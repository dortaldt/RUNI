import type { Plugin } from "vite";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Dev-only endpoint that persists inline slide edits back to source.
 *
 * The browser edit mode (see Deck.tsx) sends `{ original, replacement }` where
 * `original` is the exact text currently rendered and `replacement` is the new
 * text. We locate that text inside `src/decks/*.tsx` and rewrite it in place,
 * so the edit survives reloads and Vite HMR re-renders it immediately.
 *
 * Safety: we only write when the text resolves to exactly ONE location across
 * all deck files. Anything ambiguous is refused (409) rather than guessed at,
 * so an edit can never corrupt the wrong slide.
 */
export function slideEditor(): Plugin {
  return {
    name: "slide-editor",
    apply: "serve",
    configureServer(server) {
      const decksDir = path.resolve(server.config.root, "src/decks");

      server.middlewares.use("/__save-slide", (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end("Method Not Allowed");
          return;
        }

        let body = "";
        req.on("data", (c) => (body += c));
        req.on("end", async () => {
          const reply = (status: number, payload: object) => {
            res.statusCode = status;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(payload));
          };

          try {
            const { original, replacement } = JSON.parse(body || "{}");
            if (typeof original !== "string" || typeof replacement !== "string") {
              return reply(400, { ok: false, error: "original/replacement required" });
            }
            if (original === replacement) {
              return reply(200, { ok: true, unchanged: true });
            }
            if (!original.trim()) {
              return reply(400, { ok: false, error: "empty original text" });
            }

            const files = (await fs.readdir(decksDir))
              .filter((f) => f.endsWith(".tsx"))
              .map((f) => path.join(decksDir, f));

            const hits: Array<{
              file: string;
              kind: "literal" | "text";
              start: number;
              end: number;
            }> = [];

            for (const file of files) {
              const src = await fs.readFile(file, "utf8");
              // 1) Prefer matching a JS/TS string literal whose *decoded*
              //    contents equal the original text (covers prop strings and
              //    array entries — the bulk of slide content).
              for (const m of src.matchAll(STRING_LITERAL)) {
                const decoded = decodeLiteral(m[0]);
                if (decoded === original) {
                  hits.push({
                    file,
                    kind: "literal",
                    start: m.index!,
                    end: m.index! + m[0].length,
                  });
                }
              }
            }

            // 2) Fallback: raw JSX text (between tags), only if no literal hit.
            if (hits.length === 0) {
              for (const file of files) {
                const src = await fs.readFile(file, "utf8");
                let from = 0;
                let at: number;
                while ((at = src.indexOf(original, from)) !== -1) {
                  hits.push({ file, kind: "text", start: at, end: at + original.length });
                  from = at + original.length;
                }
              }
            }

            if (hits.length === 0) {
              return reply(404, {
                ok: false,
                error: "couldn't locate that text in any deck source",
              });
            }
            if (hits.length > 1) {
              return reply(409, {
                ok: false,
                error: `text appears ${hits.length} times — too ambiguous to save safely`,
              });
            }

            const hit = hits[0];
            const src = await fs.readFile(hit.file, "utf8");
            const insert =
              hit.kind === "literal"
                ? encodeLiteral(replacement, src[hit.start])
                : replacement;
            const next = src.slice(0, hit.start) + insert + src.slice(hit.end);
            await fs.writeFile(hit.file, next, "utf8");

            return reply(200, { ok: true, file: path.basename(hit.file) });
          } catch (err) {
            return reply(500, { ok: false, error: String(err) });
          }
        });
      });
    },
  };
}

/** Matches a single- or double-quoted JS string literal (with escapes). */
const STRING_LITERAL = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g;

/** Decode a matched literal (including its surrounding quotes) to its value. */
function decodeLiteral(literal: string): string {
  const quote = literal[0];
  const inner = literal.slice(1, -1);
  // Normalize to a double-quoted JSON string, then parse.
  const jsonReady =
    quote === '"'
      ? literal
      : '"' + inner.replace(/\\'/g, "'").replace(/"/g, '\\"') + '"';
  try {
    return JSON.parse(jsonReady);
  } catch {
    // Best-effort manual unescape if JSON.parse trips on something exotic.
    return inner.replace(/\\(.)/g, "$1");
  }
}

/** Produce a valid string literal for `value`, preferring the original quote. */
function encodeLiteral(value: string, quote: string): string {
  if (quote === "'") {
    const body = value
      .replace(/\\/g, "\\\\")
      .replace(/'/g, "\\'")
      .replace(/\n/g, "\\n");
    return "'" + body + "'";
  }
  // JSON.stringify gives a correctly-escaped double-quoted literal.
  return JSON.stringify(value);
}
