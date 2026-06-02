import { Kid, LiveEvent } from '../types';

function getNextWeekendDates(): { saturdayISO: string; sundayISO: string } {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 6=Sat
  const daysUntilSat = day === 6 ? 0 : 6 - day;

  const saturday = new Date(now);
  saturday.setDate(now.getDate() + daysUntilSat);
  saturday.setHours(0, 0, 0, 0);

  const sunday = new Date(saturday);
  sunday.setDate(saturday.getDate() + 1);
  sunday.setHours(23, 59, 59, 0);

  return {
    saturdayISO: saturday.toISOString().slice(0, 19) + 'Z',
    sundayISO: sunday.toISOString().slice(0, 19) + 'Z',
  };
}

function parseCityFromLocality(targetLocality: string): string {
  return targetLocality.split(',')[0].trim();
}

function pickBestImage(
  images: Array<{ url: string; width: number; height: number; ratio?: string }>
): string | undefined {
  if (!images?.length) return undefined;
  const preferred = images
    .filter(img => img.ratio === '16_9' && img.width >= 400 && img.width <= 1024)
    .sort((a, b) => Math.abs(a.width - 640) - Math.abs(b.width - 640));
  return preferred[0]?.url ?? images[0]?.url;
}

function formatPrice(
  priceRanges?: Array<{ min: number; max: number; currency: string }>
): string {
  if (!priceRanges?.length) return 'Check event page';
  const { min, max, currency } = priceRanges[0];
  const symbol = currency === 'USD' ? '$' : currency;
  if (min === 0 && max === 0) return 'Free';
  if (min === max) return `${symbol}${Math.round(min)}`;
  return `${symbol}${Math.round(min)}–${symbol}${Math.round(max)}`;
}

function formatEventDate(dateTimeStr?: string): { date: string; time: string } {
  if (!dateTimeStr) return { date: 'This weekend', time: 'See event page' };
  const d = new Date(dateTimeStr);
  const date = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return { date, time };
}

async function fetchTicketmasterEvents(
  targetLocality: string,
  saturdayISO: string,
  sundayISO: string
): Promise<LiveEvent[]> {
  const city = parseCityFromLocality(targetLocality);
  const params = new URLSearchParams({
    city,
    startDateTime: saturdayISO,
    endDateTime: sundayISO,
    size: '20',
    sort: 'date,asc',
  });

  try {
    const res = await fetch(`/api/events/ticketmaster?${params}`);
    if (!res.ok) {
      console.warn(`[events] Ticketmaster ${res.status}:`, await res.text());
      return [];
    }
    const data = await res.json();
    const events: any[] = data?._embedded?.events ?? [];
    console.log(`[events] Ticketmaster returned ${events.length} events for ${city}`);

    return events.map((event): LiveEvent => {
      const venue = event._embedded?.venues?.[0];
      const address = [
        venue?.address?.line1,
        venue?.city?.name,
        venue?.state?.stateCode,
      ].filter(Boolean).join(', ');

      const { date, time } = formatEventDate(
        event.dates?.start?.dateTime ?? event.dates?.start?.localDate
      );

      return {
        title: event.name,
        venue: venue?.name ?? 'TBD',
        address,
        date,
        time,
        priceRange: formatPrice(event.priceRanges),
        imageUrl: pickBestImage(event.images),
        eventUrl: event.url,
        source: 'ticketmaster',
      };
    });
  } catch (err) {
    console.warn('[events] Ticketmaster fetch failed:', err);
    return [];
  }
}

async function fetchEventbriteEvents(
  targetLocality: string,
  saturdayISO: string,
  sundayISO: string
): Promise<LiveEvent[]> {
  // Category 115 = Family & Education on Eventbrite
  const params = new URLSearchParams({
    'location.address': targetLocality,
    'location.within': '25mi',
    'start_date.range_start': saturdayISO,
    'start_date.range_end': sundayISO,
    'categories': '115',
    'expand': 'venue,ticket_availability',
    'page_size': '20',
  });

  try {
    const res = await fetch(`/api/events/eventbrite?${params}`);
    if (!res.ok) {
      console.warn(`[events] Eventbrite ${res.status}:`, await res.text());
      return [];
    }
    const data = await res.json();
    const events: any[] = data?.events ?? [];
    console.log(`[events] Eventbrite returned ${events.length} events for ${targetLocality}`);

    return events
      .filter((event: any) => event.name?.text && event.url)
      .map((event: any): LiveEvent => {
        const venue = event.venue;
        const address = [
          venue?.address?.address_1,
          venue?.address?.city,
          venue?.address?.region,
        ].filter(Boolean).join(', ');

        const { date, time } = formatEventDate(event.start?.utc ?? event.start?.local);

        const minPrice = event.ticket_availability?.minimum_ticket_price?.value;
        const maxPrice = event.ticket_availability?.maximum_ticket_price?.value;
        const priceRange = event.is_free
          ? 'Free'
          : minPrice == null
            ? 'Check event page'
            : minPrice === maxPrice
              ? `$${Math.round(minPrice)}`
              : `$${Math.round(minPrice)}–$${Math.round(maxPrice)}`;

        return {
          title: event.name.text,
          venue: venue?.name ?? 'TBD',
          address,
          date,
          time,
          priceRange,
          imageUrl: event.logo?.original?.url ?? event.logo?.url,
          eventUrl: event.url,
          source: 'eventbrite',
        };
      });
  } catch (err) {
    console.warn('[events] Eventbrite fetch failed:', err);
    return [];
  }
}

export async function fetchLiveEvents(
  targetLocality: string,
  _kids: Kid[]
): Promise<LiveEvent[]> {
  const { saturdayISO, sundayISO } = getNextWeekendDates();

  const [tmEvents, ebEvents] = await Promise.all([
    fetchTicketmasterEvents(targetLocality, saturdayISO, sundayISO),
    fetchEventbriteEvents(targetLocality, saturdayISO, sundayISO),
  ]);

  // Deduplicate by normalised title across sources
  const seen = new Set<string>();
  const merged: LiveEvent[] = [];
  for (const e of [...tmEvents, ...ebEvents]) {
    const key = e.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 30);
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(e);
    }
  }

  console.log(`[events] Total merged events: ${merged.length}`);
  return merged.slice(0, 30);
}
