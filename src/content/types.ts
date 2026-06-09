import type { ReactNode } from "react";

/* ──────────────────────────────────────────────────────────────
   The course content model. Weeks, assignments, and slides are
   DATA, not JSX, so they can be authored and reordered without
   touching component code. Slide specs are rendered to the existing
   templates by SlideRenderer.tsx. See deck/ARCHITECTURE.md.
   ────────────────────────────────────────────────────────────── */

/** A reference image (screenshot in public/refs/) with attribution. */
export type RefImg = {
  src?: string;
  caption: string;
  credit?: string;
  href?: string;
};

/**
 * A visual example: image, gif, video, or YouTube/Vimeo embed. `src` is a URL
 * or a local /refs file; `kind` is inferred from it but can be forced.
 */
export type MediaSpec = {
  src?: string;
  kind?: "image" | "video" | "embed";
  poster?: string;
  caption?: string;
  credit?: string;
  href?: string;
  aspect?: string;
  contain?: boolean;
};

/**
 * A slide spec. Each variant maps 1:1 to a template in slides/templates.tsx.
 * `custom` is the escape hatch for one-off rich slides (keeps full JSX power).
 */
export type Slide =
  | { type: "title"; course: string; title: string; subtitle?: string }
  | { type: "recap"; label?: string; points: ReactNode[] }
  | { type: "agenda"; title?: string; items: ReactNode[]; icon?: string }
  | {
      type: "concept";
      title: string;
      definition?: ReactNode;
      points?: ReactNode[];
      source?: ReactNode;
      icon?: string;
    }
  | {
      type: "comparison";
      title: string;
      left: { heading: string; body: ReactNode };
      right: { heading: string; body: ReactNode };
    }
  | {
      type: "breakout";
      minutes: string;
      mode?: string;
      steps: ReactNode[];
      link?: { label: string; href: string };
    }
  | {
      type: "checklist";
      title: string;
      intro?: ReactNode;
      groups: Array<{ label: string; items: ReactNode[] }>;
      source?: ReactNode;
    }
  | {
      type: "activity";
      index: number;
      title: string;
      minutes: string;
      method?: { label: string; href?: string };
      steps: ReactNode[];
      output: ReactNode;
      link?: { label: string; href: string };
      figure?: RefImg;
      icon?: string;
    }
  | { type: "divider"; title: string; pattern?: string }
  | {
      type: "resources";
      title?: string;
      links: Array<{ label: string; href: string; note?: string }>;
    }
  | { type: "gallery"; title: string; intro?: ReactNode; images: RefImg[] }
  | { type: "mediaSlide"; title?: string; intro?: ReactNode; media: MediaSpec; source?: ReactNode }
  | {
      type: "splitMedia";
      title: string;
      points: ReactNode[];
      media: MediaSpec;
      mediaLeft?: boolean;
    }
  | { type: "assignment"; title: string; whatToBuild: ReactNode[]; due?: string }
  | { type: "custom"; render: () => ReactNode };

/** A weekly home exercise / assignment brief. */
export type Assignment = {
  /** Short title shown on cards, e.g. "App Brief". */
  title: string;
  /** One-line framing of what they make and why it matters this week. */
  summary: string;
  format?: string;
  workMode?: string;
  duration?: string;
  /** Full brief sections (rendered on the assignment page). Optional for stubs. */
  sections?: Array<{ heading: string; body: ReactNode; bullets?: ReactNode[] }>;
  due?: string;
};

export type WeekStatus =
  | "not started"
  | "outlined"
  | "drafting"
  | "built"
  | "taught"
  | "revising";

/** One week of the course. */
export type Week = {
  /** Dor's working week number (1..13). */
  n: number;
  topic: string;
  /** What students will be able to do / what the class covers. */
  summary: string;
  exercise?: Assignment;
  /**
   * Whether this week has a built slide deck is NOT stored here, it is derived
   * from the deck registry (deckByNumber). One source of truth per fact.
   */
  /** True if source material exists in the Drive folder. */
  driveMaterial?: boolean;
  status: WeekStatus;
  resources?: Array<{ label: string; href: string; note?: string }>;
};

export type GradingComponent = {
  weight: string;
  label: string;
  who: "Individual" | "Pairs";
  detail: string;
};

export type CourseManifest = {
  title: string;
  term: string;
  institution: string;
  instructor: string;
  ta?: string;
  courseCode?: string;
  /** One-paragraph description of the real subject. */
  description: string;
  goals: string[];
  /** The continuous semester product. */
  product: { name: string; summary: string };
  grading: GradingComponent[];
  policies: Array<{ label: string; detail: string }>;
  weeks: Week[];
  resources: Array<{ label: string; href: string; note?: string }>;
};
