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

## 3. Apply the schema

From the repository root:

```bash
npx wrangler d1 migrations apply qubit-lab-db --remote
```

The migration creates:

- `users` — learner account records and password hashes/salts.
- `sessions` — hashed, expiring HttpOnly login sessions.

## 4. Authentication behavior

- Signup requires a name, valid email, and password of 8–128 characters.
- Passwords are hashed with PBKDF2-SHA-256 using a per-user random salt.
- The browser receives only an HttpOnly, Secure, SameSite=Lax session cookie.
- Raw passwords and session tokens are not stored in the database.
- The account page is available from the `Account` control in the navbar.
- The frontend uses same-origin requests, so no public CORS configuration is required.

This is an application login system, not an identity provider. Add email verification, password reset, rate limiting, and account recovery before treating it as production-grade authentication for a large public service.
