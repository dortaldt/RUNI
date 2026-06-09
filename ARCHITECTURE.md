# Deck architecture plan: from slide pile to course site

Status: PROPOSAL for Dor to approve. Nothing here is built yet. Goal: make the course site
sustainable for 13 weeks of slides + assignments + a syllabus, and make it something the assistant
can edit as data instead of hand-editing JSX.

## Where we are (honest read)
Good bones already exist:
- A deck registry (`src/decks/index.ts`, `DeckDef = {slug, title, slides, notes}`).
- A template library (`src/slides/templates.tsx`, ~590 lines).
- A slide player with speaker notes (`src/components/Deck.tsx`, `SpeakerNotesWindow.tsx`).
- A slide-editor plugin and save helpers (`plugins/slide-editor.ts`, `src/lib/`).

The limits:
1. **Slides are JSX inside per-week files** (`week1.tsx`, `week9.tsx`). The assistant can't author or
   reorder slides as data; every change is JSX surgery. Doesn't scale to 13 decks.
2. **No information architecture beyond decks.** No course hub, no syllabus/schedule page, no per-week
   overview, no assignment/brief pages, no resources. The home page is a flat list of decks.
3. **The plan lives in two places.** `syllabus.md` (memory) and the site don't share a source, so they
   can drift.
4. **No student vs instructor view.** Speaker notes exist but there's no clean student-facing mode.

## Target architecture

### Layer 1, content as data (the core change)
Introduce a typed content model so weeks are data, not code.

```
src/content/
  course.ts        // the manifest: term, instructor, weeks[], grading, policies
  weeks/
    week-01.ts     // { meta, slides[], assignment, resources[] }
    week-02.ts
    ...
  types.ts         // Slide union, WeekContent, Assignment, Resource
```

- A `Slide` is a typed spec, e.g. `{ type: 'concept', title, body, accent? }`,
  `{ type: 'comparison', left, right }`, `{ type: 'activity', steps, timebox, output }`,
  `{ type: 'example', refImage, caption }`, `{ type: 'recap', lastTime, today }`. A `SlideRenderer`
  maps each spec to the existing templates in `templates.tsx`.
- **Escape hatch:** `{ type: 'custom', render: () => JSX }` for one-off rich slides, so we never lose
  the flexibility we have today.
- Why typed TS data over MDX: type-safety, the assistant edits plain objects, and it composes with the
  existing template components. MDX stays an option later for prose-heavy briefs.

### Layer 2, one source of truth for the plan
`src/content/course.ts` is the student-facing manifest (weeks, topics, exercises, dates, grading,
policies). It mirrors `.claude/memory/syllabus.md`. Keep them in sync deliberately: the assistant
updates both when a commitment changes, or we generate `course.ts` from `syllabus.md` in a small
script. The syllabus/schedule page renders from the manifest, so the site can never silently disagree
with what we promised.

### Layer 3, the information architecture
Routes (HashRouter, GitHub Pages friendly):
- `/` Course hub: title, the schedule (from the manifest), quick links, next deadline.
- `/syllabus` Full plan: goals, grading, policies, the product brief, week-by-week.
- `/week/:n` Week overview: topic, what you'll learn, the exercise, links to slides + resources.
- `/week/:n/slides` The deck player (today's Deck, fed from `weeks/week-N.ts`).
- `/assignment/:n` The brief as its own page (printable to the per-assignment PDF Dor wants).
- `/cheatsheet/:slug` Cheat sheets (keep CritiqueCheatSheet).

### Layer 4, components
Unchanged philosophy, made explicit: tokens (Tailwind config) → shadcn primitives → slide templates
(`templates.tsx`) → `SlideRenderer` (data to template) → page layouts (hub, week, assignment, syllabus).
All existing design rules hold: frameless slides, warm grey + single `#fcf403` yellow highlight, Geist
+ DM Serif Display, no dark mode, CSS transitions, no bespoke motif graphics, real attributed refs.

### Layer 5, student vs instructor
- **Student view** (default public): slides + overview + assignment + resources, no speaker notes.
- **Instructor/presenter view:** the current player with `SpeakerNotesWindow`. Gate by route
  (`/week/:n/present`) or a toggle. PDF export per week + per-assignment handout (matches Dor's
  cheat-sheet preference: full sheet + per-card PDF).

## Migration path (incremental, never breaks the live deck)
- **Phase 0 (schema + manifest): DONE 2026-06-07.** `src/content/types.ts`, `src/content/course.ts`
  (seeded from `syllabus.md`), and `src/content/SlideRenderer.tsx`. No change to existing decks.
- **Phase 1 (IA from the manifest): DONE 2026-06-07.** Course hub (`src/pages/Home.tsx`), `/syllabus`,
  `/week/:n` (`WeekOverview`), `/assignment/:n` (`Assignment`), all rendered from `course.ts`. All 13
  weeks navigable. Routing in `src/App.tsx`. Build passes (`pnpm build`).
- **Phase 2 (prove the data model):** port `week1` and `week9` slides from JSX to the slide-data
  schema as the reference implementation. Resolve the week7/week9 routing mismatch here.
- **Phase 3 (scaffold the semester):** generate stub `week-N.ts` for all weeks from the manifest, each
  with its known exercise brief, so the whole course is browsable. Fill slide content week by week.
- **Phase 4 (views + export):** student/instructor split, per-week and per-assignment PDF export.

## Single source of truth (enforced 2026-06-07)
One fact lives in one place, so the hub and the decks can't drift again:
- **Week identity** (number, topic, exercise, status) = the manifest `src/content/course.ts` only
  (mirrored by `.claude/memory/syllabus.md`).
- **Slides + notes** = the deck registry, **keyed by week number** (`deckByNumber(n)`), not a free-form
  slug or a hardcoded per-deck title. Route: `/week/:n/slides`.
- **"Has a deck"** is derived from the registry, never hand-set on the manifest.
- This fixed the drift Dor caught: the hub showed "Layouts Across a Flow" (week 9) while the deck there
  was the design sprint. The design sprint is now Week 7 (its real content); Week 9 is Layouts, unbuilt.

## Open decisions for Dor (also tracked in open-questions.md)
- What fills the 13th class (the official syllabus lists 12 topic weeks).
- Should `course.ts` be generated from `syllabus.md`, or maintained alongside it? (Currently: kept in
  sync by hand, both updated together.)
- Public student site now, or keep it instructor-only until content is fuller?

## Out of scope for this plan
Backend, auth, student submissions, analytics. This stays a static, fast, Pages-hosted site.
