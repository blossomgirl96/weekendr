import React from 'react';
import { Calendar, ArrowLeft, Download, CloudRain, ShieldCheck, Sun, Loader2 } from 'lucide-react';
import { WeekendPlan, DayPlan } from '../types';
import { ActivityCard } from './ActivityCard';
import { motion, AnimatePresence } from 'motion/react';
import jsPDF from 'jspdf';

interface Props {
  plan: WeekendPlan;
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

function DaySection({ day, plan, accent, isSunday }: { day: string; plan: DayPlan; accent: 'terracotta' | 'pine'; isSunday?: boolean }) {
  const iconBg = accent === 'terracotta' ? 'bg-terracotta-50' : 'bg-pine-50';
  const iconColor = accent === 'terracotta' ? 'text-terracotta-500' : 'text-pine-500';
  const subtitle = isSunday ? 'Keep the momentum.' : "Let's make it count.";

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
        {(plan.primary ?? []).map((activity, idx) => (
          <ActivityCard key={`${day}-primary-${activity.title ?? idx}`} activity={activity} index={idx} />
        ))}
      </div>

      {/* Plan B */}
      <div className="mt-12 p-8 bg-pine-50 rounded-[18px] border border-pine-100">
        <div className="flex items-center gap-2 mb-6">
          <ShieldCheck className="w-5 h-5 text-pine-500" />
          <p className="text-[11px] font-bold text-pine-500 uppercase tracking-[0.1em] font-sans">Plan B — Indoor backup</p>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {(plan.planB ?? []).map((activity, idx) => (
            <ActivityCard key={`${day}-planB-${activity.title ?? idx}`} activity={activity} index={idx} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function WeekendPlanView({ plan, onBack }: Props) {
  const [isExporting, setIsExporting] = React.useState(false);
  const [activeDay, setActiveDay] = React.useState<'saturday' | 'sunday'>('saturday');

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const margin = 20;
      let y = 25;
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFillColor(216, 95, 42);
      doc.rect(0, 0, pageWidth, 40, 'F');
      doc.setTextColor(251, 247, 241);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('SUNDAE ITINERARY', margin, 25);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, 32);

      const addActivity = (activity: any, x: number) => {
        if (y > 250) { doc.addPage(); y = 30; }
        doc.setTextColor(26, 20, 14);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(activity.title, x, y);
        y += 7;
        doc.setTextColor(92, 84, 71);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const desc = doc.splitTextToSize(activity.description, (pageWidth / 2) - 30);
        doc.text(desc, x, y);
        y += (desc.length * 5) + 5;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(`Drive: ${activity.driveTime}`, x, y); y += 5;
        doc.text(`Entry: ${activity.cost.entry}`, x, y); y += 5;
        doc.text(`Parking: ${activity.cost.parking}`, x, y); y += 5;
        if (activity.tip) {
          doc.setFont('helvetica', 'italic');
          const tipLines = doc.splitTextToSize(`Tip: ${activity.tip}`, (pageWidth / 2) - 30);
          doc.text(tipLines, x, y);
          doc.setFont('helvetica', 'normal');
          y += (tipLines.length * 5) + 5;
        } else {
          y += 5;
        }
      };

      y = 55;
      doc.setTextColor(216, 95, 42);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('SATURDAY', margin, y);
      y += 15;
      plan.saturday.primary.forEach(a => addActivity(a, margin));

      if (y > 200) { doc.addPage(); y = 30; } else { y += 10; }
      doc.setTextColor(44, 94, 42);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('SUNDAY', margin, y);
      y += 15;
      plan.sunday.primary.forEach(a => addActivity(a, margin));

      doc.save(`Sundae-Plan-${Date.now()}.pdf`);
    } catch {
      window.print();
    } finally {
      setIsExporting(false);
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

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-600 rounded-xl font-bold text-sm border border-sky-100 font-sans">
            <CloudRain className="w-4 h-4" />
            {getUpcomingWeekend()} · {plan.weatherForecast}
          </div>
          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 bg-ink-900 text-cream-50 rounded-xl font-bold text-sm hover:bg-ink-600 transition-all shadow-sm hover:scale-105 active:scale-95 disabled:opacity-50 font-sans"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isExporting ? 'Creating PDF…' : 'Save plan'}
          </button>
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
    </div>
  );
}
