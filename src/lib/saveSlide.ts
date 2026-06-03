/**
 * Persist an inline slide edit back to the deck source via the dev endpoint
 * defined in `plugins/slide-editor.ts`. Dev-only — there is no server to write
 * to in a production build, so callers should gate on `import.meta.env.DEV`.
 */
type SaveResult = { ok: boolean; file?: string; error?: string };

async function postSlide(payload: object): Promise<SaveResult> {
  try {
    const res = await fetch("/__save-slide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return res.ok
      ? { ok: true, file: data.file }
      : { ok: false, error: data.error ?? `HTTP ${res.status}` };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

export function saveSlideEdit(original: string, replacement: string) {
  return postSlide({ original, replacement });
}

/** Remove the whole array element (bullet + icon) this text belongs to. */
export function deleteSlideItem(original: string) {
  return postSlide({ original, op: "delete" });
}
