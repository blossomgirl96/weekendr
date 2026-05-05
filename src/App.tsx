import React from 'react';
import { Diamond, MapPin, Calendar, Heart, Users, Info } from 'lucide-react';
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
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setPlan(null)}>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-100 group-hover:rotate-12 transition-transform">
              <Diamond className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              Weekndr
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
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-bold tracking-wide uppercase"
                >
                  <Users className="w-4 h-4" />
                  Weekend Magic Awaits
                </motion.div>
                <h2 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
                  Less planning, <br />
                  <span className="text-orange-500">more playing.</span>
                </h2>
                <p className="text-xl text-gray-500 max-w-xl mx-auto">
                  Tell us a bit about your family, and we'll craft the perfect weekend itinerary with real local activities.
                </p>
              </div>

              <PreferencesForm onSubmit={handleGenerate} isLoading={isLoading} />

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 flex items-center gap-3">
                  <Info className="w-5 h-5 shrink-0" />
                  <p className="font-medium">{error}</p>
                </div>
              )}

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
                {[
                  { icon: MapPin, title: 'Real Local Spots', desc: 'We find actual events and places near you.', color: 'text-blue-500', bg: 'bg-blue-50' },
                  { icon: Calendar, title: 'Smart Scheduling', desc: 'Optimized routes and timing for kids.', color: 'text-purple-500', bg: 'bg-purple-50' },
                  { icon: Heart, title: 'Age Appropriate', desc: 'Activities tailored to your kids\' ages.', color: 'text-pink-500', bg: 'bg-pink-50' },
                ].map((feature, i) => (
                  <div key={i} className="p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className={`${feature.bg} ${feature.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
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
              <div className="text-center mb-16 space-y-4">
                <h2 className="text-4xl md:text-5xl font-black text-gray-900">Your Weekend Adventure</h2>
                <p className="text-xl text-gray-500">Hand-picked activities just for your family.</p>
              </div>
              <WeekendPlanView plan={plan} onBack={() => setPlan(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white">
              <Diamond className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-gray-800 tracking-tight">Weekndr</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2026 Weekndr. Making parenting a little more magical.
          </p>
          <div className="flex gap-6 text-gray-400">
            <span className="hover:text-orange-500 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-orange-500 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-orange-500 cursor-pointer transition-colors">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
