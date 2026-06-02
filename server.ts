import { config } from 'dotenv';
config({ path: '.env.local' });
config();

import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import path from 'path';
import { fileURLToPath } from 'url';
import type { KidPreferences, LiveEvent, WeekendPlan } from './src/types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json({ limit: '2mb' }));

const PORT = Number(process.env.PORT ?? process.env.API_PORT ?? 3001);

// ─── Anthropic schema & tool definition ──────────────────────────────────────

const activitySchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    location: { type: 'string' },
    time: { type: 'string' },
    cost: {
      type: 'object',
      properties: {
        entry: { type: 'string' },
        parking: { type: 'string' },
        total: { type: 'number' },
      },
      required: ['entry', 'parking', 'total'],
    },
    driveTime: { type: 'string' },
    whyItsGreat: { type: 'string' },
    ageSuitability: { type: 'string' },
    mapsUrl: { type: 'string' },
    isIndoor: { type: 'boolean' },
    tip: {
      type: 'string',
      description: "A single actionable pro tip specific to this activity (e.g., 'Arrive 30 min before opening to beat crowds')",
    },
    imageQuery: {
      type: 'string',
      description: "Short descriptive search phrase for a relevant stock photo (e.g., 'San Francisco Golden Gate Park children playing')",
    },
    eventImageUrl: {
      type: 'string',
      description: 'Direct image URL from a live event listing — only populate for activities sourced from a live event.',
    },
    eventSource: {
      type: 'string',
      description: "Source aggregator for live events: 'ticketmaster' or 'eventbrite'. Omit for non-event activities.",
    },
    eventUrl: {
      type: 'string',
      description: "Direct URL to the event's ticket or info page. Only populate for live event activities.",
    },
  },
  required: ['title', 'description', 'location', 'time', 'cost', 'driveTime', 'whyItsGreat', 'ageSuitability', 'isIndoor', 'tip', 'imageQuery'],
};

const weekendPlanTool: Anthropic.Tool = {
  name: 'generate_weekend_plan',
  description: 'Generate a structured weekend plan for a family with kids',
  input_schema: {
    type: 'object',
    properties: {
      saturday: {
        type: 'object',
        properties: {
          primary: { type: 'array', items: activitySchema },
          planB: { type: 'array', items: activitySchema },
        },
        required: ['primary', 'planB'],
      },
      sunday: {
        type: 'object',
        properties: {
          primary: { type: 'array', items: activitySchema },
          planB: { type: 'array', items: activitySchema },
        },
        required: ['primary', 'planB'],
      },
      weatherForecast: { type: 'string' },
    },
    required: ['saturday', 'sunday', 'weatherForecast'],
  },
};

// ─── POST /api/plan ───────────────────────────────────────────────────────────

app.post('/api/plan', async (req, res) => {
  try {
    const { prefs, liveEvents } = req.body as { prefs: KidPreferences; liveEvents?: LiveEvent[] };
    const client = new Anthropic(); // reads ANTHROPIC_API_KEY from process.env
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8192,
      system: [
        {
          type: 'text',
          text: `You are a family weekend activity planner. Create detailed, realistic weekend itineraries for families with kids. Always use the generate_weekend_plan tool to return structured data.

CRITICAL INSTRUCTIONS FOR 2026 REALISM:
1. Realistic 2026 Pricing: It is currently 2026. Ensure all costs reflect modern inflation-adjusted pricing. A typical family meal is rarely under $15-$20 per person unless it's fast food.
2. Budget Awareness: If the budget is low, prioritize free, public, or low-cost activities (parks, libraries, community festivals).
3. Weather Awareness: Consider typical weather for the location and season. If rain or extreme heat is likely, prioritize indoor activities.
4. Plan B (Indoor Fallback): For each day, provide 1-2 indoor backup activities.
5. Detailed Cost Breakdown: For each activity, break down entry fees and parking only (no food). The budget is per person.
6. Drive Time: Estimate drive time from starting address to each activity.
7. Age Suitability: Explicitly state why each activity suits the kids' ages.
8. Maps URL: Provide a full Google Maps Search URL: https://www.google.com/maps/search/?api=1&query=[Place+Name]+[Location]
9. Per-Activity Pro Tip: For each activity, include one practical pro-tip specific to that activity. Examples: 'Arrive 30 min before opening to beat crowds', 'Bring a change of clothes for water splash pads', 'Weekday pricing applies if you go Monday — save 20%'.
10. Image Query: For each activity, provide a short descriptive search phrase suitable for finding a relevant stock photo (e.g., 'San Francisco Golden Gate Park children playing', 'Chicago Museum of Science kids exhibit').
11. Restrictions: Respect any stated family restrictions. Stroller = avoid activities with lots of stairs or uneven terrain. Food allergies = avoid recommending food venues that prominently feature that allergen, and flag any risk in the tip field.`,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: `Create a weekend plan for a family with these details:
Starting From: ${prefs.startingAddress}
Target Locality: ${prefs.targetLocality}
Kids: ${prefs.kids.map((k) => `${k.age}yo`).join(', ')}
Interests: ${prefs.interests.length > 0 ? prefs.interests.join(', ') : 'general family activities'}
Budget Ceiling: ${prefs.freeOnly ? 'FREE - prioritize ONLY free or zero-cost activities (parks, public spaces, free museum days, community events)' : `$${prefs.budgetCeiling} per person (entry + parking only, no food)`}
Vibe: ${prefs.vibe}
Profile interests: ${prefs.typicalInterests || 'Not specified'}
This weekend specifically: ${prefs.weekendInterests || 'General family fun'}
Restrictions/Accessibility: ${prefs.restrictions || 'None specified'}

Find real, currently active places or events in the Target Locality. Include 2-3 primary activities per day.${liveEvents && liveEvents.length > 0 ? `

LIVE EVENTS THIS WEEKEND IN ${prefs.targetLocality}:
${JSON.stringify(liveEvents, null, 2)}

INSTRUCTIONS FOR LIVE EVENTS:
- Prioritize incorporating these as primary activities where they match the user's criteria (vibe, budget, age suitability).
- Use the provided title, venue, date, time, and priceRange exactly — do not alter or fabricate event details.
- Set eventUrl to the event's provided eventUrl.
- Set eventImageUrl to the event's provided imageUrl (if present).
- Set eventSource to the event's provided source field.
- For events without a provided imageUrl, generate an appropriate imageQuery as usual.
- If no events fit the criteria, fall back to your standard location-based suggestions and leave eventUrl/eventImageUrl/eventSource empty.` : ''}`,
        },
      ],
      tools: [weekendPlanTool],
      tool_choice: { type: 'tool', name: 'generate_weekend_plan' },
    });

    const toolUseBlock = response.content.find(
      (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
    );
    if (!toolUseBlock) {
      res.status(500).json({ error: 'Could not generate a valid plan. Please try again.' });
      return;
    }
    res.json(toolUseBlock.input as WeekendPlan);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Plan generation failed' });
  }
});

// ─── GET /api/events/ticketmaster ─────────────────────────────────────────────

app.get('/api/events/ticketmaster', async (req, res) => {
  const apiKey = process.env.VITE_TICKETMASTER_API_KEY;
  if (!apiKey) { res.status(500).json({ error: 'Ticketmaster API key not configured' }); return; }
  try {
    const params = new URLSearchParams(req.query as Record<string, string>);
    params.set('apikey', apiKey);
    const upstream = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?${params}`);
    const data = await upstream.json();
    res.json(data);
  } catch (err) {
    console.warn('[server] Ticketmaster fetch failed:', err);
    res.status(500).json({ error: 'Ticketmaster fetch failed' });
  }
});

// ─── GET /api/events/eventbrite ───────────────────────────────────────────────

app.get('/api/events/eventbrite', async (req, res) => {
  const token = process.env.VITE_EVENTBRITE_TOKEN;
  if (!token) { res.status(500).json({ error: 'Eventbrite token not configured' }); return; }
  try {
    const params = new URLSearchParams(req.query as Record<string, string>);
    const upstream = await fetch(`https://www.eventbriteapi.com/v3/events/search/?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await upstream.json();
    res.json(data);
  } catch (err) {
    console.warn('[server] Eventbrite fetch failed:', err);
    res.status(500).json({ error: 'Eventbrite fetch failed' });
  }
});

// ─── POST /api/places/search ──────────────────────────────────────────────────

app.post('/api/places/search', async (req, res) => {
  const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) { res.status(500).json({ error: 'Google Maps API key not configured' }); return; }
  try {
    const upstream = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.photos',
      },
      body: JSON.stringify(req.body),
    });
    const data = await upstream.json();
    res.json(data);
  } catch (err) {
    console.warn('[server] Places search failed:', err);
    res.status(500).json({ error: 'Places search failed' });
  }
});

// ─── GET /api/places/photo ────────────────────────────────────────────────────

app.get('/api/places/photo', async (req, res) => {
  const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) { res.status(500).json({ error: 'Google Maps API key not configured' }); return; }
  const { name } = req.query as { name?: string };
  if (!name) { res.status(400).json({ error: 'name parameter required' }); return; }
  try {
    const upstream = await fetch(
      `https://places.googleapis.com/v1/${name}/media?maxWidthPx=800&maxHeightPx=400&key=${apiKey}&skipHttpRedirect=true`
    );
    const data = await upstream.json();
    res.json(data);
  } catch (err) {
    console.warn('[server] Places photo fetch failed:', err);
    res.status(500).json({ error: 'Places photo fetch failed' });
  }
});

// ─── GET /api/places/streetview ───────────────────────────────────────────────
// Proxies the image bytes so the key never appears in the browser.

app.get('/api/places/streetview', async (req, res) => {
  const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) { res.status(500).end(); return; }
  const { location } = req.query as { location?: string };
  if (!location) { res.status(400).end(); return; }
  try {
    const upstream = await fetch(
      `https://maps.googleapis.com/maps/api/streetview?size=800x400&location=${encodeURIComponent(location)}&key=${apiKey}`
    );
    const contentType = upstream.headers.get('content-type') ?? 'image/jpeg';
    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=86400');
    const buffer = await upstream.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.warn('[server] Street View fetch failed:', err);
    res.status(500).end();
  }
});

// ─── Production static file serving ──────────────────────────────────────────

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[server] API server running on http://localhost:${PORT}`);
});
