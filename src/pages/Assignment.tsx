import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { weekByNumber } from "@/content/course";

/**
 * Render a plain string with tiny inline markdown: **bold** and [label](url).
 * Lets the brief content live as plain strings in the manifest (course.ts, a
 * .ts file with no JSX) while still showing bold leads and clickable links.
 * Non-string nodes pass through untouched.
 */
function renderInline(node: ReactNode): ReactNode {
  if (typeof node !== "string") return node;
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(node)) !== null) {
    if (m.index > last) out.push(node.slice(last, m.index));
    if (m[1] !== undefined) {
      out.push(<strong key={k++}>{m[1]}</strong>);
    } else {
      out.push(
        <a
          key={k++}
          href={m[3]}
          target="_blank"
          rel="noreferrer"
          className="font-medium underline decoration-2 underline-offset-2 hover:text-foreground"
        >
          {m[2]}
        </a>,
      );
    }
    last = re.lastIndex;
  }
  if (last < node.length) out.push(node.slice(last));
  return out;
}

export function Assignment() {
  const { n } = useParams();
  const num = Number(n);
  const week = weekByNumber(num);
  const a = week?.exercise;

  if (!week || !a) {
    return (
      <main className="mx-auto w-full max-w-3xl px-6 py-16">
        <Link to="/" className="text-caption font-medium text-muted-foreground hover:text-foreground">
          ← Course home
        </Link>
        <h1 className="mt-6 font-serif text-h2">No exercise for week {n}</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16 print:py-8">
      <div className="flex items-center justify-between print:hidden">
        <Link
          to={`/week/${week.n}`}
          className="text-caption font-medium text-muted-foreground hover:text-foreground"
        >
          ← Week {week.n}
        </Link>
        <button
          onClick={() => window.print()}
          className="rounded-md px-2.5 py-1.5 text-caption font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          Print / PDF
        </button>
      </div>

      <p className="mt-6 text-caption font-medium uppercase tracking-widest text-muted-foreground">
        Week {week.n} · {week.topic}
      </p>
      <h1 className="mt-2 font-serif text-h1 tracking-tight">{a.title}</h1>
      <p className="mt-4 text-body">{renderInline(a.summary)}</p>

      <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-3 text-body sm:grid-cols-3">
        {a.format && (
          <div>
            <dt className="text-caption uppercase tracking-widest text-muted-foreground">Format</dt>
            <dd className="mt-0.5">{a.format}</dd>
          </div>
        )}
        {a.workMode && (
          <div>
            <dt className="text-caption uppercase tracking-widest text-muted-foreground">Work mode</dt>
            <dd className="mt-0.5">{a.workMode}</dd>
          </div>
        )}
        {a.duration && (
          <div>
            <dt className="text-caption uppercase tracking-widest text-muted-foreground">Duration</dt>
            <dd className="mt-0.5">{a.duration}</dd>
          </div>
        )}
        {a.due && (
          <div>
            <dt className="text-caption uppercase tracking-widest text-muted-foreground">Due</dt>
            <dd className="mt-0.5">{a.due}</dd>
          </div>
        )}
      </dl>

      {a.sections && a.sections.length > 0 && (
        <section className="mt-10 space-y-6">
          {a.sections.map((s, i) => (
            <div key={i}>
              <h2 className="text-h3 font-semibold">{s.heading}</h2>
              {s.body && (
                <p className="mt-1 text-body text-muted-foreground">{renderInline(s.body)}</p>
              )}
              {s.bullets && (
                <ul className="mt-2 space-y-1.5">
                  {s.bullets.map((b, j) => (
                    <li key={j} className="flex items-baseline gap-2 text-body">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
                      <span>{renderInline(b)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
