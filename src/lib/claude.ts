import { KidPreferences, LiveEvent, WeekendPlan } from "../types";

export async function generateWeekendPlan(prefs: KidPreferences, liveEvents?: LiveEvent[]): Promise<WeekendPlan> {
  const res = await fetch('/api/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prefs, liveEvents: liveEvents ?? [] }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(err.error ?? 'Could not generate a valid plan. Please try again.');
  }
  return res.json() as Promise<WeekendPlan>;
}
