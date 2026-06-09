import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * A detached presenter window: pops out a second browser window that
 * mirrors the speaker notes for the current slide and updates live as
 * the deck advances. Put it on a second screen during a talk.
 *
 * Notes are rendered with inline styles so they don't depend on the
 * parent document's stylesheet (which the popup doesn't inherit).
 */
export function SpeakerNotesWindow({
  index,
  total,
  note,
  nextNote,
  onClose,
}: {
  index: number;
  total: number;
  note?: string;
  nextNote?: string;
  onClose: () => void;
}) {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const win = window.open(
      "",
      "speaker-notes",
      "width=420,height=520,menubar=no,toolbar=no",
    );
    if (!win) {
      onClose();
      return;
    }
    win.document.title = "Speaker notes";
    win.document.body.style.margin = "0";
    win.document.body.style.background = "#0b0b0c";
    const root = win.document.createElement("div");
    win.document.body.appendChild(root);
    setContainer(root);

    win.addEventListener("beforeunload", onClose);
    return () => {
      win.removeEventListener("beforeunload", onClose);
      win.close();
    };
  }, [onClose]);

  if (!container) return null;

  return createPortal(
    <div
      style={{
        fontFamily: "Libre Franklin, ui-sans-serif, system-ui, sans-serif",
        color: "#f5f5f5",
        minHeight: "100vh",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#8a8a8f",
        }}
      >
        Slide {index + 1} / {total}
      </div>
      <div
        style={{
          marginTop: 16,
          fontSize: 17,
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
        }}
      >
        {note?.trim() ? note : "No notes for this slide."}
      </div>
      {nextNote?.trim() ? (
        <div
          style={{
            marginTop: 28,
            paddingTop: 16,
            borderTop: "1px solid #2a2a2e",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#6a6a6f",
            }}
          >
            Next
          </div>
          <div
            style={{
              marginTop: 6,
              fontSize: 13,
              lineHeight: 1.55,
              color: "#a5a5ab",
              whiteSpace: "pre-wrap",
            }}
          >
            {nextNote}
          </div>
        </div>
      ) : null}
    </div>,
    container,
  ) as ReactNode;
}
