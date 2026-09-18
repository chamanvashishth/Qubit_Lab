import { supabase } from '../lib/supabase';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

const mapUser = (user: { id: string; email?: string | null; created_at?: string; user_metadata?: Record<string, unknown> }): AuthUser => ({
  id: user.id,
  email: user.email || '',
  name: typeof user.user_metadata?.name === 'string' && user.user_metadata.name.trim()
    ? user.user_metadata.name.trim()
    : user.email?.split('@')[0] || 'Learner',
  createdAt: user.created_at || new Date().toISOString(),
});

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return mapUser(data.user);
};

export const login = async (email: string, password: string): Promise<AuthUser> => {
  const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error || !data.user) throw new Error(error?.message || 'Unable to sign in.');
  return mapUser(data.user);
};

export const signup = async (name: string, email: string, password: string): Promise<AuthUser> => {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: { data: { name: name.trim() } },
  });

  if (error) throw new Error(error.message);
  if (!data.user) throw new Error('Unable to create your account.');

  if (!data.session) {
    throw new Error('Account created. Check your email to confirm your account, then sign in.');
  }

  return mapUser(data.user);
};

export const getAccountFromBackend = async (): Promise<AuthUser | null> => {
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;
  if (!accessToken) return null;

  const response = await fetch('/api/account', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error('Unable to fetch account from backend.');
  const payload = await response.json() as { user?: { id: string; email?: string | null; created_at?: string; user_metadata?: Record<string, unknown> } | null };
  return payload.user ? mapUser(payload.user) : null;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message || 'Unable to log out.');
};

export const loginWithGoogle = async () => {
  const redirectTo = window.location.origin;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  });
  if (error) throw new Error(error.message || 'Unable to start Google sign-in.');
};
