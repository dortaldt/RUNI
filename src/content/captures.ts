/* ──────────────────────────────────────────────────────────────
   DBDs — Dor's Brain Dump. The raw material behind the course:
   thoughts and visual references Dor captures in Apple Notes during
   the day (any note titled "RUNI brain*"), then the brain-dump skill
   triages into the memory engine and appends here as data.

   This file is APPEND-ONLY in spirit: each capture is a dated record
   with an immutable `id`. When a capture gets shaped into a lecture,
   add the destination to `shapedInto` rather than deleting it — the
   point of the page is to show the raw → shaped lineage (transparency).

   Images live in deck/public/refs/brain/ and are referenced as
   "/refs/brain/<file>". Newest captures render first (sorted by date).
   ────────────────────────────────────────────────────────────── */

export type Capture = {
  /** Stable slug, never reused. e.g. "2026-06-07-linear-empty-state". */
  id: string;
  /** ISO date the thought was captured (YYYY-MM-DD). Sorts the gallery. */
  date: string;
  /** Dor's raw words, cleaned from the note (plain text, line breaks kept). */
  note: string;
  /** Local image paths under /refs/brain/, in display order. */
  images?: string[];
  /** Loose tags Dor jotted (e.g. "content", "week5"), without the leading #. */
  tags?: string[];
  /** Where this capture turned into course content. Internal routes or URLs. */
  shapedInto?: Array<{ label: string; href: string }>;
  /** Set false to archive a capture without showing it publicly. Default: shown. */
  public?: boolean;
};

export const captures: Capture[] = [
  // Newest first. The brain-dump skill prepends real captures here.
  {
    id: "2026-06-07-flows-skeleton",
    date: "2026-06-07",
    note: "Flows are the skeleton of the experience — without it the UI is a shapeless skin.",
    images: ["/refs/brain/2026-06-07-flows-skeleton-1.jpg"],
    tags: ["flows", "navigation", "principle"],
    public: true,
  },
  {
    id: "2026-06-07-no-flowchart-for-show",
    date: "2026-06-07",
    note: "Never add a flow chart just for showing “process.”",
    tags: ["principle", "critique", "diagrams"],
    public: true,
  },
  {
    id: "2026-06-07-show-dont-tell",
    date: "2026-06-07",
    note: "Better show than tell.",
    tags: ["principle", "critique"],
    public: true,
  },
];
