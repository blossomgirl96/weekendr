import React from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { MapPin, Info } from 'lucide-react';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { AppHeader } from '../components/AppHeader';
import { WeekendPlanView } from '../components/WeekendPlanView';
import { generateWeekendPlan } from '../lib/claude';
import { fetchLiveEvents } from '../lib/events';
import { cn } from '../lib/utils';
import { KidPreferences, UserProfile, WeekendPlan } from '../types';

const POPULAR_CITIES = [
  'Atlanta, GA', 'Austin, TX', 'Boston, MA', 'Chicago, IL', 'Dallas, TX',
  'Denver, CO', 'Houston, TX', 'Las Vegas, NV', 'Los Angeles, CA', 'Miami, FL',
  'Nashville, TN', 'New York, NY', 'Orlando, FL', 'Philadelphia, PA', 'Phoenix, AZ',
  'Portland, OR', 'San Diego, CA', 'San Francisco, CA', 'Seattle, WA', 'Washington, D.C.',
  'London, UK', 'Paris, FR', 'Tokyo, JP', 'Sydney, AU', 'Toronto, CA', 'Vancouver, CA',
];

const INTERESTS = ['Outdoors', 'Animals', 'Science', 'Art', 'Active Play', 'Music', 'History', 'Food', 'Sports'];
const VIBES = [
  { id: 'active', label: 'Active' },
  { id: 'educational', label: 'Educational' },
  { id: 'relaxing', label: 'Relaxing' },
  { id: 'creative', label: 'Creative' },
];

export function PlannerPage() {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(' ')[0] || '';
  const [profile, setProfile] = React.useState<UserProfile | null>(null);

  // Form state
  const [targetLocality, setTargetLocality] = React.useState('');
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [weekendInterests, setWeekendInterests] = React.useState('');
  const [selectedInterests, setSelectedInterests] = React.useState<string[]>([]);
  const [budgetCeiling, setBudgetCeiling] = React.useState(100);
  const [freeOnly, setFreeOnly] = React.useState(false);
  const [vibe, setVibe] = React.useState<KidPreferences['vibe']>('active');

  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingMessage, setLoadingMessage] = React.useState('');
  const [plan, setPlan] = React.useState<WeekendPlan | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!user) return;
    getDoc(doc(db, 'users', user.uid)).then((snap) => {
      if (snap.exists()) setProfile(snap.data() as UserProfile);
    });
  }, [user]);

  const handleTargetChange = (val: string) => {
    setTargetLocality(val);
    if (val.length >= 2) {
      setSuggestions(POPULAR_CITIES.filter(c => c.toLowerCase().startsWith(val.toLowerCase())));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const toggleInterest = (i: string) =>
    setSelectedInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetLocality || !profile) return;
    setPlan(null);
    setIsLoading(true);
    setError(null);
    try {
      const prefs: KidPreferences = {
        startingAddress: profile.homeAddress,
        targetLocality,
        kids: profile.kids,
        interests: selectedInterests,
        budgetCeiling,
        freeOnly,
        vibe,
        weekendInterests,
        typicalInterests: profile.typicalInterests,
        restrictions: profile.restrictions,
      };
      setLoadingMessage('Finding live events near you…');
      const liveEvents = await fetchLiveEvents(targetLocality, profile.kids);
      setLoadingMessage('Building your weekend plan…');
      const result = await generateWeekendPlan(prefs, liveEvents);
      setPlan(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (plan) {
    return (
      <div className="min-h-screen bg-cream-50">
        <AppHeader />
        <main className="max-w-7xl mx-auto px-4 py-12">
          <WeekendPlanView plan={plan} onBack={() => setPlan(null)} />
        </main>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-cream-50">
      <AppHeader />
      <main className="max-w-2xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-2">
          <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-terracotta-500 font-sans">Weekend planner</p>
          <h1 className="display-hero text-4xl md:text-5xl text-ink-900">
            {firstName ? <>Hi {firstName}, what's the plan?</> : "What's the plan?"}
          </h1>
        </div>


        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-[18px] border border-cream-200 shadow-[0_4px_10px_-2px_rgba(38,31,24,0.08)]">
          {/* Target locality */}
          <div className="space-y-2 relative">
            <label className="text-sm font-bold text-ink-600 uppercase tracking-[0.08em] font-sans block">Where to this weekend?</label>
            <div className="relative">
              <input
                type="text"
                placeholder="City or neighborhood to explore"
                value={targetLocality}
                onChange={(e) => handleTargetChange(e.target.value)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-100 text-ink-900 placeholder:text-ink-400 outline-none focus:ring-[3px] focus:ring-sky-500/50 focus:border-transparent transition-all font-sans"
                required
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-cream-200 rounded-xl shadow-[0_12px_24px_-8px_rgba(38,31,24,0.14)] overflow-hidden">
                  {suggestions.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => { setTargetLocality(city); setShowSuggestions(false); }}
                      className="w-full text-left px-4 py-3 hover:bg-sky-50 text-ink-900 transition-colors flex items-center gap-3 border-b border-cream-100 last:border-0 font-sans text-sm"
                    >
                      <MapPin className="w-4 h-4 text-sky-400" />
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Weekend interests */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-ink-600 uppercase tracking-[0.08em] font-sans block">What do you feel like this weekend?</label>
            <textarea
              rows={2}
              placeholder="e.g. something outdoors, maybe near water, low-key and easy"
              value={weekendInterests}
              onChange={(e) => setWeekendInterests(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-100 text-ink-900 placeholder:text-ink-400 outline-none focus:ring-[3px] focus:ring-terracotta-500/50 focus:border-transparent transition-all font-sans resize-none"
            />
          </div>

          {/* Interest chips */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-ink-600 uppercase tracking-[0.08em] font-sans block">Quick interests</label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map(interest => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={cn(
                    'px-4 py-2 rounded-full border text-sm font-sans transition-all',
                    selectedInterests.includes(interest)
                      ? 'bg-terracotta-500 border-ink-900 text-white shadow-sm'
                      : 'bg-white border-cream-200 text-ink-600 hover:border-terracotta-300'
                  )}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Budget + Vibe */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-ink-600 uppercase tracking-[0.08em] font-sans block">Budget / person</label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div
                    className={cn('w-9 h-5 rounded-full transition-colors relative', freeOnly ? 'bg-pine-500' : 'bg-cream-200')}
                    onClick={() => setFreeOnly(v => !v)}
                  >
                    <div className={cn('absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform', freeOnly ? 'translate-x-4' : 'translate-x-0.5')} />
                  </div>
                  <span className="text-xs font-bold text-ink-600 font-sans">Free only</span>
                </label>
              </div>
              <div className={cn('relative transition-opacity', freeOnly && 'opacity-40 pointer-events-none')}>
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 font-bold font-sans">$</span>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={budgetCeiling}
                  onChange={(e) => setBudgetCeiling(parseInt(e.target.value) || 0)}
                  disabled={freeOnly}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-cream-200 bg-cream-100 text-ink-900 outline-none focus:ring-[3px] focus:ring-terracotta-500/50 focus:border-transparent font-bold font-sans disabled:cursor-not-allowed transition-all"
                />
              </div>
              <p className="text-xs text-ink-400 font-sans">
                {freeOnly ? 'Only free & zero-cost activities' : 'Per person: entry + parking'}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-ink-600 uppercase tracking-[0.08em] font-sans block">Weekend vibe</label>
              <div className="grid grid-cols-2 gap-2">
                {VIBES.map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setVibe(id as KidPreferences['vibe'])}
                    className={cn(
                      'flex items-center justify-center px-4 py-3 rounded-xl border text-sm font-sans transition-all',
                      vibe === id
                        ? 'bg-pine-500 border-ink-900 text-white shadow-sm'
                        : 'bg-white border-cream-200 text-ink-600 hover:border-pine-200'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-terracotta-50 border border-terracotta-200 rounded-2xl text-terracotta-600 flex items-center gap-3 font-sans">
              <Info className="w-5 h-5 shrink-0" />
              <p className="font-medium text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !profile}
            className="w-full py-4 bg-terracotta-500 text-cream-50 rounded-full font-bold text-lg border-2 border-ink-900 shadow-[0_6px_0_#1A140E] hover:bg-terracotta-600 hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_3px_0_#1A140E] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-3 font-sans"
          >
            {isLoading ? (
              <><div className="w-5 h-5 border-[3px] border-cream-50/30 border-t-cream-50 rounded-full animate-spin" /> {loadingMessage || 'Planning your weekend…'}</>
            ) : (
              'Plan my weekend'
            )}
          </button>
          {!profile && (
            <p className="text-center text-xs text-ink-400 font-sans">
              <Link to="/profile" className="text-terracotta-500 font-bold">Complete your profile</Link> before planning
            </p>
          )}
        </form>
      </main>
    </div>
  );
}
