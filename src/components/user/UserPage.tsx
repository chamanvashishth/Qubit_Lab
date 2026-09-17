import React, { FormEvent, useState } from 'react';
import { ArrowRight, Atom, Check, LogOut, Mail, Lock, UserRound, Chrome } from 'lucide-react';
import { AuthUser, login, loginWithGoogle, logout, signup } from '../../utils/auth';

interface UserPageProps {
  user: AuthUser | null;
  onAuthenticated: (user: AuthUser) => void;
  onLoggedOut: () => void;
}

export const UserPage: React.FC<UserPageProps> = ({ user, onAuthenticated, onLoggedOut }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <section className="max-w-3xl mx-auto py-10">
      <div className="glass-section rounded-3xl overflow-hidden">
        <div className="p-6 sm:p-10 border-b border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl border border-[#dfff3f]/30 bg-[#dfff3f]/10 flex items-center justify-center"><UserRound className="w-7 h-7 text-[#dfff3f]" /></div>
              <div><p className="text-xs font-mono uppercase tracking-[.22em] text-zinc-500">QubitLab account</p><h1 className="text-2xl sm:text-3xl font-semibold text-white mt-1">{user.name}</h1></div>
            </div>
            <button onClick={async () => { try { await logout(); onLoggedOut(); } catch (e) { setError(e instanceof Error ? e.message : 'Unable to log out.'); } }} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"><LogOut className="w-4 h-4" /> Sign out</button>
          </div>
        </div>
        <div className="p-6 sm:p-10 grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/10 bg-black/25 p-5"><div className="flex items-center gap-2 text-zinc-400 text-xs font-mono uppercase tracking-wider"><Mail className="w-4 h-4" /> Email</div><p className="mt-3 text-white break-all">{user.email}</p></div>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-5"><div className="flex items-center gap-2 text-zinc-400 text-xs font-mono uppercase tracking-wider"><Check className="w-4 h-4" /> Account</div><p className="mt-3 text-white">Active</p></div>
        </div>
        {error && <p className="px-6 sm:px-10 pb-8 text-sm text-red-300">{error}</p>}
      </div>
    </section>;
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError(''); setLoading(true);
    try {
      const authenticatedUser = mode === 'login' ? await login(email, password) : await signup(name, email, password);
      onAuthenticated(authenticatedUser); setPassword('');
    } catch (e) { setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  return <section className="max-w-5xl mx-auto py-8 sm:py-14">
    <div className="grid lg:grid-cols-[1fr_460px] gap-6 items-stretch">
      <div className="glass-section rounded-3xl p-7 sm:p-10 flex flex-col justify-between min-h-[520px]">
        <div><div className="w-12 h-12 rounded-2xl border border-[#dfff3f]/30 bg-[#dfff3f]/10 flex items-center justify-center mb-7"><Atom className="w-6 h-6 text-[#dfff3f]" /></div><p className="text-xs font-mono uppercase tracking-[.28em] text-[#dfff3f]">Personal quantum workspace</p><h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">Learn quantum computing with your progress in one place.</h1><p className="mt-5 max-w-xl text-zinc-400 leading-7">Create an account to keep your QubitLab learning identity connected across sessions. Your tutor and interactive tools stay inside the same workspace.</p></div>
        <div className="mt-10 grid sm:grid-cols-2 gap-3 text-sm text-zinc-300">{['Personal learner profile', 'Persistent Supabase session', 'Progress-ready backend', 'Managed authentication'].map((item) => <div key={item} className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3"><Check className="w-4 h-4 text-[#dfff3f]" />{item}</div>)}</div>
      </div>

      <div className="glass-section rounded-3xl p-6 sm:p-8 self-center">
        <div className="flex gap-1 rounded-xl bg-black/35 border border-white/10 p-1 mb-7"><button type="button" onClick={() => { setMode('login'); setError(''); }} className={`flex-1 rounded-lg px-4 py-2.5 text-sm transition-colors ${mode === 'login' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Log in</button><button type="button" onClick={() => { setMode('signup'); setError(''); }} className={`flex-1 rounded-lg px-4 py-2.5 text-sm transition-colors ${mode === 'signup' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Sign up</button></div>
        <div className="mb-6"><h2 className="text-2xl font-semibold text-white">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2><p className="mt-2 text-sm text-zinc-500">{mode === 'login' ? 'Continue your quantum learning workspace.' : 'Start with a free QubitLab learner account.'}</p></div>
        <button type="button" onClick={async () => { setError(''); setLoading(true); try { await loginWithGoogle(); } catch (e) { setError(e instanceof Error ? e.message : 'Unable to start Google sign-in.'); setLoading(false); } }} disabled={loading} className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-zinc-200 hover:bg-white/10 disabled:opacity-50"><Chrome className="w-4 h-4" /> Continue with Google</button>
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider text-zinc-600"><span className="h-px flex-1 bg-white/10" />or continue with email<span className="h-px flex-1 bg-white/10" /></div>
        <form onSubmit={submit} className="space-y-4">
          {mode === 'signup' && <label className="block"><span className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">Name</span><div className="relative"><UserRound className="absolute left-3 top-3.5 w-4 h-4 text-zinc-600" /><input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} maxLength={80} autoComplete="name" className="w-full rounded-xl border border-white/10 bg-black/35 pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-[#dfff3f]/50" placeholder="Your name" /></div></label>}
          <label className="block"><span className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">Email</span><div className="relative"><Mail className="absolute left-3 top-3.5 w-4 h-4 text-zinc-600" /><input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" autoComplete="email" className="w-full rounded-xl border border-white/10 bg-black/35 pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-[#dfff3f]/50" placeholder="you@example.com" /></div></label>
          <label className="block"><span className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">Password</span><div className="relative"><Lock className="absolute left-3 top-3.5 w-4 h-4 text-zinc-600" /><input value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} maxLength={128} type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} className="w-full rounded-xl border border-white/10 bg-black/35 pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-[#dfff3f]/50" placeholder="At least 8 characters" /></div></label>
          {error && <div className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300">{error}</div>}
          <button disabled={loading} className="w-full inline-flex items-center justify-center gap-2 rounded-xl template-button px-4 py-3.5 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all">{loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'} {!loading && <ArrowRight className="w-4 h-4" />}</button>
        </form>
        <p className="mt-5 text-center text-[11px] text-zinc-600">Authentication is handled by Supabase Auth; passwords are not stored by QubitLab.</p>
      </div>
    </div>
  </section>;
};
