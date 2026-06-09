import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Printer,
  Home,
  StickyNote,
  MoreVertical,
  Pencil,
} from "lucide-react";
import { SpeakerNotesWindow } from "./SpeakerNotesWindow";
import { DeckMetaProvider } from "@/slides/templates";
import { saveSlideEdit, deleteSlideItem } from "@/lib/saveSlide";
import { collectUnits, serializeUnit } from "@/lib/slideEdit";

type Toast = { kind: "pending" | "ok" | "err"; text: string };

// Slides are authored at a fixed 16:9 base (matching the print page) and then
// scaled to fit the viewport, so they fill the screen on any monitor while the
// rem-based type scale stays perfectly proportioned. See `useFitScale`.
const BASE_W = 1280;
const BASE_H = 720;

/**
 * Returns the scale factor for the largest 16:9 box that fits the current
 * viewport, after reserving room for the deck chrome (padding + the counter
 * below the stage). Recomputes on resize.
 */
function useFitScale() {
  const compute = () => {
    if (typeof window === "undefined") return 1;
    const availW = window.innerWidth - 96; // px-6 on both sides
    const availH = window.innerHeight - 168; // py-6 + gap-6 + counter row
    return Math.min(availW / BASE_W, availH / BASE_H);
  };
  const [scale, setScale] = useState(compute);
  useEffect(() => {
    const onResize = () => setScale(compute());
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return Math.max(0.1, scale);
}

/**
 * Deck player: renders one slide at a time in a centered 16:9 stage,
 * with keyboard nav (←/→), a counter, and a top-right menu holding
 * Home, print-to-PDF, and a pop-out speaker-notes window.
 */
export function Deck({
  slides,
  notes,
  footer,
}: {
  slides: ReactNode[];
  notes?: string[];
  /** Running dateline shown on every content slide (e.g. "Week 7 · … · Dor Tal"). */
  footer?: string;
}) {
  const [i, setI] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [jumpOpen, setJumpOpen] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const jumpRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const scale = useFitScale();
  const last = slides.length - 1;
  const canEdit = import.meta.env.DEV;

  const go = useCallback(
    (delta: number) => setI((cur) => Math.min(last, Math.max(0, cur + delta))),
    [last],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Don't hijack arrows/space while the user is typing in a slide.
      if ((e.target as HTMLElement)?.isContentEditable) return;
      if (e.key === "ArrowRight" || e.key === " ") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  // Edit mode: make every text container in the current slide editable — both
  // its words and its inline formatting (bold/italic) — and persist changes to
  // source on blur. Content is serialized to a normalized, JSX-shaped string so
  // a <strong> toggle round-trips. Re-runs when the slide (i) changes.
  useEffect(() => {
    if (!editing) return;
    const root = stageRef.current;
    if (!root) return;

    // Prefer tag-based markup (<b>/<i>) over inline-styled spans for execCommand.
    try {
      document.execCommand("styleWithCSS", false, "false");
    } catch {
      /* not supported — serializer folds styled spans anyway */
    }

    const units = collectUnits(root);

    const cleanups: Array<() => void> = [];
    for (const el of units) {
      el.contentEditable = "true";
      el.spellcheck = false;
      el.dataset.slideEditable = "true";

      const onFocus = () => {
        el.dataset.slideOriginal = serializeUnit(el);
      };
      const onBlur = async () => {
        if (el.dataset.slideDeleted) return; // deletion already handled it
        const original = el.dataset.slideOriginal ?? "";
        const next = serializeUnit(el);
        if (next === original) return;

        // Emptying a bullet removes the whole item (icon and all), rather than
        // leaving a blank row. Deletion is refused server-side for anything
        // that isn't an array entry, so a blanked prop just reverts.
        if ((el.textContent ?? "").trim() === "") {
          el.dataset.slideDeleted = "1";
          setToast({ kind: "pending", text: "Removing…" });
          const r = await deleteSlideItem(original);
          if (r.ok) {
            setToast({ kind: "ok", text: `Removed → ${r.file}` });
          } else {
            delete el.dataset.slideDeleted;
            el.innerHTML = original; // restore on failure
            setToast({ kind: "err", text: r.error ?? "Remove failed" });
          }
          return;
        }

        setToast({ kind: "pending", text: "Saving…" });
        const r = await saveSlideEdit(original, next);
        if (r.ok) {
          el.dataset.slideOriginal = next;
          setToast({ kind: "ok", text: `Saved → ${r.file}` });
        } else {
          el.innerHTML = original; // revert on failure
          setToast({ kind: "err", text: r.error ?? "Save failed" });
        }
      };
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          el.blur(); // commit single-line edits (or remove, if emptied)
        }
        if (e.key === "Escape") {
          el.innerHTML = el.dataset.slideOriginal ?? "";
          el.blur();
        }
      };

      el.addEventListener("focus", onFocus);
      el.addEventListener("blur", onBlur);
      el.addEventListener("keydown", onKeyDown);
      cleanups.push(() => {
        el.removeAttribute("contenteditable");
        el.removeAttribute("data-slide-editable");
        el.removeEventListener("focus", onFocus);
        el.removeEventListener("blur", onBlur);
        el.removeEventListener("keydown", onKeyDown);
      });
    }
    return () => cleanups.forEach((c) => c());
  }, [editing, i, slides]);

  // Auto-dismiss success/error toasts.
  useEffect(() => {
    if (!toast || toast.kind === "pending") return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  // Close the menu on outside click.
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  // Close the jump-to-slide selector on outside click or Escape.
  useEffect(() => {
    if (!jumpOpen) return;
    const onClick = (e: MouseEvent) => {
      if (jumpRef.current && !jumpRef.current.contains(e.target as Node))
        setJumpOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setJumpOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [jumpOpen]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden bg-background p-6 print:overflow-visible">
      {/* Edge click zones for navigation - sit below the chrome (z-20) so
          menu/buttons stay clickable, above the slide stage edges. */}
      <button
        onClick={() => go(-1)}
        disabled={i === 0}
        aria-label="Previous slide"
        className="group absolute inset-y-0 left-0 z-10 w-[12%] cursor-pointer disabled:cursor-default print:hidden"
      >
        <ChevronLeft className="absolute left-3 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-60 group-disabled:opacity-0" />
      </button>
      <button
        onClick={() => go(1)}
        disabled={i === last}
        aria-label="Next slide"
        className="group absolute inset-y-0 right-0 z-10 w-[12%] cursor-pointer disabled:cursor-default print:hidden"
      >
        <ChevronRight className="absolute right-3 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-60 group-disabled:opacity-0" />
      </button>

      {/* Top-right chrome - kept at caption scale */}
      <div ref={menuRef} className="deck-chrome absolute right-6 top-6 z-20 flex items-center gap-1">
        <button
          onClick={() => navigate("/")}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Home"
        >
          <Home className="h-4 w-4" />
        </button>
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          <MoreVertical className="h-4 w-4" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-full mt-1.5 w-44 overflow-hidden rounded-md border bg-card p-1 shadow-md">
            {[
              ...(canEdit
                ? [
                    {
                      icon: Pencil,
                      label: editing ? "Done editing" : "Edit slides",
                      onClick: () => setEditing((e) => !e),
                    },
                  ]
                : []),
              { icon: Printer, label: "PDF", onClick: () => window.print() },
              {
                icon: StickyNote,
                label: notesOpen ? "Close notes" : "Speaker notes",
                onClick: () => setNotesOpen((o) => !o),
              },
            ].map(({ icon: Icon, label, onClick }) => (
              <button
                key={label}
                onClick={() => {
                  setMenuOpen(false);
                  onClick();
                }}
                className="flex w-full items-center gap-2.5 rounded-sm px-2.5 py-1.5 text-left text-caption hover:bg-muted"
              >
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <DeckMetaProvider footer={footer}>
        {/* Screen view: the slide is authored at BASE_W×BASE_H and scaled to fill
            the viewport. The outer box takes the *scaled* dimensions so centering
            and the gap to the counter stay correct; the inner box keeps the base
            dimensions and is transform-scaled. Hidden in print. */}
        <div
          className="overflow-hidden print:hidden"
          style={{ width: BASE_W * scale, height: BASE_H * scale }}
        >
          {/* re-keyed each step so the entrance animation replays */}
          <div
            key={i}
            ref={stageRef}
            className={`animate-slide-in origin-top-left ${editing ? "slide-editing" : ""}`}
            style={{ width: BASE_W, height: BASE_H, transform: `scale(${scale})` }}
          >
            {slides[i]}
          </div>
        </div>
        {/* Print view: every slide stacked, one page each (see print CSS). */}
        <div className="slide-stage hidden w-full print:block">
          {slides.map((s, idx) => (
            <div key={idx}>{s}</div>
          ))}
        </div>
      </DeckMetaProvider>

      <div className="deck-chrome flex items-center gap-2">
        <button
          onClick={() => go(-1)}
          disabled={i === 0}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-25"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div ref={jumpRef} className="relative">
          <button
            onClick={() => setJumpOpen((o) => !o)}
            className="rounded-md px-1.5 py-0.5 text-caption tabular-nums text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Jump to slide"
            aria-expanded={jumpOpen}
          >
            {i + 1} / {slides.length}
          </button>
          {jumpOpen && (
            <div className="absolute bottom-full left-1/2 mb-1.5 max-h-[40vh] w-60 -translate-x-1/2 overflow-y-auto rounded-md border bg-card p-2 shadow-md">
              <div className="grid grid-cols-6 gap-1">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setI(idx);
                      setJumpOpen(false);
                    }}
                    className={`rounded-sm py-1 text-caption tabular-nums ${
                      idx === i
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <button
          onClick={() => go(1)}
          disabled={i === last}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-25"
          aria-label="Next slide"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        {footer && (
          <span className="ml-3 border-l pl-3 text-caption uppercase tracking-widest text-muted-foreground/70">
            {footer}
          </span>
        )}
      </div>

      {notesOpen && (
        <SpeakerNotesWindow
          index={i}
          total={slides.length}
          note={notes?.[i]}
          nextNote={notes?.[i + 1]}
          onClose={() => setNotesOpen(false)}
        />
      )}

      {editing && (
        <div className="deck-chrome pointer-events-none absolute left-6 top-6 z-20 flex items-center gap-1.5 rounded-md bg-accent px-2.5 py-1 text-caption font-semibold text-accent-foreground print:hidden">
          <Pencil className="h-3 w-3" />
          Editing · click text to change it · clear a bullet to remove it
        </div>
      )}

      {toast && (
        <div
          className={`deck-chrome fixed bottom-6 right-6 z-30 rounded-md px-3 py-2 text-caption font-medium shadow-md print:hidden ${
            toast.kind === "err"
              ? "bg-[#b42318] text-white"
              : "bg-foreground text-background"
          }`}
        >
          {toast.text}
        </div>
      )}
    </div>
  );
}
