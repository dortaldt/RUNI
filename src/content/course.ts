import type { CourseManifest } from "./types";

/* ──────────────────────────────────────────────────────────────
   The course manifest: the student-facing single source of truth,
   mirroring .claude/memory/syllabus.md (the assistant's contract).
   When a commitment changes, update BOTH. The hub, syllabus page,
   and per-week pages all render from this. Seeded from the official
   RUNI syllabus (Drive), 2026-06-07. Working numbering = Dor's 13.
   ────────────────────────────────────────────────────────────── */

export const course: CourseManifest = {
  title: "Product Design: Patterns and Design System",
  term: "Semester B, 2026",
  institution: "Reichman University (RUNI) · HCI",
  instructor: "Dor Tal",
  ta: "Arbel Eini",
  description:
    "A studio-style exploration of UI design patterns, using a design system (Material Design 3) as a supporting tool rather than the main subject. Each week, students complete a focused home exercise on a real product, then bring it to an in-class review built on critique, peer discussion, and pattern comparison. Desktop-first, worked in pairs.",
  goals: [
    "Design clear, usable UI screens by applying core UX-UI principles (hierarchy, spacing, typography, feedback, accessibility).",
    "Use essential UI patterns (inputs, navigation, content, menus, AI/chat) and choose the right pattern for the task.",
    "Work with a design system in Figma (Material Design 3) to create consistent layouts and components efficiently.",
    "Explain and improve design decisions through critique: give and receive feedback, iterate, and communicate the why.",
  ],
  product: {
    name: "Solopreneur Hub",
    summary:
      "All exercises target one product: a desktop small-business management app for a single-person business (solopreneur or freelancer). Pairs pick any business type, real or fictional. It spans four pillars: inventory and services, financial tracking, marketing and communication, and a simple dashboard. The challenge is a feature-rich tool that still feels simple for a non-tech-savvy owner.",
  },
  grading: [
    {
      weight: "20%",
      label: "Ongoing Process",
      who: "Individual",
      detail:
        "Attendance, active participation, and sharing weekly exercise progress for feedback in workshops. Missing more than two classes results in failing the course.",
    },
    {
      weight: "20%",
      label: "Midterm Assignment",
      who: "Pairs",
      detail:
        "A Figma file with a redesigned screen or flow for an existing product using Material Design 3. Includes at least one iteration based on critique and a short note explaining key pattern choices.",
    },
    {
      weight: "60%",
      label: "Final Assignment",
      who: "Pairs",
      detail:
        "A complete mini UI flow in Figma using Material Design 3: several key screens and states (inputs, navigation, content, optional AI/chat). Must show refinement over time and include a highly-justified written rationale of the main decisions and tradeoffs.",
    },
  ],
  policies: [
    {
      label: "Attendance",
      detail: "Two absences are allowed. Missing more than two sessions can result in course cancellation.",
    },
    {
      label: "Late work",
      detail: "Late assignments without prior approval are penalized 2% per 24 hours.",
    },
    {
      label: "Academic integrity",
      detail: "All submitted work must be your own. Plagiarism or unauthorized collaboration results in disciplinary action.",
    },
    {
      label: "Generative AI",
      detail: "Option A, unrestricted use permitted. AI tools can support every stage of the work.",
    },
  ],
  resources: [
    { label: "Material Design 3", href: "https://m3.material.io/", note: "The design system we build on." },
    { label: "UI Patterns", href: "https://ui-patterns.com/", note: "Pattern reference library." },
    {
      label: "Interaction Design Foundation: UI patterns",
      href: "https://www.interaction-design.org/literature/topics/ui-design-patterns",
      note: "Background reading on pattern thinking.",
    },
  ],
  weeks: [
    {
      n: 1,
      topic: "Course Overview and Design Systems",
      summary:
        "Establish the semester: course goals, the studio format, the practical role of design systems, and how UI patterns orient users.",
      driveMaterial: true,
      status: "built",
      exercise: {
        title: "App Brief",
        summary:
          "In pairs, define the product you will design all semester: a desktop small-business management app for a single-person business. This brief is your north star for every later exercise.",
        format: "One-page PDF",
        workMode: "Pairs (both submit the same file)",
        duration: "1 week",
        sections: [
          {
            heading: "1. App basics",
            body: "App name, a one-sentence tagline, industry and business type, and target platform (desktop web app).",
          },
          {
            heading: "2. Problem and value",
            body: "What is frustrating today for this owner, the value proposition, and 2-3 lightweight measurable success signals.",
          },
          {
            heading: "3. Main persona",
            body: "One primary persona (the owner/operator): background, business context, goals, pain points, current tools, and tech comfort.",
          },
          {
            heading: "4. Core use cases",
            body: "3-5 short scenarios in the form: As the owner, I want to [action] so that [outcome].",
          },
          {
            heading: "5. MVP scope",
            body: "5-8 must-have features for the semester, plus 3-5 things intentionally out of scope.",
          },
          {
            heading: "6. Information architecture draft",
            body: "A simple top-level structure: 4-7 main navigation items, optionally one line each.",
          },
          {
            heading: "7. Light research",
            body: "2-3 reference products with a one-line takeaway each, and 3 insights to carry forward.",
          },
        ],
      },
    },
    {
      n: 2,
      topic: "Visual Foundations: Layout and Typography",
      summary:
        "Visual hierarchy, rhythm, grid systems, and typographic readability: the structural elements of an interface.",
      driveMaterial: true,
      status: "not started",
      exercise: {
        title: "Landing page",
        summary:
          "Design a single-sectioned landing page for the app: one image, a title, a subtitle, and a button.",
      },
    },
    {
      n: 3,
      topic: "User Input and Form Design",
      summary:
        "Interaction models for data entry: text fields, selection controls, validation, and error-state feedback.",
      driveMaterial: true,
      status: "not started",
      exercise: {
        title: "Sign-up flow",
        summary:
          "Design the sign-up flow: first and last name, email, a strong password, business name, address, and industry.",
      },
    },
    {
      n: 4,
      topic: "Navigation and Product Architecture",
      summary:
        "Product structure and wayfinding: tabbed views, side navigation, breadcrumbs, and organizing complex architectures.",
      driveMaterial: true,
      status: "not started",
      exercise: {
        title: "Redesign the main navigation",
        summary: "Redesign the app's main navigation.",
      },
    },
    {
      n: 5,
      topic: "Content Containers and Scannability",
      summary:
        "Organizing information: content density, card structures, and designing for unknown or dynamic content.",
      driveMaterial: true,
      status: "not started",
      exercise: {
        title: "About Us page",
        summary: "Design the app's About Us page.",
      },
    },
    {
      n: 6,
      topic: "Menus and Action Discoverability",
      summary:
        "How users trigger tasks and make choices: menu structures, action grouping, command hierarchy, and discoverability.",
      driveMaterial: true,
      status: "not started",
      exercise: {
        title: "Hierarchical menu",
        summary:
          "Design a menu with 1, 2, and 3 levels of hierarchy: main sections, pages, and sub-pages (e.g. Finance > Reports > Revenue).",
      },
    },
    {
      n: 7,
      topic: "Midterm Workshop: Redesign Sprint",
      summary:
        "An in-class redesign sprint built on two timeboxed audits: a design-system audit (Interface Inventory) and a UX-pattern audit (Heuristic Evaluation), then rebuild one part. Peer critique, alternatives, rapid iteration. This is the built 'Design sprint (ish)' deck.",
      driveMaterial: true,
      status: "built",
      exercise: {
        title: "Midterm: RUNI redesign",
        summary:
          "Redesign RUNI's landing page plus a Contact Us page. Show at least one iteration from critique and a short note on pattern choices.",
        workMode: "Pairs",
      },
    },
    {
      n: 8,
      topic: "Emerging Interfaces: AI and Chat",
      summary:
        "Conversational UX and generative AI patterns: message structures, prompt design, empty states, and guardrails.",
      status: "not started",
      exercise: {
        title: "Site-helper chat",
        summary:
          "Design a short chat experience for the site helper: two-sided messages, an input, and a send button.",
      },
    },
    {
      n: 9,
      topic: "Layouts Across a Flow",
      summary:
        "Designing the whole user journey across many screens. Start with the user's goal (why they open the app at all), map the flow, treat it as a story (setup to payoff, the Hook loop), and make many screens feel like one product. Frontal lecture; ends with the final-presentation brief.",
      driveMaterial: true,
      status: "built",
      exercise: {
        title: "Final presentation",
        summary:
          "Present your full product as one story in three parts: the design system, one complete flow, and the process behind it. Everything you built in the weekly exercises comes together here as one product.",
        format: "Figma file + live presentation",
        workMode: "Pairs (one submission)",
        duration: "10 minutes per pair",
        due: "Wed, July 8, 15:45 (Gong, Ramat Gan)",
        sections: [
          {
            heading: "The task",
            body: "Tell the story of the product you have designed all semester, and walk us through one complete flow from start to end. Ten minutes per pair, both partners presenting. Ten minutes is short, so use the time smartly: most of it on the flow, the rest kept tight.",
          },
          {
            heading: "What you'll present",
            body: "Structure the talk in four parts, in this order. It is the same spine we used in class.",
            bullets: [
              "**The idea and quick background (~1.5 min).** What the product is, who it is for (the persona and the job it does), and why it exists.",
              "**Your design system, shown (~2.5 min).** Tokens, components, and their states, plus the rules you set and how you built it. Show it on screen and walk us through it.",
              "**One major flow, start to end (~5 min).** The heart of the talk. Walk us through the flow, then click the final prototype through it. Trigger to payoff.",
              "**The decisions (~1 min).** The key tradeoffs you made, and what critique changed along the way.",
            ],
          },
          {
            heading: "The flow must tell a story",
            body: "Your one flow follows the arc from class: setup to resolution. Start it where the journey really starts, out in the user's life, before the app opens.",
            bullets: [
              "**Begin with the real-world trigger.** Something happened first: a new order lands in the DMs, a customer message comes in, an invoice is due, a task gets assigned. Show that moment, then bring the user into the app.",
              "**Walk the arc.** Setup (entry and the empty state), the first easy action, the steps with momentum, the peak (the payoff they came for), and the resolution (confirmation and one clear next step).",
              "**Treat the states as scenes.** Empty, loading, error, and success are part of the story, designed on purpose.",
              "**One clear next step on every screen.** The user always knows where they are, what just happened, and what to do next.",
            ],
          },
          {
            heading: "Name the patterns you used",
            body: "Across the semester you learned a set of UI patterns. As you walk the flow, call out which ones you used and why. This is how you show the choices were intentional.",
            bullets: [
              "**Point to patterns by name:** inputs and forms (Week 3), navigation and wayfinding (Week 4), content containers and scannability (Week 5), menus and action discoverability (Week 6), AI and chat if you have it (Week 8).",
              "**For each, say the choice and the reason.** \"We used a side nav here because...\" lands better than showing it silently.",
              "**Tie it to consistency.** The same shell, tokens, and components across every screen, the design system from Week 7.",
            ],
          },
          {
            heading: "Deliverable",
            body: "Two things, one submission per pair, brought ready to present.",
            bullets: [
              "**Figma file** link with view access: the design system and the clickable prototype.",
              "**A slide deck** for the talk: the idea, the design system, and the decisions.",
              "**The full critical flow** end to end in the prototype, with every state (empty, loading, error, success).",
              "**A short written rationale** in a Figma sticky: the user's goal, your key decisions, and the tradeoffs.",
              "**Come ready:** Figma open, deck ready, talk rehearsed and timed to 10 minutes, both partners presenting.",
            ],
          },
          {
            heading: "Critique prep",
            body: "Be ready to answer these on the spot.",
            bullets: [
              "What is the user's goal, and where does the flow start in their real life?",
              "Where is the peak, and did you design it on purpose?",
              "What stays consistent across every screen, and what carries forward?",
              "Which patterns did you use, and why those?",
              "If something goes wrong mid-flow, what does the user see?",
            ],
          },
          {
            heading: "References",
            body: "The canon behind this brief.",
            bullets: [
              "[Material Design 3](https://m3.material.io/), components, tokens, and the rules.",
              "Laws of UX: [Peak-End Rule](https://lawsofux.com/peak-end-rule/) and [Jakob's Law](https://lawsofux.com/jakobs-law/).",
              "Nir Eyal, [the Hook Model](https://www.nirandfar.com/how-to-manufacture-desire/), the loop that brings users back.",
              "Jobs to be Done: [Nick Babich, UX Planet](https://uxplanet.org/jobs-to-be-done-jtbd-in-product-design-6065e7bec122), the job statement format.",
            ],
          },
          {
            heading: "When and where",
            body: "Wednesday, July 8, 2026, 15:45. Gong, Icon Tower, Menachem Begin Rd, Ramat Gan, floor 22 (ask for Sia). Arrive a few minutes early with Figma open.",
          },
        ],
      },
    },
    {
      n: 10,
      topic: "Final Studio 1: Execution and Critique",
      summary:
        "Dedicated studio time with structured feedback: layout clarity, visual hierarchy, and appropriate pattern application.",
      status: "not started",
    },
    {
      n: 11,
      topic: "Final Studio 2: Polish and Edge Cases",
      summary:
        "Refining deliverables: interactive states, edge cases, accessibility, and a clear design rationale.",
      status: "not started",
    },
    {
      n: 12,
      topic: "Final Presentations",
      summary:
        "Presenting the completed flows, defending design decisions, and reflecting on how and why the designs evolved.",
      status: "not started",
      exercise: {
        title: "Final Assignment",
        summary:
          "Present the complete mini UI flow in Figma with a written rationale of the main decisions and tradeoffs.",
        workMode: "Pairs",
      },
    },
    {
      n: 13,
      topic: "Final presentations / wrap-up",
      summary:
        "Dor's working calendar includes a 13th class. Exact content is still to be confirmed.",
      status: "not started",
    },
  ],
};

export const weekByNumber = (n: number) => course.weeks.find((w) => w.n === n);
