import type { ReactNode } from "react";
import { week1 } from "./week1";
import { week9 } from "./week9";

export type DeckDef = {
  slug: string;
  title: string;
  slides: ReactNode[];
  /** Optional speaker notes, one per slide (same index as `slides`). */
  notes?: string[];
};

/** Register each week's deck here. One route is generated per entry. */
export const decks: DeckDef[] = [week1, week9];

export const deckBySlug = (slug: string) => decks.find((d) => d.slug === slug);
