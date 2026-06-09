import { Link } from "react-router-dom";
import { course } from "@/content/course";

/** Section heading used throughout the syllabus page. */
function H({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-12 font-serif text-h2 tracking-tight">{children}</h2>
  );
}

export function Syllabus() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16 print:py-8">
      <Link
        to="/"
        className="text-caption font-medium text-muted-foreground hover:text-foreground print:hidden"
      >
        ← Course home
      </Link>

      <p className="mt-6 text-caption font-medium uppercase tracking-widest text-muted-foreground">
        {course.institution} · {course.term}
      </p>
      <h1 className="mt-2 font-serif text-h1 tracking-tight">{course.title}</h1>
      <p className="mt-3 text-body text-muted-foreground">
        Instructor: {course.instructor}
        {course.ta ? ` · TA: ${course.ta}` : ""}
      </p>
      <p className="mt-6 text-body">{course.description}</p>

      <H>Course goals</H>
      <p className="mt-2 text-body text-muted-foreground">By the end, students can:</p>
      <ul className="mt-3 space-y-2">
        {course.goals.map((g, i) => (
          <li key={i} className="flex items-baseline gap-2 text-body">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
            <span>{g}</span>
          </li>
        ))}
      </ul>

      <H>The semester product</H>
      <p className="mt-2 text-body font-semibold">{course.product.name}</p>
      <p className="mt-1 text-body text-muted-foreground">{course.product.summary}</p>

      <H>Grading</H>
      <div className="mt-3 space-y-4">
        {course.grading.map((g, i) => (
          <div key={i}>
            <p className="text-body font-semibold">
              {g.weight} · {g.label}{" "}
              <span className="font-normal text-muted-foreground">({g.who})</span>
            </p>
            <p className="mt-1 text-body text-muted-foreground">{g.detail}</p>
          </div>
        ))}
      </div>

      <H>Weekly schedule</H>
      <ol className="mt-3 space-y-3">
        {course.weeks.map((w) => (
          <li key={w.n} className="flex items-baseline gap-3 text-body">
            <span className="w-8 shrink-0 font-semibold tabular-nums text-muted-foreground">
              {w.n}
            </span>
            <span>
              <Link
                to={`/week/${w.n}`}
                className="font-medium decoration-accent decoration-2 underline-offset-4 hover:underline print:no-underline"
              >
                {w.topic}
              </Link>
              {w.exercise && (
                <span className="text-muted-foreground"> · {w.exercise.title}</span>
              )}
            </span>
          </li>
        ))}
      </ol>

      <H>Policies</H>
      <div className="mt-3 space-y-3">
        {course.policies.map((p, i) => (
          <p key={i} className="text-body">
            <span className="font-semibold">{p.label}: </span>
            <span className="text-muted-foreground">{p.detail}</span>
          </p>
        ))}
      </div>

      <H>Resources</H>
      <ul className="mt-3 space-y-2">
        {course.resources.map((r, i) => (
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
    </main>
  );
}
