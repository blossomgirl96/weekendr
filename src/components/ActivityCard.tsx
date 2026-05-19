import React from 'react';
import { MapPin, Clock, DollarSign, ExternalLink, Car, Baby, X, Lightbulb } from 'lucide-react';
import { Activity } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  activity: Activity;
  index: number;
}

type ImgStage = 'places' | 'streetview' | 'staticmap' | 'failed';

export function ActivityCard({ activity, index }: Props) {
  const [activeModal, setActiveModal] = React.useState<{ title: string; content: string } | null>(null);
  const [imageUrl, setImageUrl] = React.useState<string>('');
  const [imgStage, setImgStage] = React.useState<ImgStage>('places');
  const mountedRef = React.useRef(true);

  React.useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  React.useEffect(() => {
    setActiveModal(null);
    setImgStage('places');
    if (activity.eventImageUrl) {
      setImageUrl(activity.eventImageUrl);
      return;
    }
    setImageUrl('');
    const title = activity.title ?? '';
    const location = activity.location ?? '';
    const query = `${title} ${location}`.trim();
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

    const fetchPhoto = async () => {
      try {
        const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'places.photos',
          },
          body: JSON.stringify({ textQuery: query, maxResultCount: 1 }),
        });
        if (!mountedRef.current) return;
        if (res.ok) {
          const data = await res.json();
          const photoName = data?.places?.[0]?.photos?.[0]?.name;
          if (photoName) {
            const mediaRes = await fetch(
              `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=800&maxHeightPx=400&key=${apiKey}&skipHttpRedirect=true`
            );
            if (!mountedRef.current) return;
            if (mediaRes.ok) {
              const mediaData = await mediaRes.json();
              const photoUri = mediaData?.photoUri as string | undefined;
              if (photoUri) {
                setImgStage('places');
                setImageUrl(photoUri);
                return;
              }
            }
          }
        }
      } catch { /* fall through to Street View */ }

      if (!mountedRef.current) return;
      setImgStage('streetview');
      setImageUrl(
        `https://maps.googleapis.com/maps/api/streetview?size=800x400&location=${encodeURIComponent(query)}&key=${apiKey}`
      );
    };

    fetchPhoto();
  }, [activity.title, activity.location, activity.eventImageUrl, index]);

  const handleImgError = () => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
    const title = activity.title ?? '';
    const location = activity.location ?? '';
    const query = `${title} ${location}`.trim();
    const unsplashQuery = encodeURIComponent(activity.imageQuery ?? query);

    if (imgStage === 'places') {
      setImgStage('streetview');
      setImageUrl(
        `https://maps.googleapis.com/maps/api/streetview?size=800x400&location=${encodeURIComponent(query)}&key=${apiKey}`
      );
    } else if (imgStage === 'streetview') {
      setImgStage('staticmap');
      setImageUrl(`https://source.unsplash.com/featured/800x400?${unsplashQuery}`);
    } else {
      setImgStage('failed');
      setImageUrl('');
    }
  };

  const isShortened = activity.mapsUrl?.includes('goo.gl') || activity.mapsUrl?.includes('app.goo.gl');
  const mapsUrl = (!activity.mapsUrl || isShortened)
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${activity.title ?? ''} ${activity.location ?? ''}`.trim())}`
    : activity.mapsUrl;
  const externalUrl = activity.eventUrl ?? mapsUrl;
  const cost = activity.cost ?? { entry: '—', parking: '—', total: 0 };

  return (
    <div className="bg-white rounded-[18px] overflow-hidden border border-cream-200 shadow-[0_4px_10px_-2px_rgba(38,31,24,0.08),0_1px_2px_rgba(38,31,24,0.04)] hover:shadow-[0_12px_24px_-8px_rgba(38,31,24,0.14),0_4px_8px_rgba(38,31,24,0.06)] hover:-translate-y-0.5 transition-all group flex flex-col">
      <div className="relative h-48 overflow-hidden shrink-0 bg-cream-100">
        {imageUrl && imgStage !== 'failed' ? (
          <img
            src={imageUrl}
            alt={activity.title}
            onError={handleImgError}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : imgStage === 'failed' ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cream-100 to-cream-200">
            <MapPin className="w-10 h-10 text-terracotta-200" />
          </div>
        ) : (
          <div className="w-full h-full animate-pulse bg-gradient-to-r from-cream-100 via-cream-200 to-cream-100" />
        )}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-terracotta-600 shadow-sm font-sans">
            {activity.isIndoor ? 'Indoor' : 'Outdoor'}
          </span>
          {activity.eventSource && (
            <span className="bg-pine-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm font-sans">
              Live
            </span>
          )}
        </div>
      </div>

      <div className="p-6 space-y-4 flex flex-col">
        <div className="flex justify-between items-start gap-4 shrink-0">
          <h3 className="text-lg font-bold text-ink-900 leading-tight font-sans">{activity.title}</h3>
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-terracotta-50 text-terracotta-500 rounded-full hover:bg-terracotta-500 hover:text-white transition-colors shrink-0"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <p className="text-ink-600 text-sm leading-relaxed font-sans">{activity.description}</p>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-cream-200 shrink-0">
          <div className="flex items-center gap-2 text-sm text-ink-600 font-sans">
            <Clock className="w-4 h-4 text-sky-400 shrink-0" />
            {activity.time}
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-600 font-sans">
            <Car className="w-4 h-4 text-pine-500 shrink-0" />
            {activity.driveTime}
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-600 col-span-2 font-sans">
            <MapPin className="w-4 h-4 text-terracotta-500 shrink-0" />
            <span className="truncate">{activity.location}</span>
          </div>
        </div>

        {/* Cost breakdown */}
        <div className="space-y-2 shrink-0">
          <p className="text-[10px] font-bold text-ink-600 uppercase tracking-[0.08em] font-sans">Cost breakdown</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'entry', label: 'Entry', content: cost.entry },
              { id: 'parking', label: 'Parking', content: cost.parking },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveModal({ title: item.label, content: item.content })}
                className="bg-terracotta-50 p-2.5 rounded-xl text-center hover:bg-terracotta-100 transition-colors w-full overflow-hidden group/cost"
              >
                <span className="block text-[9px] font-bold uppercase tracking-wider text-ink-400 group-hover/cost:text-terracotta-500 transition-colors mb-0.5 font-sans">{item.label}</span>
                <span className="text-ink-900 block truncate text-xs font-mono">{item.content}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cost modal */}
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
                className="bg-white rounded-[18px] p-8 max-w-sm w-full shadow-[0_24px_48px_-16px_rgba(38,31,24,0.22)] relative border border-cream-200"
              >
                <button
                  onClick={() => setActiveModal(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-cream-100 rounded-full text-ink-400 hover:text-ink-900 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-terracotta-50 rounded-xl flex items-center justify-center text-terracotta-500">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-ink-900 font-sans">{activeModal.title}</h3>
                </div>
                <p className="text-ink-600 leading-relaxed italic font-sans">
                  "{activeModal.content}"
                </p>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Age suitability */}
        <div className="bg-sky-50 p-4 rounded-xl flex gap-3 shrink-0 border border-sky-100">
          <Baby className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-sky-500 uppercase tracking-[0.08em] font-sans">Age suitability</p>
            <p className="text-sm text-ink-900 leading-snug font-sans">{activity.ageSuitability}</p>
          </div>
        </div>

        {/* Pro tip */}
        {activity.tip && (
          <div className="bg-terracotta-100 p-4 rounded-xl flex gap-3 shrink-0 border border-terracotta-200">
            <Lightbulb className="w-4 h-4 text-terracotta-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-terracotta-600 uppercase tracking-[0.08em] font-sans">Pro tip</p>
              <p className="text-sm text-ink-900 leading-snug font-sans">{activity.tip}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
