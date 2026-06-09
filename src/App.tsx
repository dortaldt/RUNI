import { HashRouter, Routes, Route, useParams } from "react-router-dom";
import { Deck } from "@/components/Deck";
import { deckByNumber } from "@/decks";
import { weekByNumber } from "@/content/course";
import { CritiqueCheatSheet } from "@/pages/CritiqueCheatSheet";
import { Home } from "@/pages/Home";
import { Syllabus } from "@/pages/Syllabus";
import { WeekOverview } from "@/pages/WeekOverview";
import { Assignment } from "@/pages/Assignment";
import { BrainDump } from "@/pages/BrainDump";

function DeckRoute() {
  const { n } = useParams();
  const num = n ? Number(n) : undefined;
  const deck = num ? deckByNumber(num) : undefined;
  if (!deck || !num) return <Home />;
  // Running dateline (single source of truth: the manifest). NYT-style furniture.
  const week = weekByNumber(num);
  const footer = [`Week ${num}`, week?.topic, "Dor Tal"].filter(Boolean).join(" · ");
  return <Deck slides={deck.slides} notes={deck.notes} footer={footer} />;
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/syllabus" element={<Syllabus />} />
        <Route path="/week/:n" element={<WeekOverview />} />
        <Route path="/week/:n/slides" element={<DeckRoute />} />
        <Route path="/assignment/:n" element={<Assignment />} />
        <Route path="/dbd" element={<BrainDump />} />
        <Route path="/cheatsheet/critique" element={<CritiqueCheatSheet />} />
      </Routes>
    </HashRouter>
  );
}
