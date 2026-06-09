import type { ReactNode } from "react";
import type { Slide } from "./types";
import {
  TitleSlide,
  RecapSlide,
  AgendaSlide,
  ConceptSlide,
  ComparisonSlide,
  BreakoutSlide,
  ChecklistSlide,
  ActivitySlide,
  DividerSlide,
  ResourcesSlide,
  GallerySlide,
  MediaSlide,
  SplitMediaSlide,
  AssignmentSlide,
} from "@/slides/templates";

/**
 * Maps a data-only Slide spec to the matching template component. This is the
 * bridge that lets weeks be authored as data (content/weeks/*) instead of JSX.
 * The `custom` variant is the escape hatch for one-off rich slides.
 */
export function renderSlide(slide: Slide, key?: number): ReactNode {
  switch (slide.type) {
    case "title":
      return (
        <TitleSlide
          key={key}
          course={slide.course}
          title={slide.title}
          subtitle={slide.subtitle}
        />
      );
    case "recap":
      return <RecapSlide key={key} label={slide.label} points={slide.points} />;
    case "agenda":
      return (
        <AgendaSlide key={key} title={slide.title} items={slide.items} icon={slide.icon} />
      );
    case "concept":
      return (
        <ConceptSlide
          key={key}
          title={slide.title}
          definition={slide.definition}
          points={slide.points}
          source={slide.source}
          icon={slide.icon}
        />
      );
    case "comparison":
      return (
        <ComparisonSlide key={key} title={slide.title} left={slide.left} right={slide.right} />
      );
    case "breakout":
      return (
        <BreakoutSlide
          key={key}
          minutes={slide.minutes}
          mode={slide.mode}
          steps={slide.steps}
          link={slide.link}
        />
      );
    case "checklist":
      return (
        <ChecklistSlide
          key={key}
          title={slide.title}
          intro={slide.intro}
          groups={slide.groups}
          source={slide.source}
        />
      );
    case "activity":
      return (
        <ActivitySlide
          key={key}
          index={slide.index}
          title={slide.title}
          minutes={slide.minutes}
          method={slide.method}
          steps={slide.steps}
          output={slide.output}
          link={slide.link}
          figure={slide.figure}
          icon={slide.icon}
        />
      );
    case "divider":
      return <DividerSlide key={key} title={slide.title} pattern={slide.pattern} />;
    case "resources":
      return <ResourcesSlide key={key} title={slide.title} links={slide.links} />;
    case "gallery":
      return (
        <GallerySlide key={key} title={slide.title} intro={slide.intro} images={slide.images} />
      );
    case "mediaSlide":
      return (
        <MediaSlide
          key={key}
          title={slide.title}
          intro={slide.intro}
          media={slide.media}
          source={slide.source}
        />
      );
    case "splitMedia":
      return (
        <SplitMediaSlide
          key={key}
          title={slide.title}
          points={slide.points}
          media={slide.media}
          mediaLeft={slide.mediaLeft}
        />
      );
    case "assignment":
      return (
        <AssignmentSlide
          key={key}
          title={slide.title}
          whatToBuild={slide.whatToBuild}
          due={slide.due}
        />
      );
    case "custom":
      return <div key={key}>{slide.render()}</div>;
  }
}

/** Render a list of slide specs to ReactNodes (for the Deck player). */
export function renderSlides(slides: Slide[]): ReactNode[] {
  return slides.map((s, i) => renderSlide(s, i));
}
