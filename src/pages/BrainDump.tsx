import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { captures } from "@/content/captures";

/** Resolve a /refs path against the deployed base URL; pass remote URLs through. */
function asset(src: string) {
  if (/^https?:\/\//.test(src)) return src;
  return `${import.meta.env.BASE_URL.replace(/\/$/, "")}${src}`;
}

/** Display form of a tag: "navigation" → "Navigation". */
function labelOf(tag: string) {
  return tag.charAt(0).toUpperCase() + tag.slice(1);
}

function ShapedLink({ label, href }: { label: string; href: string }) {
  const cls =
    "font-medium text-foreground underline decoration-dotted underline-offset-2 hover:decoration-solid";
  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {label}
      </a>
    );
  }
  return (
    <Link to={href} className={cls}>
      {label}
    </Link>
  );
}

/** A rounded filter/label pill. `active` gets the yellow accent. */
function pillClass(active: boolean) {
  return `inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-caption font-medium transition-colors ${
    active
      ? "border-transparent bg-accent text-accent-foreground"
      : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
  }`;
}

export function BrainDump() {
  // Public captures, newest first (ISO dates sort lexicographically).
  const items = useMemo(
    () =>
      captures
        .filter((c) => c.public !== false)
        .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)),
    [],
  );

  // Every tag with how many captures use it, most-used first.
  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of items) for (const t of c.tags ?? []) counts.set(t, (counts.get(t) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [items]);

  const [active, setActive] = useState<string | null>(null);
  const shown = active ? items.filter((c) => c.tags?.includes(active)) : items;

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16 lg:py-24">
      <Link
        to="/"
        className="text-caption font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Home
      </Link>

      <p className="mt-6 text-caption font-medium uppercase tracking-widest text-muted-foreground">
        DBDs
      </p>
      <h1 className="mt-2 font-serif text-h1 tracking-tight">Dor's Brain Dump</h1>
      <p className="mt-6 max-w-3xl text-body text-muted-foreground">
        The raw material behind the course — thoughts and references caught during the day, before
        they're shaped into a lecture. Nothing here is polished. It's posted as-is so you can see
        where the ideas come from and how a stray observation becomes a slide.
      </p>

      {items.length === 0 ? (
        <p className="mt-16 text-body text-muted-foreground">Nothing captured yet.</p>
      ) : (
        <>
          {/* Filter by label */}
          {tags.length > 0 && (
            <div className="mt-10">
              <p className="text-caption font-medium uppercase tracking-widest text-muted-foreground">
                Filter by label
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  className={pillClass(active === null)}
                >
                  All
                  <span className="tabular-nums opacity-60">{items.length}</span>
                </button>
                {tags.map(([tag, n]) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => setActive((cur) => (cur === tag ? null : tag))}
                    className={pillClass(active === tag)}
                  >
                    {labelOf(tag)}
                    <span className="tabular-nums opacity-60">{n}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3">
            {shown.map((c) => (
              <article key={c.id} className="mb-5 break-inside-avoid rounded-xl border bg-card p-5">
                {c.images?.map((src) => (
                  <img
                    key={src}
                    src={asset(src)}
                    alt=""
                    loading="lazy"
                    className="mb-3 w-full rounded-lg border bg-muted"
                  />
                ))}

                <p className="whitespace-pre-wrap text-body">{c.note}</p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <time className="text-caption text-muted-foreground" dateTime={c.date}>
                    {c.date}
                  </time>
                  {c.tags?.map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setActive(t)}
                      title={`Filter by ${labelOf(t)}`}
                      className={`rounded-full border px-2 py-0.5 text-caption font-medium transition-colors ${
                        active === t
                          ? "border-transparent bg-accent text-accent-foreground"
                          : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {labelOf(t)}
                    </button>
                  ))}
                </div>

                {c.shapedInto && c.shapedInto.length > 0 && (
                  <div className="mt-3 border-t pt-3 text-caption">
                    <span className="text-muted-foreground">Shaped into </span>
                    {c.shapedInto.map((s, i) => (
                      <span key={s.href}>
                        {i > 0 ? ", " : ""}
                        <ShapedLink label={s.label} href={s.href} />
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
