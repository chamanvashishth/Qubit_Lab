# QubitLab Authentication

QubitLab uses **Supabase Auth** for learner accounts and sessions. The Vite frontend connects to Supabase with the publishable browser key; no QubitLab password-hashing or session-cookie implementation is required.

## 1. Configure Supabase

Create a Supabase project and copy the Project URL and publishable key from the Supabase Connect/API settings.

Set these variables locally and in Vercel:

```text
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

These are browser configuration values. Never expose a Supabase service-role key through `VITE_*` variables.

## 2. Authentication

The account page uses Supabase Auth directly:

- Sign up with name, email and password.
- The name is stored in Supabase Auth user metadata.
- Sign in uses Supabase password authentication.
- Supabase manages the authenticated session and token refresh.
- Sign out calls `supabase.auth.signOut()`.

QubitLab maps the Supabase user into its small `AuthUser` UI model in `src/utils/auth.ts`.

## 3. Learning-state persistence

Run:

```text
supabase/migrations/0001_learning_state.sql
```

The migration creates `public.learning_state` with:

- `progress` — curriculum completion, quiz scores and XP.
- `adaptive` — learner profile, mastery, misconceptions and experiment signals.
- `updated_at` — last cloud-sync timestamp.

Row Level Security is enabled. A learner can only read, insert or update the row where `user_id = auth.uid()`.

## 4. Vercel

Vercel only needs the Supabase environment variables for account functionality. The optional model-backed endpoint also accepts:

```text
AI_GATEWAY_API_KEY=...
AI_GATEWAY_MODEL=google/gemini-2.5-flash
```

The AI gateway credential must remain server-side. Do not prefix it with `VITE_`.

## 5. Production considerations

Before opening the application to a large public audience, configure Supabase email confirmation, password reset/recovery, appropriate Auth rate limits, redirect URLs and any required provider protections in the Supabase dashboard.

The learning-state table is protected by RLS, but every new table or RPC added to the project should receive an explicit RLS policy and least-privilege grants before deployment.
