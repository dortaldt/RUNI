# Course Decks — "Design Patterns and Systems"

Web-based React decks for the RUNI HCI course. Built on Vite + React + TypeScript + Tailwind + shadcn/ui
conventions. The deck is itself a worked example of a design system: **tokens → components → slide templates**.

## Run
```bash
cd deck
pnpm install
pnpm dev        # http://localhost:5173
```

## How it's organized
- `src/styles/index.css` — **design tokens** (color, radius). Edit here to restyle every deck.
- `tailwind.config.js` — type scale + 8pt spacing tokens.
- `src/slides/templates.tsx` — reusable slide templates (TitleSlide, ConceptSlide, BreakoutSlide…).
- `src/components/Deck.tsx` — the player: keyboard nav (←/→), counter, PDF button.
- `src/decks/week1.tsx` — a week's deck (content only; styling comes from tokens/templates).
- `src/decks/index.ts` — register each week here → one route per deck (`/week-1`).

## Add a new week
1. Copy `src/decks/week1.tsx` → `weekN.tsx`, write the slides by composing templates.
2. Register it in `src/decks/index.ts`.

## Edit slides inline (and have it saved)
While running `pnpm dev`, open any deck and use the **⋮ menu → Edit slides** (pencil).
Every piece of text on the slide becomes click-to-edit:
- Click text, type your change, press **Enter** to save (**Esc** to cancel).
- The edit is written straight back to the source in `src/decks/*.tsx`, so it
  persists — Vite HMR re-renders the slide instantly. A toast confirms which file changed.
- If the same text appears in more than one place it's **refused** (toast shows why)
  rather than guessing — reword it to be unique, then edit.
- Dev-only: the Edit option is hidden in the production build.

Implementation: `plugins/slide-editor.ts` (dev endpoint `/__save-slide`) +
edit mode in `src/components/Deck.tsx` + `src/lib/saveSlide.ts`.

## Export a PDF for students
Open a deck, click **PDF** (or print the page) → "Save as PDF". The print stylesheet renders every slide
as its own page.

## Adding shadcn/ui components
This scaffold follows shadcn conventions (token CSS vars, `cn()` in `src/lib/utils.ts`, `@/` alias). To pull
real shadcn components later: `pnpx shadcn@latest init` then `pnpx shadcn@latest add button card …`.

## Design system
The authoritative spec lives in `../.claude/skills/course-designer/design-system.md`. Keep code and spec in sync.
