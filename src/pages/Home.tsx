import { Link } from "react-router-dom";
import { course } from "@/content/course";
import type { WeekStatus } from "@/content/types";

const cheatSheets = [{ slug: "critique", title: "Refine your work in progress" }];

const STATUS_STYLE: Record<WeekStatus, string> = {
  "not started": "text-muted-foreground",
  outlined: "text-muted-foreground",
  drafting: "text-foreground",
  built: "text-accent-foreground bg-accent px-1.5 rounded",
  taught: "text-muted-foreground",
  revising: "text-foreground",
};

function logo() {
  return `${import.meta.env.BASE_URL.replace(/\/$/, "")}/refs/runi-logo.png`;
}

export function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16 lg:py-24">
      <div className="flex items-center gap-3">
        <img
          src={logo()}
          alt="Reichman University"
          className="h-7 w-auto opacity-60 [filter:invert(1)]"
        />
        <p className="text-caption font-medium uppercase tracking-widest text-muted-foreground">
          HCI
        </p>
      </div>

      <h1 className="mt-3 max-w-4xl font-serif text-h1 tracking-tight">{course.title}</h1>
      <p className="mt-3 text-h3 font-normal text-muted-foreground">
        {course.term} · {course.instructor}
        {course.ta ? ` · TA ${course.ta}` : ""}
      </p>
      <p className="mt-6 max-w-3xl text-body text-muted-foreground">{course.description}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/syllabus"
          className="rounded-lg border bg-card px-4 py-2 text-body font-medium transition-colors hover:bg-muted"
        >
          Full syllabus →
        </Link>
        <Link
          to="/dbd"
          className="rounded-lg border bg-card px-4 py-2 text-body font-medium transition-colors hover:bg-muted"
        >
          DBDs: Dor's Brain Dump →
        </Link>
      </div>

      <h2 className="mt-14 text-caption font-medium uppercase tracking-widest text-muted-foreground">
        Schedule
      </h2>
      <div className="mt-3 divide-y divide-border rounded-xl border bg-card">
        {course.weeks.map((w) => (
          <Link
            key={w.n}
            to={`/week/${w.n}`}
            className="group flex items-center gap-4 px-5 py-4 transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-muted"
          >
            <span className="w-12 shrink-0 font-serif text-h3 tabular-nums text-muted-foreground">
              {w.n}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-body font-medium">{w.topic}</span>
              {w.exercise && (
                <span className="block truncate text-caption text-muted-foreground">
                  Exercise: {w.exercise.title}
                </span>
              )}
            </span>
            <span className={`shrink-0 text-caption font-medium ${STATUS_STYLE[w.status]}`}>
              {w.status}
            </span>
            <span className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        ))}
      </div>

      <h2 className="mt-12 text-caption font-medium uppercase tracking-widest text-muted-foreground">
        Cheat sheets
      </h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cheatSheets.map((c) => (
          <Link
            key={c.slug}
            to={`/cheatsheet/${c.slug}`}
            className="group flex items-center justify-between gap-4 rounded-xl border bg-card px-6 py-5 text-body font-medium transition-colors hover:bg-muted"
          >
            {c.title}
            <span className="text-muted-foreground transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
