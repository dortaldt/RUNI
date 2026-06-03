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
import { saveSlideEdit } from "@/lib/saveSlide";

type Toast = { kind: "pending" | "ok" | "err"; text: string };

/**
 * Deck player: renders one slide at a time in a centered 16:9 stage,
 * with keyboard nav (←/→), a counter, and a top-right menu holding
 * Home, print-to-PDF, and a pop-out speaker-notes window.
 */
export function Deck({
  slides,
  notes,
}: {
  slides: ReactNode[];
  notes?: string[];
}) {
  const [i, setI] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
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

  // Edit mode: make every text-bearing leaf in the current slide editable, and
  // persist changes to source on blur. Re-runs when the slide (i) changes.
  useEffect(() => {
    if (!editing) return;
    const root = stageRef.current;
    if (!root) return;

    const leaves = Array.from(root.querySelectorAll<HTMLElement>("*")).filter(
      (el) => el.children.length === 0 && (el.textContent ?? "").trim() !== "",
    );

    const cleanups: Array<() => void> = [];
    for (const el of leaves) {
      el.contentEditable = "true";
      el.spellcheck = false;
      el.dataset.slideEditable = "true";

      const onFocus = () => {
        el.dataset.slideOriginal = el.textContent ?? "";
      };
      const onBlur = async () => {
        const original = el.dataset.slideOriginal ?? "";
        const next = el.textContent ?? "";
        if (next === original) return;
        setToast({ kind: "pending", text: "Saving…" });
        const r = await saveSlideEdit(original, next);
        if (r.ok) {
          el.dataset.slideOriginal = next;
          setToast({ kind: "ok", text: `Saved → ${r.file}` });
        } else {
          el.textContent = original; // revert on failure
          setToast({ kind: "err", text: r.error ?? "Save failed" });
        }
      };
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          el.blur(); // commit single-line edits
        }
        if (e.key === "Escape") {
          el.textContent = el.dataset.slideOriginal ?? "";
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

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-6">
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

      {/* On screen: one slide. In print: the stage shows all slides stacked. */}
      <div className="slide-stage w-full max-w-6xl overflow-hidden print:max-w-none">
        {/* screen view - re-keyed each step so the entrance animation replays */}
        <div
          key={i}
          ref={stageRef}
          className={`animate-slide-in print:hidden ${editing ? "slide-editing" : ""}`}
        >
          {slides[i]}
        </div>
        {/* print view */}
        <div className="hidden print:block">
          {slides.map((s, idx) => (
            <div key={idx}>{s}</div>
          ))}
        </div>
      </div>

      <div className="deck-chrome flex items-center gap-2">
        <button
          onClick={() => go(-1)}
          disabled={i === 0}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-25"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-caption tabular-nums text-muted-foreground">
          {i + 1} / {slides.length}
        </span>
        <button
          onClick={() => go(1)}
          disabled={i === last}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-25"
          aria-label="Next slide"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
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
          Editing · click text to change it
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
