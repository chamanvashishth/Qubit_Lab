export interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface AuthResponse {
  authenticated?: boolean;
  configured?: boolean;
  user?: AuthUser | null;
  error?: string;
}

const request = async (input: RequestInfo, init?: RequestInit): Promise<AuthResponse> => {
  const response = await fetch(input, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    credentials: 'same-origin',
  });
  const data = await response.json().catch(() => ({})) as AuthResponse;
  if (!response.ok && response.status !== 503) throw new Error(data.error || 'Authentication request failed.');
  return data;
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const data = await request('/api/auth', { method: 'GET', headers: {} });
    return data.user || null;
  } catch {
    return null;
  }
};

export const login = async (email: string, password: string) => {
  const data = await request('/api/auth', {
    method: 'POST',
    body: JSON.stringify({ action: 'login', email, password }),
  });
  if (!data.user) throw new Error(data.error || 'Unable to sign in.');
  return data.user;
};

export const signup = async (name: string, email: string, password: string) => {
  const data = await request('/api/auth', {
    method: 'POST',
    body: JSON.stringify({ action: 'signup', name, email, password }),
  });
  if (!data.user) throw new Error(data.error || 'Unable to create your account.');
  return data.user;
};

export const logout = async () => {
  const response = await fetch('/api/auth', { method: 'DELETE', credentials: 'same-origin' });
  if (!response.ok) throw new Error('Unable to log out.');
};
