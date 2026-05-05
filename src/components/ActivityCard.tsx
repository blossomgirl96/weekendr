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

  // Fallback to a direct Google Maps search URL if the provided link is shortened or missing
  const isShortened = activity.mapsUrl?.includes('goo.gl') || activity.mapsUrl?.includes('app.goo.gl');
  const mapsUrl = (!activity.mapsUrl || isShortened)
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${activity.title} ${activity.location}`)}`
    : activity.mapsUrl;

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all group flex flex-col">
      <div className="relative h-48 overflow-hidden shrink-0">
        <img 
          src={imageUrl} 
          alt={activity.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-orange-600 shadow-sm flex items-center gap-1">
          {activity.isIndoor ? '🏠 Indoor' : '🌳 Outdoor'}
        </div>
      </div>
      
      <div className="p-6 space-y-4 flex flex-col">
        <div className="flex justify-between items-start gap-4 shrink-0">
          <h3 className="text-xl font-bold text-gray-800 leading-tight flex items-center">{activity.title}</h3>
          <a 
            href={mapsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 bg-orange-50 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition-colors shrink-0"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed">{activity.description}</p>

        <div className="grid grid-cols-2 gap-4 py-2 border-y border-gray-50 shrink-0">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4 text-blue-400" />
            {activity.time}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Car className="w-4 h-4 text-purple-400" />
            {activity.driveTime} drive
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 col-span-2">
            <MapPin className="w-4 h-4 text-red-400 shrink-0" />
            <span className="truncate">{activity.location}</span>
          </div>
        </div>

        <div className="space-y-2 shrink-0">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <DollarSign className="w-4 h-4 text-green-500" />
            Cost Breakdown
          </div>
          <div className="grid grid-cols-3 gap-2 text-[10px] uppercase font-bold tracking-wider text-gray-400">
            {[
              { id: 'entry', label: 'Entry', content: activity.cost.entry },
              { id: 'parking', label: 'Parking', content: activity.cost.parking },
              { id: 'food', label: 'Food', content: activity.cost.food },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveModal({ title: item.label, content: item.content })}
                className="bg-gray-50 p-2 rounded-lg text-center hover:bg-gray-100 transition-colors cursor-pointer group/cost block w-full overflow-hidden"
              >
                <span className="block mb-0.5 group-hover/cost:text-orange-500 transition-colors truncate">{item.label}:</span>
                <span className="text-gray-700 block truncate">{item.content}</span>
              </button>
            ))}
          </div>
          <div className="text-right text-sm font-black text-green-600">
            Total Est: ${activity.cost.total}
          </div>
        </div>

        <AnimatePresence>
          {activeModal && (
            <div 
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
              onClick={() => setActiveModal(null)}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl relative border border-gray-100"
              >
                <button 
                  onClick={() => setActiveModal(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{activeModal.title} Details</h3>
                </div>
                <p className="text-gray-600 leading-relaxed text-lg italic">
                  "{activeModal.content}"
                </p>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="bg-blue-50 p-4 rounded-2xl flex gap-3 shrink-0">
          <Baby className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Age Suitability</p>
            <p className="text-sm text-blue-800 leading-snug">{activity.ageSuitability}</p>
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-2xl flex gap-3 shrink-0">
          <Info className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">Why kids love it</p>
            <p className="text-sm text-orange-800 italic leading-snug">"{activity.whyItsGreat}"</p>
          </div>
        </div>
      </div>
    </div>
  );
}
