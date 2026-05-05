# Weekndr — Design Input Brief
*Prepared for: Design team | Source: 5 user interviews + synthesis + affinity map | Date: 2026-05-03*

---

## Purpose of This Brief

This brief translates user research into actionable design inputs for the next phase of Weekndr's product design. It is organized around five questions the research was built to answer:

1. What are parents' reactions to Weekndr?
2. What are the app's current drawbacks?
3. What feature enhancements are needed?
4. What are parents' core frustrations with weekend activity planning?
5. How will parents measure the success of the app?

Each section ends with **Design Implications** — specific decisions or constraints the design team should carry forward.

---

## Who We Designed For

Five parent personas surfaced across research. Design decisions should be stress-tested against all five.

| Persona | Profile | Core Need | Highest Pain |
|---|---|---|---|
| **Sarah** | Single mom, 2 kids (4 & 7), Chicago, $62K | Reduce planning load; cost visibility | Decision fatigue + age-gap overlap |
| **James** | Married, 1 kid (11), Palo Alto, $145K | Tween-appropriate discovery | Emma's disengagement; rotation fatigue |
| **Derek** | Stay-at-home dad, 3 kids (3–9), Atlanta suburb, $210K | Multi-age simultaneous satisfaction | Solo parent logistics; wide age range |
| **Marcus** | Divorced dad (every-other-weekend), 2 kids (9 & 12), Brooklyn, $88K | Make 48 hours count; transit-first | Constrained custody window; diverging interests |
| **Priya** | Married engineer, 2 kids (5 & 8), Columbus suburb, $105K | Discovery beyond the rotation | Drive calculus; mid-city activity density |

---

## 1. Parents' Reactions to Weekndr

### What landed immediately

**The two-day structure with a proactive backup plan was the strongest universal reaction.** No participant had encountered a tool that paired a primary plan with a weather fallback by default. Every participant called it out unprompted and positively.

> *"I didn't know I needed someone to just tell me: here's the plan, here's the rain plan."* — Sarah
> *"Getting a primary and backup in one generation without having to ask is novel."* — Marcus

**Itemized cost breakdown resonated strongly** with budget-constrained participants (Sarah, Marcus, Priya). The format — entry + parking + food — was described as the information they currently have to dig for themselves across multiple sources.

> *"Tell me the total upfront so I can decide yes or no without digging through a website."* — Sarah

**Per-child age input was noticed and appreciated.** Participants flagged it immediately as different from other tools that treat "family" as a single unit.

**Drive time embedded in the schedule** (not just a link) was valued, particularly by parents managing young children's nap/meal timing.

### What caused hesitation or skepticism

**Trust is conditional, not given.** All 5 participants said they would verify the output before committing. The primary concern: is the data current? Has this venue permanently closed? Is the age rating honest?

> *"I've burned myself with ChatGPT recommendations for venues that had closed."* — James
> *"I'd still go to the venue website to confirm hours and price before telling the kids."* — Sarah

**"Family-friendly" language is an active trust signal — in the wrong direction.** Every participant has been burned by activities labeled "family-friendly" that didn't account for their youngest child's age. Generic copy reads as lazy to this audience.

> *"Family-friendly means nothing. I've been burned by that label."* — Sarah
> *"I want specific language — not 'great for all ages.' That's a cop-out."* — Derek

**The interests input field created uncertainty.** Multiple participants didn't know whether to enter one child's interests, all children's interests, or general family interests. For families with kids at different stages, the single field felt lossy.

> *"Whose interests do I put in — everyone's? What if they conflict?"* — Marcus

### Design Implications
- Lead with the backup plan visibility — it's the clearest differentiator and the fastest trust-builder on first encounter
- Never use "family-friendly" or "all ages" in output copy; replace with specific, age-callout language (e.g., "manageable for a 3-year-old, engaging enough for a 9-year-old")
- Add a data freshness signal (e.g., "last verified [date]") to reduce verification anxiety
- Redesign the interests input: per-child, not per-family

---

## 2. Current App Drawbacks

These are gaps between the current product and what users need — problems that will cause friction or abandonment if unaddressed.

### Drawback 1 — Single interests field collapses per-child nuance

The current input asks for interests at the family level. Parents with multiple kids have per-child interests that can conflict. Collapsing them into one field either loses information or forces parents to make a lossy choice.

> *"Rohan likes animals. Ananya likes science and art. If I have to collapse that into one field I lose something."* — Priya
> *"Emma is into astronomy, drawing, mysteries, animals. I want all of that to shape the output."* — James

**Who it hurts most:** Derek (3 kids, wide range), Priya (5 and 8 with distinct profiles), James (one child but rich, specific interests)

### Drawback 2 — Output copy doesn't demonstrate age awareness

Even if the recommendation is age-appropriate, parents can't tell from the copy. Generic descriptions that don't reference developmental considerations lose trust, regardless of how well the underlying match was made.

**Who it hurts most:** All 5 — this is universal. Derek and Marcus most acutely.

### Drawback 3 — No profile memory; re-entry is friction

The app requires re-entering family details on every session. Parents with strong weekly habits expect the app to know their family. Re-entry signals the app doesn't know them, which undermines the personalization premise.

> *"If I could just open it and press 'plan this weekend' without re-entering anything — that's the version I want."* — Sarah
> *"I don't want to re-enter three kids' ages every weekend."* — Derek

**Who it hurts most:** Sarah (solo parent, high frequency), Derek (3 kids, complex re-entry)

### Drawback 4 — No past-activity memory; rotation repeats

Without history, the app will surface the same venues the parent has already visited. This is the primary cause of rotation fatigue, which erodes trust and kills retention.

> *"We've been to every major Bay Area attraction twice already. Without a history, it'll just repeat them."* — James
> *"If it remembered 'you went to the science museum in March, here are alternatives' — I'd trust it so much more."* — Sarah

**Who it hurts most:** James (exhausted Bay Area venues), Priya (small Columbus rotation), Marcus (maxed out NYC staples)

### Drawback 5 — Car-centric UX silently fails transit users

The app outputs drive times and parking info. For urban parents without cars (Marcus, Brooklyn), this information is useless and the absence of transit time/routing is a functional gap.

> *"The parking info is meaningless to me. I don't have a car."* — Marcus
> *"No subway, no activity — but apps don't know that."* — Marcus

**Who it hurts most:** Marcus and any user in dense transit cities (NYC, Chicago, Boston, DC, SF)

### Drawback 6 — Weather backup is binary (rain / not rain)

The current logic assumes "outdoor = weather-sensitive" and "indoor = backup." This doesn't account for heat (Georgia summers eliminate outdoor activities by 11am) or cold (Ohio winters make outdoor plans miserable). The backup trigger is underspecified.

> *"Georgia heat is the plan-killer, not rain. The backup needs to account for that."* — Derek
> *"In Ohio, 'too cold to be outside' is as common as raining."* — Priya

**Who it hurts most:** Derek (Atlanta heat), Priya (Ohio winter), anyone in climate-variable regions

### Drawback 7 — No tween-appropriate filtering

The content set and output copy are skewed toward younger children (perceived age range: 3–9). Parents with 10–13 year olds describe this as the most underserved demographic in family activity products. If Weekndr doesn't address it, older-kid families will churn immediately.

> *"The family activity category completely ignores 10–13 year olds."* — James
> *"If it keeps giving me things targeted at 5–8 year olds, I'll stop using it."* — Marcus

**Who it hurts most:** James (11), Marcus (12), and any family with a tween

### Drawback 8 — No energy/intensity setting

The app always generates a full two-day plan. Some weekends parents have low bandwidth and want a lighter suggestion — half-day, close to home, minimal coordination required. The all-or-nothing output doesn't match variable parental energy.

> *"Some weekends I have more bandwidth than others. I want to set an 'energy level.'"* — Sarah
> *"Sometimes I just want a half-day easy thing."* — Sarah

**Who it hurts most:** Sarah (solo parent, variable energy), anyone coming off an intense work week

---

## 3. Feature Enhancements

Prioritized by RICE and directness of user signal. Unprompted mentions weighted higher than prompted.

### Priority 1 — MVP Refinements (fix before launch or immediately after)

#### 1A. Per-child interest profiles
Replace the single family-level "interests" field with one input row per child. Each child gets: name/nickname (optional), age (already captured), interests (free text or tags).

- **Evidence:** 4/5 participants; raised unprompted by James, Marcus, Derek, Priya
- **Design constraint:** Must stay fast — adding more fields risks abandonment. Consider a progressive disclosure pattern: quick mode (age only) → detailed mode (age + per-child interests)

#### 1B. Age-specific language in output cards
Every activity card must include at least one sentence of developmental callout copy — language that demonstrates the recommendation accounts for the youngest AND oldest child in the family.

- **Evidence:** All 5 participants; "family-friendly" is a red flag
- **Design constraint:** Copy must be specific, not templated. "Great for ages 3–9" is insufficient. "The paved trail works for a 3-year-old; the longer nature loop gives a 9-year-old something to explore" is the target register.
- **Anti-pattern:** Any phrase that includes "family-friendly," "all ages," or "kids of all ages"

#### 1C. Venue age minimum surfaced in card
Display the minimum age policy for activities that have one. Flag clearly if the youngest child in the entered family profile falls below the minimum.

- **Evidence:** Marcus (escape room incident); all participants verified this manually
- **Design constraint:** This requires reliable venue metadata; consider a "verify age policy" link as a fallback until data coverage is confirmed

#### 1D. Backup plan trigger expanded beyond rain
Add temperature-based triggers to the weather backup logic. The backup should activate for: rain, temperatures above threshold (e.g., >90°F for outdoor plans), temperatures below threshold (e.g., <35°F for outdoor plans), and any severe weather advisory.

- **Evidence:** Derek (heat), Priya (cold) — both unprompted
- **Design constraint:** Threshold should be user-configurable or geo-calibrated (a 90°F day means something different in Georgia vs. Minnesota)

---

### Priority 2 — V1 Paid Tier (retention and conversion features)

#### 2A. Saved family profile + one-tap replanning
Allow users to save their family profile (kids' names, ages, interests, location, budget, transportation mode). Return visits should open to a "Plan this weekend" state that requires zero re-entry.

- **Evidence:** 4/5 participants unprompted; Sarah: *"That feature alone would make me pay for the app"*
- **Monetization signal:** This is the primary free-to-paid conversion trigger across all personas
- **Design constraint:** Account creation is required — onboarding must communicate the profile memory benefit explicitly to justify the signup step

#### 2B. Past-activity log + rotation prevention
Track activities that have been generated or marked as "done." Exclude them from future suggestions by default. Surface a "we've been here" indicator on any card that appears in history.

- **Evidence:** 4/5 participants unprompted; core driver of rotation fatigue
- **Design constraint:** Users should be able to override exclusions ("suggest it again anyway") — some families do return to favorites intentionally

#### 2C. Post-activity feedback (thumbs / engagement rating)
After a weekend, prompt a lightweight check-in: "How did Saturday go?" with per-child reaction capture. Use to weight future suggestions toward activities similar to high-rated ones.

- **Evidence:** Marcus: *"Track what Aiden reacted well to, not just what we've been to"*; James: *"Mark Emma approved / vetoed"*
- **Design constraint:** Must be frictionless — a 5-second interaction, not a form. Consider push notification trigger Sunday evening.

---

### Priority 3 — V1 General (usability and persona coverage)

#### 3A. Transportation mode selector
Add a "how you'll get there" input: driving, public transit, or both. For transit mode, replace parking info with estimated transit time and nearest station/stop. Replace Google Maps driving link with transit directions link.

- **Evidence:** Marcus (Brooklyn); affects all urban-dense users — a silent but complete UX failure today
- **Design constraint:** Transit routing requires integration with a transit API (Google Maps Transit, Apple Maps, or similar). For MVP, a toggle that suppresses driving-specific content and flags "best by transit" on cards may be sufficient.

#### 3B. Tween mode (ages 10–13)
When the oldest child in the profile is 10–13, apply a content filter that excludes activities coded as primarily-for-young-children. Add a "not too young" signal to output cards for activities that will satisfy a tween.

- **Evidence:** James and Marcus both independently named this as the largest gap in the market
- **Design constraint:** This is partly a prompting/model problem (LLM must model tween preferences differently) and partly a data problem (activity taxonomy must tag tween-appropriate content). Both need to be addressed.

#### 3C. Energy/intensity setting
Add an optional "what kind of weekend is it?" input: Adventure (full day, active, something new) / Chill (half-day, close to home, low coordination) / Quick (1–2 hours, neighborhood-level). Adjust itinerary scope and distance radius accordingly.

- **Evidence:** Sarah (solo parent, variable energy); implies the current always-full-plan output is a mismatch for low-bandwidth weekends
- **Design constraint:** This should be optional and fast — a single tap before generation, not a required field

---

### Priority 4 — V2 (expand addressable personas)

#### 4A. Solo parent mode
When flagged, filter venues by solo-parent manageability: enclosed/bounded spaces, single-entry points, onsite food so you don't have to leave, adequate bathroom proximity. Display a "solo-friendly" badge on qualifying venues.

- **Evidence:** Derek; the only parent explicitly managing 3 kids alone with no backup adult
- **Design constraint:** Requires venue-level metadata currently unavailable in most APIs. Likely requires a curated data layer or community tagging.

#### 4B. Drive radius selector + cluster itinerary
Allow users to set a max drive radius (e.g., 15 / 30 / 45 min). For suburban users, add a "cluster" option that returns two activities in the same geographic area, enabling a single drive to cover both.

- **Evidence:** Priya (Lewis Center → Columbus, 30 min each way)
- **Design constraint:** Clustering requires geographic proximity logic in the activity selection algorithm

#### 4C. "Worth the drive" value signal
For any activity beyond a user-set distance threshold, add a brief justification of why it's worth the trip — something specific to the family profile.

- **Evidence:** Priya: *"If it knew I was 30 minutes out and told me 'worth the drive because X,' I'd trust that signal"*
- **Design constraint:** This is copy/LLM work, not a UI component — the model must be prompted to generate this for distant recommendations

#### 4D. Venue age policy metadata
Display minimum age requirements on every activity card. Flag conflicts with the youngest child in the profile. Provide a direct link to the venue's ticketing/booking page for confirmation.

- **Evidence:** Marcus (escape room incident forced a complete plan pivot on arrival)

---

### Priority 5 — V3 / Exploratory

#### 5A. Cultural event integration
Allow users to specify cultural community preferences (e.g., South Asian, Latin American, Korean, Black community events). Surface culturally relevant events when available in the area.

- **Evidence:** Priya (Indian community events in Columbus)
- **Build constraint:** Requires community-specific data partnerships or user-contributed content — not solvable with generic activity APIs alone

#### 5B. "Pitch to your kid" framing
Add a one-sentence "how to pitch this to your kid" line on activity cards for families with tweens or kids with strong veto behavior.

- **Evidence:** James (Emma vetoes before arrival); Marcus (Aiden needs pre-buy-in)
- **Design constraint:** LLM-generated, family-profile-aware copy. Low build cost, high perceived value for this persona.

#### 5C. Sibling + friend mode
Option to plan an activity for "my kid + one friend" rather than for the whole family. Useful for single-child families or older kids whose friends matter more than their parents' company.

- **Evidence:** James (Emma at 11 cares more about peers)

---

## 4. Parents' Core Frustrations

These are the problems Weekndr must solve to earn and retain users. Ordered by prevalence across participants.

### F1 — Planning takes too long at the worst possible moment
All 5 parents plan Thursday–Friday, after a full work week, when cognitive load is highest. Planning time ranges from 45 minutes to 4 hours. The job is: eliminate the research burden, not just streamline it.

> *"I want the planning to take five minutes, not two hours."* — Sarah
> *"By Friday I am done. Fully depleted. And then I have to switch into mom mode."* — Sarah

**Design implication:** Speed of generation is a first-class UX goal. The time from opening the app to having a usable plan must be under 60 seconds. Every required input field adds abandonment risk.

---

### F2 — No tool understands my specific kids' ages
Every parent described the same failure: tools label activities "family-friendly" without accounting for the actual age range present. Parents have to mentally re-filter every recommendation.

> *"I'm doing a five-way mental simulation every time I pick something."* — Derek

**Design implication:** The app's primary trust differentiator is demonstrating age-range awareness in its output. This must be visible in the card copy, not buried in metadata.

---

### F3 — Hidden costs cause humiliation at the venue
Arriving at a venue with kids excited about the plan, only to realize the total cost blows the budget, is one of the most emotionally charged failure modes reported. It's not just inconvenient — it feels like failure.

> *"I've gotten to places and realized I'm going to blow my whole budget on parking before we've eaten."* — Sarah
> *"I need to know the total before I get the kids excited about it."* — Marcus

**Design implication:** The cost breakdown must be complete (entry + parking + food estimate) and surfaced before the user commits to a plan — not as an afterthought. For budget-constrained users, this is the gate to adoption.

---

### F4 — Weather destroys plans with no ready alternative
Weather changes are a recurring failure mode (estimated 40% of weekends for Sarah). Current backup lists are described as thin, stale, and identical every time. Parents don't have a good indoor discovery system — they have a rotation of 3–5 places they've used to exhaustion.

> *"If it rains I know I'm going to land on something we've done a hundred times."* — Sarah

**Design implication:** The backup plan is not a secondary feature — it's half the product's value. It must be specific, not generic. "Indoor activity" is not a backup plan; "Glazed ceramic workshop, $18/child, 12 min away" is.

---

### F5 — The rotation runs out; discovery is the gap
Most parents have a known set of 10–20 venues. The planning problem is not execution (getting to the venue, managing the day) — it's discovery: finding new places they don't already know. When the rotation exhausts itself, parents feel stuck.

> *"My rotation of 15–20 places is reliable but it gets old. Discovery is the gap, not execution."* — Derek
> *"If it surfaces something I would never have found on my own and it's great — that's when I become a believer."* — Priya

**Design implication:** The product must measure and optimize for discovery rate — the percentage of generated activities that are new to the family. This is the metric that drives word-of-mouth.

---

### F6 — Tween engagement is the hardest problem and the least served
Parents with 10–13 year olds face a specific version of the age problem: their child has outgrown "family" content but isn't ready for adult content. The entire family activity product category ignores this demographic.

> *"The family activity category completely ignores 10–13 year olds."* — James
> *"Aiden needs to not feel like the activity is for little kids. That filter is very real."* — Marcus

**Design implication:** Tween-specific filtering is both a trust gate (for families with tweens) and a market differentiation opportunity — no competitor has addressed it.

---

## 5. What Parents Hope to Achieve

These are the Jobs to Be Done — the outcomes parents are hiring Weekndr to produce. Design decisions should serve these outcomes, not just feature checklists.

| Job | Description | Success State | Persona |
|---|---|---|---|
| **Eliminate the planning burden** | Stop spending Friday nights stressed about what to do Saturday | Opens app Thursday → has a plan in under 60 seconds | Sarah |
| **Find something the tween will actually engage with** | Surface activities that bypass the "this is for little kids" filter | Kid puts phone away and participates without prompting | James, Marcus |
| **Satisfy multiple ages simultaneously** | One activity that gives the 3-year-old and the 9-year-old a genuinely good time at the same time | All kids happy at the same time for most of the outing | Derek |
| **Make the custody window count** | Use limited time with kids to create real shared memories, not generic outings | Kid voluntarily references the activity afterward | Marcus |
| **Discover what the city actually has** | Find real places the parent didn't know, beyond the rotation | Parent goes somewhere new and it's good | Priya |
| **Know the real cost upfront** | Make a confident financial decision before getting kids excited | No surprises at the venue; plan executes within budget | Sarah, Marcus |
| **Have a ready fallback when weather changes** | Not scramble on a rainy Saturday | Weather changes → backup plan ready without any additional work | All |

---

## 6. How Parents Measure App Success

These are the actual metrics parents described when asked "how would you know it's working?" Design should optimize for these outcomes, and product analytics should track proxies for them.

### What parents said

| Success Signal | Quote | Who |
|---|---|---|
| **Planning time collapses** | *"If planning goes from 45 minutes to 5 minutes — that's the metric."* | Sarah |
| **Kid engagement is the real measure** | *"If Aiden voluntarily talks about the activity afterward — that's the metric."* | Marcus |
| **All kids happy simultaneously** | *"All three kids having a genuinely good time at the same time."* | Derek |
| **Discovery rate** | *"If I'm consistently finding things I didn't know about and they're actually good."* | Priya |
| **End-of-Sunday feeling** | *"The weekend had a shape to it — not just two days of TV and the same park."* | Sarah |
| **Loss aversion test** | *"If it disappeared and I had to go back to my old process — genuinely annoyed."* | Sarah |
| **Kid engagement as quality proxy** | *"Emma off her phone, actually present, for the whole activity."* | James |

### Translated to product metrics

| Parent Success Signal | Product Metric Proxy |
|---|---|
| Planning time < 5 min | Time from app open → plan accepted (session duration) |
| Kid engaged / talked about it after | Post-weekend feedback rating (thumbs up per child) |
| Discovery (new place, not rotation) | % of accepted plans containing ≥1 activity new to the family profile |
| Loss aversion / regret test | 30-day retention rate; churn reason at cancellation |
| Weather backup used | Backup plan acceptance rate when weather trigger fires |
| End-of-Sunday shape | 7-day return rate after a completed weekend |
| Plan executed as generated | Plan acceptance rate (accepted → not abandoned before the day) |

### Design implication
The app's success loop must close the feedback cycle. Without a post-weekend check-in, the product cannot learn what worked and the personalization premise breaks. A Sunday evening micro-prompt — 2 taps, not a form — is a prerequisite for the memory features to function.

---

## Design Principles (derived directly from research)

These are constraints that should govern design decisions throughout the process. Each is grounded in a specific user insight, not a convention.

**1. Speed over completeness.** Every required input field is an abandonment risk. The core generation flow must require only: location, kids' ages, and budget. Everything else is optional or learned over time.
*Grounded in:* Sarah's "I'm depleted by Friday" and all participants' emphasis on planning time as the primary metric.

**2. Specificity earns trust; generality destroys it.** Output copy must demonstrate the app understood this family's specific configuration, not families in general. "Family-friendly" is a trust signal in the wrong direction.
*Grounded in:* All 5 participants' verification behavior; Derek's "I want language that shows it understood the range."

**3. Design for the youngest child first.** The youngest child is the binding constraint for every activity decision. The design must make it easy to see, at a glance, whether the youngest profile is accommodated.
*Grounded in:* Derek (Maya is always the filter), Sarah (Lily's limits eliminated half the activities), Marcus (Jordan's age minimum issue).

**4. The backup plan is not secondary.** Primary and backup must be visually equivalent in weight. The backup plan is half the product's value, not a footnote.
*Grounded in:* All 5 participants' positive reaction to proactive backup; Sarah's backup list exhaustion.

**5. Cost must be complete before commitment.** Never show an activity card without at least an estimated total cost. Partial cost (entry only, no parking or food) is worse than no cost because it creates false confidence.
*Grounded in:* Sarah and Marcus's hard budget ceilings; the emotional humiliation of hidden costs at the venue.

**6. Memory is the product.** The value of Weekndr compounds over time as the app learns the family's profile, history, and preferences. Every design decision should ask: does this create learning, or is it stateless?
*Grounded in:* 4/5 participants naming profile memory as the clearest paid-tier trigger, unprompted.

**7. Don't design for nuclear families only.** Single parents, divorced parents with custody schedules, and solo planning adults are high-frequency, high-stakes users. Car-ownership is not a given. Two adults are not a given.
*Grounded in:* Sarah (solo), Marcus (custody), Derek (solo logistics), Marcus (no car).

---

## Open Design Questions

These require design decisions before the next round of wireframes or prototypes.

1. **How does the input form scale across 1–4 children without feeling like a form?** Per-child interest fields add real value but also friction. What's the progressive disclosure pattern that keeps the core flow under 60 seconds while allowing depth for returning users?

2. **How should the Saturday and Sunday plans relate visually?** Sarah wanted to see both days simultaneously without scrolling. Is the right pattern a two-column layout, a tabbed view, or a swipe gesture? The decision affects how the backup plan is surfaced alongside each day.

3. **What triggers the post-weekend feedback prompt, and how is it framed?** Sunday evening is the right moment, but notification fatigue is real. What's the framing that makes this feel like a "how did it go?" check-in rather than a survey? And does it ask per-child or per-weekend?

4. **How do we visually differentiate a new discovery from a known rotation item?** Once history is tracked, how does the UI signal "you haven't been here before" vs. "you've been here twice"? A badge, a sort order, a separate tab?

5. **What does the "pitch to your kid" micro-copy look like, and where does it live on the card?** Is it a collapsed section, a tooltip, or a dedicated line? For families without tweens it's irrelevant; it should not clutter cards for Sarah or Derek.

6. **How does transportation mode change the spatial layout of the output?** For Marcus, parking info is replaced by transit time. But the card's information hierarchy was built around driving. Does transit mode require a distinct card variant, or can the layout flex gracefully?

7. **What does onboarding look like for the first-time user with no history?** The first generation is stateless — no profile, no history, no preferences. The output quality will be lower than for a returning user. How do we set expectations and still deliver enough value to earn account creation?

---

*Source documents: [synthesis-report.md](synthesis-report.md) · [affinity-map.md](affinity-map.md) · Interviews 01–05*
*Next stage: Wireframes + prototype for usability testing*
*Recommended test scenarios: first-time onboarding flow; per-child profile input; activity card trust signals; Saturday/Sunday dual-day layout; post-weekend feedback prompt*
