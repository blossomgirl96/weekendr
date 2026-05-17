import { Link } from 'react-router-dom';
import { MapPin, Calendar, Baby } from 'lucide-react';
import { motion } from 'motion/react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="bg-cream-50/90 backdrop-blur-md sticky top-0 z-50 border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 52 70" fill="none">
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
          </div>
          <nav className="flex items-center gap-3">
            <Link to="/auth" className="text-sm font-bold text-ink-600 hover:text-ink-900 transition-colors font-sans">
              Sign in
            </Link>
            <Link
              to="/auth?mode=signup"
              className="px-5 py-2 bg-terracotta-500 text-cream-50 rounded-xl font-bold text-sm hover:bg-terracotta-600 transition-all shadow-sm font-sans"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="max-w-3xl mx-auto">
          <div className="relative text-center space-y-6">
            {/* Floating illustrations */}
            <div className="hidden md:block absolute -left-20 top-6 -rotate-12 opacity-90">
              <svg width="52" height="70" viewBox="0 0 52 70" fill="none">
                <path d="M8 32 L26 68 L44 32 Z" fill="#F2C9B3" stroke="#1A140E" strokeWidth="2" strokeLinejoin="round"/>
                <line x1="16" y1="44" x2="36" y2="44" stroke="#1A140E" strokeWidth="1" strokeLinecap="round" opacity="0.35"/>
                <line x1="12" y1="54" x2="40" y2="54" stroke="#1A140E" strokeWidth="1" strokeLinecap="round" opacity="0.35"/>
                <circle cx="26" cy="18" r="16" fill="#EDB821" stroke="#1A140E" strokeWidth="2"/>
                <line x1="10" y1="32" x2="42" y2="32" stroke="#1A140E" strokeWidth="2"/>
                <circle cx="26" cy="5" r="3.5" fill="#D85F2A" stroke="#1A140E" strokeWidth="1.5"/>
                <path d="M26 2 Q30 -2 34 2" stroke="#1A140E" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
            <div className="hidden md:block absolute -right-16 top-2 rotate-6 opacity-90">
              <svg width="48" height="72" viewBox="0 0 48 72" fill="none">
                <ellipse cx="24" cy="22" rx="18" ry="20" fill="#D85F2A" stroke="#1A140E" strokeWidth="2"/>
                <path d="M20 41 Q24 47 28 41" stroke="#1A140E" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <path d="M24 47 Q18 56 24 68" stroke="#1A140E" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
            <div className="hidden md:block absolute -right-20 bottom-0 rotate-12 opacity-90">
              <svg width="48" height="68" viewBox="0 0 48 68" fill="none">
                <path d="M24 2 Q46 26 24 54 Q2 26 24 2 Z" fill="#7ABF7A" stroke="#1A140E" strokeWidth="2"/>
                <line x1="24" y1="5" x2="24" y2="51" stroke="#1A140E" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M24 54 Q21 61 18 67" stroke="#1A140E" strokeWidth="2" strokeLinecap="round" fill="none"/>
              </svg>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] font-bold tracking-[0.12em] uppercase text-terracotta-500 font-sans"
            >
              Built for tired parents
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="display-hero text-5xl md:text-6xl text-ink-900"
            >
              Skip the planning.<br />
              <span className="text-terracotta-500">Keep the fun.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base md:text-lg text-ink-600 max-w-md mx-auto leading-relaxed font-sans"
            >
              Sundae pulls a handful of weekend activities your kids will actually like — close to home, easy to book, and ready before Friday night.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Link
                to="/auth?mode=signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-terracotta-500 text-cream-50 rounded-full font-bold text-lg border-2 border-ink-900 shadow-[0_6px_0_#1A140E] hover:bg-terracotta-600 hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_3px_0_#1A140E] transition-all font-sans"
              >
                Get started free
              </Link>
            </motion.div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
            {[
              { icon: MapPin, title: 'Real local spots', desc: 'Actual places near you, not a generic ranked list.', iconColor: 'text-terracotta-500', bg: 'bg-terracotta-50' },
              { icon: Calendar, title: 'Two full days', desc: 'Saturday and Sunday, sequenced and timed.', iconColor: 'text-pine-500', bg: 'bg-pine-50' },
              { icon: Baby, title: 'Age-specific', desc: "Written for your kids' exact ages. Not 'great for all ages.'", iconColor: 'text-sky-500', bg: 'bg-sky-50' },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="p-6 bg-white rounded-[18px] border border-cream-200 shadow-[0_4px_10px_-2px_rgba(38,31,24,0.08),0_1px_2px_rgba(38,31,24,0.04)] hover:shadow-[0_12px_24px_-8px_rgba(38,31,24,0.14),0_4px_8px_rgba(38,31,24,0.06)] hover:-translate-y-0.5 transition-all"
              >
                <div className={`${f.bg} ${f.iconColor} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-ink-900 mb-1 font-sans text-base">{f.title}</h3>
                <p className="text-ink-600 text-sm leading-relaxed font-sans">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-pine-500 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 52 70" fill="none">
              <path d="M8 32 L26 68 L44 32 Z" fill="#F2C9B3" stroke="#FBF7F1" strokeWidth="2" strokeLinejoin="round"/>
              <circle cx="26" cy="18" r="16" fill="#EDB821" stroke="#FBF7F1" strokeWidth="2"/>
              <line x1="10" y1="32" x2="42" y2="32" stroke="#FBF7F1" strokeWidth="2"/>
              <circle cx="26" cy="5" r="3.5" fill="#D85F2A" stroke="#FBF7F1" strokeWidth="1.5"/>
            </svg>
            <span className="sniglet text-lg">
              <span className="text-cream-50">s</span><span className="text-sun-400">un</span><span className="text-cream-50">da</span><span className="text-sun-400">e</span>
            </span>
          </div>
          <p className="caveat text-2xl text-cream-100">Have a good weekend.</p>
          <div className="flex gap-6 text-cream-200 text-sm font-sans">
            <span className="hover:text-cream-50 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-cream-50 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-cream-50 cursor-pointer transition-colors">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
