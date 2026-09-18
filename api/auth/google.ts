import { createClient } from '@supabase/supabase-js';

const getConfig = (request: Request, body: Record<string, unknown> = {}) => ({
  url: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || (typeof body.supabaseUrl === 'string' ? body.supabaseUrl : '') || request.headers.get('x-supabase-url') || '',
  key: process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || (typeof body.supabaseKey === 'string' ? body.supabaseKey : '') || request.headers.get('x-supabase-key') || '',
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { url, key } = getConfig(request, body);
  if (!url || !key) return Response.json({ error: 'Supabase server configuration is missing.' }, { status: 500 });

  const redirectTo = typeof body.redirectTo === 'string' && body.redirectTo
    ? body.redirectTo
    : new URL('/', request.url).origin;

  const supabase = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
      flowType: 'implicit',
    },
  });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  });

  if (error || !data.url) return Response.json({ error: error?.message || 'Unable to start Google sign-in.' }, { status: 400 });
  return Response.json({ url: data.url });
}
