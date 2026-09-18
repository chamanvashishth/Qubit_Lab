export async function GET() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const publishableKey =
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    '';

  return Response.json(
    {
      url,
      publishableKey,
      configured: Boolean(url && publishableKey),
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
}
