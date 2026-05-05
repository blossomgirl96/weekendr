import React from 'react';
import { Calendar, Lightbulb, ArrowLeft, Download, CloudRain, ShieldCheck, Diamond, Loader2 } from 'lucide-react';
import { WeekendPlan, DayPlan } from '../types';
import { ActivityCard } from './ActivityCard';
import { motion } from 'motion/react';
import jsPDF from 'jspdf';

interface Props {
  plan: WeekendPlan;
  onBack: () => void;
}

function DaySection({ day, plan, color, isSunday }: { day: string, plan: DayPlan, color: 'orange' | 'blue', isSunday?: boolean }) {
  const colorClass = color === 'orange' ? 'bg-orange-500 shadow-orange-200' : 'bg-blue-500 shadow-blue-200';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className={`w-12 h-12 ${colorClass} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-gray-800">{day}</h2>
          <p className="text-gray-500">{isSunday ? 'Making memories.' : 'Adventure awaits!'}</p>
        </div>
      </div>
      
      <div className="space-y-8">
        {plan.primary.map((activity, idx) => (
          <ActivityCard key={idx} activity={activity} index={idx} />
        ))}
      </div>

      {/* Plan B Section */}
      <div className="mt-12 p-8 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <ShieldCheck className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-bold text-gray-500 uppercase tracking-wider">Plan B: Indoor Fallbacks</h3>
        </div>
        <div className="grid grid-cols-1 gap-6">
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
      
      // Header
      doc.setFillColor(249, 115, 22); // Orange-500
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('WEEKNDR ITINERARY', margin, 25);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, 32);

      const addActivity = (activity: any, x: number) => {
        if (y > 250) {
          doc.addPage();
          y = 30;
        }

        doc.setTextColor(31, 41, 55);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(activity.title, x, y);
        y += 7;

        doc.setTextColor(107, 114, 128);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const desc = doc.splitTextToSize(activity.description, (pageWidth / 2) - 30);
        doc.text(desc, x, y);
        y += (desc.length * 5) + 5;

        // Details
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(`Drive Time: ${activity.driveTime}`, x, y);
        y += 5;
        doc.text(`Entry: ${activity.cost.entry}`, x, y);
        y += 5;
        doc.text(`Food: ${activity.cost.food}`, x, y);
        y += 10;
      };

      // Saturday
      y = 55;
      doc.setTextColor(234, 88, 12);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('SATURDAY', margin, y);
      y += 15;

      plan.saturday.primary.forEach(activity => addActivity(activity, margin));
      
      // Sunday
      if (y > 200) {
        doc.addPage();
        y = 30;
      } else {
        y += 10;
      }
      
      doc.setTextColor(37, 99, 235);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('SUNDAY', margin, y);
      y += 15;

      plan.sunday.primary.forEach(activity => addActivity(activity, margin));

      // Tips
      if (y > 220) {
        doc.addPage();
        y = 30;
      } else {
        y += 15;
      }
      
      doc.setFillColor(243, 244, 246);
      doc.rect(margin - 5, y - 10, pageWidth - (margin * 2) + 10, 60, 'F');
      
      doc.setTextColor(31, 41, 55);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Parenting Pro-Tips', margin, y);
      y += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      plan.tips.forEach((tip, idx) => {
        const tipLines = doc.splitTextToSize(`${idx + 1}. ${tip}`, pageWidth - (margin * 2));
        doc.text(tipLines, margin, y);
        y += (tipLines.length * 5);
      });

      doc.save(`Weekndr-Plan-${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error('Manual PDF generation failed:', error);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Print-only Header (still useful for the fallback) */}
      <div className="print-header">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white">
            <Diamond className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-gray-900">Weekndr Plan</h1>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors font-medium group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Planner
        </button>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm border border-blue-100">
            <CloudRain className="w-4 h-4" />
            {plan.weatherForecast}
          </div>
          <button 
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            {isExporting ? 'Creating PDF...' : 'Save Plan'}
          </button>
        </div>
      </div>

      <div className="space-y-12 pdf-export-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <DaySection day="Saturday" plan={plan.saturday} color="orange" />
          <DaySection day="Sunday" plan={plan.sunday} color="blue" isSunday />
        </div>

        {/* Pro Tips */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <Lightbulb className="w-8 h-8 text-yellow-300" />
              <h2 className="text-3xl font-black">Parenting Pro-Tips</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plan.tips.map((tip, idx) => (
                <div key={idx} className="flex gap-4 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center shrink-0 font-bold">
                    {idx + 1}
                  </div>
                  <p className="text-lg leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
