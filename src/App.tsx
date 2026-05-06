import React from 'react';
import { MapPin, Calendar, Heart, Users, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PreferencesForm } from './components/PreferencesForm';
import { WeekendPlanView } from './components/WeekendPlanView';
import { KidPreferences, WeekendPlan } from './types';
import { generateWeekendPlan } from './lib/claude';

export default function App() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [plan, setPlan] = React.useState<WeekendPlan | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleGenerate = async (prefs: KidPreferences) => {
    setPlan(null);
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateWeekendPlan(prefs);
      setPlan(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="bg-cream-50/90 backdrop-blur-md sticky top-0 z-50 border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setPlan(null)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="44" height="44" className="shrink-0 -rotate-12 group-hover:rotate-180 transition-transform duration-[600ms]">
              <circle cx="48" cy="48" r="20" fill="#EDB821"/>
              <g stroke="#EDB821" strokeWidth="5" strokeLinecap="round">
                <line x1="48" y1="10" x2="48" y2="20"/><line x1="48" y1="76" x2="48" y2="86"/>
                <line x1="10" y1="48" x2="20" y2="48"/><line x1="76" y1="48" x2="86" y2="48"/>
                <line x1="21" y1="21" x2="28" y2="28"/><line x1="68" y1="68" x2="75" y2="75"/>
                <line x1="21" y1="75" x2="28" y2="68"/><line x1="68" y1="28" x2="75" y2="21"/>
              </g>
            </svg>
            <h1 style={{ fontFamily: '"Sniglet", sans-serif', fontWeight: 800, fontSize: '32px', letterSpacing: '-0.02em', lineHeight: 1, color: 'var(--ink-700)' }}>
              w<span style={{ display: 'inline-block', transform: 'rotate(-6deg) translateY(2px)', color: 'var(--terracotta-500)' }}>e</span><span style={{ display: 'inline-block', transform: 'rotate(4deg) translateY(-1px)' }}>e</span>k<span style={{ display: 'inline-block', transform: 'rotate(-6deg) translateY(2px)', color: 'var(--terracotta-500)' }}>e</span>nd<span style={{ display: 'inline-block', transform: 'rotate(8deg)', color: 'var(--terracotta-500)' }}>r</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {!plan ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative w-full"
            >
              {/* Decorative sun */}
              <motion.div
                className="absolute top-0 left-2 xl:left-12 hidden lg:block pointer-events-none"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="68" height="68" style={{ transform: 'rotate(-15deg)' }}>
                  <circle cx="48" cy="48" r="20" fill="#EDB821"/>
                  <g stroke="#EDB821" strokeWidth="5" strokeLinecap="round">
                    <line x1="48" y1="10" x2="48" y2="20"/><line x1="48" y1="76" x2="48" y2="86"/>
                    <line x1="10" y1="48" x2="20" y2="48"/><line x1="76" y1="48" x2="86" y2="48"/>
                    <line x1="21" y1="21" x2="28" y2="28"/><line x1="68" y1="68" x2="75" y2="75"/>
                    <line x1="21" y1="75" x2="28" y2="68"/><line x1="68" y1="28" x2="75" y2="21"/>
                  </g>
                </svg>
              </motion.div>

              {/* Decorative balloon */}
              <motion.div
                className="absolute top-4 right-2 xl:right-16 hidden lg:block pointer-events-none"
                animate={{ y: [0, -8, 0], rotate: [-3, 3, -3] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 82" width="50" height="73">
                  <ellipse cx="28" cy="27" rx="20" ry="24" fill="#D85F2A"/>
                  <ellipse cx="21" cy="18" rx="5" ry="7" fill="rgba(255,255,255,0.18)"/>
                  <path d="M23 50 Q28 55 33 50" stroke="#B84A1F" strokeWidth="2" fill="#B84A1F" strokeLinecap="round"/>
                  <path d="M28 56 C25 65 31 68 27 79" stroke="#8A8073" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                </svg>
              </motion.div>

              {/* Decorative leaf */}
              <motion.div
                className="absolute top-[300px] left-0 xl:left-8 hidden lg:block pointer-events-none"
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                style={{ transformOrigin: 'bottom center' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 100" width="52" height="88" style={{ transform: 'rotate(-30deg)' }}>
                  <path d="M30 95 C8 75 5 30 30 5 C55 30 52 75 30 95Z" fill="#437E3F"/>
                  <path d="M30 8 L30 93" stroke="#2C5E2A" strokeWidth="1.5" fill="none"/>
                  <path d="M30 38 L15 28" stroke="#2C5E2A" strokeWidth="1" fill="none" opacity="0.5"/>
                  <path d="M30 52 L13 44" stroke="#2C5E2A" strokeWidth="1" fill="none" opacity="0.5"/>
                  <path d="M30 38 L45 28" stroke="#2C5E2A" strokeWidth="1" fill="none" opacity="0.5"/>
                  <path d="M30 52 L47 44" stroke="#2C5E2A" strokeWidth="1" fill="none" opacity="0.5"/>
                </svg>
              </motion.div>

              <div className="max-w-3xl mx-auto space-y-12">
              <div className="text-center space-y-5">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 bg-terracotta-50 text-terracotta-500 rounded-full text-xs font-bold tracking-widest uppercase border border-terracotta-100"
                >
                  <Users className="w-3.5 h-3.5" />
                  Weekend planner
                </motion.div>
                <h2
                  className="text-6xl md:text-8xl font-black text-ink-700 leading-none tracking-tight"
                  style={{ fontFamily: 'var(--font-display)', fontVariationSettings: '"opsz" 144, "SOFT" 50, "WONK" 1', textWrap: 'balance' }}
                >
                  Less planning,<br />
                  <span className="text-terracotta-500">more playing.</span>
                </h2>
                <p className="text-xl text-ink-400 max-w-xl mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
                  Tell us about your family and we'll put together a weekend with real local activities.
                </p>
              </div>

              <PreferencesForm onSubmit={handleGenerate} isLoading={isLoading} />

              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 flex items-center gap-3">
                  <Info className="w-5 h-5 shrink-0" />
                  <p className="font-medium">{error}</p>
                </div>
              )}

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                {[
                  { icon: MapPin, title: 'Real local spots', desc: 'Actual events and places near you, not generic suggestions.', color: 'text-terracotta-500', bg: 'bg-terracotta-50' },
                  { icon: Calendar, title: 'Smart scheduling', desc: 'Routes and timing optimised for families with kids.', color: 'text-pine-500', bg: 'bg-pine-50' },
                  { icon: Heart, title: 'Age appropriate', desc: 'Every activity matched to your kids\' ages.', color: 'text-sky-500', bg: 'bg-sky-50' },
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="p-7 bg-white rounded-[18px] shadow-[0_4px_10px_-2px_rgba(38,31,24,0.08)] border border-cream-200 hover:shadow-[0_12px_24px_-8px_rgba(38,31,24,0.14)] hover:border-ink-700 hover:-translate-y-0.5 transition-all"
                  >
                    <div className={`${feature.bg} ${feature.color} w-11 h-11 rounded-xl flex items-center justify-center mb-5`}>
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-ink-700 mb-2">{feature.title}</h3>
                    <p className="text-ink-400 leading-relaxed text-sm">{feature.desc}</p>
                  </div>
                ))}
              </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="plan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center mb-16 space-y-3">
                <h2 className="text-4xl md:text-5xl font-black text-ink-700">Your weekend adventure</h2>
                <p className="text-xl text-ink-400">Activities picked for your family.</p>
              </div>
              <WeekendPlanView plan={plan} onBack={() => setPlan(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-pine-500 border-t-2 border-ink-700 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="28" height="28" className="shrink-0 -rotate-12">
              <circle cx="48" cy="48" r="20" fill="#EDB821"/>
              <g stroke="#EDB821" strokeWidth="5" strokeLinecap="round">
                <line x1="48" y1="10" x2="48" y2="20"/><line x1="48" y1="76" x2="48" y2="86"/>
                <line x1="10" y1="48" x2="20" y2="48"/><line x1="76" y1="48" x2="86" y2="48"/>
                <line x1="21" y1="21" x2="28" y2="28"/><line x1="68" y1="68" x2="75" y2="75"/>
                <line x1="21" y1="75" x2="28" y2="68"/><line x1="68" y1="28" x2="75" y2="21"/>
              </g>
            </svg>
            <span style={{ fontFamily: '"Sniglet", sans-serif', fontWeight: 800, fontSize: '20px', letterSpacing: '-0.02em', lineHeight: 1, color: 'var(--cream-50)' }}>
              w<span style={{ display: 'inline-block', transform: 'rotate(-6deg) translateY(2px)', color: 'var(--sun-300)' }}>e</span><span style={{ display: 'inline-block', transform: 'rotate(4deg) translateY(-1px)' }}>e</span>k<span style={{ display: 'inline-block', transform: 'rotate(-6deg) translateY(2px)', color: 'var(--sun-300)' }}>e</span>nd<span style={{ display: 'inline-block', transform: 'rotate(8deg)', color: 'var(--sun-300)' }}>r</span>
            </span>
          </div>
          <div className="flex gap-6 text-sm" style={{ color: 'rgba(251,247,241,0.6)' }}>
            <span className="hover:text-cream-50 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-cream-50 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-cream-50 cursor-pointer transition-colors">Support</span>
          </div>
          <span style={{ fontFamily: 'var(--font-hand)', fontSize: '22px', color: 'var(--sun-300)' }}>
            Have a good weekend.
          </span>
        </div>
      </footer>
    </div>
  );
}
