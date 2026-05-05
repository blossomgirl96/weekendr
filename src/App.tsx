import React from 'react';
import { Sun, MapPin, Calendar, Heart, Users, Info } from 'lucide-react';
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
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setPlan(null)}>
            <div className="w-10 h-10 bg-terracotta-500 rounded-xl flex items-center justify-center text-cream-50 shadow-md group-hover:rotate-12 transition-transform">
              <Sun className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-terracotta-500" style={{ fontFamily: 'var(--font-display)' }}>
              Weekendr
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
              className="max-w-3xl mx-auto space-y-12"
            >
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
                  className="text-5xl md:text-6xl font-black text-ink-700 leading-tight"
                  style={{ fontVariationSettings: '"opsz" 96, "SOFT" 40, "WONK" 1' }}
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
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 flex items-center gap-3">
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
                    className="p-7 bg-white rounded-[18px] border border-cream-200 hover:shadow-[0_12px_24px_-8px_rgba(38,31,24,0.12)] transition-shadow"
                  >
                    <div className={`${feature.bg} ${feature.color} w-11 h-11 rounded-xl flex items-center justify-center mb-5`}>
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-ink-700 mb-2">{feature.title}</h3>
                    <p className="text-ink-400 leading-relaxed text-sm">{feature.desc}</p>
                  </div>
                ))}
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
      <footer className="bg-cream-100 border-t border-cream-200 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-terracotta-500 rounded-lg flex items-center justify-center text-cream-50">
              <Sun className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-ink-700" style={{ fontFamily: 'var(--font-display)' }}>Weekendr</span>
          </div>
          <p className="text-ink-400 text-sm">
            © 2026 Weekendr. Making weekends worth it.
          </p>
          <div className="flex gap-6 text-ink-400 text-sm">
            <span className="hover:text-terracotta-500 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-terracotta-500 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-terracotta-500 cursor-pointer transition-colors">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
