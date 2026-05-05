import React from 'react';
import { Sparkles, MapPin, Users, Heart, Wallet, Zap, Plus, Trash2, GraduationCap, Palette, Lightbulb } from 'lucide-react';
import { KidPreferences, Kid } from '../types';
import { cn } from '../lib/utils';

interface Props {
  onSubmit: (prefs: KidPreferences) => void;
  isLoading: boolean;
}

const INTERESTS = ['Outdoors', 'Animals', 'Science', 'Art', 'Active Play', 'Music', 'History', 'Food'];
const VIBES = [
  { id: 'active', label: 'Active', icon: Zap },
  { id: 'educational', label: 'Educational', icon: GraduationCap },
  { id: 'relaxing', label: 'Relaxing', icon: Heart },
  { id: 'creative', label: 'Creative', icon: Palette },
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
  const [activeSearch, setActiveSearch] = React.useState<'starting' | 'target' | null>(null);
  const [kids, setKids] = React.useState<Kid[]>([{ id: '1', age: 5 }]);
  const [selectedInterests, setSelectedInterests] = React.useState<string[]>([]);
  const [budgetCeiling, setBudgetCeiling] = React.useState(100);
  const [vibe, setVibe] = React.useState<KidPreferences['vibe']>('active');

  const handleLocationChange = (val: string, type: 'starting' | 'target') => {
    if (type === 'starting') setStartingAddress(val);
    else setTargetLocality(val);

    if (val.length >= 2) {
      const filtered = POPULAR_CITIES.filter(city =>
        city.toLowerCase().startsWith(val.toLowerCase())
      );
      setSuggestions(filtered);
      setActiveSearch(type);
    } else {
      setSuggestions([]);
      setActiveSearch(null);
    }
  };

  const selectSuggestion = (city: string) => {
    if (activeSearch === 'starting') setStartingAddress(city);
    else if (activeSearch === 'target') setTargetLocality(city);
    setSuggestions([]);
    setActiveSearch(null);
  };

  const addKid = () => {
    setKids([...kids, { id: Math.random().toString(36).substr(2, 9), age: 5 }]);
  };

  const removeKid = (id: string) => {
    if (kids.length > 1) {
      setKids(kids.filter(k => k.id !== id));
    }
  };

  const updateKidAge = (id: string, age: number) => {
    setKids(kids.map(k => k.id === id ? { ...k, age } : k));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startingAddress || !targetLocality) return;
    onSubmit({ startingAddress, targetLocality, kids, interests: selectedInterests, budgetCeiling, vibe });
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-[24px] shadow-[0_12px_24px_-8px_rgba(38,31,24,0.12)] border border-cream-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3 relative">
          <label className="flex items-center gap-2 text-base font-semibold text-ink-600">
            <MapPin className="w-4 h-4 text-terracotta-500" />
            Starting address
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Your home or hotel address"
              value={startingAddress}
              onChange={(e) => handleLocationChange(e.target.value, 'starting')}
              onBlur={() => setTimeout(() => setActiveSearch(prev => prev === 'starting' ? null : prev), 200)}
              className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 focus:ring-2 focus:ring-terracotta-400 focus:border-transparent outline-none transition-all text-ink-700 placeholder:text-ink-300"
              required
            />
            {activeSearch === 'starting' && suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-white border border-cream-200 rounded-xl shadow-[0_12px_24px_-8px_rgba(38,31,24,0.14)] overflow-hidden">
                {suggestions.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => selectSuggestion(city)}
                    className="w-full text-left px-4 py-3 hover:bg-terracotta-50 text-ink-600 transition-colors flex items-center gap-3 border-b border-cream-100 last:border-0"
                  >
                    <MapPin className="w-4 h-4 text-terracotta-300" />
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-ink-300">Used for drive time estimates</p>
        </div>

        <div className="space-y-3 relative">
          <label className="flex items-center gap-2 text-base font-semibold text-ink-600">
            <MapPin className="w-4 h-4 text-sky-500" />
            Where you want to explore
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="City or neighbourhood"
              value={targetLocality}
              onChange={(e) => handleLocationChange(e.target.value, 'target')}
              onBlur={() => setTimeout(() => setActiveSearch(prev => prev === 'target' ? null : prev), 200)}
              className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition-all text-ink-700 placeholder:text-ink-300"
              required
            />
            {activeSearch === 'target' && suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-white border border-cream-200 rounded-xl shadow-[0_12px_24px_-8px_rgba(38,31,24,0.14)] overflow-hidden">
                {suggestions.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => selectSuggestion(city)}
                    className="w-full text-left px-4 py-3 hover:bg-sky-50 text-ink-600 transition-colors flex items-center gap-3 border-b border-cream-100 last:border-0"
                  >
                    <MapPin className="w-4 h-4 text-sky-300" />
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-ink-300">Where we'll find activities</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-base font-semibold text-ink-600">
            <Users className="w-4 h-4 text-terracotta-500" />
            Your kids
          </label>
          <button
            type="button"
            onClick={addKid}
            className="flex items-center gap-1 text-sm font-bold text-terracotta-600 hover:text-terracotta-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add kid
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {kids.map((kid, index) => (
            <div key={kid.id} className="flex items-center gap-3 bg-terracotta-50 p-4 rounded-[18px] border border-terracotta-100">
              <span className="text-sm font-bold text-terracotta-400">#{index + 1}</span>
              <div className="flex-1">
                <label className="text-xs font-bold text-terracotta-600 uppercase tracking-wider block mb-1">Age</label>
                <input
                  type="number"
                  min="0"
                  max="18"
                  value={kid.age}
                  onChange={(e) => updateKidAge(kid.id, parseInt(e.target.value) || 0)}
                  className="w-full bg-transparent border-b border-terracotta-200 focus:border-terracotta-500 outline-none font-bold text-ink-700"
                />
              </div>
              {kids.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeKid(kid.id)}
                  className="p-2 text-terracotta-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-base font-semibold text-ink-600">
          <Lightbulb className="w-4 h-4 text-terracotta-500" />
          Interests
        </label>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map(interest => (
            <button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              className={cn(
                "px-4 py-2 rounded-full border text-sm font-medium transition-all",
                selectedInterests.includes(interest)
                  ? "bg-terracotta-500 border-terracotta-500 text-white shadow-sm"
                  : "bg-white border-cream-200 text-ink-500 hover:border-terracotta-300 hover:text-terracotta-600"
              )}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-base font-semibold text-ink-600">
            <Wallet className="w-4 h-4 text-terracotta-500" />
            Max budget
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 font-bold">$</span>
            <input
              type="number"
              min="0"
              step="10"
              value={budgetCeiling}
              onChange={(e) => setBudgetCeiling(parseInt(e.target.value) || 0)}
              className="w-full pl-8 pr-4 py-3 rounded-xl border border-cream-200 bg-cream-50 focus:ring-2 focus:ring-terracotta-400 outline-none transition-all font-bold text-ink-700"
            />
          </div>
          <p className="text-xs text-ink-300">Entry + parking + food, estimated</p>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-base font-semibold text-ink-600">
            <Zap className="w-4 h-4 text-terracotta-500" />
            Weekend vibe
          </label>
          <div className="grid grid-cols-2 gap-2">
            {VIBES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setVibe(id as any)}
                className={cn(
                  "flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all",
                  vibe === id
                    ? "bg-pine-500 border-pine-500 text-white shadow-sm"
                    : "bg-white border-cream-200 text-ink-500 hover:border-pine-300 hover:text-pine-600"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 bg-terracotta-500 text-cream-50 rounded-full font-bold text-lg shadow-[0_6px_0_#1A140E] hover:bg-terracotta-600 hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_3px_0_#1A140E] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0 flex items-center justify-center gap-3"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
            Planning your weekend…
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Plan my weekend
          </>
        )}
      </button>
    </form>
  );
}
