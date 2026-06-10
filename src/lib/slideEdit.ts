/**
 * Client-side helpers for inline slide editing (see Deck.tsx).
 *
 * The editor lets you change both *text* and *inline formatting* (bold/italic)
 * directly on a slide and persist it to the JSX source. To make that round-trip
 * reliable we:
 *
 *   1. Make whole text *containers* editable, not just pure-text leaves; so the
 *      words sitting next to a <strong> are reachable too.
 *   2. Serialize a container's content to a normalized, JSX-shaped string where
 *      bold is always <strong> and italic is always <em> (browsers emit <b>/<i>
 *      or inline-styled <span>s from execCommand; we fold those back). The
 *      server matches this against the deck source, so what you see maps to what
 *      gets written.
 */

/** Inline tags we understand and can round-trip into JSX. */
function inlineTag(el: Element): "strong" | "em" | "br" | null {
  switch (el.tagName) {
    case "STRONG":
    case "B":
      return "strong";
    case "EM":
    case "I":
      return "em";
    case "BR":
      return "br";
    case "SPAN":
      return styleWrapper(el as HTMLElement);
    default:
      return null;
  }
}

/**
 * execCommand("bold"/"italic") can emit a bare `<span style="font-weight:…">`
 * instead of a tag. Recognize that (and only that; a classed <span> is real
 * structure like <Highlight>, which we must not touch) and fold it to a tag.
 */
function styleWrapper(el: HTMLElement): "strong" | "em" | null {
  if (el.className) return null;
  const fw = el.style.fontWeight;
  if (fw === "bold" || (Number(fw) >= 600 && fw !== "")) return "strong";
  if (el.style.fontStyle === "italic") return "em";
  return null;
}

/**
 * Is `el` a self-contained editable unit? True when it holds visible text and
 * every nested element is inline formatting we can serialize. A container with
 * any unknown element (a bullet wrapper, a <Highlight>/<mark>, an icon) is not;
 * we descend past it to find cleaner units inside.
 */
function isEditableUnit(el: Element): boolean {
  if ((el.textContent ?? "").trim() === "") return false;
  for (const d of Array.from(el.querySelectorAll("*"))) {
    if (!inlineTag(d)) return false;
  }
  return true;
}

/**
 * Collect the editable units under `root`, top-down: the first ancestor that
 * qualifies wins, and we never descend into it (so we never double-bind a
 * container and its own <strong>).
 */
export function collectUnits(root: HTMLElement): HTMLElement[] {
  const units: HTMLElement[] = [];
  const visit = (node: Element) => {
    for (const child of Array.from(node.children)) {
      if (isEditableUnit(child)) units.push(child as HTMLElement);
      else visit(child);
    }
  };
  visit(root);
  return units;
}

function rawSerialize(el: HTMLElement): string {
  let out = "";
  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      out += node.textContent ?? "";
      continue;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) continue;
    const e = node as HTMLElement;
    const tag = inlineTag(e);
    if (tag === "br") out += "<br />";
    else if (tag === "strong" || tag === "em")
      out += `<${tag}>${rawSerialize(e)}</${tag}>`;
    else out += e.textContent ?? ""; // unknown: keep its text, drop the wrapper
  }
  return out;
}

/**
 * Serialize a unit's content to a normalized, whitespace-collapsed, JSX-shaped
 * string; the canonical form both the focus snapshot and the save payload use.
 */
export function serializeUnit(el: HTMLElement): string {
  return rawSerialize(el).replace(/\s+/g, " ").trim();
}
