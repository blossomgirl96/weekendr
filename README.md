> **v3 note:** majorly, live integrations

# Weekndr

The ultimate weekend planner for busy parents. Enter your location, kids' ages, interests, and budget — get a full two-day family itinerary in seconds, with indoor backup plans built in.

Built with React, TypeScript, and the Anthropic Claude API.

## Features

- Age-appropriate activity suggestions for any kid age range
- Budget-aware planning with itemized cost breakdowns (entry, parking, food)
- Weather-conscious scheduling with indoor Plan B fallbacks
- Drive time estimates from your starting address
- Saturday + Sunday itineraries with primary and backup activities
- Google Maps links for every activity

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite 6
- **Styling:** Tailwind CSS v4
- **AI:** Anthropic Claude API (`claude-sonnet-4-6`)
- **Utilities:** Lucide React, Motion, react-markdown

## Getting Started

**Prerequisites:** Node.js 18+

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Copy the example env file and add your Anthropic API key:
   ```bash
   cp .env.example .env.local
   ```
   Then set `ANTHROPIC_API_KEY` in `.env.local` — get a key at [console.anthropic.com](https://console.anthropic.com).

3. Start the dev server:
   ```bash
   npm run dev
   ```

   The app runs at `http://localhost:3000`.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key |
| `APP_URL` | No | The URL where the app is hosted |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server on port 3000 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Type-check with TypeScript |
