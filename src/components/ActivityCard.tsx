import React from 'react';
import { MapPin, Clock, DollarSign, Info, ExternalLink, Car, Baby, X } from 'lucide-react';
import { Activity } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  activity: Activity;
  index: number;
}

export function ActivityCard({ activity, index }: Props) {
  const [activeModal, setActiveModal] = React.useState<{ title: string; content: string } | null>(null);
  const imageUrl = `https://picsum.photos/seed/${activity.title.replace(/\s/g, '')}/800/400`;

  const isShortened = activity.mapsUrl?.includes('goo.gl') || activity.mapsUrl?.includes('app.goo.gl');
  const mapsUrl = (!activity.mapsUrl || isShortened)
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${activity.title} ${activity.location}`)}`
    : activity.mapsUrl;

  return (
    <div className="bg-white rounded-[18px] overflow-hidden shadow-[0_4px_10px_-2px_rgba(38,31,24,0.08)] border border-cream-200 hover:shadow-[0_12px_24px_-8px_rgba(38,31,24,0.14)] transition-all group flex flex-col">
      <div className="relative h-48 overflow-hidden shrink-0">
        <img
          src={imageUrl}
          alt={activity.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-terracotta-600 shadow-sm">
          {activity.isIndoor ? '🏠 Indoor' : '🌳 Outdoor'}
        </div>
      </div>

      <div className="p-6 space-y-4 flex flex-col">
        <div className="flex justify-between items-start gap-4 shrink-0">
          <h3 className="text-lg font-bold text-ink-700 leading-snug">{activity.title}</h3>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-terracotta-50 text-terracotta-500 rounded-full hover:bg-terracotta-500 hover:text-white transition-colors shrink-0"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <p className="text-ink-400 text-sm leading-relaxed">{activity.description}</p>

        <div className="grid grid-cols-2 gap-3 py-3 border-y border-cream-100 shrink-0">
          <div className="flex items-center gap-2 text-sm text-ink-400">
            <Clock className="w-4 h-4 text-sky-400" />
            {activity.time}
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-400">
            <Car className="w-4 h-4 text-pine-400" />
            {activity.driveTime} drive
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-400 col-span-2">
            <MapPin className="w-4 h-4 text-terracotta-400 shrink-0" />
            <span className="truncate">{activity.location}</span>
          </div>
        </div>

        <div className="space-y-2 shrink-0">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink-600">
            <DollarSign className="w-4 h-4 text-pine-500" />
            Cost breakdown
          </div>
          <div className="grid grid-cols-3 gap-2 text-[10px] uppercase font-bold tracking-wider text-ink-400">
            {[
              { id: 'entry', label: 'Entry', content: activity.cost.entry },
              { id: 'parking', label: 'Parking', content: activity.cost.parking },
              { id: 'food', label: 'Food', content: activity.cost.food },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveModal({ title: item.label, content: item.content })}
                className="bg-cream-50 p-2 rounded-lg text-center hover:bg-cream-100 transition-colors cursor-pointer group/cost block w-full overflow-hidden border border-cream-100"
              >
                <span className="block mb-0.5 group-hover/cost:text-terracotta-500 transition-colors truncate">{item.label}:</span>
                <span className="text-ink-600 block truncate">{item.content}</span>
              </button>
            ))}
          </div>
          <div className="text-right text-sm font-black text-pine-500">
            Total est: ${activity.cost.total}
          </div>
        </div>

        <AnimatePresence>
          {activeModal && (
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-sm"
              onClick={() => setActiveModal(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-[24px] p-8 max-w-sm w-full shadow-[0_24px_48px_-16px_rgba(38,31,24,0.22)] relative border border-cream-200"
              >
                <button
                  onClick={() => setActiveModal(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-cream-100 rounded-full text-ink-400 hover:text-ink-600 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-pine-50 rounded-xl flex items-center justify-center text-pine-500">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-ink-700">{activeModal.title}</h3>
                </div>
                <p className="text-ink-400 leading-relaxed text-lg italic">
                  "{activeModal.content}"
                </p>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="bg-sky-50 p-4 rounded-[14px] flex gap-3 shrink-0 border border-sky-100">
          <Baby className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-sky-500 uppercase tracking-wider">Age suitability</p>
            <p className="text-sm text-ink-600 leading-snug">{activity.ageSuitability}</p>
          </div>
        </div>

        <div className="bg-terracotta-50 p-4 rounded-[14px] flex gap-3 shrink-0 border border-terracotta-100">
          <Info className="w-5 h-5 text-terracotta-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-terracotta-600 uppercase tracking-wider">Why kids love it</p>
            <p className="text-sm text-terracotta-700 italic leading-snug">"{activity.whyItsGreat}"</p>
          </div>
        </div>
      </div>
    </div>
  );
}
