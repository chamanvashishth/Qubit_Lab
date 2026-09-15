interface UserRecord {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  password_salt: string;
  created_at: string;
}

interface D1Result<T = unknown> {
  results: T[];
}

interface D1DatabaseLike {
  prepare(query: string): {
    bind(...values: unknown[]): {
      first<T = unknown>(): Promise<T | null>;
      all<T = unknown>(): Promise<D1Result<T>>;
      run(): Promise<unknown>;
    };
  };
}

interface Env {
  DB?: D1DatabaseLike;
}

type PagesContext = { request: Request; env: Env };

const SESSION_COOKIE = 'ql_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
const PASSWORD_ITERATIONS = 100_000;

const json = (body: unknown, status = 200, headers: HeadersInit = {}) =>
  Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      ...headers,
    },
  });

const cookie = (value: string, maxAge = SESSION_MAX_AGE) =>
  `${SESSION_COOKIE}=${value}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`;

const base64Encode = (bytes: Uint8Array) => {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
};

const base64Decode = (value: string) => {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
};

const randomBytes = (length: number) => {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
};

const sha256 = async (value: string) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return base64Encode(new Uint8Array(digest));
};

const hashPassword = async (password: string, salt = randomBytes(16)) => {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: PASSWORD_ITERATIONS, hash: 'SHA-256' },
    key,
    256,
  );
  return { hash: base64Encode(new Uint8Array(bits)), salt: base64Encode(salt) };
};

const safeEqual = (a: string, b: string) => {
  const left = new TextEncoder().encode(a);
  const right = new TextEncoder().encode(b);
  if (left.length !== right.length) return false;
  let result = 0;
  for (let i = 0; i < left.length; i += 1) result |= left[i] ^ right[i];
  return result === 0;
};

const getSessionToken = (request: Request) => {
  const value = request.headers.get('Cookie') || '';
  const match = value.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`));
  return match?.[1] || null;
};

const publicUser = (user: UserRecord) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  createdAt: user.created_at,
});

const getCurrentUser = async (request: Request, db: D1DatabaseLike) => {
  const token = getSessionToken(request);
  if (!token) return null;
  const tokenHash = await sha256(token);
  const row = await db.prepare(
    `SELECT u.id, u.email, u.name, u.password_hash, u.password_salt, u.created_at
     FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = ?1 AND s.expires_at > CURRENT_TIMESTAMP`,
  ).bind(tokenHash).first<UserRecord>();
  return row || null;
};

export const onRequestGet = async ({ request, env }: PagesContext) => {
  if (!env.DB) return json({ authenticated: false, configured: false }, 503);
  try {
    const user = await getCurrentUser(request, env.DB);
    return json({ authenticated: Boolean(user), user: user ? publicUser(user) : null });
  } catch (error) {
    console.error('QubitLab auth session error:', error);
    return json({ error: 'Unable to read the current session.' }, 500);
  }
};

export const onRequestPost = async ({ request, env }: PagesContext) => {
  if (!env.DB) return json({ error: 'Authentication is not configured yet.' }, 503);

  try {
    const body = await request.json().catch(() => ({})) as {
      action?: unknown;
      name?: unknown;
      email?: unknown;
      password?: unknown;
    };
    const action = body.action === 'signup' ? 'signup' : body.action === 'login' ? 'login' : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!action) return json({ error: 'Invalid authentication action.' }, 400);
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email) || email.length > 254) {
      return json({ error: 'Enter a valid email address.' }, 400);
    }
    if (password.length < 8 || password.length > 128) {
      return json({ error: 'Password must be between 8 and 128 characters.' }, 400);
    }

    if (action === 'signup') {
      const name = typeof body.name === 'string' ? body.name.trim().replace(/\\s+/g, ' ') : '';
      if (name.length < 2 || name.length > 80) return json({ error: 'Name must be between 2 and 80 characters.' }, 400);

      const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?1').bind(email).first<{ id: string }>();
      if (existing) return json({ error: 'An account with this email already exists.' }, 409);

      const id = crypto.randomUUID();
      const passwordData = await hashPassword(password);
      await env.DB.prepare(
        `INSERT INTO users (id, email, name, password_hash, password_salt)
         VALUES (?1, ?2, ?3, ?4, ?5)`,
      ).bind(id, email, name, passwordData.hash, passwordData.salt).run();

      const token = base64Encode(randomBytes(32));
      const tokenHash = await sha256(token);
      await env.DB.prepare(
        `INSERT INTO sessions (token_hash, user_id, expires_at)
         VALUES (?1, ?2, datetime('now', '+30 days'))`,
      ).bind(tokenHash, id).run();

      const user = await env.DB.prepare(
        'SELECT id, email, name, password_hash, password_salt, created_at FROM users WHERE id = ?1',
      ).bind(id).first<UserRecord>();
      if (!user) return json({ error: 'Account creation failed. Please try again.' }, 500);

      return json({ user: publicUser(user) }, 201, { 'Set-Cookie': cookie(token) });
    }

    const user = await env.DB.prepare(
      'SELECT id, email, name, password_hash, password_salt, created_at FROM users WHERE email = ?1',
    ).bind(email).first<UserRecord>();
    if (!user) return json({ error: 'Invalid email or password.' }, 401);

    const passwordData = await hashPassword(password, base64Decode(user.password_salt));
    if (!safeEqual(passwordData.hash, user.password_hash)) return json({ error: 'Invalid email or password.' }, 401);

    const token = base64Encode(randomBytes(32));
    const tokenHash = await sha256(token);
    await env.DB.prepare(
      `INSERT INTO sessions (token_hash, user_id, expires_at)
       VALUES (?1, ?2, datetime('now', '+30 days'))`,
    ).bind(tokenHash, user.id).run();

    return json({ user: publicUser(user) }, 200, { 'Set-Cookie': cookie(token) });
  } catch (error) {
    console.error('QubitLab auth POST error:', error);
    return json({ error: 'Authentication failed. Please try again.' }, 500);
  }
};

export const onRequestDelete = async ({ request, env }: PagesContext) => {
  if (!env.DB) return json({ ok: true });
  try {
    const token = getSessionToken(request);
    if (token) await env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?1').bind(await sha256(token)).run();
    return json({ ok: true }, 200, { 'Set-Cookie': cookie('', 0) });
  } catch (error) {
    console.error('QubitLab auth logout error:', error);
    return json({ error: 'Unable to log out cleanly.' }, 500);
  }
};
