# QubitLab — Vercel + Supabase Deployment

QubitLab is deployed as a Vite frontend on Vercel with Supabase providing managed authentication and learner-state persistence.

## Vercel

Use the repository root as the Vercel project root.

- Build command: `npm run build`
- Output directory: `dist`
- Node.js: `22.x` (matches `.node-version`)
- API functions: `api/*.ts`

The repository no longer contains Cloudflare Pages Functions, Wrangler scripts, D1 migrations, or Cloudflare Pages routing files.

## Environment variables

### Vercel

```text
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
AI_GATEWAY_API_KEY=...        # optional
AI_GATEWAY_MODEL=google/gemini-2.5-flash
```

`VITE_*` variables are intentionally public browser configuration. Do not put service-role keys or AI gateway secrets in `VITE_*` variables.

## Supabase

Run `supabase/migrations/0001_learning_state.sql` in the Supabase SQL Editor or through the Supabase migration workflow.

The `learning_state` table stores one row per authenticated learner containing:

- `progress` — curriculum completion, quiz scores, XP and related learning progress
- `adaptive` — learner profile, concept mastery, misconceptions and experiment prediction signals

Row Level Security is enabled. Each authenticated user can only read or write the row whose `user_id` equals `auth.uid()`.

Supabase Auth handles password storage, sessions and token refresh. QubitLab does not implement its own password hashing or session-cookie system.

## Performance

The initial application bundle avoids loading the heavy 3D quantum workspace until it is opened. Circuit Composer, Bloch Playground, Quantum Code Sandbox and Quiz are loaded with `React.lazy`/dynamic imports.

Three.js remains a runtime dependency because the application genuinely uses it for 3D quantum visualization; it is not loaded into the initial route bundle.

## Optional AI

The primary QubitLab guide remains deterministic and grounded in the local curriculum/simulator context. `api/chat.ts` is an optional Vercel Function for model-backed responses when `AI_GATEWAY_API_KEY` is configured.

The AI endpoint is server-side so the gateway credential is never exposed to the browser. Request cancellation is forwarded to the upstream fetch to avoid unnecessary model work when a user closes or cancels a request.

## Verification

Run locally:

```bash
npm install
npm run lint
npm run build
```

The GitHub CI workflow runs the same typecheck and build commands on pushes to `main` and pull requests.
