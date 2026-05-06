import React from 'react';
import { Calendar, Lightbulb, ArrowLeft, Download, CloudRain, ShieldCheck, Sun, Loader2 } from 'lucide-react';
import { WeekendPlan, DayPlan } from '../types';
import { ActivityCard } from './ActivityCard';
import { motion } from 'motion/react';
import jsPDF from 'jspdf';

interface Props {
  plan: WeekendPlan;
  onBack: () => void;
}

function DaySection({ day, plan, color, isSunday }: { day: string, plan: DayPlan, color: 'terracotta' | 'pine', isSunday?: boolean }) {
  const bgClass = color === 'terracotta'
    ? 'bg-terracotta-500 shadow-terracotta-100'
    : 'bg-pine-500 shadow-pine-100';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className={`w-12 h-12 ${bgClass} rounded-2xl flex items-center justify-center text-cream-50 shadow-[0_4px_10px_-2px_rgba(38,31,24,0.18)]`}>
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-ink-700">{day}</h2>
          <p className="text-ink-400 text-sm">{isSunday ? 'Make Sunday count.' : 'Let\'s make it a good one.'}</p>
        </div>
      </div>

      <div className="space-y-8">
        {plan.primary.map((activity, idx) => (
          <ActivityCard key={idx} activity={activity} index={idx} />
        ))}
      </div>

      <div className="mt-10 p-6 rounded-[20px] bg-cream-100 border border-dashed border-cream-300">
        <div className="flex items-center gap-2 mb-5">
          <ShieldCheck className="w-5 h-5 text-ink-400" />
          <p className="text-xs font-bold text-ink-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-sans)' }}>Plan B — indoor fallbacks</p>
        </div>
        <div className="grid grid-cols-1 gap-5">
          {plan.planB.map((activity, idx) => (
            <ActivityCard key={`planB-${idx}`} activity={activity} index={idx} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function WeekendPlanView({ plan, onBack }: Props) {
  const [isExporting, setIsExporting] = React.useState(false);

  const handleDownloadPDF = async () => {
    setIsExporting(true);

    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const margin = 20;
      let y = 25;
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFillColor(216, 95, 42); // Terracotta-500
      doc.rect(0, 0, pageWidth, 40, 'F');

      doc.setTextColor(251, 247, 241);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('WEEKENDR ITINERARY', margin, 25);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, 32);

      const addActivity = (activity: any, x: number) => {
        if (y > 250) {
          doc.addPage();
          y = 30;
        }

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
        doc.text(`Drive time: ${activity.driveTime}`, x, y);
        y += 5;
        doc.text(`Entry: ${activity.cost.entry}`, x, y);
        y += 5;
        doc.text(`Food: ${activity.cost.food}`, x, y);
        y += 10;
      };

      y = 55;
      doc.setTextColor(216, 95, 42);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('SATURDAY', margin, y);
      y += 15;

      plan.saturday.primary.forEach(activity => addActivity(activity, margin));

      if (y > 200) {
        doc.addPage();
        y = 30;
      } else {
        y += 10;
      }

      doc.setTextColor(44, 94, 42);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('SUNDAY', margin, y);
      y += 15;

      plan.sunday.primary.forEach(activity => addActivity(activity, margin));

      if (y > 220) {
        doc.addPage();
        y = 30;
      } else {
        y += 15;
      }

      doc.setFillColor(246, 239, 227);
      doc.rect(margin - 5, y - 10, pageWidth - (margin * 2) + 10, 60, 'F');

      doc.setTextColor(26, 20, 14);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Parenting tips', margin, y);
      y += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      plan.tips.forEach((tip, idx) => {
        const tipLines = doc.splitTextToSize(`${idx + 1}. ${tip}`, pageWidth - (margin * 2));
        doc.text(tipLines, margin, y);
        y += (tipLines.length * 5);
      });

      doc.save(`Weekendr-Plan-${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error('PDF generation failed:', error);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="print-header">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-10 bg-terracotta-500 rounded-xl flex items-center justify-center text-cream-50">
            <Sun className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-black text-ink-700">Weekendr plan</h1>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-ink-400 hover:text-terracotta-500 transition-colors font-medium group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to planner
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-500 rounded-xl font-semibold text-sm border border-sky-100">
            <CloudRain className="w-4 h-4" />
            {plan.weatherForecast}
          </div>
          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-6 py-3 bg-ink-700 text-cream-50 rounded-xl font-bold hover:bg-ink-600 transition-all shadow-md disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            {isExporting ? 'Creating PDF…' : 'Save plan'}
          </button>
        </div>
      </div>

      <div className="space-y-12 pdf-export-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <DaySection day="Saturday" plan={plan.saturday} color="terracotta" />
          <DaySection day="Sunday" plan={plan.sunday} color="pine" isSunday />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-pine-500 rounded-[32px] p-8 md:p-12 text-cream-50 shadow-[0_24px_48px_-16px_rgba(38,31,24,0.22)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <Lightbulb className="w-7 h-7 text-sun-400" />
              <h2 className="text-2xl font-black text-cream-50">Parenting tips</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {plan.tips.map((tip, idx) => (
                <div key={idx} className="flex gap-4 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15">
                  <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center shrink-0 font-bold text-sm">
                    {idx + 1}
                  </div>
                  <p className="text-base leading-relaxed text-cream-100">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
