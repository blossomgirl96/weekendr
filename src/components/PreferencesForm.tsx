import React from 'react';
import { Diamond, Sparkles, MapPin, Users, Heart, Wallet, Zap, Plus, Trash2, GraduationCap, Palette, Lightbulb } from 'lucide-react';
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
    setSelectedInterests(prev => prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-orange-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 relative">
          <label className="flex items-center gap-2 text-lg font-semibold text-gray-700">
            <MapPin className="w-5 h-5 text-orange-500" />
            Starting Address
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Your home or hotel address"
              value={startingAddress}
              onChange={(e) => handleLocationChange(e.target.value, 'starting')}
              onBlur={() => setTimeout(() => setActiveSearch(prev => prev === 'starting' ? null : prev), 200)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              required
            />
            {activeSearch === 'starting' && suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {suggestions.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => selectSuggestion(city)}
                    className="w-full text-left px-4 py-3 hover:bg-orange-50 text-gray-700 transition-colors flex items-center gap-3 border-b border-gray-50 last:border-0"
                  >
                    <MapPin className="w-4 h-4 text-orange-300" />
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-gray-400">Used for local drive time estimates</p>
        </div>

        <div className="space-y-4 relative">
          <label className="flex items-center gap-2 text-lg font-semibold text-gray-700">
            <MapPin className="w-5 h-5 text-blue-500" />
            Target Locality
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="City or Neighborhood to explore"
              value={targetLocality}
              onChange={(e) => handleLocationChange(e.target.value, 'target')}
              onBlur={() => setTimeout(() => setActiveSearch(prev => prev === 'target' ? null : prev), 200)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            />
            {activeSearch === 'target' && suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {suggestions.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => selectSuggestion(city)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 text-gray-700 transition-colors flex items-center gap-3 border-b border-gray-50 last:border-0"
                  >
                    <MapPin className="w-4 h-4 text-blue-300" />
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-gray-400">Area where activities will be found</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-lg font-semibold text-gray-700">
            <Users className="w-5 h-5 text-orange-500" />
            Your Kids
          </label>
          <button
            type="button"
            onClick={addKid}
            className="flex items-center gap-1 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Kid
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {kids.map((kid, index) => (
            <div key={kid.id} className="flex items-center gap-3 bg-orange-50 p-4 rounded-2xl border border-orange-100">
              <span className="text-sm font-bold text-orange-400">#{index + 1}</span>
              <div className="flex-1">
                <label className="text-xs font-bold text-orange-600 uppercase block mb-1">Age</label>
                <input
                  type="number"
                  min="0"
                  max="18"
                  value={kid.age}
                  onChange={(e) => updateKidAge(kid.id, parseInt(e.target.value) || 0)}
                  className="w-full bg-transparent border-b border-orange-200 focus:border-orange-500 outline-none font-bold text-gray-700"
                />
              </div>
              {kids.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeKid(kid.id)}
                  className="p-2 text-orange-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="flex items-center gap-2 text-lg font-semibold text-gray-700">
          <Lightbulb className="w-5 h-5 text-orange-500" />
          Interests
        </label>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map(interest => (
            <button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              className={cn(
                "px-4 py-2 rounded-full border transition-all",
                selectedInterests.includes(interest)
                  ? "bg-blue-500 border-blue-500 text-white shadow-md"
                  : "bg-white border-gray-200 text-gray-600 hover:border-blue-300"
              )}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-lg font-semibold text-gray-700">
            <Wallet className="w-5 h-5 text-orange-500" />
            Max Budget ($)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
            <input
              type="number"
              min="0"
              step="10"
              value={budgetCeiling}
              onChange={(e) => setBudgetCeiling(parseInt(e.target.value) || 0)}
              className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all font-bold text-gray-700"
            />
          </div>
          <p className="text-xs text-gray-400">Estimated all-in cost (entry + parking + food)</p>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-2 text-lg font-semibold text-gray-700">
            <Zap className="w-5 h-5 text-orange-500" />
            Weekend Vibe
          </label>
          <div className="grid grid-cols-2 gap-2">
            {VIBES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setVibe(id as any)}
                className={cn(
                  "flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all",
                  vibe === id
                    ? "bg-purple-500 border-purple-500 text-white shadow-md"
                    : "bg-white border-gray-200 text-gray-600 hover:border-purple-300"
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
        className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl font-bold text-xl shadow-lg hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {isLoading ? (
          <>
            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            Planning your magic weekend...
          </>
        ) : (
          <>
            <Diamond className="w-6 h-6" />
            Generate Weekend Plan
          </>
        )}
      </button>
    </form>
  );
}
