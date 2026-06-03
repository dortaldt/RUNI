import {
  TitleSlide,
  AgendaSlide,
  ConceptSlide,
  BreakoutSlide,
  DividerSlide,
  AssignmentSlide,
} from "@/slides/templates";

/**
 * Week 1: Welcome. Ported from the original Google Slides deck as the
 * proof-of-system deck. Each slide is one entry; presenter notes can be
 * added later as a notes view. Edit content here; styling comes from tokens.
 */
export const week1 = {
  slug: "week-1",
  title: "Week 1: Welcome",
  slides: [
    <TitleSlide
      course="Design Patterns and Systems"
      title="Hi"
      subtitle="Product Design with Design Systems"
    />,
    <AgendaSlide
      items={[
        "Intro, background and kickoff",
        "What are design patterns, and why we need them",
        "Spot the pattern (breakout)",
        "First assignment",
      ]}
    />,
    <ConceptSlide
      title="What's the plan for the semester?"
      points={[
        "Week 1: Intro, background and kickoff",
        "Weeks 2-6: design patterns, hands-on exercises",
        "Week 7: Midterm workshop",
        "Weeks 8-9: more patterns and exercises",
        "Weeks 10-12: final presentation, prep and review",
      ]}
    />,
    <ConceptSlide
      title="Lesson structure"
      points={[
        "45-60 min: peer review of the previous assignment",
        "30 min: learning something new",
        "Then: your next assignment",
        "A studio-style class. Most of the learning happens through mutual feedback",
      ]}
    />,
    <ConceptSlide
      title="What are design patterns?"
      definition="Reusable principles designers use to solve common problems in user interface design."
      points={[
        "Universal across products. They evolve collectively over time",
        "Selections, filtering, sorting…",
        "Patterns are everywhere. We just need to detect them",
      ]}
    />,
    <ConceptSlide
      title="Why design patterns?"
      definition="Three audiences, three benefits."
      points={[
        "Designers: consistency across flows; faster decisions; a shared language",
        "Users: familiar interactions reduce cognitive load; predictable behavior builds trust",
        "Engineers: shared vocabulary; reusable structures improve maintainability",
      ]}
    />,
    <BreakoutSlide
      minutes="5-7 min"
      steps={[
        "Pick a product you both use (Zoom, WhatsApp, Slack, Gmail, Spotify…)",
        "Find a design pattern that repeats in several areas",
        "Describe the pattern",
        "Add screenshots of the different instances",
      ]}
    />,
    <DividerSlide title="Questions?" />,
    <AssignmentSlide
      title="App brief: pick your product"
      whatToBuild={[
        "Divide into pairs and pick one of the three briefs",
        "Start rapid immersion in the domain",
        "Come back ready to share your direction",
      ]}
    />,
  ],
};
