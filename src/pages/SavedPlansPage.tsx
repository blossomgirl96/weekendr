import React from 'react';
import { Link } from 'react-router-dom';
import { BookmarkCheck, ArrowLeft, Trash2, CheckCircle, ChevronDown, MoreVertical, Download, RotateCcw } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { AppHeader } from '../components/AppHeader';
import { useSavedPlans } from '../hooks/useSavedPlans';
import { SavedPlan } from '../types';
import { cn } from '../lib/utils';

function PlanCard({ saved, onDelete, onMarkVisited, onMoveToSaved, onRate }: {
  saved: SavedPlan;
  onDelete: (id: string) => void;
  onMarkVisited: (id: string) => void;
  onMoveToSaved: (id: string) => void;
  onRate: (id: string, rating: number) => Promise<void>;
}) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);
  const [isWorking, setIsWorking] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!showMenu) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showMenu]);

  const formattedDate = new Date(saved.weekendDate + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });

  const satTitles = (saved.plan?.saturday?.primary ?? []).map(a => a.title).join(' · ');
  const sunTitles = (saved.plan?.sunday?.primary ?? []).map(a => a.title).join(' · ');

  const handleDownload = () => {
    const pdf = new jsPDF({ unit: 'pt', format: 'letter' });
    const pageW = pdf.internal.pageSize.getWidth();
    const margin = 48;
    const contentW = pageW - margin * 2;
    let y = margin;

    const LINE_H = 16;
    const SECTION_GAP = 24;
    const ACTIVITY_GAP = 18;

    const addLine = (text: string, size: number, style: 'normal' | 'bold', color: [number, number, number] = [38, 31, 24]) => {
      if (y > pdf.internal.pageSize.getHeight() - margin) {
        pdf.addPage();
        y = margin;
      }
      pdf.setFontSize(size);
      pdf.setFont('helvetica', style);
      pdf.setTextColor(...color);
      const lines = pdf.splitTextToSize(text, contentW);
      pdf.text(lines, margin, y);
      y += LINE_H * lines.length;
    };

    // Header
    addLine(`WEEKENDR`, 22, 'bold', [196, 96, 60]);
    y += 4;
    addLine(saved.targetLocality, 16, 'bold');
    addLine(`${formattedDate}  ·  ${saved.plan.weatherForecast}`, 10, 'normal', [120, 110, 100]);
    y += SECTION_GAP;

    (['saturday', 'sunday'] as const).forEach((day) => {
      addLine(day === 'saturday' ? 'SATURDAY' : 'SUNDAY', 10, 'bold', [120, 110, 100]);
      y += 6;
      (saved.plan?.[day]?.primary ?? []).forEach((a) => {
        addLine(a.title, 12, 'bold');
        y += 2;
        addLine(a.description, 9, 'normal', [100, 92, 84]);
        y += 2;
        addLine(`Drive: ${a.driveTime}  ·  Entry: ${a.cost.entry}  ·  Parking: ${a.cost.parking}`, 9, 'normal', [140, 130, 120]);
        if (a.tip) { y += 2; addLine(`Tip: ${a.tip}`, 9, 'normal', [140, 130, 120]); }
        y += ACTIVITY_GAP;
      });
      y += SECTION_GAP - ACTIVITY_GAP;
    });

    const slug = saved.targetLocality.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    pdf.save(`weekendr-${slug}-${saved.weekendDate}.pdf`);
    setShowMenu(false);
  };

  return (
    <div className="bg-white rounded-[18px] border border-cream-200 shadow-[0_4px_10px_-2px_rgba(38,31,24,0.08)]">
      {/* Header */}
      <div className="px-6 pt-6 pb-5 flex items-start gap-4 hover:bg-cream-50 transition-colors">
        {/* Left — click to expand */}
        <div className="flex-1 min-w-0 cursor-pointer space-y-2" onClick={() => setIsExpanded(v => !v)}>
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-lg font-bold text-ink-900 font-sans">{saved.targetLocality}</h3>
            <span className={cn(
              'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-sans',
              saved.status === 'saved'
                ? 'bg-terracotta-50 text-terracotta-500 border border-terracotta-100'
                : 'bg-pine-50 text-pine-600 border border-pine-100'
            )}>
              {saved.status === 'visited' ? 'Visited' : 'Saved'}
            </span>
            {saved.rating && (
              <span className="text-xs text-amber-400 tracking-tight">
                {'★'.repeat(saved.rating)}{'☆'.repeat(5 - saved.rating)}
              </span>
            )}
          </div>
          <p className="text-sm text-ink-400 font-sans">{formattedDate}{saved.plan?.weatherForecast ? ` · ${saved.plan.weatherForecast}` : ''}</p>
          {!isExpanded && (
            <div className="space-y-0.5 pt-1">
              <p className="text-xs text-ink-500 font-sans truncate"><span className="font-bold text-ink-600">Sat</span> {satTitles}</p>
              <p className="text-xs text-ink-500 font-sans truncate"><span className="font-bold text-ink-600">Sun</span> {sunTitles}</p>
            </div>
          )}
        </div>

        {/* Right — menu + chevron */}
        <div className="flex items-center gap-1 shrink-0 mt-0.5">
          {/* Sandwich menu */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setShowMenu(v => !v)}
              className="p-1.5 rounded-lg hover:bg-cream-200 text-ink-400 hover:text-ink-700 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-9 w-48 bg-white rounded-xl border border-cream-200 shadow-[0_12px_24px_-8px_rgba(38,31,24,0.16)] overflow-hidden z-20">
                <button
                  onClick={() => { setIsExpanded(true); setShowMenu(false); }}
                  className="w-full px-4 py-3 text-left text-sm font-sans text-ink-700 hover:bg-cream-50 flex items-center gap-2.5 transition-colors"
                >
                  <span className="text-base leading-none">★</span>
                  Rate this plan
                </button>
                {saved.status === 'saved' ? (
                  <button
                    disabled={isWorking}
                    onClick={async () => {
                      setShowMenu(false);
                      setIsWorking(true);
                      await onMarkVisited(saved.id);
                      setIsWorking(false);
                    }}
                    className="w-full px-4 py-3 text-left text-sm font-sans text-ink-700 hover:bg-cream-50 flex items-center gap-2.5 transition-colors border-t border-cream-100 disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4 text-pine-500" />
                    Move to Visited
                  </button>
                ) : (
                  <button
                    disabled={isWorking}
                    onClick={async () => {
                      setShowMenu(false);
                      setIsWorking(true);
                      await onMoveToSaved(saved.id);
                      setIsWorking(false);
                    }}
                    className="w-full px-4 py-3 text-left text-sm font-sans text-ink-700 hover:bg-cream-50 flex items-center gap-2.5 transition-colors border-t border-cream-100 disabled:opacity-50"
                  >
                    <RotateCcw className="w-4 h-4 text-terracotta-500" />
                    Move to Saved
                  </button>
                )}
                <button
                  onClick={handleDownload}
                  className="w-full px-4 py-3 text-left text-sm font-sans text-ink-700 hover:bg-cream-50 flex items-center gap-2.5 transition-colors border-t border-cream-100"
                >
                  <Download className="w-4 h-4 text-ink-400" />
                  Download plan
                </button>
                <button
                  disabled={isWorking}
                  onClick={async () => {
                    setShowMenu(false);
                    if (!window.confirm('Remove this saved plan?')) return;
                    setIsWorking(true);
                    await onDelete(saved.id);
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-sans text-red-500 hover:bg-red-50 flex items-center gap-2.5 transition-colors border-t border-cream-100 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Expand chevron */}
          <button onClick={() => setIsExpanded(v => !v)} className="p-1 text-ink-400 hover:text-ink-700 transition-colors">
            <ChevronDown className={cn('w-5 h-5 transition-transform duration-200', isExpanded && 'rotate-180')} />
          </button>
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="border-t border-cream-100">
          {/* Star rating */}
          <div className="px-6 pt-5 pb-4">
            <p className="text-[10px] font-bold text-ink-500 uppercase tracking-[0.1em] font-sans mb-2">Rate this plan</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => onRate(saved.id, star)}
                  className="text-2xl leading-none text-amber-400 transition-transform hover:scale-125 active:scale-110"
                >
                  {star <= (saved.rating ?? 0) ? '★' : '☆'}
                </button>
              ))}
            </div>
          </div>

          {/* Activity list */}
          <div className="px-6 pb-6 space-y-6 border-t border-cream-100 pt-5">
            {(['saturday', 'sunday'] as const).map((day) => (
              <div key={day}>
                <p className="text-[10px] font-bold text-ink-500 uppercase tracking-[0.1em] font-sans mb-3">
                  {day === 'saturday' ? 'Saturday' : 'Sunday'}
                </p>
                <div className="space-y-4">
                  {(saved.plan?.[day]?.primary ?? []).map((activity, i) => (
                    <div key={i} className="space-y-1 pl-3 border-l-2 border-cream-200">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="font-bold text-sm text-ink-900 font-sans">{activity.title}</p>
                        <p className="text-xs text-ink-400 font-sans shrink-0">{activity.driveTime}</p>
                      </div>
                      <p className="text-xs text-ink-500 font-sans line-clamp-2">{activity.description}</p>
                      <p className="text-xs text-ink-400 font-sans">
                        Entry: {activity.cost.entry} · Parking: {activity.cost.parking}
                      </p>
                      {activity.tip && (
                        <p className="text-xs text-ink-400 italic font-sans">Tip: {activity.tip}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function SavedPlansPage() {
  const { savedPlans, deletePlan, markVisited, moveToSaved, ratePlan, isLoaded } = useSavedPlans();
  const [activeTab, setActiveTab] = React.useState<'saved' | 'visited'>('saved');

  const savedList = savedPlans.filter(s => s.status === 'saved');
  const visitedList = savedPlans.filter(s => s.status === 'visited');
  const activeList = activeTab === 'saved' ? savedList : visitedList;

  return (
    <div className="min-h-screen bg-cream-50">
      <AppHeader />
      <main className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <div className="flex items-center gap-4">
          <Link
            to="/app"
            className="flex items-center gap-2 text-ink-600 hover:text-terracotta-500 transition-colors font-medium group font-sans text-sm"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to planner
          </Link>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-6 h-6 text-terracotta-500" />
            <h1 className="display-headline text-3xl text-ink-900">My Plans</h1>
          </div>
          <p className="text-ink-500 font-sans text-sm">Your saved weekend plans.</p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 bg-cream-100 p-1.5 rounded-2xl w-fit border border-cream-200">
          {(['saved', 'visited'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-6 py-2.5 rounded-xl font-bold text-sm font-sans transition-all capitalize',
                activeTab === tab
                  ? 'bg-terracotta-500 text-cream-50 shadow-sm'
                  : 'text-ink-600 hover:text-ink-900'
              )}
            >
              {tab === 'saved' ? 'Saved' : 'Visited'}
              {tab === 'saved' && savedList.length > 0 && (
                <span className={cn(
                  'ml-2 px-1.5 py-0.5 rounded-full text-[10px]',
                  activeTab === 'saved' ? 'bg-white/20 text-cream-50' : 'bg-cream-200 text-ink-500'
                )}>
                  {savedList.length}
                </span>
              )}
              {tab === 'visited' && visitedList.length > 0 && (
                <span className={cn(
                  'ml-2 px-1.5 py-0.5 rounded-full text-[10px]',
                  activeTab === 'visited' ? 'bg-white/20 text-cream-50' : 'bg-cream-200 text-ink-500'
                )}>
                  {visitedList.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {!isLoaded ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-28 rounded-[18px] bg-cream-100 animate-pulse border border-cream-200" />
            ))}
          </div>
        ) : activeList.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <div className="w-16 h-16 bg-cream-100 rounded-2xl flex items-center justify-center mx-auto border border-cream-200">
              <BookmarkCheck className="w-8 h-8 text-cream-300" />
            </div>
            <p className="font-bold text-ink-900 font-sans">
              {activeTab === 'saved' ? 'No saved plans yet' : 'No visited plans yet'}
            </p>
            <p className="text-sm text-ink-400 font-sans">
              {activeTab === 'saved'
                ? 'Head to the planner and hit "Save This Weekend Plan" to save your first weekend.'
                : 'Plans you\'ve marked as visited will appear here.'}
            </p>
            {activeTab === 'saved' && (
              <Link
                to="/app"
                className="inline-block mt-2 px-5 py-2.5 bg-terracotta-500 text-cream-50 rounded-xl font-bold text-sm font-sans hover:bg-terracotta-600 transition-all"
              >
                Plan a weekend
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {activeList.map(saved => (
              <PlanCard
                key={saved.id}
                saved={saved}
                onDelete={deletePlan}
                onMarkVisited={markVisited}
                onMoveToSaved={moveToSaved}
                onRate={ratePlan}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
