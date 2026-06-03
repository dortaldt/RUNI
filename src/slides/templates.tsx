import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────
   Slide templates = the deck's "components". Build a slide by
   composing these, never by hand-styling. Add new templates here
   and register them in design-system.md.
   ────────────────────────────────────────────────────────────── */

/** The 16:9 frame every slide lives in. */
export function Slide({
  children,
  className,
  center,
}: {
  children: ReactNode;
  className?: string;
  center?: boolean;
}) {
  return (
    <section
      className={cn(
        // 16:9 frame. If content is taller than the frame it scrolls
        // vertically (rather than clipping); in print it expands instead.
        "slide relative aspect-video w-full overflow-y-auto overflow-x-hidden bg-background px-12 py-10 print:aspect-auto print:min-h-[720px] print:overflow-visible",
        center && "flex flex-col items-center justify-center text-center",
        className,
      )}
    >
      {children}
    </section>
  );
}

/** Small muted label that sits above a slide title. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-caption font-medium uppercase tracking-widest text-muted-foreground">
      {children}
    </p>
  );
}

/** Source footnote, bottom of slide. */
export function Source({ children }: { children: ReactNode }) {
  return (
    <p className="absolute bottom-6 left-12 text-caption italic text-muted-foreground">
      {children}
    </p>
  );
}

/**
 * Left padding for a slide that carries a `SlideIcon`. Widens the gutter into a
 * "rail" so the (doubled-size) icon hangs fully visible to the left of the title
 * while the title and body shift right together and stay aligned with each other.
 * Keep in sync with SlideIcon's height (rail ≥ icon width + gap).
 */
export const ICON_RAIL = "pl-[9.5rem]";

/**
 * A small decorative line-art icon sized to sit inline to the LEFT of a slide
 * title (height ~matches the h2 cap height). Pass a root-relative `src`
 * (e.g. "/refs/whistle.png"); transparent PNGs sit cleanly on the background.
 * Purely decorative — hidden from screen readers by default. Use via the `icon`
 * prop on a title template, or `<TitleWithIcon>` for custom slides.
 */
export function SlideIcon({
  src,
  alt = "",
  className,
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  const resolvedSrc = src.startsWith("/")
    ? import.meta.env.BASE_URL.replace(/\/$/, "") + src
    : src;
  return (
    <img
      src={resolvedSrc}
      alt={alt}
      aria-hidden={alt === "" ? true : undefined}
      className={cn(
        "pointer-events-none h-[6.4rem] w-auto shrink-0 object-contain",
        className,
      )}
    />
  );
}

/**
 * A slide title (h2) with an optional decorative icon. The title stays flush with
 * the content's left edge; the icon hangs out into the left margin (overflowing
 * left) so it never pushes the title inward.
 */
export function TitleWithIcon({
  children,
  icon,
  className,
}: {
  children: ReactNode;
  icon?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      {icon && (
        <SlideIcon
          src={icon}
          className="absolute right-full top-1/2 -translate-y-1/2"
        />
      )}
      <h2 className="font-serif text-h2 tracking-tight">{children}</h2>
    </div>
  );
}

/** Highlighter mark - the brand yellow behind dark text. Use to spotlight words. */
export function Highlight({ children }: { children: ReactNode }) {
  return (
    <mark className="bg-accent px-1 text-accent-foreground decoration-clone">
      {children}
    </mark>
  );
}

export function TitleSlide({
  course,
  title,
  subtitle,
}: {
  course: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <Slide center>
      <Eyebrow>{course}</Eyebrow>
      <h1 className="mt-3 max-w-4xl font-serif text-h1 tracking-tight">{title}</h1>
      {subtitle && (
        <p className="mt-3 text-h3 font-normal text-muted-foreground">{subtitle}</p>
      )}
      <span className="mt-6 h-1 w-16 rounded-full bg-accent" />
    </Slide>
  );
}

export function RecapSlide({
  label = "Last time",
  points,
}: {
  label?: string;
  points: ReactNode[];
}) {
  return (
    <Slide>
      <Eyebrow>{label}</Eyebrow>
      <ul className="mt-4 space-y-3">
        {points.map((p, i) => (
          <li key={i} className="text-h3 font-normal text-muted-foreground">
            {p}
          </li>
        ))}
      </ul>
    </Slide>
  );
}

export function AgendaSlide({
  title,
  items,
  icon,
}: {
  title?: string;
  items: ReactNode[];
  icon?: string;
}) {
  return (
    <Slide className={icon ? ICON_RAIL : undefined}>
      <Eyebrow>Today</Eyebrow>
      {title && (
        <TitleWithIcon icon={icon} className="mt-2">
          {title}
        </TitleWithIcon>
      )}
      <ol className="mt-6 space-y-4">
        {items.map((item, i) => (
          <li key={i} className="flex items-baseline gap-3 text-h3">
            <span className="font-semibold text-foreground">{i + 1}.</span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </Slide>
  );
}

export function ConceptSlide({
  title,
  definition,
  points,
  source,
  icon,
}: {
  title: string;
  definition?: ReactNode;
  points?: ReactNode[];
  source?: ReactNode;
  icon?: string;
}) {
  return (
    <Slide className={icon ? ICON_RAIL : undefined}>
      <TitleWithIcon icon={icon}>{title}</TitleWithIcon>
      {definition && (
        <p className="mt-4 max-w-3xl text-h3 font-normal text-muted-foreground">
          {definition}
        </p>
      )}
      {points && (
        <ul className="mt-6 max-w-3xl space-y-2">
          {points.map((p, i) => (
            <li key={i} className="flex items-baseline gap-2 text-body">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      )}
      {source && <Source>{source}</Source>}
    </Slide>
  );
}

export function ComparisonSlide({
  title,
  left,
  right,
}: {
  title: string;
  left: { heading: string; body: ReactNode };
  right: { heading: string; body: ReactNode };
}) {
  return (
    <Slide>
      <h2 className="font-serif text-h2 tracking-tight">{title}</h2>
      <div className="mt-8 grid grid-cols-2 gap-10">
        {[left, right].map((col, i) => (
          <div key={i} className={i === 0 ? "border-r border-border pr-10" : ""}>
            <h3 className="text-h3 font-semibold">{col.heading}</h3>
            <div className="mt-3 text-body text-muted-foreground">{col.body}</div>
          </div>
        ))}
      </div>
    </Slide>
  );
}

export function BreakoutSlide({
  minutes,
  mode = "In pairs",
  steps,
  link,
}: {
  minutes: string;
  mode?: string;
  steps: ReactNode[];
  link?: { label: string; href: string };
}) {
  return (
    <Slide>
      <div className="flex items-center gap-3">
        <span className="rounded-md bg-accent px-3 py-1 text-caption font-semibold text-accent-foreground">
          ⏱ {minutes}
        </span>
        <Eyebrow>Breakout · {mode}</Eyebrow>
      </div>
      <ol className="mt-6 max-w-3xl space-y-3">
        {steps.map((s, i) => (
          <li key={i} className="flex items-baseline gap-3 text-body">
            <span className="font-semibold text-foreground">{i + 1}.</span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
      {link && (
        <a
          href={link.href}
          className="mt-6 inline-block text-body font-medium decoration-accent decoration-2 underline underline-offset-4"
        >
          {link.label}
        </a>
      )}
    </Slide>
  );
}

/** A dense, grouped checklist slide. Checkbox marks, multi-column, for "what to review" lists. */
export function ChecklistSlide({
  title,
  intro,
  groups,
  source,
}: {
  title: string;
  intro?: ReactNode;
  groups: Array<{ label: string; items: ReactNode[] }>;
  source?: ReactNode;
}) {
  return (
    <Slide className="flex flex-col">
      <h2 className="font-serif text-h2 tracking-tight">{title}</h2>
      {intro && <p className="mt-2 max-w-3xl text-body text-muted-foreground">{intro}</p>}
      <div className="mt-5 grid grid-cols-2 gap-x-10 gap-y-4">
        {groups.map((g, i) => (
          <div key={i}>
            <p className="text-caption font-semibold uppercase tracking-widest text-muted-foreground">
              {g.label}
            </p>
            <ul className="mt-2 space-y-1">
              {g.items.map((it, j) => (
                <li key={j} className="flex items-baseline gap-2 text-[1rem] leading-snug">
                  <span className="mt-1 h-3.5 w-3.5 shrink-0 rounded-[4px] border-2 border-foreground" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {source && (
        <p className="mt-auto pt-6 text-caption italic text-muted-foreground">{source}</p>
      )}
    </Slide>
  );
}

/** A timeboxed studio activity: a named method, numbered steps, and the output it should produce. */
export function ActivitySlide({
  index,
  title,
  minutes,
  method,
  steps,
  output,
  link,
  figure,
  icon,
}: {
  index: number;
  title: string;
  minutes: string;
  method?: { label: string; href?: string };
  steps: ReactNode[];
  output: ReactNode;
  link?: { label: string; href: string };
  // Optional reference visual shown beside the steps (right column).
  figure?: { src?: string; caption: string; credit?: string; href?: string };
  // Optional decorative line-art icon, left of the title. Hidden when a `figure`
  // is set (the figure already carries the visual).
  icon?: string;
}) {
  const body = (
    <>
      <ol className="mt-5 space-y-2">
        {steps.map((s, i) => (
          <li key={i} className="flex items-baseline gap-3 text-body">
            <span className="font-semibold text-foreground">{i + 1}.</span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
      <p className="mt-5 text-body">
        <span className="font-semibold">Output: </span>
        {output}
      </p>
    </>
  );
  const withIcon = !!icon && !figure;
  return (
    <Slide className={withIcon ? ICON_RAIL : undefined}>
      <div className="flex items-center gap-3">
        <Eyebrow>Activity {index}</Eyebrow>
        <span className="rounded-md bg-accent px-3 py-1 text-caption font-semibold text-accent-foreground">
          ⏱ {minutes}
        </span>
      </div>
      <TitleWithIcon icon={withIcon ? icon : undefined} className="mt-2">
        {title}
      </TitleWithIcon>
      {figure ? (
        <div className="mt-2 grid grid-cols-[1fr_minmax(0,40%)] items-start gap-10">
          <div className="max-w-2xl">{body}</div>
          <RefImage {...figure} />
        </div>
      ) : (
        <div className="max-w-3xl">{body}</div>
      )}
      <div
        className={cn(
          "absolute bottom-6 flex items-center gap-5 text-caption text-muted-foreground",
          withIcon ? "left-[9.5rem]" : "left-12",
        )}
      >
        {method && (
          <span>
            Method:{" "}
            {method.href ? (
              <a
                href={method.href}
                target="_blank"
                rel="noreferrer"
                className="decoration-accent decoration-2 underline underline-offset-2"
              >
                {method.label}
              </a>
            ) : (
              method.label
            )}
          </span>
        )}
        {link && (
          <a
            href={link.href}
            className="font-medium decoration-accent decoration-2 underline underline-offset-2"
          >
            {link.label}
          </a>
        )}
      </div>
    </Slide>
  );
}

export function DividerSlide({ title }: { title: string }) {
  return (
    <Slide center>
      <h2 className="font-serif text-display tracking-tight">{title}</h2>
    </Slide>
  );
}

export function ResourcesSlide({
  title = "Resources",
  links,
}: {
  title?: string;
  links: Array<{ label: string; href: string; note?: string }>;
}) {
  return (
    <Slide>
      <h2 className="font-serif text-h2 tracking-tight">{title}</h2>
      <ul className="mt-8 max-w-3xl space-y-4">
        {links.map((l, i) => (
          <li key={i}>
            <a
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="text-h3 font-semibold decoration-accent decoration-2 underline underline-offset-4"
            >
              {l.label}
            </a>
            {l.note && <p className="text-body text-muted-foreground">{l.note}</p>}
          </li>
        ))}
      </ul>
    </Slide>
  );
}

/**
 * A single reference visual. Drop a screenshot into deck/public/refs/ and pass
 * `src` (e.g. "/refs/capability-signaling.png"). Until then it renders a tidy
 * placeholder naming the file to add. Always attributes the source (Dribbble etc.).
 */
export function RefImage({
  src,
  caption,
  credit,
  href,
}: {
  src?: string;
  caption: string;
  credit?: string;
  href?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showImg = src && !failed;
  // Root-relative srcs (e.g. "/refs/foo.png") must be prefixed with Vite's base
  // URL or they 404 when deployed under a base path (e.g. GitHub Pages "/RUNI/").
  const resolvedSrc =
    src && src.startsWith("/")
      ? import.meta.env.BASE_URL.replace(/\/$/, "") + src
      : src;
  return (
    <figure className="flex flex-col">
      <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
        {showImg ? (
          <img
            src={resolvedSrc}
            alt={caption}
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-4 text-center">
            <span className="text-caption text-muted-foreground">
              drop screenshot →{" "}
              <code className="rounded bg-background px-1">
                {src ?? "public/refs/…"}
              </code>
            </span>
          </div>
        )}
      </div>
      <figcaption className="mt-2 text-caption text-muted-foreground">
        {caption}
        {credit && (
          <>
            {" · "}
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="decoration-accent decoration-2 underline underline-offset-2"
              >
                {credit}
              </a>
            ) : (
              credit
            )}
          </>
        )}
      </figcaption>
    </figure>
  );
}

/** A slide of 2-3 reference visuals (e.g. Dribbble shots) with attribution. */
export function GallerySlide({
  title,
  intro,
  images,
}: {
  title: string;
  intro?: ReactNode;
  images: Array<{ src?: string; caption: string; credit?: string; href?: string }>;
}) {
  return (
    <Slide>
      <h2 className="font-serif text-h2 tracking-tight">{title}</h2>
      {intro && <p className="mt-3 max-w-3xl text-body text-muted-foreground">{intro}</p>}
      <div
        className="mt-6 grid gap-6"
        style={{ gridTemplateColumns: `repeat(${images.length}, minmax(0, 1fr))` }}
      >
        {images.map((img, i) => (
          <RefImage key={i} {...img} />
        ))}
      </div>
    </Slide>
  );
}

export function AssignmentSlide({
  title,
  whatToBuild,
  due,
}: {
  title: string;
  whatToBuild: ReactNode[];
  due?: string;
}) {
  return (
    <Slide>
      <Eyebrow>Next assignment</Eyebrow>
      <h2 className="mt-2 font-serif text-h2 tracking-tight">{title}</h2>
      <ul className="mt-6 max-w-3xl space-y-2">
        {whatToBuild.map((p, i) => (
          <li key={i} className="flex items-baseline gap-2 text-body">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
      {due && <Source>Due: {due}</Source>}
    </Slide>
  );
}
