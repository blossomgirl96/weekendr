import React from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { WeekendPlan, SavedPlan } from '../types';
import { getUpcomingSaturdayISO } from '../lib/utils';

export function useSavedPlans() {
  const { user } = useAuth();
  const [savedPlans, setSavedPlans] = React.useState<SavedPlan[]>([]);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'users', user.uid, 'savedPlans'),
      orderBy('savedAt', 'desc')
    );
    return onSnapshot(q, (snap) => {
      setSavedPlans(snap.docs.map(d => ({ id: d.id, ...d.data() } as SavedPlan)));
      setIsLoaded(true);
    });
  }, [user]);

  const savePlan = async (plan: WeekendPlan, targetLocality: string) => {
    if (!user) return;
    await addDoc(collection(db, 'users', user.uid, 'savedPlans'), {
      plan,
      targetLocality,
      weekendDate: getUpcomingSaturdayISO(),
      savedAt: new Date().toISOString(),
      status: 'saved',
    });
  };

  const deletePlan = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'savedPlans', id));
  };

  const markVisited = async (id: string) => {
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid, 'savedPlans', id), { status: 'visited' });
  };

  const moveToSaved = async (id: string) => {
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid, 'savedPlans', id), { status: 'saved' });
  };

  const ratePlan = async (id: string, rating: number) => {
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid, 'savedPlans', id), { rating });
  };

  const savedWeekendDates = new Set(savedPlans.map(p => p.weekendDate));

  return { savedPlans, savePlan, deletePlan, markVisited, moveToSaved, ratePlan, savedWeekendDates, isLoaded };
}
