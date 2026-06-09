import { useState, type ReactNode } from "react";
import {
  Slide,
  Eyebrow,
  Source,
  TitleSlide,
  AgendaSlide,
  ConceptSlide,
  ChecklistSlide,
  DividerSlide,
  SplitMediaSlide,
  Media,
  Highlight,
  Lead,
  TitleWithIcon,
} from "@/slides/templates";
import { asset } from "@/content/assets";

/**
 * Week 9: "The Flow Is a Story" (topic: layouts across a flow).
 * Tightened to the syllabus topic, cross-screen consistency and state
 * transitions, with a single spine: the flow is a film. Cold-open on a
 * customer message, start from the goal, judge the flow as a story (the arc,
 * with the Hook-loop coda), make many screens feel like one product (the
 * core), then make it real with a prototype (AI to go faster). Closes with the
 * final-presentation brief. Two running case studies carry every section,
 * Spotify (B2C) and Gong (B2B, and where the finals happen), so the class
 * follows the same two products the whole way through.
 *
 * Identity (number, topic, status) lives in the manifest (content/course.ts).
 * Visuals come from the asset registry (content/assets.ts). This file owns only
 * the slides + notes, keyed by `n`.
 */

// A small inline link for tool/resource names on the deck.
function A({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-medium decoration-accent decoration-2 underline underline-offset-2"
    >
      {children}
    </a>
  );
}

// The five story beats, placed as points on an arc (viewBox 1000 x 400).
// y is smaller toward the top, so the "Peak" sits highest. `side` is where the
// label sits relative to the node; `anchor` keeps edge labels inside the frame.
// The arc reads as one clean story (Freytag's pyramid); the Hook Model loop is
// its own coda slide later, so the arc itself stays pure narrative.
const ARC_BEATS: {
  k: string;
  g: string;
  d: string;
  eg: string;
  x: number;
  y: number;
  side: "above" | "below";
  anchor: "start" | "middle" | "end";
  accent?: boolean;
}[] = [
  {
    k: "Setup",
    g: "Entry & empty state",
    d: "Entry and the empty state. The user lands and asks: where am I, and what can I do here?",
    eg: "Spotify opens to a home built around you. Gong opens to your to-dos, the day's work waiting.",
    x: 60,
    y: 296,
    side: "above",
    anchor: "start",
  },
  {
    k: "Hook",
    g: "First action earns attention",
    d: "The first small action that earns attention before you ask for anything. Make it nearly free.",
    eg: "Spotify plays in one tap. Gong surfaces the one account that needs you today, before any digging.",
    x: 255,
    y: 250,
    side: "above",
    anchor: "middle",
  },
  {
    k: "Rising action",
    g: "Momentum, no friction",
    d: "The steps in between, with momentum and no friction. Every one moves them closer to the goal.",
    eg: "Skipping and liking to shape the mix. Opening the right account to work its follow-up.",
    x: 480,
    y: 178,
    side: "below",
    anchor: "middle",
  },
  {
    k: "Peak",
    g: "The payoff: the moment they remember",
    d: "The payoff: the one thing they came for, designed to land. This is the moment they remember.",
    eg: "Spotify: the song that fits perfectly. Gong: the follow-up's done, the deal keeps moving.",
    x: 700,
    y: 72,
    side: "above",
    anchor: "middle",
    accent: true,
  },
  {
    k: "Resolution",
    g: "Confirmation & one next step",
    d: "Confirmation that it worked, and one clear next step so they're never left at a dead end.",
    eg: "Spotify saves it to your library. Gong queues your next to-do.",
    x: 948,
    y: 206,
    side: "below",
    anchor: "end",
  },
];

// Smooth a polyline through its points (Catmull-Rom → cubic bézier) so the arc
// passes exactly through every beat node.
function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? pts[i + 1];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

const ARC_PATH = smoothPath(ARC_BEATS.map((b) => [b.x, b.y] as [number, number]));
const ARC_AREA = `${ARC_PATH} L 948 340 L 60 340 Z`;

/**
 * "Every flow has an arc." The arc draws itself on entry; click any beat to
 * load its definition (and a Spotify/Gong example) into the side panel.
 * Pure story, the Hook Model is its own slide later.
 */
function StoryArcSlide() {
  const [sel, setSel] = useState(0);
  const b = ARC_BEATS[sel];
  return (
    <Slide className="flex flex-col">
      <Eyebrow>The shape of a flow</Eyebrow>
      <TitleWithIcon className="mt-2">Every flow has an arc</TitleWithIcon>
      <p className="mt-2 max-w-3xl text-body text-muted-foreground">
        The same shape as a story: it climbs to a <Highlight>peak</Highlight>, then resolves. Click a
        beat to walk it, on Spotify and on Gong.
      </p>
      <div className="mt-3 grid min-h-0 flex-1 grid-cols-[1fr_23rem] items-center gap-7">
        {/* left: the arc, drawn trigger → goal */}
        <div className="flex h-full min-h-0 items-center">
          <svg
            viewBox="0 0 1000 400"
            preserveAspectRatio="xMidYMid meet"
            className="h-full w-full overflow-visible"
          >
            {/* area under the arc */}
            <path
              d={ARC_AREA}
              className="fill-muted arc-fade"
              fillOpacity={0.5}
              style={{ animationDelay: "1.15s" }}
            />
            {/* baseline = the journey, trigger to goal */}
            <line
              x1="48"
              y1="340"
              x2="962"
              y2="340"
              className="stroke-border arc-fade"
              strokeWidth={1.5}
            />
            {/* drop line at the peak */}
            <line
              x1="700"
              y1="72"
              x2="700"
              y2="340"
              className="stroke-accent arc-fade"
              strokeWidth={1.5}
              strokeDasharray="3 6"
              style={{ animationDelay: "1.3s" }}
            />
            {/* the arc — draws itself on entry */}
            <path
              d={ARC_PATH}
              pathLength={1}
              fill="none"
              className="stroke-foreground arc-draw"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* bookend captions */}
            <text
              x="56"
              y="364"
              className="fill-muted-foreground arc-fade"
              fontSize={14}
              fontStyle="italic"
              style={{ animationDelay: "0.2s" }}
            >
              the trigger
            </text>
            <text
              x="954"
              y="364"
              textAnchor="end"
              className="fill-muted-foreground arc-fade"
              fontSize={14}
              fontStyle="italic"
              style={{ animationDelay: "0.2s" }}
            >
              goal met
            </text>
            {/* the five beats — click to load into the side panel */}
            {ARC_BEATS.map((beat, i) => {
              const above = beat.side === "above";
              const nameY = above ? beat.y - (beat.accent ? 50 : 44) : beat.y + 36;
              const glossY = above ? beat.y - (beat.accent ? 26 : 24) : beat.y + 56;
              const delay = 0.15 + ((beat.x - 60) / 888) * 1.55;
              const isSel = i === sel;
              const active = beat.accent || isSel;
              const r = beat.accent ? 15 : 13;
              return (
                <g
                  key={beat.k}
                  className="arc-node arc-beat cursor-pointer"
                  style={{ animationDelay: `${delay}s` }}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSel(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSel(i);
                    }
                  }}
                >
                  {/* generous, invisible click target */}
                  <circle cx={beat.x} cy={beat.y} r={28} fill="transparent" />
                  {/* selected halo */}
                  {isSel && (
                    <circle
                      cx={beat.x}
                      cy={beat.y}
                      r={r + 7}
                      className="fill-none stroke-accent"
                      strokeWidth={2}
                    />
                  )}
                  <text
                    x={beat.x}
                    y={nameY}
                    textAnchor={beat.anchor}
                    className="fill-foreground font-serif"
                    fontSize={beat.accent ? 27 : 22}
                    fontWeight={beat.accent ? 600 : 500}
                  >
                    {beat.k}
                  </text>
                  <text
                    x={beat.x}
                    y={glossY}
                    textAnchor={beat.anchor}
                    className={active ? "fill-foreground" : "fill-muted-foreground"}
                    fontSize={15}
                  >
                    {beat.g}
                  </text>
                  <circle
                    cx={beat.x}
                    cy={beat.y}
                    r={r}
                    className={active ? "fill-accent" : "fill-background stroke-foreground"}
                    strokeWidth={active ? 0 : 1.5}
                  />
                  <text
                    x={beat.x}
                    y={beat.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className={active ? "fill-accent-foreground" : "fill-foreground"}
                    fontSize={beat.accent ? 15 : 13}
                    fontWeight={600}
                  >
                    {i + 1}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        {/* right: the selected beat. One flat card, caption-sized type so lines
            breathe in the narrow column. */}
        <aside className="flex h-full min-h-0 flex-col justify-center">
          <div key={sel} className="arc-panel rounded-xl border bg-card px-5 py-4">
            <div className="flex items-baseline gap-2.5">
              <span
                className={`font-serif text-h3 leading-none ${
                  b.accent ? "text-foreground" : "text-muted-foreground/40"
                }`}
              >
                {sel + 1}
              </span>
              <h3 className="font-serif text-h3 leading-none tracking-tight">{b.k}</h3>
            </div>
            <p className="mt-3 text-caption leading-relaxed text-muted-foreground">{b.d}</p>
            <div className="mt-3.5 border-t border-border pt-3.5">
              <p className="text-caption leading-relaxed">
                <strong className="text-foreground">e.g.</strong> {b.eg}
              </p>
            </div>
          </div>
          <p className="mt-2.5 text-[0.7rem] italic text-muted-foreground">
            Story arc (Freytag's pyramid)
          </p>
        </aside>
      </div>
    </Slide>
  );
}

/**
 * The arc made concrete in one real product: the gif plays the flow while the
 * four visible beats (Setup → Rising action → Peak → Resolution) are named
 * beside it. Used right after the abstract arc so students see the same shape
 * in a tool they know.
 */
function FlowExampleSlide({
  eyebrow,
  title,
  lead,
  media,
  beats,
  job,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  media: Parameters<typeof Media>[0];
  beats: { beat: string; desc: string; accent?: boolean }[];
  // Optional Jobs-to-be-Done sentence (the trigger slide's template), shown as the goal
  // the arc climbs toward, so the story reads as the delivery of one job.
  job?: { when: string; want: string; outcome: ReactNode };
}) {
  return (
    <Slide className="flex flex-col">
      <Eyebrow>{eyebrow}</Eyebrow>
      <TitleWithIcon className="mt-2">{title}</TitleWithIcon>
      <p className="mt-2 max-w-3xl text-body text-muted-foreground">{lead}</p>
      <div className="mt-4 grid min-h-0 flex-1 grid-cols-[1fr_minmax(0,54%)] items-center gap-9">
        <div className="flex flex-col gap-5">
          {job && (
            <div className="border-b border-border pb-4">
              <span className="text-caption font-semibold uppercase tracking-wider text-muted-foreground">
                The job
              </span>
              <p className="mt-1.5 text-body leading-snug">
                <span className="text-muted-foreground">When</span>{" "}
                <Highlight>{job.when}</Highlight>
                <span className="text-muted-foreground">, I want to</span>{" "}
                <Highlight>{job.want}</Highlight>
                <span className="text-muted-foreground">, so I can</span>{" "}
                <Highlight>{job.outcome}</Highlight>
                <span className="text-muted-foreground">.</span>
              </p>
            </div>
          )}
          <ol className="flex flex-col gap-3">
            {beats.map((b, i) => (
              <li key={i} className="flex items-baseline gap-3">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-caption font-semibold ${
                    b.accent
                      ? "bg-accent text-accent-foreground"
                      : "border border-foreground text-foreground"
                  }`}
                >
                  {i + 1}
                </span>
                <div>
                  <span
                    className={`text-caption font-semibold uppercase tracking-wider ${
                      b.accent ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {b.beat}
                  </span>
                  <p className="text-body leading-snug">{b.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="flex h-full min-h-0 items-center justify-center">
          <Media {...media} fitHeight className="max-h-full" />
        </div>
      </div>
    </Slide>
  );
}

export const week9 = {
  n: 9,
  slides: [
    <TitleSlide
      course="Design Patterns and Systems · Week 9"
      title="The Flow Is a Story"
      subtitle="Designing the whole journey, screen to screen"
      illustration="/refs/protagonist.svg"
      illustrationAlt="The protagonist of the flow, mid-journey through the landscape"
    />,

    // Cold open: the journey starts out in the user's life, with one customer
    // message and the app still closed. The trigger slide ("It's a bit
    // triggering") picks this exact message back up and turns it into a job.
    <Slide className="flex flex-col items-center justify-center text-center">
      <Eyebrow>Tuesday, 9:12 · a message to Sarah's bakery</Eyebrow>
      <h2 className="mt-4 max-w-4xl text-balance font-serif text-h1 tracking-tight">
        "Can you do a gluten-free cake for Saturday?"
      </h2>
      <p className="mt-6 max-w-4xl text-balance text-h3 font-normal text-muted-foreground">
        The journey has already started. Sarah's app isn't open yet.
      </p>
    </Slide>,

    // Recap the most recent class — the in-class redesign workshop
    // (interface inventory + heuristic eval). The PNC button inventory image
    // points straight back to that deck.
    <Slide>
      <Eyebrow>Last time</Eyebrow>
      <div className="mt-4 grid grid-cols-[1fr_minmax(0,44%)] items-center gap-10">
        <ul className="space-y-3">
          {[
            <>
              The <strong>in-class redesign workshop</strong>: an interface inventory and a heuristic eval on your own product
            </>,
            <>By now you're stringing screens into flows. Today we make a sequence of screens read as one journey</>,
          ].map((p, i) => (
            <li key={i} className="text-h3 font-normal text-muted-foreground">
              {p}
            </li>
          ))}
        </ul>
        <Media
          src="/refs/pnc-button-inventory.jpg"
          contain
          caption="Your interface inventory from the workshop"
          credit="Brad Frost, PNC"
          href="https://bradfrost.com/blog/post/interface-inventory/"
        />
      </div>
    </Slide>,

    <AgendaSlide
      title="Today"
      items={[
        <>Start from the <strong>goal</strong>, and map the path low-fi</>,
        <>A flow is a <strong>story</strong>: setup to payoff</>,
        <>Make many screens feel like <strong>one product</strong></>,
        <>Prototype it to <strong>feel</strong> the flow (with AI to go faster)</>,
        <>Your <strong>final presentation</strong>: the brief</>,
      ]}
    />,

    <Slide>
      <div className="grid grid-cols-[1fr_minmax(0,46%)] items-center gap-10">
        <div>
          <TitleWithIcon>When is a flow actually good?</TitleWithIcon>
          <Lead className="mt-4 max-w-xl">
            {[
              <>A flow can fail while every screen in it is excellent.</>,
              <>
                A good flow passes <Highlight>three tests</Highlight>, and they are the plan for
                today.
              </>,
            ]}
          </Lead>
          <ul className="mt-6 max-w-2xl space-y-2">
            {[
              <>
                It starts from the user's <strong>goal</strong>, the reason they opened the app at all
              </>,
              <>
                It moves like a <strong>story</strong>: a setup, a payoff, a clean ending
              </>,
              <>
                It feels like <strong>one product</strong> across every screen
              </>,
            ].map((p, i) => (
              <li key={i} className="flex items-baseline gap-2 text-body">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <Media {...asset("week9.flowDemo")} aspect="16/10" />
      </div>
    </Slide>,

    // ── Part 1: start from the goal, map low-fi ───────────────────
    <DividerSlide title="Start from the end" />,

    // The trigger & the job, merged — the trigger lives out in their life
    // (the cold-open message, picked back up here), and the job names what
    // they came for.
    <Slide>
      <div className="grid grid-cols-[1fr_minmax(0,38%)] items-center gap-10">
        <div>
          <h2 className="font-serif text-h2 tracking-tight">It's a bit triggering</h2>
          <Lead className="mt-4">
            {[
              <>
                The journey starts in the user's life, before your app opens, with a{" "}
                <strong className="text-foreground">trigger</strong>.
              </>,
              <>
                Write the goal as a job:{" "}
                <Highlight>When [situation], I want to [motivation], so I can [outcome].</Highlight>
              </>,
            ]}
          </Lead>
          <ul className="mt-6 max-w-2xl space-y-2">
            {[
              <>
                "When a customer asks 'gluten-free cake for Saturday?', Sarah wants to quote a price in under a minute, <strong>so she answers before they ask another baker</strong>"
              </>,
              <>
                The <strong>"when"</strong> sets where the flow starts; the <strong>"so I can"</strong> sets when it's done. Design backward from that end
              </>,
              <>
                Same shape for any job: "When stock runs low, I want a heads-up, so I can reorder before I sell out"
              </>,
            ].map((p, i) => (
              <li key={i} className="flex items-baseline gap-2 text-body">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          {/* In-flow citation, not the absolute <Source>: this column is tall and
              vertically centered, so a bottom-pinned source overlaps the last bullet. */}
          <p className="mt-6 text-caption italic text-muted-foreground">
            Jobs to be Done (Christensen; Nick Babich, UX Planet, 2022)
          </p>
        </div>
        <Media {...asset("week9.customerMessage")} aspect="3/4" />
      </div>
    </Slide>,

    // Map the path low-fi — folds the old "screens in sequence",
    // "checkout chart", and "tools" slides into one. Checkout as the visual.
    <Slide className="flex flex-col">
      <h2 className="font-serif text-h2 tracking-tight">Map the path before the pixels</h2>
      <div className="mt-6 grid min-h-0 flex-1 grid-cols-[1fr_minmax(0,42%)] items-stretch gap-12">
        <div className="flex max-w-md flex-col justify-center gap-5">
          <Lead>
            {[
              <>Before you design a single screen, sketch the route.</>,
              <>
                Boxes are screens, diamonds are decisions, start at the{" "}
                <strong className="text-foreground">trigger</strong>, end at the{" "}
                <strong className="text-foreground">goal met</strong>.
              </>,
            ]}
          </Lead>
          <ul className="space-y-2">
            {[
              <>
                The stakes: about <strong>70% of online carts are abandoned</strong>, and a long or complicated checkout is a top documented reason
              </>,
              <>
                This checkout has two branches that decide everything: <strong>signed in or guest</strong>, <strong>payment approved or not</strong>
              </>,
              <>
                Same shape in B2B: convert a lead, open the opportunity, move the stage, close
              </>,
              <>
                Label every arrow with the action, name screens the way users see them, keep it rough. The tool barely matters
              </>,
            ].map((p, i) => (
              <li key={i} className="flex items-baseline gap-2 text-body">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <p className="text-caption italic text-muted-foreground">
            Baymard Institute, cart abandonment rate statistics (2026)
          </p>
        </div>
        <div className="flex min-h-0 items-center justify-center">
          <Media {...asset("week9.checkoutFlow")} fitHeight className="max-h-full" />
        </div>
      </div>
    </Slide>,

    <Slide>
      <h2 className="font-serif text-h2 tracking-tight">Stay low-fidelity while you shape it</h2>
      <div className="mt-6 grid grid-cols-[1fr_minmax(0,44%)] items-center gap-12">
        <div>
          <Lead className="max-w-xl">
            Work in wireframes and grey boxes while the flow is still moving. Polish last.
          </Lead>
          <ul className="mt-6 space-y-2">
            {[
              "Grey boxes are quick to throw away, so you keep exploring options",
              <>
                Staying rough keeps you from <Highlight>falling in love</Highlight> with one
                solution too early
              </>,
              <>A polished screen looks finished, so <strong>people stop questioning it</strong></>,
              <>You see the <strong>whole flow</strong> before the details of any one screen</>,
            ].map((p, i) => (
              <li key={i} className="flex items-baseline gap-2 text-body">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <Media {...asset("week9.wireframe")} />
      </div>
    </Slide>,

    // ── Part 2: a flow is a story ─────────────────────────────────
    <DividerSlide title="A flow is a story" />,

    <StoryArcSlide />,

    <FlowExampleSlide
      eyebrow="The arc in a real flow · Spotify"
      title="Spotify, start to playing"
      lead="The same five beats from the arc, in a product you know by heart, and they all serve one job."
      media={asset("week9.spotifyFlow")}
      job={{
        when: "I sit down to work and the silence is distracting",
        want: "put on something that fits the moment in one move",
        outcome: <><strong>drop into focus instead of hunting for music</strong></>,
      }}
      beats={[
        { beat: "Setup", desc: "Home, built around you: what do you want? Maybe this?" },
        { beat: "Hook", desc: "Hit play in one tap, no setup, no commitment." },
        { beat: "Rising action", desc: "Find a nice playlist; skip and like to shape it." },
        { beat: "Peak", desc: "Pick the song that fits perfectly.", accent: true },
        { beat: "Resolution", desc: "It's playing and saved, with more songs queued up." },
      ]}
    />,

    <FlowExampleSlide
      eyebrow="The arc in a real flow · Gong"
      title="Gong, to-do to done"
      lead="The same arc in a B2B tool, the one you'll present in. Four screens, one job, one story."
      media={asset("week9.gongFlow")}
      job={{
        when: "an important account needs a follow-up",
        want: "be reminded and complete the task in one place",
        outcome: <><strong>follow up on time and keep the deal moving</strong></>,
      }}
      beats={[
        { beat: "Setup", desc: "My to-dos: the day's work, waiting." },
        { beat: "Rising action", desc: "Find the right account and open it." },
        { beat: "Peak", desc: "Complete the task.", accent: true },
        { beat: "Resolution", desc: "Success, and the next to-do is ready." },
      ]}
    />,

    <Slide>
      <div className="grid grid-cols-[1fr_minmax(0,42%)] items-center gap-10">
        <div>
          <h2 className="font-serif text-h2 tracking-tight">
            "There it is. That's what I came for."
          </h2>
          <p className="mt-4 max-w-2xl text-h3 font-normal text-muted-foreground">
            People remember a journey by its best moment and its ending. Design the peak, then the
            exit.
          </p>
          <ul className="mt-6 max-w-2xl space-y-2">
            {[
              <>
                Find the <strong>peak</strong> (the payoff) and make it land. Spotify's is the song that fits; Asana fires off the celebration creatures when you clear your tasks
              </>,
              "End on confirmation and a clear next step",
              "A rough middle is forgivable. A weak peak or a dead-end ending is what they'll remember",
            ].map((p, i) => (
              <li key={i} className="flex items-baseline gap-2 text-body">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-caption italic text-muted-foreground">
            Peak-End Rule (Kahneman); Laws of UX (lawsofux.com/peak-end-rule)
          </p>
        </div>
        <Media {...asset("week9.asanaPeak")} />
      </div>
    </Slide>,

    // Coda to the arc: the resolution plants the next trigger, so the story
    // loops. This is the slide the arc's speaker note promises.
    <ConceptSlide
      title="The ending plants the next trigger"
      definition={<>Flows people return to run a <strong>loop</strong>: trigger → action → reward → investment. The resolution is where you set up the next pass.</>}
      points={[
        <>
          Spotify: saving the song is an <strong>investment</strong>. The library and the mixes get better, so tomorrow starts one tap closer
        </>,
        <>
          Gong: the resolution queues the <strong>next to-do</strong>. Today's ending is tomorrow's trigger
        </>,
        <>
          Walk your own resolution and ask: <Highlight>what brings them back?</Highlight>
        </>,
      ]}
      source={<>The Hook Model: Nir Eyal, <em>Hooked: How to Build Habit-Forming Products</em> (2014)</>}
    />,

    // ── Part 3: make many screens feel like one (the core) ────────
    <DividerSlide title="Make many screens feel like one" />,

    // Continuity of layout — the shell. First of the three layers,
    // and where the design system pays off (callback to Week 7). Merges the old
    // concept + gallery into one.
    <Slide className="flex flex-col">
      <Eyebrow>Continuity of layout</Eyebrow>
      <TitleWithIcon className="mt-2">Same shell, every screen</TitleWithIcon>
      <p className="mt-2 max-w-4xl text-body text-muted-foreground">
        Continuity has three layers: the{" "}
        <strong className="text-foreground">shell</strong> that holds, the{" "}
        <strong className="text-foreground">information</strong> you carry, the{" "}
        <strong className="text-foreground">space</strong> that connects. Start with the shell: the
        nav and header stay put while the content changes underneath.
      </p>
      <div className="mt-5 grid min-h-0 flex-1 grid-cols-2 items-center gap-8">
        <Media {...asset("week9.gongTodos")} />
        <Media {...asset("week9.gongDeals")} />
      </div>
    </Slide>,

    <ConceptSlide
      title={'"Wait, didn\'t I already tell you that?"'}
      definition={<><strong>Continuity</strong> of information: each screen remembers what the last one did. Carry it forward so people never re-enter or re-decide.</>}
      points={[
        <>
          Keep what they picked visible across the steps. On Spotify the <strong>song keeps playing</strong> while you browse, the context travels with you
        </>,
        <><strong>Show progress</strong> so they know where they are in the journey</>,
        <>
          Recognition over recall: <strong>carry the context</strong> so they don't have to remember it. Gong keeps your recent accounts a click away
        </>,
      ]}
    />,

    <SplitMediaSlide
      title="Continuity in motion"
      points={[
        <>
          <strong>Continuity of space</strong>: transitions connect screens, so the flow feels like one continuous place
        </>,
        <>
          A shared element that <strong>moves</strong> keeps the user oriented, like Spotify's player bar expanding into the full-screen player
        </>,
        "Reserve the space so the layout holds steady when content loads",
      ]}
      media={asset("week9.transition")}
    />,

    <SplitMediaSlide
      title={'"First time here, I had no idea what to do"'}
      points={[
        <>
          The same flow is a <strong>different journey</strong> the first time, when it's empty, and when something breaks. Design each state
        </>,
        <>
          Treat empty, loading, error, and success as scenes: Spotify's empty library and offline mode, Gong's empty pipeline and a failed save
        </>,
        "Design the first run on purpose. It's the only first impression you get",
      ]}
      media={asset("week9.stateByState")}
    />,

    // ── Part 4: make it real (prototype + AI) ─────────────────────
    <DividerSlide title="Make it real" />,

    <Slide>
      <div className="grid grid-cols-[1fr_minmax(0,46%)] items-center gap-10">
        <div>
          <h2 className="font-serif text-h2 tracking-tight">Prototype it to feel the flow</h2>
          <p className="mt-4 max-w-2xl text-h3 font-normal text-muted-foreground">
            Static screens take you to a point: the layout, the hierarchy, the look of each step. To
            test the flow itself, you need an <Highlight>interactive prototype</Highlight> you can
            click through.
          </p>
          <ul className="mt-6 max-w-2xl space-y-2">
            {[
              "Make it clickable: real taps, real transitions, the dead ends exposed",
              <>
                Walk it end to end and ask: does it have <strong>momentum</strong>, or does it stall?
              </>,
              "Static screens prove the layout works. A clickable prototype is how you prove the flow works",
            ].map((p, i) => (
              <li key={i} className="flex items-baseline gap-2 text-body">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <Media {...asset("week9.emailPrototype")} />
      </div>
    </Slide>,

    <ChecklistSlide
      title="AI gets you to a prototype faster"
      intro="Describe your flow in plain language, get clickable screens back in minutes. Use the speed to explore three versions, then commit to one, and treat what comes back as version zero. This course allows AI (Option A). Lean on it, then own the decisions."
      groups={[
        {
          label: "Tools that build it for you",
          items: [
            <>
              <A href="https://www.figma.com/make/"><strong>Figma Make</strong></A>. Describe a flow, get a working prototype inside Figma, closest to your design file
            </>,
            <>
              <A href="https://v0.app/"><strong>v0 (Vercel)</strong></A>. Prompt to UI, clean React and Tailwind output for web
            </>,
            <>
              <A href="https://lovable.dev/"><strong>Lovable</strong></A> / <A href="https://bolt.new/"><strong>Bolt</strong></A>. Prompt to a full, hosted app with a shareable link
            </>,
            <>
              <A href="https://claude.ai/"><strong>Claude</strong></A>. Describe a flow in chat, get a clickable prototype you refine by talking
            </>,
          ],
        },
        {
          label: "How to get good output",
          items: [
            <>
              <strong>Give it the job and your screen list.</strong> Paste your JTBD sentence and name each screen
            </>,
            <>
              <strong>Feed it your tokens.</strong> Your colors and type, so it looks like your product
            </>,
            <>
              <strong>One flow, end to end.</strong> Beats ten half-built screens
            </>,
            <>
              <strong>Ask for the states.</strong> Empty, loading, error, success
            </>,
            <>
              <strong>Click it, feel the friction,</strong> then make the call. You own the design
            </>,
          ],
        },
      ]}
      source={<>Course AI policy: Option A, unrestricted use. The tools draft; you decide.</>}
    />,

    <DividerSlide title="Questions?" />,

    // ── Part 5: the final presentation brief ──────────────────────
    <DividerSlide title="Your final presentation" />,

    // The running order + the time box. Maps 1:1 onto the lecture
    // spine: idea → system → one flow → decisions.
    <Slide className="flex flex-col">
      <Eyebrow>Your final presentation · both partners</Eyebrow>
      <div className="mt-2 flex items-end justify-between border-b border-rule pb-3">
        <h2 className="font-serif text-h2 tracking-tight">Tell the story of your product</h2>
        <span className="shrink-0 rounded-md bg-accent px-3 py-1 text-caption font-semibold text-accent-foreground">
          ⏱ 10 min / pair
        </span>
      </div>
      <p className="mt-4 max-w-3xl text-body text-muted-foreground">
        Four parts, in order, the same spine we used all class. Ten minutes is short, so spend most
        of it on the <strong className="text-foreground">flow</strong> and keep the rest tight.
      </p>
      <ol className="mt-6 space-y-4">
        {[
          {
            t: "The idea & quick background",
            m: "~1.5 min",
            d: "What the product is and who it's for, the persona and the job it does, and why it exists. Keep it fast.",
          },
          {
            t: "Your design system, shown",
            m: "~2.5 min",
            d: "Tokens, components, states, and the rules you set. Show it on screen, walk us through it.",
          },
          {
            t: "One major flow, start to end",
            m: "~5 min",
            d: "The heart of the talk. Walk us through the flow and click the prototype through it. Trigger to payoff.",
          },
          {
            t: "The decisions",
            m: "~1 min",
            d: "The key tradeoffs, and what critique changed along the way.",
          },
        ].map((s, i) => (
          <li key={i} className="flex items-baseline gap-4">
            <span className="font-semibold text-foreground">{i + 1}.</span>
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-h3 font-semibold">{s.t}</span>
                <span className="text-caption font-medium uppercase tracking-wider text-muted-foreground">
                  {s.m}
                </span>
              </div>
              <p className="mt-1 text-body text-muted-foreground">{s.d}</p>
            </div>
          </li>
        ))}
      </ol>
      <a
        href="#/assignment/9"
        className="mt-5 inline-block text-body font-medium decoration-accent decoration-2 underline underline-offset-4"
      >
        Read the full brief →
      </a>
    </Slide>,

    <ChecklistSlide
      title="What 'done' looks like"
      intro="Bring all of it. This is the whole semester, told as one story in 10 minutes."
      groups={[
        {
          label: "Idea & background",
          items: [
            <>What the product <strong>is</strong> and <strong>who</strong> it's for</>,
            "The persona and the job it does",
            "Why it exists",
          ],
        },
        {
          label: "Design system",
          items: [
            <><strong>Basics</strong>: color, type, spacing</>,
            <>Core <strong>components</strong> with their states</>,
            <>The <strong>rules</strong>, and how you built it</>,
          ],
        },
        {
          label: "The one flow",
          items: [
            <>The full critical flow, <strong>end to end</strong></>,
            "A clickable prototype, walked end to end",
            "More states: empty, loading, error, success",
          ],
        },
        {
          label: "The talk",
          items: [
            "10 minutes, timed (per pair)",
            "Both partners present",
            "Slide deck ready, Figma open before you start",
          ],
        },
      ]}
      source={
        <>
          This is your 60% final. Pairs.{" "}
          <A href="https://m3.material.io/">Material Design 3</A> in Figma
        </>
      }
    />,

    // Logistics + map. Maps embed renders via the Media `embed` kind (iframe).
    <Slide className="flex flex-col">
      <Eyebrow>Final presentation · when and where</Eyebrow>
      <TitleWithIcon className="mt-2">See you at Gong</TitleWithIcon>
      <div className="mt-6 grid grid-cols-[1fr_minmax(0,46%)] items-start gap-10">
        <div>
          <p className="text-h3 font-normal text-muted-foreground">
            <Highlight>Wednesday, July 8</Highlight>
          </p>
          <p className="mt-3 text-display font-serif tracking-tight">15:45</p>
          <div className="mt-6 space-y-1 text-body">
            <p className="font-semibold">Gong · Icon Tower</p>
            <p>Menachem Begin Rd, Ramat Gan</p>
            <p className="text-muted-foreground">Floor 22 (Sia)</p>
          </div>
          <p className="mt-6 max-w-md text-body text-muted-foreground">
            Come ready to present. Bring your Figma link open and your talk rehearsed.
          </p>
        </div>
        <Media
          kind="embed"
          src="https://www.google.com/maps?q=Icon+Tower,+Menachem+Begin+Rd,+Ramat+Gan&output=embed"
          aspect="3/4"
          caption="Gong · Icon Tower, Ramat Gan"
        />
      </div>
    </Slide>,

    <Slide>
      <Eyebrow>Between now and July 8</Eyebrow>
      <h2 className="mt-2 font-serif text-h2 tracking-tight">Get the journey ready</h2>
      <ul className="mt-6 max-w-3xl space-y-2">
        {[
          <>
            Finish the flow <strong>end to end</strong>, every state, no gaps
          </>,
          <>
            Walk it as a story: does it have a clear <strong>goal, peak, and ending</strong>?
          </>,
          <>
            <Highlight>Rehearse out loud and time it to 10 minutes.</Highlight> Both of you present
          </>,
          "Bring the Figma link ready to open, no setup on the day",
        ].map((p, i) => (
          <li key={i} className="flex items-baseline gap-2 text-body">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
      <a
        href="#/assignment/9"
        className="mt-6 inline-block text-body font-medium decoration-accent decoration-2 underline underline-offset-4"
      >
        Read the full brief →
      </a>
      <Source>Final presentation: Wed, July 8, 15:45, Gong · Icon Tower (floor 22), Ramat Gan</Source>
    </Slide>,

    <Slide className="flex flex-col items-center justify-center text-center">
      <Eyebrow>Before the finals</Eyebrow>
      <h2 className="mt-3 font-serif text-h1 tracking-tight">Let's get you ready, 1:1</h2>
      <p className="mt-6 max-w-2xl text-h3 font-normal text-muted-foreground">
        For the next <Highlight>two weeks</Highlight> we'll run <strong>1:1 sessions, 20 minutes per
        pair</strong>, to help with your final presentations.
      </p>
    </Slide>,
  ],
  notes: [
    // 1. Title
    "Frame it in one line: today is about the whole journey, the sequence of screens a user moves through to reach a goal. By the end you'll know how to make your flow better, and you'll have the brief for your final presentation. Two products ride along the whole class: Spotify and Gong, one consumer, one B2B, and Gong is where you'll present next month.",
    // 2. Cold open: the customer message
    "Cold open, before any agenda. Read the message off the slide and let it sit for a beat. Sarah is the small-business owner you've been designing for all semester. Ask the room: where does her journey start? Most will say the home screen. It starts here, out in her day, with the app still closed. Everything today is about what happens between this message and her reply. We pick this exact message back up in a few slides and turn it into a job.",
    // 3. Recap
    "Quick callback to the in-class redesign workshop: the interface inventory and heuristic eval you ran on your own product. Point at the PNC inventory on screen, that's what yours looked like. Then set the level: most of you already have a sequence of screens by now. Good. Today we make yours better.",
    // 4. Agenda
    "Walk the plan. The center of gravity is the middle: making many screens feel like one product, with states. The goal and the story framing get us there; the prototype makes it real. We end with the final brief.",
    // 5. Thesis
    "Open with the book analogy: a novel can have unforgettable characters and a plot that goes nowhere, the writing is strong and you still put it down. Your screens are the characters; the flow is the plot. So the question today is when a flow is actually good. Hand them the three tests up front, because they are the spine of today: it starts from the user's goal (Part 1), it moves like a story with a setup and a payoff (Part 2), and it feels like one product across every screen (Part 3). After that we make it real and test it with a prototype, then the final brief. Point at the clip looping on the right: a 12-step onboarding where the progress bar and microinteractions make twelve screens feel like one journey. Ask: who has used an app where each screen was fine but the whole thing felt confusing? That's a flow problem, and that's what we fix today.",
    // 6. Divider: start from the goal
    "Section break. The point I most want them to take: the journey begins out in the user's life, before your app opens, with a trigger and a goal.",
    // 7. The trigger & the job
    "Use their own product, the small-business app. The trigger lives out in the owner's day: the cold open's message, 'Can you do a gluten-free cake for Saturday?', now back on screen. That message is where the journey really starts, before the app is even open. Then name the job: When [situation], I want to [motivation], so I can [outcome]. For Sarah: when that message comes in, she wants to check the calendar and quote a price in under a minute, so she answers before they ask another baker. The two ends carry the weight: 'when' sets where the flow starts, 'so I can' sets when it's done, the customer has their answer. The famous version, if you want it: Christensen's milkshake study. McDonald's discovered nearly half their milkshakes sold before 8am, hired for the long boring commute, competing with bananas and bagels rather than other desserts. Naming the job changed what they improved (thicker shake, lasts the whole drive). Apple did it in six words: '1,000 songs in your pocket' names the iPod's job, with zero specs. Make them write the sentence for their own app, out loud. If they can't, they don't yet know what they're designing. Tie it back to the section: start from that end and design backward.",
    // 8. Map the path
    "Open with the stat on the slide: Baymard's running average across 50 studies puts cart abandonment at just over 70%, and a long or complicated checkout is one of the top documented reasons. The route is usually what loses people, so we map the route first. Keep it low-fi: boxes and arrows. Have them trace the checkout out loud: cart, checkout, sign-in branch, shipping, payment, review, then the approval branch with its retry loop. Two decisions carry the whole flow. Then the B2B parallel: a rep converts a lead to an opportunity, moves the stage, closes it. Same shape, different domain. The tool barely matters, FigJam, Whimsical, Excalidraw, Miro; pick one both partners can edit and keep it rough. Dor's rule: a flow chart earns its place when you can read the story off it. Never draw one just to have one.",
    // 9. Stay low-fidelity
    "This is the emphasis. Wireframe while the flow is still moving. The real reason is commitment: grey boxes are easy to throw away, so you keep exploring. A polished screen looks finished, so people stop questioning it. See the whole flow before the details of any one screen. Point at the grey-box wireframe: every image is a placeholder, and that's the point. Ask: who has over-polished a screen and then hated to change it?",
    // 10. Divider: a flow is a story
    "Section break, and the heart of the framing. The best way to judge a flow is to tell it as a story. If it doesn't read as one, it isn't done.",
    // 11. Story arc
    "Click each beat on the arc, left to right; the panel loads its definition and an example from both products. Setup is entry and the empty state. Hook is the first action that earns attention, Spotify plays in one tap, Gong surfaces the one account that needs you today. Rising action is the steps with momentum. The peak is the payoff, Spotify's perfect song, Gong's follow-up done and the deal moving, the moment they remember, design it hardest. Resolution is confirmation and a next step. Then ask which beat their own flow is missing, usually a weak peak or a thin resolution. Note: the loop that brings them back is its own slide in a moment.",
    // 12. Spotify flow example
    "The arc made concrete in a product everyone uses, the same five beats as the slide before. First close the loop back to the trigger slide: read the job sentence at the top out loud, when I sit down to work and the silence is distracting, I want to put on something that fits in one move, so I can drop into focus. That's the same JTBD template, and every beat below is how Spotify delivers it. Then walk the beats: setup is the home asking what you want; hook is hitting play in one tap; rising action is finding a playlist and shaping it; the peak is the song that fits perfectly; resolution is it playing and saved, more queued. Point out it's the exact same shape as the abstract arc, and it all pays off the one job. Ask: which beat is the moment they remember?",
    // 13. Gong flow example
    "Same arc, B2B, and the tool you'll present in next month. Start the same way as Spotify: read the job at the top, when an important account needs a follow-up, I want to be reminded and complete the task in one place, so I can follow up on time and keep the deal moving. Same JTBD template, just a work tool instead of a consumer one. The key move: the to-do is what serves that job, it helps me remember the follow-up and complete it without it slipping. Then the beats: my to-dos (setup, the reminder), find and open the right account (rising action), complete the task (the peak), success plus the next to-do (resolution). If someone asks where the Hook beat went: here it folds into the setup, the to-do list itself surfaces what needs you before any digging, and that's the first action that earns attention. The point: the arc and the job describe any good flow, including the small-business tools you're building.",
    // 14. Peak-end
    "Kahneman's peak-end rule: we remember an experience by its best moment and its ending. The origin study is worth telling: Kahneman and Redelmeier tracked colonoscopy patients in the 90s. What patients remembered tracked the worst moment and the final moments, and the length of the procedure barely registered (duration neglect). A longer procedure with a gentler ending was remembered as less painful than a shorter, harsher one. That's how memory scores every experience, including your flow. So spend your effort on the peak and the ending. Point at the Asana shot: those rainbow creatures fire off when you clear your tasks, a peak someone designed on purpose, not by accident. Spotify's peak is the song that fits perfectly. A blank screen after the main action throws away a good flow. Ask: what's the peak in your product, and did you design it, or does it just happen?",
    // 15. The Hook loop
    "The coda the arc slide promised. Peak-end says memory keeps the peak and the ending; Eyal's Hook Model is about what the ending does next: trigger, action, variable reward, investment, and around again. Walk the two examples: on Spotify, saving the song is the investment, the library and the mixes get better, so tomorrow starts one tap closer. On Gong, the resolution queues the next to-do, so today's ending is literally tomorrow's trigger. Have them walk their own resolution and ask what brings the user back. One caution to say out loud: the loop has to serve the user's job from the trigger slide. A loop that serves only engagement is a dark pattern, and we'll grade it as one.",
    // 16. Divider: make many screens feel like one
    "Section break, and the real topic of the week. Five screens can each be on-system and still feel like five different apps. Continuity is the fix, and it has three layers: layout, information, space.",
    // 17. Same shell (continuity of layout)
    "Layer one, the shell. Frame this as a callback, not new material: we already did consistency and design systems, this is just how that same idea shows up across a flow (that framing lives here in the notes; the slide stays lean). Point at the two Gong screens, To-dos and Deals: the purple sidebar and the top header are identical, only the main region changes. That stillness is what lets the content change while the user stays oriented. Jakob's Law: people expect yours to behave like the apps they already use. Ask them to name what stays put in their own product across two screens.",
    // 18. Carry context (continuity of information)
    "Layer two, information. Carry forward what they already did and keep it visible, so they never re-enter or re-decide. The cleanest example is Spotify: the song keeps playing as you move around, the context literally travels with you. Show progress. Gong keeps your recent accounts one click away. Recognition over recall, applied across screens.",
    // 19. Continuity in motion (continuity of space)
    "Layer three, space. A good transition says the new screen is part of the same world. The textbook example is Spotify's player bar expanding into the full-screen player, a shared element that moves and keeps you oriented. Reserve space so the layout holds steady on load. The slot here is for a real product clip, paste a URL or drop an mp4 and it plays.",
    // 20. State by state
    "The same flow is a different journey by state. First-timers travel the empty journey, returners the full one, and both have to work. Treat empty, loading, error, and success as scenes: Spotify's empty library and offline mode, Gong's empty pipeline and a failed save. Design the first run on purpose.",
    // 21. Divider: make it real
    "Section break. You've mapped it and told it as a story. Now make it real enough to feel.",
    // 22. Prototype to feel
    "The core message: static screens take you to a point, layout and hierarchy and the look of each step, and that's real value. To test the flow itself, the momentum and the friction between screens, you have to click through an interactive prototype. Point at the wireframe prototype on the slide, watch the attach menu open: that's the level you want, something you can actually click. Make it clickable, with real transitions and the dead ends exposed, then walk it end to end and ask: does it have momentum, or does it stall?",
    // 23. AI prototyping toolkit
    "One reference slide, the intro does the framing: AI turns a flow into a clickable prototype in minutes, so explore three versions and commit, and treat what comes back as version zero. Left column, the tools, all take a description and hand back working screens: Figma Make lives inside Figma, v0 is strongest for clean web UI, Lovable and Bolt give a full running app, Claude refines a prototype by talking. Don't agonize over which. Right column is where quality comes from, the prompt: give it the job and your screen list, feed it your tokens, build one flow end to end, ask for the states, then click it and make the call. You own the design.",
    // 24. Questions
    "Pause for questions before switching to the final brief.",
    // 25. Divider: your final presentation
    "Shift to logistics and the brief. Tone change: this is what the whole semester has been building to.",
    // 26. What you'll present
    "Set the expectation: a story in four parts, in order, and it maps exactly onto today's lecture. The idea and background, then the design system shown, then one flow end to end (walk it, then click the prototype), then the decisions. Ten minutes per pair, both partners, timed. Stress using the time smartly: most of it on the flow, keep the intro and the system quick. The common mistake is flipping through screens with no narrative. The full brief is linked on the slide.",
    // 27. Done checklist
    "Read it as the spec for the final. Four buckets: idea and background, design system, the one flow, the talk. Call out the ones students drop: the states inside the flow, and rehearsing to time. It's the 60% final, in pairs, Figma with Material Design 3.",
    // 28. Logistics + map
    "Say the details clearly and twice. Wednesday, July 8, at 15:45. Gong, now at Icon Tower, Menachem Begin Rd, Ramat Gan, floor 22, ask for Sia. Map's on the slide. Arrive a few minutes early, Figma open before you walk in.",
    // 29. Closing
    "Send them off: finish the flow end to end with every state, walk it as a story to check it has a goal, a peak, and an ending, rehearse out loud and time it to 10 minutes, bring the link ready. Last line: come tell us the story, see you at Gong on July 8.",
    // 30. 1:1 sessions
    "Logistics close: for the next two weeks we'll run 1:1 sessions, 20 minutes per pair, to help get the final presentation in shape. Bring whatever you have, the flow, the prototype, the open questions. Tell them how to sign up.",
  ],
};
