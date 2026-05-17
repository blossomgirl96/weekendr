import React from 'react';
import { MapPin, Plus, Trash2 } from 'lucide-react';
import { KidPreferences, Kid } from '../types';
import { cn } from '../lib/utils';

interface Props {
  onSubmit: (prefs: KidPreferences) => void;
  isLoading: boolean;
}

const INTERESTS = ['Outdoors', 'Animals', 'Science', 'Art', 'Active Play', 'Music', 'History', 'Food', 'Sports'];
const VIBES = [
  { id: 'active', label: 'Active' },
  { id: 'educational', label: 'Educational' },
  { id: 'relaxing', label: 'Relaxing' },
  { id: 'creative', label: 'Creative' },
];

const POPULAR_CITIES = [
  'Atlanta, GA', 'Austin, TX', 'Boston, MA', 'Chicago, IL', 'Dallas, TX',
  'Denver, CO', 'Houston, TX', 'Las Vegas, NV', 'Los Angeles, CA', 'Miami, FL',
  'Nashville, TN', 'New York, NY', 'Orlando, FL', 'Philadelphia, PA', 'Phoenix, AZ',
  'Portland, OR', 'San Diego, CA', 'San Francisco, CA', 'Seattle, WA', 'Washington, D.C.',
  'London, UK', 'Paris, FR', 'Tokyo, JP', 'Sydney, AU', 'Toronto, CA', 'Vancouver, CA'
];

export function PreferencesForm({ onSubmit, isLoading }: Props) {
  const [startingAddress, setStartingAddress] = React.useState('');
  const [targetLocality, setTargetLocality] = React.useState('');
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [activeSearch, setActiveSearch] = React.useState<'target' | null>(null);
  const [kids, setKids] = React.useState<Kid[]>([{ id: '1', age: 5 }]);
  const [selectedInterests, setSelectedInterests] = React.useState<string[]>([]);
  const [budgetCeiling, setBudgetCeiling] = React.useState(100);
  const [vibe, setVibe] = React.useState<KidPreferences['vibe']>('active');

  const [freeOnly, setFreeOnly] = React.useState(false);

const handleTargetChange = (val: string) => {
    setTargetLocality(val);
    if (val.length >= 2) {
      const filtered = POPULAR_CITIES.filter(city =>
        city.toLowerCase().startsWith(val.toLowerCase())
      );
      setSuggestions(filtered);
      setActiveSearch('target');
    } else {
      setSuggestions([]);
      setActiveSearch(null);
    }
  };

  const selectSuggestion = (city: string) => {
    setTargetLocality(city);
    setSuggestions([]);
    setActiveSearch(null);
  };

  const addKid = () => {
    setKids([...kids, { id: Math.random().toString(36).substr(2, 9), age: 5 }]);
  };

  const removeKid = (id: string) => {
    if (kids.length > 1) setKids(kids.filter(k => k.id !== id));
  };

  const updateKidAge = (id: string, age: number) => {
    setKids(kids.map(k => k.id === id ? { ...k, age } : k));
  };

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startingAddress || !targetLocality) return;
    onSubmit({ startingAddress, targetLocality, kids, interests: selectedInterests, budgetCeiling, freeOnly, vibe });
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 bg-white p-8 rounded-[18px] border border-cream-200 shadow-[0_4px_10px_-2px_rgba(38,31,24,0.08),0_1px_2px_rgba(38,31,24,0.04)]"
    >
      {/* Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 relative">
          <label className="text-sm font-bold text-ink-600 uppercase tracking-[0.08em] font-sans block">
            Starting address
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Your home or hotel"
              value={startingAddress}
              onChange={(e) => setStartingAddress(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-100 text-ink-900 placeholder:text-ink-400 outline-none transition-all focus:ring-[3px] focus:ring-terracotta-500/50 focus:ring-offset-2 focus:border-transparent font-sans"
              required
            />
          </div>
          <p className="text-xs text-ink-400 font-sans">Used for drive time estimates</p>
        </div>

        <div className="space-y-2 relative">
          <label className="text-sm font-bold text-ink-600 uppercase tracking-[0.08em] font-sans block">
            Target locality
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="City or neighborhood to explore"
              value={targetLocality}
              onChange={(e) => handleTargetChange(e.target.value)}
              onBlur={() => setTimeout(() => setActiveSearch(null), 200)}
              className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-100 text-ink-900 placeholder:text-ink-400 outline-none transition-all focus:ring-[3px] focus:ring-sky-500/50 focus:ring-offset-2 focus:border-transparent font-sans"
              required
            />
            {activeSearch === 'target' && suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-cream-200 rounded-xl shadow-[0_12px_24px_-8px_rgba(38,31,24,0.14)] overflow-hidden">
                {suggestions.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => selectSuggestion(city)}
                    className="w-full text-left px-4 py-3 hover:bg-sky-50 text-ink-900 transition-colors flex items-center gap-3 border-b border-cream-100 last:border-0 font-sans text-sm"
                  >
                    <MapPin className="w-4 h-4 text-sky-400" />
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-ink-400 font-sans">Where activities will be found</p>
        </div>
      </div>

      {/* Kids */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-ink-600 uppercase tracking-[0.08em] font-sans block">
            Your kids
          </label>
          <button
            type="button"
            onClick={addKid}
            className="flex items-center gap-1 text-sm font-bold text-terracotta-500 hover:text-terracotta-600 transition-colors font-sans"
          >
            <Plus className="w-4 h-4" />
            Add kid
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {kids.map((kid, index) => (
            <div key={kid.id} className="flex items-center gap-3 bg-terracotta-50 p-4 rounded-xl border border-terracotta-100">
              <span className="text-xs font-bold text-terracotta-500 font-sans">#{index + 1}</span>
              <div className="flex-1">
                <label className="text-[10px] font-bold text-terracotta-600 uppercase tracking-[0.08em] block mb-1 font-sans">Age</label>
                <input
                  type="number"
                  min="0"
                  max="18"
                  value={kid.age}
                  onChange={(e) => updateKidAge(kid.id, parseInt(e.target.value) || 0)}
                  className="w-full bg-transparent border-b border-terracotta-200 focus:border-terracotta-500 outline-none font-bold text-ink-900 font-sans"
                />
              </div>
              {kids.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeKid(kid.id)}
                  className="p-1.5 text-terracotta-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-ink-600 uppercase tracking-[0.08em] font-sans block">
          Interests
        </label>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map(interest => (
            <button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              className={cn(
                "px-4 py-2 rounded-full border text-sm font-sans transition-all",
                selectedInterests.includes(interest)
                  ? "bg-terracotta-500 border-ink-900 text-white shadow-sm"
                  : "bg-white border-cream-200 text-ink-600 hover:border-terracotta-300"
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
            <label className="text-sm font-bold text-ink-600 uppercase tracking-[0.08em] font-sans block">
              Max budget
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div
                className={cn(
                  "w-9 h-5 rounded-full transition-colors relative",
                  freeOnly ? "bg-pine-500" : "bg-cream-200"
                )}
                onClick={() => setFreeOnly(v => !v)}
              >
                <div className={cn(
                  "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform",
                  freeOnly ? "translate-x-4" : "translate-x-0.5"
                )} />
              </div>
              <span className="text-xs font-bold text-ink-600 font-sans">Free only</span>
            </label>
          </div>
          <div className={cn("relative transition-opacity", freeOnly && "opacity-40 pointer-events-none")}>
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 font-bold font-sans">$</span>
            <input
              type="number"
              min="0"
              step="10"
              value={budgetCeiling}
              onChange={(e) => setBudgetCeiling(parseInt(e.target.value) || 0)}
              disabled={freeOnly}
              className="w-full pl-8 pr-4 py-3 rounded-xl border border-cream-200 bg-cream-100 text-ink-900 outline-none transition-all focus:ring-[3px] focus:ring-terracotta-500/50 focus:ring-offset-2 focus:border-transparent font-bold font-sans disabled:cursor-not-allowed"
            />
          </div>
          <p className="text-xs text-ink-400 font-sans">
            {freeOnly ? 'Only free & zero-cost activities' : 'All-in: entry + parking + food'}
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-ink-600 uppercase tracking-[0.08em] font-sans block">
            Weekend vibe
          </label>
          <div className="grid grid-cols-2 gap-2">
            {VIBES.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setVibe(id as KidPreferences['vibe'])}
                className={cn(
                  "flex items-center justify-center px-4 py-3 rounded-xl border text-sm font-sans transition-all",
                  vibe === id
                    ? "bg-pine-500 border-ink-900 text-white shadow-sm"
                    : "bg-white border-cream-200 text-ink-600 hover:border-pine-200"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 bg-terracotta-500 text-cream-50 rounded-full font-bold text-lg border-2 border-ink-900 shadow-[0_6px_0_#1A140E] hover:bg-terracotta-600 hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_3px_0_#1A140E] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-3 font-sans"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-[3px] border-cream-50/30 border-t-cream-50 rounded-full animate-spin" />
            Planning your weekend…
          </>
        ) : (
          'Plan my weekend'
        )}
      </button>
    </form>
  );
}
