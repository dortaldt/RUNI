import { useEffect, useState, type ReactNode } from "react";
import { Printer, FileDown } from "lucide-react";

/**
 * Workshop cheat sheet: the one-page companion students keep open through both
 * audits (design system audit, UX pattern audit), then fixing one thing.
 *
 * Two ways to export:
 *  - "Print all" (header) -> the full sheet as one PDF.
 *  - Per-card PDF button   -> that single activity as its own A4 handout,
 *    so you can send students just the part they need.
 *
 * Reachable at /cheatsheet/critique.
 */

/**
 * The cards, in reading order. Drives both the body and the side anchor menu.
 * Because the app runs under HashRouter, we can't use `#id` href anchors
 * (they'd fight the router's hash), so the nav scrolls programmatically.
 */
const SECTIONS = [
  { id: "ground-rules", label: "Ground rules" },
  { id: "note-formula", label: "How to phrase a note" },
  { id: "activity-1", label: "1 · Design system audit" },
  { id: "ds-checklist", label: "Design system checklist" },
  { id: "activity-2", label: "2 · UX pattern audit" },
  { id: "receiving", label: "When you're reviewed" },
];

function Mark({ children }: { children: ReactNode }) {
  return <mark className="bg-accent px-1 text-accent-foreground">{children}</mark>;
}

/** Inline, muted source line. Keeps every claim traceable, per course rule. */
function Src({ children }: { children: ReactNode }) {
  return <p className="text-caption italic text-muted-foreground">{children}</p>;
}

/** A scannable list: each item leads with a bold cue, then the detail. */
function Lead({ cue, children }: { cue: string; children?: ReactNode }) {
  return (
    <li>
      <strong>{cue}</strong>
      {children ? <> {children}</> : null}
    </li>
  );
}

export function CritiqueCheatSheet() {
  // When set, only the matching card prints (its own one-page handout).
  const [printId, setPrintId] = useState<string | null>(null);
  // Which section the side menu highlights as you scroll.
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    if (!printId) return;
    window.print();
    setPrintId(null);
  }, [printId]);

  // Highlight the section nearest the top of the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          );
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  function scrollToSection(id: string) {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function Card({
    id,
    title,
    kicker,
    children,
  }: {
    id: string;
    title: string;
    kicker?: ReactNode;
    children: ReactNode;
  }) {
    return (
      <div
        id={id}
        className={`cheat-card scroll-mt-6 break-inside-avoid rounded-lg border bg-card p-5 ${
          id === printId ? "print-keep" : ""
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-h3 font-semibold tracking-tight">{title}</h2>
          <button
            onClick={() => setPrintId(id)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground print:hidden"
            aria-label={`Download ${title} as PDF`}
            title="Download this card as a PDF"
          >
            <FileDown className="h-4 w-4" />
          </button>
        </div>
        {kicker ? <div className="mt-1">{kicker}</div> : null}
        <div className="mt-3 space-y-2 text-[15px] leading-6">{children}</div>
      </div>
    );
  }

  return (
    <main
      className={`cheat-sheet mx-auto w-full max-w-7xl px-8 py-10 print:py-4 ${
        printId ? "printing-one" : ""
      }`}
    >
      <header className="flex items-end justify-between border-b pb-4">
        <div>
          <p className="text-caption font-medium uppercase tracking-widest text-muted-foreground">
            Workshop cheat sheet
          </p>
          <h1 className="mt-1 font-serif text-[2.5rem] leading-[1.05] tracking-tight">
            Refine your work in progress
          </h1>
          <p className="mt-1 text-[15px] text-muted-foreground">
            Two proven, timeboxed audits, then fix one thing. Keep this open
            the whole session. Each card downloads on its own.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-caption font-medium print:hidden"
        >
          <Printer className="h-4 w-4" /> Print all
        </button>
      </header>

      <div className="mt-6 flex gap-10">
        {/* Side anchor menu. Hidden on small screens and when printing. */}
        <aside className="hidden w-52 shrink-0 lg:block print:hidden">
          <nav className="sticky top-8" aria-label="Sections">
            <p className="mb-2 px-3 text-caption font-medium uppercase tracking-widest text-muted-foreground">
              On this page
            </p>
            <ul className="space-y-0.5">
              {SECTIONS.map(({ id, label }) => (
                <li key={id}>
                  <button
                    onClick={() => scrollToSection(id)}
                    aria-current={activeId === id ? "true" : undefined}
                    className={`block w-full rounded-md border-l-2 px-3 py-1.5 text-left text-caption transition-colors ${
                      activeId === id
                        ? "border-accent bg-muted font-medium text-foreground"
                        : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-2 xl:items-start">
        <Card
          id="ground-rules"
          title="Ground rules for critique"
          kicker={
            <Src>
              Based on NN/g, "The Art of the Design Critique," and Pixar's
              "plussing" (Catmull, <em>Creativity, Inc.</em>).
            </Src>
          }
        >
          <ul className="list-disc space-y-1.5 pl-5">
            <Lead cue="Critique the work, not the person.">
              Talk about the screen, not the designer.
            </Lead>
            <Lead cue="Ask intent before reacting.">
              "What were you trying to solve here?" Judge against that goal, not
              your own.
            </Lead>
            <Lead cue='"Why?" is a kind question.'>
              Curiosity reads as respect when the tone is right.
            </Lead>
            <Lead cue="Plus, don't only minus.">
              Pair every problem with a direction to try. Build on the idea
              instead of blocking it.
            </Lead>
            <Lead cue="Everyone speaks.">
              Every pair gives at least one note. Silence is not feedback.
            </Lead>
            <Lead cue="Disagree, with evidence.">
              Back a claim with a heuristic, a user behavior, or a guideline.
            </Lead>
            <Lead cue="Timebox each round.">
              About 2 min present, 5 min feedback. Move on before it drifts.
            </Lead>
          </ul>
        </Card>

        <Card
          id="note-formula"
          title="How to phrase a note"
          kicker={
            <Src>
              Stanford d.school "I like / I wish / What if" + NN/g feedback
              guidance. Be specific and actionable.
            </Src>
          }
        >
          <p>
            Aim for a <Mark>specific observation</Mark> plus a question or a
            suggestion, never just "I don't like it." Sentence starters:
          </p>
          <ul className="space-y-1.5">
            <Lead cue="I like…">
              "…the way the empty state explains the next step."
            </Lead>
            <Lead cue="I wish…">
              "…the primary action stood out more than the cancel link."
            </Lead>
            <Lead cue="What if…">
              "…you tried inline validation instead of an error on submit?"
            </Lead>
            <Lead cue="How does the user know…">
              "…that it saved?" Probe for missing system status.
            </Lead>
            <Lead cue="What happens when…">
              "…this call fails, or the list is empty?" Probe the edge cases.
            </Lead>
          </ul>
        </Card>

        <Card
          id="activity-1"
          title="Activity 1 · Design system audit"
          kicker={
            <Src>
              Method: Interface Inventory (Brad Frost) + 18F Interface Audit. In
              your pair. Timebox: 15 min.
            </Src>
          }
        >
          <ol className="list-decimal space-y-1.5 pl-5">
            <Lead cue="Screenshot every component">
              across all your screens. Buttons, inputs, cards, chips, headers,
              empty states.
            </Lead>
            <Lead cue="Group like with like.">
              Put all buttons together, all inputs together, and so on.
            </Lead>
            <Lead cue="Run the checklist.">
              Circle every inconsistency you find against the design-system
              checklist card.
            </Lead>
            <Lead cue="Decide what to consolidate.">
              List each duplicate to <Mark>merge into one</Mark> component or
              token.
            </Lead>
          </ol>
          <p className="text-caption text-muted-foreground">
            <strong>Output:</strong> a screenshot board grouped by component,
            with inconsistencies circled and a short consolidation list.
          </p>
        </Card>

        <Card
          id="ds-checklist"
          title="Design system checklist (M3)"
          kicker={
            <Src>
              Audit against Material Design 3, WCAG 2.2, and Refactoring UI. Goal:
              "one decision, reused," not many one-offs.
            </Src>
          }
        >
          <p className="font-semibold">Type</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <Lead cue="One type scale.">
              M3: display, headline, title, body, label. No off-scale sizes.
            </Lead>
            <Lead cue="2 to 3 weights only.">
              For example Regular plus Medium. Reserve the heavy weight for real
              emphasis.
            </Lead>
            <Lead cue="Line height and tracking come from the scale,">
              not eyeballed per screen.
            </Lead>
          </ul>
          <p className="font-semibold">Color</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <Lead cue="Use roles, not raw hex.">
              M3 roles: primary, surface, on-surface. No scattered hex values.
            </Lead>
            <Lead cue="60-30-10.">
              Neutral, supporting, one accent. Put the accent on the key action
              only.
            </Lead>
            <Lead cue="Text contrast at least 4.5:1">
              (3:1 for large text). WCAG 2.2, 1.4.3. Count your greys, kill the
              duplicates.
            </Lead>
            <Lead cue="Non-text contrast at least 3:1">
              for icons, borders, and focus rings. WCAG 2.2, 1.4.11.
            </Lead>
            <Lead cue="Never carry meaning by color alone.">
              Pair it with text or an icon. WCAG 1.4.1.
            </Lead>
          </ul>
          <p className="font-semibold">Spacing and shape</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <Lead cue="Everything on the 8pt grid">
              (4pt for fine detail). Padding inside a group stays smaller than
              the gap between groups.
            </Lead>
            <Lead cue="Corner radius from a small set">
              such as 4 / 8 / 12 / 16, not a new value per card.
            </Lead>
          </ul>
          <p className="font-semibold">Components and states</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <Lead cue="Reuse, don't redraw.">
              One button, one input, one card, reused everywhere.
            </Lead>
            <Lead cue="Every interactive element has all states:">
              enabled, hover, focus, pressed, disabled. M3 state layers.
            </Lead>
            <Lead cue="Touch targets at least 48x48dp">
              even when the icon is 24dp. M3 accessibility (WCAG 2.5.8 sets a
              24px floor; 48dp is the comfortable target).
            </Lead>
            <Lead cue="One icon set, one size and weight,">
              and consistent elevation levels.
            </Lead>
          </ul>
        </Card>

        <Card
          id="activity-2"
          title="Activity 2 · UX pattern audit"
          kicker={
            <Src>
              Method: Heuristic Evaluation (Nielsen's 10, NN/g). Run it on
              another pair's flow. Timebox: 20 min. Tip: 3 to 5 evaluators find
              about 75% of issues.
            </Src>
          }
        >
          <p className="font-semibold">Nielsen's 10 usability heuristics</p>
          <ol className="list-decimal space-y-1.5 pl-5">
            <Lead cue="Visibility of system status.">
              Show loading, saved, and error states.
            </Lead>
            <Lead cue="Match the real world.">
              Use the user's words and familiar conventions.
            </Lead>
            <Lead cue="User control and freedom.">
              Offer undo, back, cancel, and clear exits.
            </Lead>
            <Lead cue="Consistency and standards.">
              Match the rest of the app and platform norms.
            </Lead>
            <Lead cue="Error prevention.">
              Stop mistakes before they happen, then confirm risky ones.
            </Lead>
            <Lead cue="Recognition over recall.">
              Keep options visible; don't make people memorize.
            </Lead>
            <Lead cue="Flexibility and efficiency.">
              Shortcuts for experts, simple paths for newcomers.
            </Lead>
            <Lead cue="Aesthetic and minimalist design.">
              Cut anything that competes with the essentials.
            </Lead>
            <Lead cue="Help users recover from errors.">
              Plain language, the cause, and a way out.
            </Lead>
            <Lead cue="Help and documentation.">
              Available and searchable when needed.
            </Lead>
          </ol>
          <p className="font-semibold">Rate each issue (NN/g severity)</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <Lead cue="0 not a problem,">1 cosmetic, 2 minor, 3 major,</Lead>
            <Lead cue="4 catastrophe.">Fix the 3s and 4s first.</Lead>
          </ul>
          <p className="font-semibold">If the flow has AI, also check</p>
          <Src>Microsoft HAX Toolkit, Google PAIR, and Shape of AI.</Src>
          <ul className="list-disc space-y-1.5 pl-5">
            <Lead cue="Set expectations up front.">
              Show what it can and cannot do before use. HAX G1, G2.
            </Lead>
            <Lead cue="Scope the prompt.">
              Guide input with examples and affordances, not a blank "ask
              anything."
            </Lead>
            <Lead cue="Be honest about output.">
              Label AI content, cite sources, signal confidence. Shape of AI.
            </Lead>
            <Lead cue="Design the wait.">
              Stream tokens or show progress, not a dead spinner.
            </Lead>
            <Lead cue="Make correction cheap.">
              Easy to dismiss, edit, undo, or refine. HAX G7, G9.
            </Lead>
            <Lead cue="Watch for harmful bias">
              in language, defaults, and examples. HAX G6.
            </Lead>
          </ul>
        </Card>

        <Card
          id="receiving"
          title="When your work is reviewed"
          kicker={
            <Src>
              Receiving critique well. NN/g, "Design Critiques"; d.school
              facilitation.
            </Src>
          }
        >
          <ul className="list-disc space-y-1.5 pl-5">
            <Lead cue="Present in about 2 min, then stop.">
              Don't pre-defend the work.
            </Lead>
            <Lead cue="Listen, don't argue.">
              You're collecting notes, not winning a debate.
            </Lead>
            <Lead cue="Capture everything.">
              Write each note down before you respond to any of them.
            </Lead>
            <Lead cue="Make vague notes concrete.">
              Ask "what would you try?" to turn a reaction into a direction.
            </Lead>
            <Lead cue="Pick 1-2 changes">
              and make them <Mark>on the spot</Mark>. Park the rest.
            </Lead>
          </ul>
        </Card>
        </div>
      </div>

      <footer className="mt-6 break-inside-avoid border-t pt-3 text-caption text-muted-foreground">
        <p>
          <strong>Design Patterns and Systems</strong> · RUNI HCI. Methods and
          checklists drawn from vetted sources:
        </p>
        <ul className="mt-1 grid grid-cols-1 gap-x-6 gap-y-0.5 sm:grid-cols-2">
          <li>
            <SrcLink href="https://m3.material.io/">Material Design 3</SrcLink>,
            components, color, type, and accessibility.
          </li>
          <li>
            <SrcLink href="https://www.w3.org/TR/WCAG22/">WCAG 2.2</SrcLink>,
            contrast and target-size criteria.
          </li>
          <li>
            <SrcLink href="https://www.nngroup.com/articles/ten-usability-heuristics/">
              Nielsen's 10 Heuristics
            </SrcLink>{" "}
            and severity ratings, NN/g.
          </li>
          <li>
            <SrcLink href="https://bradfrost.com/blog/post/interface-inventory/">
              Interface Inventory
            </SrcLink>
            , Brad Frost.
          </li>
          <li>
            <SrcLink href="https://www.microsoft.com/en-us/haxtoolkit/">
              Microsoft HAX Toolkit
            </SrcLink>{" "}
            and <SrcLink href="https://www.shapeof.ai/">Shape of AI</SrcLink>,
            human-AI patterns.
          </li>
        </ul>
      </footer>
    </main>
  );
}

function SrcLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="decoration-accent decoration-2 underline underline-offset-2"
    >
      {children}
    </a>
  );
}
