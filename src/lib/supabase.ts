import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || '';
export const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() || '';

let clientPromise: Promise<SupabaseClient> | null = null;

export const getSupabase = async (): Promise<SupabaseClient> => {
  if (supabaseUrl && supabasePublishableKey) {
    return createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }

  if (!clientPromise) {
    clientPromise = fetch('/api/supabase-config', {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    })
      .then(async (response) => {
        const config = await response.json().catch(() => ({}));
        if (!response.ok || !config.url || !config.publishableKey) {
          throw new Error('Supabase configuration is missing.');
        }

        return createClient(config.url, config.publishableKey, {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
          },
        });
      });
  }

  return clientPromise;
};
