import type { ReactNode } from "react";
import { week1 } from "./week1";
import { week7 } from "./week7";
import { week9 } from "./week9";

/**
 * A deck is just the slides (+ optional notes) for a week, keyed to that week
 * by its number `n`. Everything else about the week, its topic, status, and
 * exercise, lives once in the manifest (content/course.ts). Keying by number
 * (not a free-form slug) is what keeps the deck and the manifest from drifting.
 */
export type DeckDef = {
  n: number;
  slides: ReactNode[];
  /** Optional speaker notes, one per slide (same index as `slides`). */
  notes?: string[];
};

/** Register each week's deck here. */
export const decks: DeckDef[] = [week1, week7, week9];

export const deckByNumber = (n: number) => decks.find((d) => d.n === n);
