import { createClient } from '@supabase/supabase-js';

const getConfig = () => ({
  url: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
  key: process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '',
});

export async function POST(request: Request) {
  const { url, key } = getConfig();
  if (!url || !key) return Response.json({ error: 'Supabase server configuration is missing.' }, { status: 500 });

  const body = await request.json().catch(() => ({}));
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  if (name.length < 2 || !email || password.length < 8) {
    return Response.json({ error: 'Enter a valid name, email and password of at least 8 characters.' }, { status: 400 });
  }

  const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false } });
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
  if (error || !data.user) return Response.json({ error: error?.message || 'Unable to create your account.' }, { status: 400 });

  return Response.json({
    user: { id: data.user.id, email: data.user.email, created_at: data.user.created_at, user_metadata: data.user.user_metadata },
    session: data.session ? { access_token: data.session.access_token, refresh_token: data.session.refresh_token } : undefined,
  });
}
