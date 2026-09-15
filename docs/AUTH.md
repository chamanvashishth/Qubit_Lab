# QubitLab Authentication

QubitLab uses a Cloudflare Pages Function at `/api/auth` and Cloudflare D1 for account storage.

## 1. Create the D1 database

Run:

```bash
npx wrangler d1 create qubit-lab-db
```

Keep the database ID returned by Wrangler.

## 2. Bind D1 to the Pages project

In Cloudflare:

`Workers & Pages → QubitLab project → Settings → Bindings → Add → D1 database`

Use the database `qubit-lab-db` and set the binding variable to:

```text
DB
```

The authentication function will return a configuration error until this binding exists.

**Important:** `wrangler.toml` is intentionally kept without `pages_build_output_dir`. That makes the file local-development configuration instead of making it the production source of truth, so the Cloudflare Pages dashboard can remain authoritative for the D1 binding and build settings. If you later choose to manage production bindings entirely through Wrangler, run `npx wrangler pages download config qubit-lab` and review the generated configuration before deploying.

## 3. Apply the schema

From the repository root:

```bash
npx wrangler d1 migrations apply qubit-lab-db --remote
```

The migration creates:

- `users` — learner account records and password hashes/salts.
- `sessions` — hashed, expiring HttpOnly login sessions.

## 4. Cloudflare Pages build settings

Use these values for the Git-connected Pages project:

- Root directory: `/`
- Production branch: `main`
- Build command: `bash build.sh`
- Build output directory: `dist`
- Node.js: `22.16.0` (the repository pins this with `.node-version`)
- Build variable: `SKIP_DEPENDENCY_INSTALL=1`

Cloudflare documents `SKIP_DEPENDENCY_INSTALL=1` as the supported way to disable its automatic dependency installation. The repository's `build.sh` then performs a deterministic npm install without creating a lockfile and runs the Vite production build.

If you prefer Cloudflare's normal automatic dependency installation, remove `SKIP_DEPENDENCY_INSTALL` and use the standard React/Vite command `npm run build`; the expected output directory remains `dist`.

## 5. AI tutor environment variables

For the `/api/chat` Pages Function, configure these as Cloudflare environment variables/secrets:

```text
CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_API_TOKEN
CLOUDFLARE_AI_MODEL=google-ai-studio/gemini-2.5-flash
```

Do not put the API token in source control or expose it as a `VITE_*` variable.

## 6. Authentication behavior

- Signup requires a name, valid email, and password of 8–128 characters.
- Passwords are hashed with PBKDF2-SHA-256 using a per-user random salt.
- The browser receives only an HttpOnly, Secure, SameSite=Lax session cookie.
- Raw passwords and session tokens are not stored in the database.
- The account page is available from the `Account` control in the navbar.
- The frontend uses same-origin requests, so no public CORS configuration is required.

This is an application login system, not an identity provider. Add email verification, password reset, rate limiting, and account recovery before treating it as production-grade authentication for a large public service.
