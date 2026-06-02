import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookmarkCheck, User, ChevronDown, MessageSquare, LogOut, Loader2 } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cn } from '../lib/utils';

const FEEDBACK_CATEGORIES = [
  'Trip recommendation',
  'User experience',
  'Bugs',
  'Other',
];

function FeedbackModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [category, setCategory] = React.useState('');
  const [text, setText] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !text.trim()) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'feedback'), {
        userId: user?.uid ?? null,
        userEmail: user?.email ?? null,
        category,
        text: text.trim(),
        submittedAt: new Date().toISOString(),
      });
      setSubmitted(true);
      setTimeout(onClose, 1800);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md bg-white rounded-[20px] border border-cream-200 shadow-[0_24px_48px_-12px_rgba(38,31,24,0.22)] overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-cream-100">
          <h2 className="text-lg font-bold text-ink-900 font-sans">Give feedback</h2>
          <p className="text-sm text-ink-400 font-sans mt-0.5">Help us make Sundae better.</p>
        </div>

        {submitted ? (
          <div className="px-6 py-10 text-center space-y-2">
            <p className="text-2xl">🎉</p>
            <p className="font-bold text-ink-900 font-sans">Thanks for the feedback!</p>
            <p className="text-sm text-ink-400 font-sans">We read every submission.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink-500 uppercase tracking-[0.08em] font-sans block">Category</label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-100 text-ink-900 outline-none focus:ring-[3px] focus:ring-terracotta-500/50 focus:border-transparent font-sans text-sm transition-all appearance-none"
              >
                <option value="" disabled>Select a category…</option>
                {FEEDBACK_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink-500 uppercase tracking-[0.08em] font-sans block">Your feedback</label>
              <textarea
                required
                rows={4}
                placeholder="Tell us what's on your mind…"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-100 text-ink-900 placeholder:text-ink-400 outline-none focus:ring-[3px] focus:ring-terracotta-500/50 focus:border-transparent font-sans text-sm resize-none transition-all"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-cream-200 text-ink-600 text-sm font-bold font-sans hover:bg-cream-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !category || !text.trim()}
                className="flex-1 py-2.5 rounded-xl bg-terracotta-500 text-cream-50 text-sm font-bold font-sans hover:bg-terracotta-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending…</> : 'Send feedback'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export function AppHeader() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.displayName?.split(' ')[0] || '';
  const [showMenu, setShowMenu] = React.useState(false);
  const [showFeedback, setShowFeedback] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!showMenu) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showMenu]);

  const handleSignOut = async () => {
    setShowMenu(false);
    await signOut();
    navigate('/');
  };

  return (
    <>
      <header className="bg-cream-50/90 backdrop-blur-md sticky top-0 z-40 border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/app" className="flex items-center gap-2 group">
            <svg width="28" height="28" viewBox="0 0 52 70" fill="none" className="group-hover:scale-110 transition-transform duration-300">
              <path d="M8 32 L26 68 L44 32 Z" fill="#F2C9B3" stroke="#1A140E" strokeWidth="2" strokeLinejoin="round"/>
              <line x1="16" y1="44" x2="36" y2="44" stroke="#1A140E" strokeWidth="1" strokeLinecap="round" opacity="0.35"/>
              <line x1="12" y1="54" x2="40" y2="54" stroke="#1A140E" strokeWidth="1" strokeLinecap="round" opacity="0.35"/>
              <circle cx="26" cy="18" r="16" fill="#EDB821" stroke="#1A140E" strokeWidth="2"/>
              <line x1="10" y1="32" x2="42" y2="32" stroke="#1A140E" strokeWidth="2"/>
              <circle cx="26" cy="5" r="3.5" fill="#D85F2A" stroke="#1A140E" strokeWidth="1.5"/>
              <path d="M26 2 Q30 -2 34 2" stroke="#1A140E" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            </svg>
            <span className="sniglet text-xl tracking-tight">
              <span className="text-ink-900">s</span><span className="text-terracotta-500">un</span><span className="text-ink-900">da</span><span className="text-terracotta-500">e</span>
            </span>
          </Link>

          <nav className="flex items-center gap-2">
            {firstName && (
              <span className="text-sm text-ink-400 font-sans hidden sm:block">Hi, {firstName}!</span>
            )}
            <Link
              to="/saved-plans"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-ink-600 hover:text-ink-900 font-sans transition-colors"
            >
              <BookmarkCheck className="w-4 h-4" />
              My Plans
            </Link>

            {/* Profile dropdown */}
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setShowMenu(v => !v)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold font-sans transition-all border',
                  showMenu
                    ? 'bg-ink-900 text-cream-50 border-ink-900'
                    : 'text-ink-600 hover:text-ink-900 border-cream-200 hover:border-ink-300 bg-white'
                )}
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
                <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-150', showMenu && 'rotate-180')} />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-11 w-52 bg-white rounded-xl border border-cream-200 shadow-[0_12px_24px_-8px_rgba(38,31,24,0.16)] overflow-hidden z-50">
                  <Link
                    to="/profile"
                    onClick={() => setShowMenu(false)}
                    className="w-full px-4 py-3 text-left text-sm font-sans text-ink-700 hover:bg-cream-50 flex items-center gap-2.5 transition-colors"
                  >
                    <User className="w-4 h-4 text-ink-400" />
                    Your details
                  </Link>
                  <button
                    onClick={() => { setShowMenu(false); setShowFeedback(true); }}
                    className="w-full px-4 py-3 text-left text-sm font-sans text-ink-700 hover:bg-cream-50 flex items-center gap-2.5 transition-colors border-t border-cream-100"
                  >
                    <MessageSquare className="w-4 h-4 text-ink-400" />
                    Give feedback
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-3 text-left text-sm font-sans text-red-500 hover:bg-red-50 flex items-center gap-2.5 transition-colors border-t border-cream-100"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
    </>
  );
}
