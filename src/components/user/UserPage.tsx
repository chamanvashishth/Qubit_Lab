import React, { FormEvent, useState } from 'react';
import { ArrowRight, Atom, Check, LogOut, Mail, Lock, UserRound, Chrome } from 'lucide-react';
import { AuthUser, login, loginWithGoogle, logout, signup } from '../../utils/auth';
import { t } from '../../utils/i18n';

interface UserPageProps {
  user: AuthUser | null;
  onAuthenticated: (user: AuthUser) => void;
  onLoggedOut: () => void;
}

export const UserPage: React.FC<UserPageProps> = ({ user, onAuthenticated, onLoggedOut }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, set{t('Name')}] = useState('');
  const [email, set{t('Email')}] = useState('');
  const [password, set{t('Password')}] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <section class{t('Name')}="max-w-3xl mx-auto py-10">
      <div class{t('Name')}="glass-section rounded-3xl overflow-hidden">
        <div class{t('Name')}="p-6 sm:p-10 border-b border-white/10">
          <div class{t('Name')}="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div class{t('Name')}="flex items-center gap-4">
              <div class{t('Name')}="w-14 h-14 rounded-2xl border border-[#dfff3f]/30 bg-[#dfff3f]/10 flex items-center justify-center"><UserRound class{t('Name')}="w-7 h-7 text-[#dfff3f]" /></div>
              <div><p class{t('Name')}="text-xs font-mono uppercase tracking-[.22em] text-zinc-500">{t('QubitLab account')}</p><h1 class{t('Name')}="text-2xl sm:text-3xl font-semibold text-white mt-1">{user.name}</h1></div>
            </div>
            <button onClick={async () => { try { await logout(); onLoggedOut(); } catch (e) { setError(e instanceof Error ? e.message : 'Unable to log out.'); } }} class{t('Name')}="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"><LogOut class{t('Name')}="w-4 h-4" /> {t('Sign out')}</button>
          </div>
        </div>
        <div class{t('Name')}="p-6 sm:p-10 grid sm:grid-cols-2 gap-4">
          <div class{t('Name')}="rounded-2xl border border-white/10 bg-black/25 p-5"><div class{t('Name')}="flex items-center gap-2 text-zinc-400 text-xs font-mono uppercase tracking-wider"><Mail class{t('Name')}="w-4 h-4" /> {t('Email')}</div><p class{t('Name')}="mt-3 text-white break-all">{user.email}</p></div>
          <div class{t('Name')}="rounded-2xl border border-white/10 bg-black/25 p-5"><div class{t('Name')}="flex items-center gap-2 text-zinc-400 text-xs font-mono uppercase tracking-wider"><Check class{t('Name')}="w-4 h-4" /> Account</div><p class{t('Name')}="mt-3 text-white">{t('Active')}</p></div>
        </div>
        {error && <p class{t('Name')}="px-6 sm:px-10 pb-8 text-sm text-red-300">{error}</p>}
      </div>
    </section>;
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError(''); setLoading(true);
    try {
      const authenticatedUser = mode === 'login' ? await login(email, password) : await signup(name, email, password);
      onAuthenticated(authenticatedUser); set{t('Password')}('');
    } catch (e) { setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  return <section class{t('Name')}="max-w-5xl mx-auto py-8 sm:py-14">
    <div class{t('Name')}="grid lg:grid-cols-[1fr_460px] gap-6 items-stretch">
      <div class{t('Name')}="glass-section rounded-3xl p-7 sm:p-10 flex flex-col justify-between min-h-[520px]">
        <div><div class{t('Name')}="w-12 h-12 rounded-2xl border border-[#dfff3f]/30 bg-[#dfff3f]/10 flex items-center justify-center mb-7"><Atom class{t('Name')}="w-6 h-6 text-[#dfff3f]" /></div><p class{t('Name')}="text-xs font-mono uppercase tracking-[.28em] text-[#dfff3f]">{t('Personal quantum workspace')}</p><h1 class{t('Name')}="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">{t('Learn quantum computing with your progress in one place.')}</h1><p class{t('Name')}="mt-5 max-w-xl text-zinc-400 leading-7">{t('Create an account to keep your QubitLab learning identity connected across sessions. Your tutor and interactive tools stay inside the same workspace.')}</p></div>
        <div class{t('Name')}="mt-10 grid sm:grid-cols-2 gap-3 text-sm text-zinc-300">{['{t('Personal learner profile')}', '{t('Persistent Supabase session')}', '{t('Progress-ready backend')}', '{t('Managed authentication')}'].map((item) => <div key={item} class{t('Name')}="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3"><Check class{t('Name')}="w-4 h-4 text-[#dfff3f]" />{item}</div>)}</div>
      </div>

      <div class{t('Name')}="glass-section rounded-3xl p-6 sm:p-8 self-center">
        <div class{t('Name')}="flex gap-1 rounded-xl bg-black/35 border border-white/10 p-1 mb-7"><button type="button" onClick={() => { setMode('login'); setError(''); }} class{t('Name')}={`flex-1 rounded-lg px-4 py-2.5 text-sm transition-colors ${mode === 'login' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>{t('Log in')}</button><button type="button" onClick={() => { setMode('signup'); setError(''); }} class{t('Name')}={`flex-1 rounded-lg px-4 py-2.5 text-sm transition-colors ${mode === 'signup' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>{t('Sign up')}</button></div>
        <div class{t('Name')}="mb-6"><h2 class{t('Name')}="text-2xl font-semibold text-white">{mode === 'login' ? '{t('Welcome back')}' : '{t('Create your account')}'}</h2><p class{t('Name')}="mt-2 text-sm text-zinc-500">{mode === 'login' ? '{t('Continue your quantum learning workspace.')}' : '{t('Start with a free QubitLab learner account.')}'}</p></div>
        <button type="button" onClick={async () => { setError(''); setLoading(true); try { await loginWithGoogle(); } catch (e) { setError(e instanceof Error ? e.message : 'Unable to start Google sign-in.'); setLoading(false); } }} disabled={loading} class{t('Name')}="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-zinc-200 hover:bg-white/10 disabled:opacity-50"><Chrome class{t('Name')}="w-4 h-4" /> {t('Continue with Google')}</button>
        <div class{t('Name')}="flex items-center gap-3 text-[10px] uppercase tracking-wider text-zinc-600"><span class{t('Name')}="h-px flex-1 bg-white/10" />{t('or continue with email')}<span class{t('Name')}="h-px flex-1 bg-white/10" /></div>
        <form onSubmit={submit} class{t('Name')}="space-y-4">
          {mode === 'signup' && <label class{t('Name')}="block"><span class{t('Name')}="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">{t('Name')}</span><div class{t('Name')}="relative"><UserRound class{t('Name')}="absolute left-3 top-3.5 w-4 h-4 text-zinc-600" /><input value={name} onChange={(e) => set{t('Name')}(e.target.value)} required minLength={2} maxLength={80} autoComplete="name" class{t('Name')}="w-full rounded-xl border border-white/10 bg-black/35 pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-[#dfff3f]/50" placeholder="{t('Your name')}" /></div></label>}
          <label class{t('Name')}="block"><span class{t('Name')}="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">{t('Email')}</span><div class{t('Name')}="relative"><Mail class{t('Name')}="absolute left-3 top-3.5 w-4 h-4 text-zinc-600" /><input value={email} onChange={(e) => set{t('Email')}(e.target.value)} required type="email" autoComplete="email" class{t('Name')}="w-full rounded-xl border border-white/10 bg-black/35 pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-[#dfff3f]/50" placeholder="you@example.com" /></div></label>
          <label class{t('Name')}="block"><span class{t('Name')}="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">{t('Password')}</span><div class{t('Name')}="relative"><Lock class{t('Name')}="absolute left-3 top-3.5 w-4 h-4 text-zinc-600" /><input value={password} onChange={(e) => set{t('Password')}(e.target.value)} required minLength={8} maxLength={128} type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} class{t('Name')}="w-full rounded-xl border border-white/10 bg-black/35 pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-[#dfff3f]/50" placeholder="{t('At least 8 characters')}" /></div></label>
          {error && <div class{t('Name')}="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300">{error}</div>}
          <button disabled={loading} class{t('Name')}="w-full inline-flex items-center justify-center gap-2 rounded-xl template-button px-4 py-3.5 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all">{loading ? '{t('Please wait…')}' : mode === 'login' ? '{t('Log in')}' : '{t('Create account')}'} {!loading && <ArrowRight class{t('Name')}="w-4 h-4" />}</button>
        </form>
        <p class{t('Name')}="mt-5 text-center text-[11px] text-zinc-600">{t('Authentication is handled by Supabase Auth; passwords are not stored by QubitLab.')}</p>
      </div>
    </div>
  </section>;
};
