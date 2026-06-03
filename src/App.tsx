import { HashRouter, Routes, Route, Link, useParams } from "react-router-dom";
import { Deck } from "@/components/Deck";
import { decks, deckBySlug } from "@/decks";
import { CritiqueCheatSheet } from "@/pages/CritiqueCheatSheet";

const cheatSheets = [
  { slug: "critique", title: "Refine your work in progress" },
];

function IndexCard({ to, title }: { to: string; title: string }) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between gap-4 rounded-xl border bg-card px-6 py-5 text-body font-medium transition-colors hover:bg-muted"
    >
      {title}
      <span className="text-muted-foreground transition-transform group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  );
}

function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16 lg:py-24">
      <p className="text-caption font-medium uppercase tracking-widest text-muted-foreground">
        RUNI · HCI
      </p>
      <h1 className="mt-2 max-w-4xl font-serif text-h1 tracking-tight">
        Design Patterns and Systems
      </h1>
      <p className="mt-3 text-h3 font-normal text-muted-foreground">
        Course decks
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {decks.map((d) => (
          <IndexCard key={d.slug} to={`/${d.slug}`} title={d.title} />
        ))}
      </div>

      <p className="mt-12 text-caption font-medium uppercase tracking-widest text-muted-foreground">
        Cheat sheets
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cheatSheets.map((c) => (
          <IndexCard key={c.slug} to={`/cheatsheet/${c.slug}`} title={c.title} />
        ))}
      </div>
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
        <Route path="/cheatsheet/critique" element={<CritiqueCheatSheet />} />
        <Route path="/:slug" element={<DeckRoute />} />
      </Routes>
    </HashRouter>
  );
}
