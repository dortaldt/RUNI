/**
 * Persist an inline slide edit back to the deck source via the dev endpoint
 * defined in `plugins/slide-editor.ts`. Dev-only — there is no server to write
 * to in a production build, so callers should gate on `import.meta.env.DEV`.
 */
export async function saveSlideEdit(
  original: string,
  replacement: string,
): Promise<{ ok: boolean; file?: string; error?: string }> {
  try {
    const res = await fetch("/__save-slide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ original, replacement }),
    });
    const data = await res.json();
    return res.ok
      ? { ok: true, file: data.file }
      : { ok: false, error: data.error ?? `HTTP ${res.status}` };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}
