import { supabase } from '../lib/supabase';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

type SupabaseUser = {
  id: string;
  email?: string | null;
  created_at: string;
  user_metadata?: Record<string, unknown>;
};

const mapUser = (user: SupabaseUser): AuthUser => ({
  id: user.id,
  email: user.email || '',
  name:
    typeof user.user_metadata?.name === 'string' && user.user_metadata.name.trim()
      ? user.user_metadata.name.trim()
      : user.email?.split('@')[0] || 'Learner',
  createdAt: user.created_at,
});

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return mapUser(data.user);
};

export const login = async (email: string, password: string): Promise<AuthUser> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('Unable to sign in.');
  }

  return mapUser(data.user);
};

export const signup = async (name: string, email: string, password: string): Promise<AuthUser> => {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: { name: name.trim() },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('Unable to create your account.');
  }

  if (!data.session) {
    throw new Error('Account created. Check your email to confirm your account, then sign in.');
  }

  return mapUser(data.user);
};

export const getAccountFromBackend = async (): Promise<AuthUser | null> => getCurrentUser();

export const logout = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
};

export const loginWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.url) {
    throw new Error('Unable to start Google sign-in.');
  }

  window.location.assign(data.url);
};
