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
  AssignmentSlide,
  Highlight,
  RefImage,
} from "@/slides/templates";

/**
 * Workshop: "Design sprint (ish)". Based on Dor's source deck:
 * https://docs.google.com/presentation/d/1BJBo8RG9Yug-aC6XMLAIx6qVGqkCG0OM0iV84JkKrXg
 *
 * Goal: refine work in progress through three proven, timeboxed methods.
 *   1. Design system audit  (Interface Inventory, Brad Frost) + a detailed M3 checklist
 *   2. UX pattern audit      (Heuristic Evaluation, Nielsen / NN/g)
 *   3. Quick ideation        (Crazy 8s, Google Design Sprint)
 *
 * The rhythm is deliberately uneven: the audit goes deep (two slides, a real
 * checklist), ideation stays punchy and visual. Cheat sheet: /cheatsheet/ai-critique
 */
export const workshopAiPeerReview = {
  slug: "workshop-ai-peer-review",
  title: "Workshop · Design sprint (ish)",
  slides: [
    <TitleSlide
      course="Design Patterns and Systems · Workshop"
      title="Design sprint (ish)"
      subtitle="Reviewing and refining your work in progress"
    />,
    <AgendaSlide
      title="Three ways to tighten your work"
      items={[
        <>
          Audit your<strong> design system</strong>, what's inconsistent? (15 min)
        </>,
        <>
          Audit<strong> </strong>a<strong> flow</strong> with another pair, what's confusing? (20 min)
        </>,
        <>
          <strong>Ideate fixes</strong> fast, then apply one (15 min)
        </>,
      ]}
    />,
    <ConceptSlide
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
          Keep the <strong>cheat sheet</strong> open. Every step, checklist, and the AI checks live there
        </>,
      ]}
    />,

    // Activity 1 spans two slides: the method, then a real checklist.
    <ActivitySlide
      index={1}
      title="Inventory your interface"
      minutes="15 min, in your pair"
      method={{
        label: "Interface Inventory (Brad Frost)",
        href: "https://bradfrost.com/blog/post/interface-inventory/",
      }}
      steps={[
        <>
          Screenshot every <strong>component</strong> across your screens: buttons, inputs, cards, chips, empty states
        </>,
        <>
          Place them on one board, <strong>grouped like with like</strong>: all buttons together, all inputs, all cards
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
      title="Audit the design system"
      intro="Check each group against these. Flag anything inconsistent or off the system."
      groups={[
        {
          label: "Type",
          items: [
            "One type scale: display, headline, title, body, label",
            "2 to 3 weights only. Heavy weight is for emphasis, not everywhere",
            "Line height and spacing come from the scale, not per screen",
          ],
        },
        {
          label: "Color",
          items: [
            "Named roles (primary, surface, on-surface), not hex everywhere",
            "60-30-10: neutral, supporting, one accent on the key action",
            "Text contrast at least 4.5:1, large text 3:1 (WCAG 1.4.3)",
            "Icons, borders, focus rings at least 3:1 (WCAG 1.4.11)",
            "Never signal by color alone. Add text or an icon (WCAG 1.4.1)",
          ],
        },
        {
          label: "Spacing & shape",
          items: [
            "Everything on the 8pt grid (4pt for fine detail). Padding inside < gaps between",
            "Corner radius from a small set (4 / 8 / 12 / 16), not a value per card",
          ],
        },
        {
          label: "Components & states",
          items: [
            "One button, one input, one card. Reused, not redrawn",
            "Every interactive element: hover, focus, pressed, disabled",
            "Keyboard focus is always visible",
            "Targets at least 48x48dp. One icon set, one size",
          ],
        },
      ]}
      source={<>Checklist based on Material Design 3 and WCAG 2.2</>}
    />,

    <ActivitySlide
      index={2}
      title="Review another pair's flow"
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
          Rate each issue <strong>0 to 4</strong> for severity (NN/g): 0 cosmetic, 4 catastrophe
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
      link={{ label: "Heuristic + AI checklist", href: "/cheatsheet/ai-critique" }}
      figure={{
        src: "/refs/heuristic-eval-template.png",
        caption: "Walk the flow against Nielsen's 10, then log each issue with a fix",
        credit: "Vincenzo Sole, Dribbble",
        href: "https://dribbble.com/shots/23128035-Heuristic-Evaluation-Template",
      }}
    />,
    <ChecklistSlide
      title="Audit the design patterns"
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
      source={<>Based on Nielsen's 10 usability heuristics (NN/g). AI checks on the cheat sheet</>}
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

    // Activity 3: punchy and visual, a different beat from the audits.
    <Slide>
      <div className="flex items-center gap-3">
        <Eyebrow>Activity 3</Eyebrow>
        <span className="rounded-md bg-accent px-3 py-1 text-caption font-semibold text-accent-foreground">
          ⏱ 8 min
        </span>
      </div>
      <h2 className="mt-2 font-serif text-h2 tracking-tight">
        Crazy 8s: sketch alternatives
      </h2>
      <p className="mt-2 max-w-3xl text-body text-muted-foreground">
        Take your top issue and frame it as "How might we...?" Then sketch one idea per box, a minute each.
        Keep them rough; aim for quantity, not polish.
      </p>
      <div className="mt-5 grid grid-cols-[1fr_minmax(0,32%)] items-start gap-8">
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex h-24 items-start rounded-md border-2 border-dashed border-border p-2 text-caption font-medium text-muted-foreground"
            >
              {i + 1}
            </div>
          ))}
        </div>
        <RefImage
          src="/refs/crazy8s-sketch-sheet.jpg"
          caption="Eight rough screens in eight minutes: quantity over polish"
          credit="Ignacio Valdes, Dribbble"
          href="https://dribbble.com/shots/4008877-Crazy-Eights-Exercise"
        />
      </div>
      <p className="mt-5 text-body">
        <strong>Then:</strong> pick the strongest idea and <Highlight>rebuild that part in Figma</Highlight>.
      </p>
    </Slide>,

    <DividerSlide title="Share what changed" />,
    <AssignmentSlide
      title="No new brief. Improve what you have"
      whatToBuild={[
        <>
          Take the feedback from today: your <strong>top 3 ranked issues</strong> and the design-system flags
        </>,
        <>
          Rebuild those parts in Figma. <Highlight>Refine, don't restart</Highlight>, no new screens or features
        </>,
        <>
          Come back next week with a <strong>before / after</strong> of what you changed and why
        </>,
      ]}
    />,
  ],
};
