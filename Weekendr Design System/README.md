# Weekendr Design System

> A weekend-planning companion for busy parents. Make Saturday morning feel less like a meeting and more like a break.

---

## What is Weekendr?

**Weekendr** helps overworked parents discover, plan, and book fun weekend activities for their kids — without it feeling like another piece of work to manage. Browse local activities (museums, parks, classes, events), build a Saturday/Sunday schedule the family can rally around, and share it with co-parents or grandparents in one tap.

The product spans:
1. **Marketing website** (`weekendr.com`) — discovery, value prop, sign-up.
2. **Planner web app** — browse activities, build the weekend, manage favorites and family.

### Audience
- Parents 30–45, kids 2–12
- Time-starved, decision-fatigued
- Want their weekend to *feel* like a weekend — not a sprint

### Sources / inputs to this system
> No codebase, Figma file, or screenshots were provided. This system was built from a brief description ("warm inviting tone, professional but unserious, the right level of playful for the adult user who's looking to relax and not be reminded of work in the weekend"). Every visual and copy decision is therefore an *interpretation*, not a recreation. Expect to iterate.

---

## Index — what's in this folder

```
README.md                  ← you are here
SKILL.md                   ← agent skill manifest (also valid for Claude Code)
colors_and_type.css        ← all CSS variables (colors, type, space, radii, shadow, motion)

assets/                    ← logos, illustrations, generic photography placeholders
fonts/                     ← (loaded from Google Fonts CDN — see "Fonts" below)
preview/                   ← design-system review cards (one per concept)

ui_kits/
  marketing/               ← weekendr.com — homepage, browse, activity detail, signup
    index.html             ← interactive walkthrough
    *.jsx                  ← components (Header, Hero, ActivityCard, etc.)
    README.md
  app/                     ← planner web app — schedule builder, favorites, family
    index.html
    *.jsx
    README.md
```

---

## Content Fundamentals

The most important rule: **do not make the user feel like they're at work.**

### Voice
- **Warm, like a friend texting you a great idea on Friday afternoon.**
- Knowing, never condescending. Parents are smart and tired — respect both.
- Lightly funny. A wink, never a wisecrack. We don't *do bits.*
- Confident about activities. Vague language ("lots of fun things to discover!") is corporate sludge — name the thing.

### Pronouns
- **You** for the user (the parent). Never "users."
- **We** for Weekendr. Never "the team" or "Weekendr (the company)."
- **They / them** for kids when generic; **your kid / your kids** is warmer when you can.

### Casing
- **Sentence case** for everything. Headers, buttons, nav. ("Plan your weekend," not "Plan Your Weekend.")
- The wordmark **Weekendr** is the only proper noun we treat with title-case.
- Never ALL CAPS in body. Caps only for tiny eyebrow labels (uppercase + tracked, 11–12px).

### Punctuation
- Em-dashes are great — use them.
- Exclamation points are rare. Save them for genuine moments. Two per page, max.
- Oxford commas. Always.
- Contractions everywhere ("you're" not "you are").

### Examples — good vs bad

| ✅ Yes | ❌ No |
|---|---|
| "Saturday's looking good." | "Discover Amazing Weekend Activities!" |
| "Three hours, indoor, $12 a kid." | "Get ready for fun-filled adventures!" |
| "We pulled five things you might like." | "Our AI has curated personalized recommendations." |
| "Add to Saturday" | "ADD TO SCHEDULE" |
| "Grandma can see this too." | "Share with family members" |
| "Skip the planning. Keep the fun." | "Planning made easy with Weekendr" |

### Emoji
- **Used very sparingly.** A small emoji can punctuate a moment ("Saturday's looking good. ☀️") but the brand has a real visual language and shouldn't lean on emoji to be friendly.
- Allowed in: empty states, transactional emails, occasional CTAs.
- Not allowed in: navigation, button labels, headers, marketing hero copy.

### What we never say
- "Curate / curated" — corporate
- "Adventure" outside literal adventures — marketing-y
- "Magical" — saccharine
- "Hustle," "grind," "boss" — work language; kills the vibe
- "Family fun" as a bare phrase — a tell of stock copywriting

---

## Visual Foundations

The whole system is one idea: **a sunset picnic in the park.** Warm cream paper, terracotta and sun-yellow accents, deep evergreen for grounding. Generous radii, soft shadows, a hint of hand-drawn personality without crossing into childish territory.

### Color
- **Primary — Terracotta `#D85F2A`.** The hero. Buttons, key links, brand moments.
- **Accent — Sun `#EDB821`.** Highlights, badges, "today" markers, sticker-style annotations.
- **Secondary — Pine `#2C5E2A`.** Grounding, success, outdoor tags, navigation accents.
- **Tertiary — Sky `#3C879D`.** Used rarely, for water/outdoor categories.
- **Cream `#FBF7F1`.** Page background. The whole system sits on this — never pure white at the page level.
- **Ink `#1A140E`.** Dark text and the drawn-outline color. Warm-tinted black, never pure `#000`.

We never use the pure-white `#FFF` for full pages — it feels clinical. Cards and elevated surfaces *can* be `#FFF` to pop above cream. We never use neutral grey — the neutral scale (`--ink-*`, `--cream-*`) is warm-toned.

Avoid: bluish-purple gradients, neon, anything resembling a productivity app.

See `colors_and_type.css` for the full ramps.

### Type
- **Display — Fraunces.** A characterful variable serif. Used for marketing headlines and the brand voice. Push `SOFT 30+` and occasional `WONK` for personality.
- **UI — Plus Jakarta Sans.** Friendly geometric sans. The product runs on this — body, controls, labels.
- **Hand — Caveat.** Sticker labels and "yay!" moments. **Used sparingly** — one per screen, max. Misuse will turn this into a Pinterest mood-board.
- **Mono — JetBrains Mono.** Time codes, prices in dense lists, codes in receipts.

> **Substitution flag:** No font files were provided. All four are loaded from Google Fonts CDN. If the brand has a custom display face or licensed alternative, drop the files in `fonts/` and update `colors_and_type.css`.

### Spacing
4-based scale: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96`. Sections breathe — vertical rhythm on marketing pages defaults to 64–96px between blocks. App padding starts at 16/24px. Density is *low* by design — this isn't an admin panel.

### Radii
Generous. **Buttons are pills (`999px`)**, cards are `18px` (lg), big surfaces (modals, hero panels) are `24–32px`. Square corners only for full-bleed photo edges or chips inside dense UI.

### Shadows
Two flavors:
1. **Soft, warm-tinted shadows** for elevation in app UI (`shadow-sm` → `shadow-xl`). Never grey — they pick up the warm ink color.
2. **Hard offset "pop" shadow** (`0 6px 0 var(--ink-700)`) — used on the *primary marketing CTA* and occasional sticker elements. This is the playful punctuation. Never apply to app chrome.

### Borders
- Default border: `1px solid var(--border)` — a soft cream line.
- Drawn-outline look: `2px solid var(--ink-700)` — used on stickers, primary CTAs in marketing, and category chips. Reads as confident, not childish.
- Avoid mixing the two on one screen.

### Backgrounds
- **Page:** flat cream (`--cream-50`).
- **Patterns:** very rare. We have one optional repeating motif (small dots / "freckles") for empty states and footer.
- **Imagery:** real photography, warm-tinted (golden hour, slight grain). Avoid stock photo over-saturation; avoid blue-cool tones; avoid people staring directly at camera with toothy grins.
- **Gradients:** almost never. Single soft sunset gradient is allowed only in the hero of the marketing site (cream → sun-100 at the bottom). Never in the app.
- **Full-bleed images:** marketing only — hero and category headers. App stays on cream.

### Animation & motion
- **Default ease:** `cubic-bezier(0.22, 1, 0.36, 1)` (out) — soft and confident.
- **Bouncy ease:** reserved for *adding to weekend*, *favoriting*, and similar success moments. One bounce per interaction, not three.
- **Durations:** 120ms (micro), 200ms (default), 360ms (page-level). Never longer.
- Page transitions: cross-fade + 8px upward translate. No slide-in panels from 100% off-screen.

### Hover & press states
- **Hover (buttons):** background darkens one step (`accent-500 → accent-600`). No scale.
- **Hover (cards):** lift `translateY(-2px)`, shadow steps up `md → lg`. No outline change.
- **Press:** `translateY(1px)` and shadow steps down. On pop-shadow CTAs, the offset shrinks `6px → 2px`.
- **Focus:** 3px outline `var(--accent)` at 50% alpha, offset 2px. Never the browser default.

### Transparency & blur
- **Sticky header on marketing:** cream at 80% with `backdrop-filter: blur(10px)`. Only place blur is used.
- App headers are solid — clarity over flair.
- Transparency otherwise reserved for protection gradients on photo overlays (bottom-up dark gradient at 0–60%).

### Cards
- Background `#FFF` on cream pages, or `--cream-100` on white pages (whichever creates contrast).
- Radius `18px` (lg).
- Shadow `sm` resting, `lg` on hover.
- Border: usually none. If a card needs a border, it's `1px solid var(--border)` — never both shadow + heavy border.

### Layout rules
- Marketing site: 1080–1280px content max-width, centered, with 24px gutters at small sizes.
- App: full-bleed with a left sidebar (240px) on desktop; bottom tab bar on mobile.
- Sticky elements: header (top) and the "weekend tray" in the planner (bottom-right, floating).
- Never more than 2 sticky elements visible at once.

---

## Iconography

**System used: Lucide.** Loaded from CDN (`https://unpkg.com/lucide@latest`). 1.75px stroke, rounded line caps, no fills unless the icon is a "selected" state.

> **Why Lucide:** clean, friendly geometric, well-maintained, broad coverage. It matches the Plus Jakarta Sans personality without being too thin or corporate.

### Sizes
- `16px` — inline with body text
- `20px` — default UI (nav, buttons)
- `24px` — primary actions, headers
- `32px+` — feature illustrations

### Usage rules
- Stroke-only icons everywhere. Filled = selected/active state ONLY.
- Icon color inherits from `currentColor` — match the surrounding text color, don't tint independently.
- One icon per button max. Icons sit *before* the label with 8px gap.
- We never use icon-only buttons in marketing. In the app, icon-only is fine for compact toolbars (with a tooltip).

### Custom illustrations
The brand has a small library of **hand-drawn doodle accents** — sun, balloon, leaf, picnic basket, kite. They live in `assets/illustrations/` as SVG. Use them as:
- Sticker accents on marketing hero (rotated 5–15°)
- Empty-state companions
- Section dividers (centered, small)

> **Flag:** Doodle illustrations were not provided. Placeholders are stubbed in `assets/illustrations/`. Replace with brand-authored SVGs when available.

### Emoji as iconography
Only in the cases listed under Content. Never as a substitute for a real icon.

### Photography placeholders
`assets/photography/` contains warm-toned stock placeholders for activity cards. Replace with real assets when available. **Do not generate photography with AI** — it tends to break the warm-but-not-saturated tone we're going for.

---

## Working in this system

1. Import `colors_and_type.css` once at the top of any HTML file.
2. Use the **semantic tokens** (`--bg`, `--fg`, `--accent`, etc.) in components — not the raw color ramps.
3. Use the `wk-*` type classes for headings and body.
4. When in doubt: less density, more breathing room, sentence case.

---

## Manifest

- **`README.md`** — this doc
- **`SKILL.md`** — agent skill manifest
- **`colors_and_type.css`** — every CSS variable
- **`assets/`** — `logo.svg`, `icon.svg`, `illustrations/{sun,balloon,leaf,kite,basket,sparkle}.svg`
- **`preview/`** — design-system review cards (22 cards across Colors, Type, Spacing, Components, Brand)
- **`ui_kits/marketing/`** — weekendr.com kit (`index.html`, `components.jsx`, `styles.css`)
- **`ui_kits/app/`** — planner app kit (`index.html`, `components.jsx`, `styles.css`)

## Caveats / known TODOs

- Real Weekendr brand assets, logo, font licenses, and photography are missing. Substitutions are flagged inline above.
- Doodle illustrations are placeholders — to be replaced.
- This system has been validated only on the design surface — it has not been load-tested in real product code.
