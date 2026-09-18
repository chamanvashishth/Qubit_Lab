export async function GET() {
  return Response.json({
    ok: true,
    aiGatewayConfigured: Boolean(process.env.AI_GATEWAY_API_KEY),
    geminiConfigured: Boolean(process.env.GOOGLE_GEMINI_API_KEY),
    model: process.env.AI_GATEWAY_MODEL || process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
