---
name: weekendr-design
description: Use this skill to generate well-branded interfaces and assets for Weekendr, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. Always import `colors_and_type.css` and use the semantic tokens (`--bg`, `--fg`, `--accent`, etc.) — never raw color ramps. Use the `wk-*` type classes for headings.

If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Key things to remember when designing for Weekendr:
- Sentence case everywhere except the wordmark.
- Cream page backgrounds, not white. Warm shadows, not grey.
- Pill buttons (radius 999px) by default. Cards at 18px radius.
- Fraunces for display moments, Plus Jakarta Sans for UI, Caveat sparingly for "sticker" annotations.
- Tone: warm friend texting you a great idea — never corporate, never saccharine.
- Lucide icons, stroke-only, 1.75px weight.
- The audience is a tired parent on Friday night. Reduce density, increase breathing room.
