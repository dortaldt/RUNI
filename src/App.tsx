import { HashRouter, Routes, Route, Link, useParams } from "react-router-dom";
import { Deck } from "@/components/Deck";
import { decks, deckBySlug } from "@/decks";
import { AiCritiqueCheatSheet } from "@/pages/AiCritiqueCheatSheet";

const cheatSheets = [
  { slug: "ai-critique", title: "Critiquing an AI feature" },
];

function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-caption font-medium uppercase tracking-widest text-muted-foreground">
        RUNI · HCI
      </p>
      <h1 className="mt-2 font-serif text-h1 tracking-tight">
        Design Patterns and Systems
      </h1>
      <p className="mt-3 text-h3 font-normal text-muted-foreground">
        Course decks
      </p>
      <ul className="mt-8 divide-y rounded-xl border bg-card">
        {decks.map((d) => (
          <li key={d.slug}>
            <Link
              to={`/${d.slug}`}
              className="flex items-center justify-between px-6 py-4 text-body font-medium hover:bg-muted"
            >
              {d.title}
              <span className="text-muted-foreground">→</span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-caption font-medium uppercase tracking-widest text-muted-foreground">
        Cheat sheets
      </p>
      <ul className="mt-2 divide-y rounded-xl border bg-card">
        {cheatSheets.map((c) => (
          <li key={c.slug}>
            <Link
              to={`/cheatsheet/${c.slug}`}
              className="flex items-center justify-between px-6 py-4 text-body font-medium hover:bg-muted"
            >
              {c.title}
              <span className="text-muted-foreground">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

function DeckRoute() {
  const { slug } = useParams();
  const deck = slug ? deckBySlug(slug) : undefined;
  if (!deck) return <Home />;
  return <Deck slides={deck.slides} notes={deck.notes} />;
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cheatsheet/ai-critique" element={<AiCritiqueCheatSheet />} />
        <Route path="/:slug" element={<DeckRoute />} />
      </Routes>
    </HashRouter>
  );
}
