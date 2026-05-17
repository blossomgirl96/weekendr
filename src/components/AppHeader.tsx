import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User } from 'lucide-react';

export function AppHeader() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.displayName?.split(' ')[0] || '';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-cream-50/90 backdrop-blur-md sticky top-0 z-50 border-b border-cream-200">
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
            to="/profile"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-ink-600 hover:text-ink-900 font-sans transition-colors"
          >
            <User className="w-4 h-4" />
            Profile
          </Link>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm font-bold text-cream-50 bg-ink-900 rounded-xl hover:bg-ink-600 transition-all font-sans"
          >
            Sign out
          </button>
        </nav>
      </div>
    </header>
  );
}
