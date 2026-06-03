import { Fragment } from "react";
import {
  Slide,
  Eyebrow,
  TitleSlide,
  AgendaSlide,
  ConceptSlide,
  ActivitySlide,
  ChecklistSlide,
  GallerySlide,
  DividerSlide,
  Highlight,
  TitleWithIcon,
} from "@/slides/templates";

/**
 * Workshop: "Design sprint (ish)". Based on Dor's source deck:
 * https://docs.google.com/presentation/d/1BJBo8RG9Yug-aC6XMLAIx6qVGqkCG0OM0iV84JkKrXg
 *
 * Goal: refine work in progress through two proven, timeboxed methods, then
 * rebuild one part in Figma.
 *   1. Design system audit  (Interface Inventory, Brad Frost) + a detailed M3 checklist
 *   2. UX pattern audit      (Heuristic Evaluation, Nielsen / NN/g)
 *
 * The rhythm is deliberately uneven: each audit goes deep (a method slide, a real
 * checklist, a gallery of good examples). Cheat sheet: /cheatsheet/critique
 */
export const week9 = {
  slug: "week-9",
  title: "Week 9: Design sprint (ish)",
  slides: [
    <TitleSlide
      course="Design Patterns and Systems · Workshop"
      title="Design sprint (ish)"
      subtitle="Reviewing and refining your work in progress"
    />,
    <Slide center>
      <img
        src={`${import.meta.env.BASE_URL.replace(/\/$/, "")}/refs/well-that-was-a-ride.png`}
        alt="A plush toy car perched on someone's head"
        className="mb-6 h-64 w-64 rounded-full object-cover"
      />
      <h2 className="font-serif text-display tracking-tight">Well that was a ride</h2>
      <p className="text-h3 font-light">
        <span className="line-through">Don't</span> <strong>Do</strong> try this at home
      </p>
    </Slide>,
    <AgendaSlide
      icon="/refs/start-grid.png"
      title="Two ways to tighten your work"
      items={[
        <>
          Audit your<strong> design system</strong>, what's inconsistent? (15 min)
        </>,
        <>
          Audit a <strong>flow</strong> with another pair, what's confusing? (20 min)
        </>,
        <>
          Then <strong>rebuild one part</strong> in Figma
        </>,
      ]}
    />,
    <ConceptSlide
      icon="/refs/whistle.png"
      title="How we work today"
      definition={
        <>
          No new material. You'll review your current work, get feedback, and{" "}
          <Highlight>improve one part of it</Highlight> in class.
        </>
      }
      points={[
        <>
          Critique the <strong>design</strong>, not the person. <strong>"Why?"</strong> is a fair question
        </>,
        <>
          Give a note as a <strong>specific observation plus a question or a suggestion</strong>, not just "I don't like it"
        </>,
        <>
          <strong>Plus, don't only minus.</strong> Pair every problem you raise with a direction to try
        </>,
        <>
          <strong>Everyone gives a note,</strong> and the pair being reviewed listens first, then picks what to act on
        </>,
        <>
          Keep the <strong>cheat sheet</strong> open. Every step and checklist lives there
        </>,
      ]}
    />,

    // A map of the session: two timeboxed passes, then fix one thing.
    <Slide>
      <Eyebrow>Today's process</Eyebrow>
      <TitleWithIcon icon="/refs/tactics-clipboard.png" className="mt-2">
        Two passes, then fix one thing
      </TitleWithIcon>
      <p className="mt-2 max-w-3xl text-body text-muted-foreground">
        Each pass is timeboxed and ends with something concrete to act on. Then
        you turn one finding into a real change.
      </p>
      <div className="mt-8 flex items-stretch gap-3">
        {[
          {
            kicker: "Pass 1 · 15 min",
            name: "Audit your design system",
            steps: ["1. Inventory your interface", "2. Audit it against the M3 checklist"],
          },
          {
            kicker: "Pass 2 · 20 min",
            name: "Audit a flow",
            steps: ["3. Review another pair's flow", "4. Audit the design patterns"],
          },
        ].map((p, i) => (
          <Fragment key={p.name}>
            {i > 0 && (
              <div className="flex shrink-0 items-center text-h3 text-muted-foreground/40">
                →
              </div>
            )}
            <div className="flex flex-1 flex-col rounded-xl bg-muted/40 p-5">
              <span className="text-caption font-semibold uppercase tracking-widest text-muted-foreground">
                {p.kicker}
              </span>
              <h3 className="mt-2 min-h-[4.2rem] text-h3 font-semibold leading-tight tracking-tight">
                {p.name}
              </h3>
              <ul className="mt-4 space-y-2 border-t border-border pt-4">
                {p.steps.map((s) => (
                  <li key={s} className="text-body leading-snug text-foreground">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </Fragment>
        ))}
        <div className="flex shrink-0 items-center text-h3 text-muted-foreground/40">
          →
        </div>
        <div className="flex w-52 shrink-0 flex-col justify-center rounded-xl bg-accent p-5">
          <span className="text-caption font-semibold uppercase tracking-widest text-accent-foreground/70">
            The output
          </span>
          <p className="mt-2 text-h3 font-semibold leading-tight tracking-tight text-accent-foreground">
            Rebuild one part
          </p>
        </div>
      </div>
    </Slide>,

    // Activity 1 spans two slides: the method, then a real checklist.
    <ActivitySlide
      index={1}
      icon="/refs/magnifier.png"
      title="1. Inventory your interface"
      minutes="15 min, in your pair"
      method={{
        label: "Interface Inventory (Brad Frost)",
        href: "https://bradfrost.com/blog/post/interface-inventory/",
      }}
      steps={[
        <>
          It's all in Figma already. Pull every <strong>component</strong> onto one board: buttons, inputs, cards, chips, empty states
        </>,
        <>
          Arrange them <strong>grouped like with like</strong>: all buttons together, all inputs, all cards
        </>,
        <>
          Side by side, near-duplicates are easy to spot. <strong>Audit each group</strong> against the checklist
        </>,
        <>
          List what to <strong>consolidate</strong> into one shared component or token
        </>,
      ]}
      output={
        <>
          your components grouped, inconsistencies circled, and a short{" "}
          <Highlight>consolidation list</Highlight>
        </>
      }
    />,
    <GallerySlide
      title="Create an inventory"
      intro="Pull every instance of one component onto a board. Side by side, the inconsistencies you miss screen by screen are easy to spot. Then consolidate to one component with defined states."
      images={[
        {
          src: "/refs/pnc-button-inventory.jpg",
          caption: "PNC: dozens of different button styles, all on one site",
          credit: "Brad Frost, Interface Inventory",
          href: "https://bradfrost.com/blog/post/interface-inventory/",
        },
        {
          src: "/refs/dribbble-component-sheet.png",
          caption: "The fix: one button, every state and variant, defined once",
          credit: "Shitij Nain, Dribbble",
          href: "https://dribbble.com/shots/21073052-Design-System-Component-Buttons",
        },
        {
          src: "/refs/button-system-cheatsheet.png",
          caption: "One button across the full set: filled, outlined, text, disabled, and the FAB",
          credit: "Roman Kamushken for Setproduct, Dribbble",
          href: "https://dribbble.com/shots/14797587-Material-design-buttons-UI-Figma-templates",
        },
      ]}
    />,
    <ChecklistSlide
      title="2. Audit the design system"
      intro="Check each group against these. Flag anything inconsistent or off the system."
      groups={[
        {
          label: "Type",
          items: [
            <><strong>One type scale</strong>: display, headline, title, body, label</>,
            <>2 to 3 <strong>weights</strong> only. Heavy weight is for emphasis, not everywhere</>,
            "Line height and spacing come from the scale, not per screen",
          ],
        },
        {
          label: "Color",
          items: [
            <>Named <strong>roles</strong> (primary, surface, on-surface), not hex everywhere</>,
            "60-30-10: neutral, supporting, one accent on the key action (remember?)",
            <>Text <strong>contrast</strong> at least 4.5:1, large text 3:1 (WCAG 1.4.3)</>,
            <><strong>Icons</strong>, <strong>borders</strong>, focus rings at least 3:1 (WCAG 1.4.11)</>,
            "Never signal by color alone. Add text or an icon (WCAG 1.4.1)",
          ],
        },
        {
          label: "Spacing & shape",
          items: [
            <>Everything on the 8pt <strong>grid</strong> (4pt for fine detail). Padding inside &lt; gaps between</>,
            "Corner radius from a small set (4 / 8 / 12 / 16), not a value per card",
          ],
        },
        {
          label: "Components & states",
          items: [
            <><strong>One</strong> button, one input, one card. Reused, not redrawn</>,
            <><strong>States</strong>: hover, focus, pressed, disabled</>,
          ],
        },
      ]}
      source={<>Checklist based on Material Design 3 and WCAG 2.2</>}
    />,

    <ActivitySlide
      index={2}
      title="3. Review another pair's flow"
      minutes="20 min, with another pair"
      method={{
        label: "Heuristic evaluation (Nielsen, NN/g)",
        href: "https://www.nngroup.com/articles/ten-usability-heuristics/",
      }}
      steps={[
        <>
          Walk their <strong>main flow</strong> as a first-time user. Say out loud what you expect at each step
        </>,
        <>
          Run the heuristic checklist. Note <strong>every issue</strong> you hit, big or small
        </>,
        <>
          Rate each issue <strong>0 to 4</strong> for severity (NN/g): 1 cosmetic, 4 catastrophe
        </>,
        <>
          Hand back the <strong>top issues, ranked</strong>. They decide what to fix first
        </>,
      ]}
      output={
        <>
          each pair leaves with their issues <Highlight>ranked by severity</Highlight>
        </>
      }
      link={{ label: "Critique checklist", href: "/cheatsheet/critique" }}
    />,
    <ChecklistSlide
      title="4. Audit the design patterns"
      intro="Walk the flow and check how it behaves, not just how it looks."
      groups={[
        {
          label: "Feedback & status",
          items: [
            "System status is visible: loading, saving, success, error",
            "Every action confirms it worked",
            "Waits use a skeleton or progress, not a blank screen",
          ],
        },
        {
          label: "Navigation & flow",
          items: [
            <>The user always knows where they are and how to go <strong>back</strong></>,
            <>Same <strong>navigation</strong> pattern across screens (consistency)</>,
            "One clear primary next step per screen",
            "Undo, cancel, and a clear exit are always available",
          ],
        },
        {
          label: "Forms & input",
          items: [
            "Clear labels and helper text, not placeholder-only",
            "Errors are inline, in plain language, and say how to fix it",
            "Recognition over recall: show the options, don't make people remember",
          ],
        },
        {
          label: "States & edge cases",
          items: [
            "Empty states show a next step, not a dead end",
            "Errors offer a way out or a retry",
            "Destructive actions are confirmable or reversible",
            "Prevent the error before it happens where you can",
          ],
        },
      ]}
      source={<>Based on Nielsen's 10 usability heuristics (NN/g)</>}
    />,
    <GallerySlide
      title="What good patterns look like"
      intro="Three of the checks above, handled well in real products. Use them as the bar when you audit a flow."
      images={[
        {
          src: "/refs/empty-state-traveloka.png",
          caption: "Empty and error states that name the problem and offer the next step",
          credit: "Steve Lianardo for Traveloka, Dribbble",
          href: "https://dribbble.com/shots/2419464-Empty-state-illustration-mobile-web",
        },
        {
          src: "/refs/form-field-states.png",
          caption: "Input fields with every state, and an inline error in plain language",
          credit: "Steven Striegel, Dribbble",
          href: "https://dribbble.com/shots/3523742-Inline-Form-Validation",
        },
        {
          src: "/refs/skeleton-loading-finance.png",
          caption: "A skeleton on load: the shape of the content, not a blank screen",
          credit: "Isaac Sanchez, Dribbble",
          href: "https://dribbble.com/shots/12105359-Skeleton-Loading-for-a-Finance-App",
        },
      ]}
    />,

    <DividerSlide title="Share what changed" />,

    // Closing: no new brief. The only work for next week is to implement today's critique.
    <Slide>
      <Eyebrow>Next week</Eyebrow>
      <h2 className="mt-2 font-serif text-h2 tracking-tight">
        Implement the critique from today
      </h2>
      <p className="mt-4 max-w-3xl text-h3 font-normal text-muted-foreground">
        No new brief. Take the feedback from this session back into your Figma
        file and put the fixes in.
      </p>
      <ul className="mt-6 max-w-3xl space-y-2">
        {[
          <>
            Work from today's output: your <strong>ranked issues</strong> and the design-system flags
          </>,
          <>
            <Highlight>Refine, don't restart.</Highlight> No new screens or features
          </>,
          <>
            Come back with a <strong>before / after</strong> of what you changed and why
          </>,
        ].map((p, i) => (
          <li key={i} className="flex items-baseline gap-2 text-body">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </Slide>,
  ],
};
