import { supabaseUrl, supabasePublishableKey } from '../lib/supabase';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

type SessionPayload = {
  access_token: string;
  refresh_token?: string;
};

const SESSION_KEY = 'qubitlab-auth-session';

const mapUser = (user: {
  id: string;
  email?: string | null;
  created_at?: string;
  user_metadata?: Record<string, unknown>;
}): AuthUser => ({
  id: user.id,
  email: user.email || '',
  name:
    typeof user.user_metadata?.name === 'string' && user.user_metadata.name.trim()
      ? user.user_metadata.name.trim()
      : user.email?.split('@')[0] || 'Learner',
  createdAt: user.created_at || new Date().toISOString(),
});

const readSession = (): SessionPayload | null => {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) as SessionPayload : null;
  } catch {
    return null;
  }
};

const saveSession = (session: SessionPayload) => {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

const clearSession = () => {
  window.localStorage.removeItem(SESSION_KEY);
};

const apiRequest = async (path: string, body?: Record<string, unknown>) => {
  const session = readSession();
  const response = await fetch(path, {
    method: body ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      ...(supabaseUrl ? { 'x-supabase-url': supabaseUrl } : {}),
      ...(supabasePublishableKey ? { 'x-supabase-key': supabasePublishableKey } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'Authentication request failed.');
  return payload as {
    user?: { id: string; email?: string | null; created_at?: string; user_metadata?: Record<string, unknown> };
    session?: SessionPayload;
    url?: string;
  };
};

const consumeOAuthSession = () => {
  const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : '';
  if (!hash) return;
  const params = new URLSearchParams(hash);
  const access_token = params.get('access_token');
  const refresh_token = params.get('refresh_token');
  if (access_token) {
    saveSession({ access_token, ...(refresh_token ? { refresh_token } : {}) });
    window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
  }
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  consumeOAuthSession();
  try {
    const payload = await apiRequest('/api/account');
    return payload.user ? mapUser(payload.user) : null;
  } catch {
    clearSession();
    return null;
  }
};

export const login = async (email: string, password: string): Promise<AuthUser> => {
  const payload = await apiRequest('/api/auth/login', {
    email: email.trim(),
    password,
    supabaseUrl,
    supabaseKey: supabasePublishableKey,
  });
  if (!payload.user || !payload.session?.access_token) {
    throw new Error('Unable to sign in.');
  }
  saveSession(payload.session);
  return mapUser(payload.user);
};

export const signup = async (name: string, email: string, password: string): Promise<AuthUser> => {
  const payload = await apiRequest('/api/auth/signup', {
    name: name.trim(),
    email: email.trim(),
    password,
    supabaseUrl,
    supabaseKey: supabasePublishableKey,
  });
  if (!payload.user) throw new Error('Unable to create your account.');
  if (!payload.session?.access_token) {
    throw new Error('Account created. Check your email to confirm your account, then sign in.');
  }
  saveSession(payload.session);
  return mapUser(payload.user);
};

export const getAccountFromBackend = async (): Promise<AuthUser | null> => getCurrentUser();

export const logout = async () => {
  clearSession();
};

export const loginWithGoogle = async () => {
  const payload = await apiRequest('/api/auth/google', { redirectTo: window.location.origin, supabaseUrl, supabaseKey: supabasePublishableKey });
  if (!payload.url) throw new Error('Unable to start Google sign-in.');
  window.location.assign(payload.url);
};
