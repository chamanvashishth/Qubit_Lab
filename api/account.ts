import { createClient } from '@supabase/supabase-js';

const getConfig = (request: Request) => ({
  url: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || request.headers.get('x-supabase-url') || '',
  key: process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || request.headers.get('x-supabase-key') || '',
});

export async function GET(request: Request) {
  const { url: supabaseUrl, key: supabaseKey } = getConfig(request);

  if (!supabaseUrl || !supabaseKey) {
    return Response.json({ error: 'Supabase server configuration is missing.' }, { status: 500 });
  }

  const authorization = request.headers.get('Authorization');
  const accessToken = authorization?.replace(/^Bearer\s+/i, '').trim();

  if (!accessToken) {
    return Response.json({ user: null }, { status: 401 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });

  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user) {
    return Response.json({ error: 'Invalid or expired session.' }, { status: 401 });
  }

  return Response.json(
    {
      user: {
        id: data.user.id,
        email: data.user.email,
        created_at: data.user.created_at,
        user_metadata: data.user.user_metadata,
      },
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
