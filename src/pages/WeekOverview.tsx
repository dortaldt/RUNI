import { Link, useParams } from "react-router-dom";
import { weekByNumber, course } from "@/content/course";
import { deckByNumber } from "@/decks";

export function WeekOverview() {
  const { n } = useParams();
  const num = Number(n);
  const week = weekByNumber(num);
  const hasSlides = !!deckByNumber(num);

  if (!week) {
    return (
      <main className="mx-auto w-full max-w-3xl px-6 py-16">
        <Link to="/" className="text-caption font-medium text-muted-foreground hover:text-foreground">
          ← Course home
        </Link>
        <h1 className="mt-6 font-serif text-h2">Week {n} not found</h1>
      </main>
    );
  }

  const prev = course.weeks.find((w) => w.n === num - 1);
  const next = course.weeks.find((w) => w.n === num + 1);

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <Link
        to="/"
        className="text-caption font-medium text-muted-foreground hover:text-foreground"
      >
        ← Course home
      </Link>

      <p className="mt-6 text-caption font-medium uppercase tracking-widest text-muted-foreground">
        Week {week.n}
      </p>
      <h1 className="mt-2 font-serif text-h1 tracking-tight">{week.topic}</h1>
      <p className="mt-4 text-body text-muted-foreground">{week.summary}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        {hasSlides && (
          <Link
            to={`/week/${week.n}/slides`}
            className="rounded-lg bg-foreground px-4 py-2 text-body font-medium text-background transition-opacity hover:opacity-90"
          >
            Open slides →
          </Link>
        )}
        {week.exercise && (
          <Link
            to={`/assignment/${week.n}`}
            className="rounded-lg border bg-card px-4 py-2 text-body font-medium transition-colors hover:bg-muted"
          >
            This week's exercise →
          </Link>
        )}
      </div>

      {week.exercise && (
        <section className="mt-12">
          <h2 className="text-caption font-medium uppercase tracking-widest text-muted-foreground">
            Exercise
          </h2>
          <p className="mt-2 text-h3 font-semibold">{week.exercise.title}</p>
          <p className="mt-1 text-body text-muted-foreground">{week.exercise.summary}</p>
        </section>
      )}

      {week.resources && week.resources.length > 0 && (
        <section className="mt-12">
          <h2 className="text-caption font-medium uppercase tracking-widest text-muted-foreground">
            Resources
          </h2>
          <ul className="mt-3 space-y-2">
            {week.resources.map((r, i) => (
              <li key={i} className="text-body">
                <a
                  href={r.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium decoration-accent decoration-2 underline underline-offset-4"
                >
                  {r.label}
                </a>
                {r.note && <span className="text-muted-foreground"> · {r.note}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav className="mt-16 flex items-center justify-between border-t border-border pt-6 text-body">
        {prev ? (
          <Link to={`/week/${prev.n}`} className="text-muted-foreground hover:text-foreground">
            ← Week {prev.n}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/week/${next.n}`} className="text-muted-foreground hover:text-foreground">
            Week {next.n} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}
