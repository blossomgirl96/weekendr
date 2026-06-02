import React from 'react';
import { Calendar, ArrowLeft, CloudRain, Sun, Loader2, Bookmark, BookmarkCheck, ShieldCheck } from 'lucide-react';
import { WeekendPlan, DayPlan, Activity } from '../types';
import { ActivityCard } from './ActivityCard';
import { motion, AnimatePresence } from 'motion/react';
import { useSavedPlans } from '../hooks/useSavedPlans';

interface Props {
  plan: WeekendPlan;
  targetLocality: string;
  onBack: () => void;
}

function getUpcomingWeekend(): string {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilSat = dayOfWeek === 6 ? 0 : (6 - dayOfWeek);
  const sat = new Date(today);
  sat.setDate(today.getDate() + daysUntilSat);
  const sun = new Date(sat);
  sun.setDate(sat.getDate() + 1);
  const satStr = sat.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${satStr}–${sun.getDate()}`;
}

interface DaySectionProps {
  day: string;
  plan: DayPlan;
  accent: 'terracotta' | 'pine';
  isSunday?: boolean;
}

function DaySection({ day, plan, accent, isSunday }: DaySectionProps) {
  const iconBg = accent === 'terracotta' ? 'bg-terracotta-50' : 'bg-pine-50';
  const iconColor = accent === 'terracotta' ? 'text-terracotta-500' : 'text-pine-500';
  const subtitle = isSunday ? 'Keep the momentum.' : "Let's make it count.";
  const primaryActivities = plan?.primary ?? [];
  const planBActivities = plan?.planB ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className={`w-12 h-12 ${iconBg} ${iconColor} rounded-2xl flex items-center justify-center`}>
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <h2 className="display-headline text-3xl text-ink-900">{day}</h2>
          <p className="text-ink-600 text-sm font-sans">{subtitle}</p>
        </div>
      </div>

      <div className="space-y-8">
        {primaryActivities.map((activity: Activity, idx: number) => (
          <ActivityCard
            key={`${day}-primary-${activity.title ?? idx}`}
            activity={activity}
            index={idx}
          />
        ))}
      </div>

      {/* Plan B */}
      <div className="mt-12 p-8 bg-pine-50 rounded-[18px] border border-pine-100">
        <div className="flex items-center gap-2 mb-6">
          <ShieldCheck className="w-5 h-5 text-pine-500" />
          <p className="text-[11px] font-bold text-pine-500 uppercase tracking-[0.1em] font-sans">Plan B — Indoor backup</p>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {planBActivities.map((activity: Activity, idx: number) => (
            <ActivityCard
              key={`${day}-planB-${activity.title ?? idx}`}
              activity={activity}
              index={idx}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function WeekendPlanView({ plan, targetLocality, onBack }: Props) {
  const [activeDay, setActiveDay] = React.useState<'saturday' | 'sunday'>('saturday');
  const [isSaving, setIsSaving] = React.useState(false);
  const [hasSaved, setHasSaved] = React.useState(false);
  const { savePlan } = useSavedPlans();

  const handleSavePlan = async () => {
    setIsSaving(true);
    try {
      await savePlan(plan, targetLocality);
      setHasSaved(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="print-header">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sun className="w-6 h-6 text-sun-400" />
          <h1 className="sniglet text-3xl text-ink-900">Sundae Plan</h1>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-ink-600 hover:text-terracotta-500 transition-colors font-medium group font-sans text-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to planner
        </button>

        <div className="flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-600 rounded-xl font-bold text-sm border border-sky-100 font-sans">
          <CloudRain className="w-4 h-4" />
          {getUpcomingWeekend()} · {plan.weatherForecast}
        </div>
      </div>

      <div className="space-y-8 pdf-export-container">
        {/* Tabs */}
        <div className="flex gap-2 bg-cream-100 p-1.5 rounded-2xl w-fit mx-auto border border-cream-200">
          {(['saturday', 'sunday'] as const).map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-8 py-2.5 rounded-xl font-bold text-sm font-sans transition-all capitalize ${
                activeDay === day
                  ? day === 'saturday'
                    ? 'bg-terracotta-500 text-cream-50 shadow-sm'
                    : 'bg-pine-500 text-cream-50 shadow-sm'
                  : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Day content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDay}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeDay === 'saturday'
              ? <DaySection day="Saturday" plan={plan.saturday} accent="terracotta" />
              : <DaySection day="Sunday" plan={plan.sunday} accent="pine" isSunday />
            }
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Plan-level save CTA */}
      <div className="flex justify-center pt-4 no-print">
        <button
          onClick={handleSavePlan}
          disabled={isSaving || hasSaved}
          className="px-8 py-3.5 bg-terracotta-500 text-cream-50 rounded-full font-bold text-sm border-2 border-ink-900 shadow-[0_6px_0_#1A140E] hover:bg-terracotta-600 hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_3px_0_#1A140E] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none font-sans flex items-center gap-2"
        >
          {isSaving
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
            : hasSaved
            ? <><BookmarkCheck className="w-4 h-4" /> Plan Saved</>
            : <><Bookmark className="w-4 h-4" /> Save This Weekend Plan</>}
        </button>
      </div>
    </div>
  );
}
