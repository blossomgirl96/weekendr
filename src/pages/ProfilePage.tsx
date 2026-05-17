import React from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { Plus, Trash2, Save, CheckCircle } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { AppHeader } from '../components/AppHeader';
import { usePlacesAutocomplete } from '../hooks/usePlacesAutocomplete';
import { Kid, UserProfile } from '../types';

export function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = React.useState('');
  const [homeAddress, setHomeAddress] = React.useState('');
  const [kids, setKids] = React.useState<Kid[]>([{ id: '1', age: 5 }]);
  const [typicalInterests, setTypicalInterests] = React.useState('');
  const [restrictions, setRestrictions] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const addressRef = React.useRef<HTMLInputElement>(null);
  usePlacesAutocomplete(addressRef, setHomeAddress);

  React.useEffect(() => {
    if (!user) return;
    setName(user.displayName || '');
    getDoc(doc(db, 'users', user.uid)).then((snap) => {
      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        if (data.name) setName(data.name);
        const addr = data.homeAddress || '';
        setHomeAddress(addr);
        if (addressRef.current) addressRef.current.value = addr;
        setKids(data.kids?.length ? data.kids : [{ id: '1', age: 5 }]);
        setTypicalInterests(data.typicalInterests || '');
        setRestrictions(data.restrictions || '');
      }
    });
  }, [user]);

  const addKid = () => setKids([...kids, { id: Math.random().toString(36).slice(2), age: 5 }]);
  const removeKid = (id: string) => { if (kids.length > 1) setKids(kids.filter(k => k.id !== id)); };
  const updateKidAge = (id: string, age: number) => setKids(kids.map(k => k.id === id ? { ...k, age } : k));

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'users', user.uid), { name, homeAddress, kids, typicalInterests, restrictions } satisfies UserProfile, { merge: true });
      if (auth.currentUser && name !== user.displayName) {
        await updateProfile(auth.currentUser, { displayName: name });
      }
      setSaved(true);
      setTimeout(() => navigate('/app'), 1000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <AppHeader />
      <main className="max-w-2xl mx-auto px-4 py-12 space-y-8">
        <div>
          <h1 className="display-headline text-3xl text-ink-900">Your profile</h1>
          <p className="text-ink-600 font-sans text-sm mt-1">Saved once, used every weekend. Update any time.</p>
        </div>

        <div className="bg-white rounded-[18px] border border-cream-200 shadow-[0_4px_10px_-2px_rgba(38,31,24,0.08)] p-8 space-y-8">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-ink-600 uppercase tracking-[0.08em] font-sans block">Your name</label>
            <input
              type="text"
              placeholder="First name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-100 text-ink-900 placeholder:text-ink-400 outline-none focus:ring-[3px] focus:ring-terracotta-500/50 focus:border-transparent transition-all font-sans"
            />
          </div>

          {/* Home address — uncontrolled so Google's Autocomplete widget can mutate it freely */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-ink-600 uppercase tracking-[0.08em] font-sans block">Starting address</label>
            <input
              ref={addressRef}
              type="text"
              placeholder="Your home address"
              defaultValue=""
              onChange={(e) => setHomeAddress(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-100 text-ink-900 placeholder:text-ink-400 outline-none focus:ring-[3px] focus:ring-terracotta-500/50 focus:border-transparent transition-all font-sans"
            />
            <p className="text-xs text-ink-400 font-sans">Used to estimate drive times from your home</p>
          </div>

          {/* Kids */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-ink-600 uppercase tracking-[0.08em] font-sans">Kids</label>
              <button
                type="button"
                onClick={addKid}
                className="flex items-center gap-1 text-sm font-bold text-terracotta-500 hover:text-terracotta-600 transition-colors font-sans"
              >
                <Plus className="w-4 h-4" />
                Add kid
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {kids.map((kid, index) => (
                <div key={kid.id} className="flex items-center gap-3 bg-cream-100 p-4 rounded-xl border border-cream-200">
                  <span className="text-xs font-bold text-ink-400 font-sans">#{index + 1}</span>
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-ink-600 uppercase tracking-[0.08em] block mb-1 font-sans">Age</label>
                    <input
                      type="number"
                      min="0"
                      max="18"
                      value={kid.age}
                      onChange={(e) => updateKidAge(kid.id, parseInt(e.target.value) || 0)}
                      className="w-full bg-transparent border-b border-cream-200 focus:border-terracotta-500 outline-none font-bold text-ink-900 font-sans"
                    />
                  </div>
                  {kids.length > 1 && (
                    <button type="button" onClick={() => removeKid(kid.id)} className="p-1 text-terracotta-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Typical interests */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-ink-600 uppercase tracking-[0.08em] font-sans block">Typical interests</label>
            <textarea
              rows={3}
              placeholder="e.g. outdoor adventures, science museums, sports, art and crafts, animals"
              value={typicalInterests}
              onChange={(e) => setTypicalInterests(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-100 text-ink-900 placeholder:text-ink-400 outline-none focus:ring-[3px] focus:ring-terracotta-500/50 focus:border-transparent transition-all font-sans resize-none"
            />
            <p className="text-xs text-ink-400 font-sans">Claude uses this to tailor suggestions to your family's tastes</p>
          </div>

          {/* Restrictions */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-ink-600 uppercase tracking-[0.08em] font-sans block">Restrictions & accessibility</label>
            <textarea
              rows={3}
              placeholder="e.g. we have a stroller, peanut allergy, avoid very crowded indoor spaces, no heights"
              value={restrictions}
              onChange={(e) => setRestrictions(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-100 text-ink-900 placeholder:text-ink-400 outline-none focus:ring-[3px] focus:ring-pine-500/50 focus:border-transparent transition-all font-sans resize-none"
            />
            <p className="text-xs text-ink-400 font-sans">Activities and tips will be filtered accordingly</p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 flex items-center justify-center gap-2 bg-ink-900 text-cream-50 rounded-xl font-bold text-sm hover:bg-ink-600 transition-all disabled:opacity-50 font-sans"
          >
            {saved ? (
              <><CheckCircle className="w-4 h-4 text-pine-200" /> Saved!</>
            ) : saving ? (
              'Saving…'
            ) : (
              <><Save className="w-4 h-4" /> Save profile</>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
