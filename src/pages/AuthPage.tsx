import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { auth, db } from '../lib/firebase';

export function AuthPage() {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = React.useState<'login' | 'signup'>(
    searchParams.get('mode') === 'signup' ? 'signup' : 'login'
  );
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const { signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const formatError = (err: unknown): string => {
    const msg = err instanceof Error ? err.message : '';
    if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password') || msg.includes('auth/user-not-found'))
      return 'Incorrect email or password.';
    if (msg.includes('auth/email-already-in-use'))
      return 'An account with this email already exists.';
    if (msg.includes('auth/weak-password'))
      return 'Password must be at least 6 characters.';
    if (msg.includes('auth/invalid-email'))
      return 'Please enter a valid email address.';
    if (msg.includes('auth/too-many-requests'))
      return 'Too many attempts. Please try again later.';
    if (msg.includes('auth/popup-closed-by-user'))
      return 'Sign-in popup was closed. Please try again.';
    return msg.replace('Firebase: ', '').replace(/\s*\(auth\/[^)]+\)\.?/g, '').trim() || 'Something went wrong.';
  };

  const redirectAfterAuth = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) { navigate('/app'); return; }
      const snap = await getDoc(doc(db, 'users', uid));
      const hasProfile = snap.exists() && !!snap.data()?.homeAddress;
      navigate(hasProfile ? '/app' : '/profile', { replace: true });
    } catch {
      navigate('/app', { replace: true });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (mode === 'signup' && password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      await redirectAfterAuth();
    } catch (err: unknown) {
      setError(formatError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      await redirectAfterAuth();
    } catch (err: unknown) {
      setError(formatError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center px-4">
      <Link to="/" className="flex items-center gap-2 mb-10">
        <svg width="28" height="28" viewBox="0 0 52 70" fill="none">
          <path d="M8 32 L26 68 L44 32 Z" fill="#F2C9B3" stroke="#1A140E" strokeWidth="2" strokeLinejoin="round"/>
          <line x1="16" y1="44" x2="36" y2="44" stroke="#1A140E" strokeWidth="1" strokeLinecap="round" opacity="0.35"/>
          <line x1="12" y1="54" x2="40" y2="54" stroke="#1A140E" strokeWidth="1" strokeLinecap="round" opacity="0.35"/>
          <circle cx="26" cy="18" r="16" fill="#EDB821" stroke="#1A140E" strokeWidth="2"/>
          <line x1="10" y1="32" x2="42" y2="32" stroke="#1A140E" strokeWidth="2"/>
          <circle cx="26" cy="5" r="3.5" fill="#D85F2A" stroke="#1A140E" strokeWidth="1.5"/>
          <path d="M26 2 Q30 -2 34 2" stroke="#1A140E" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        </svg>
        <span className="sniglet text-2xl tracking-tight">
          <span className="text-ink-900">s</span><span className="text-terracotta-500">un</span><span className="text-ink-900">da</span><span className="text-terracotta-500">e</span>
        </span>
      </Link>

      <div className="w-full max-w-md bg-white rounded-[18px] border border-cream-200 shadow-[0_4px_10px_-2px_rgba(38,31,24,0.08)] p-8 space-y-6">
        {/* Mode toggle */}
        <div className="flex gap-1 bg-cream-100 p-1 rounded-xl">
          {(['login', 'signup'] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold font-sans transition-all capitalize ${
                mode === m ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-400 hover:text-ink-600'
              }`}
            >
              {m === 'login' ? 'Sign in' : 'Sign up'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-ink-600 uppercase tracking-[0.08em] font-sans">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-100 text-ink-900 placeholder:text-ink-400 outline-none focus:ring-[3px] focus:ring-terracotta-500/50 focus:border-transparent transition-all font-sans"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-ink-600 uppercase tracking-[0.08em] font-sans">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-100 text-ink-900 placeholder:text-ink-400 outline-none focus:ring-[3px] focus:ring-terracotta-500/50 focus:border-transparent transition-all font-sans"
              placeholder="••••••••"
            />
          </div>
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-ink-600 uppercase tracking-[0.08em] font-sans">Confirm password</label>
              <input
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-100 text-ink-900 placeholder:text-ink-400 outline-none focus:ring-[3px] focus:ring-terracotta-500/50 focus:border-transparent transition-all font-sans"
                placeholder="••••••••"
              />
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 font-sans">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-terracotta-500 text-cream-50 rounded-xl font-bold text-sm hover:bg-terracotta-600 transition-all disabled:opacity-50 font-sans"
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-cream-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs text-ink-400 font-sans">or</span>
          </div>
        </div>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full py-3 bg-white border-2 border-cream-200 text-ink-900 rounded-xl font-bold text-sm hover:border-ink-900 transition-all disabled:opacity-50 font-sans flex items-center justify-center gap-3"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}
