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
            const { original, replacement, op } = JSON.parse(body || "{}");
            const deleting = op === "delete";
            if (typeof original !== "string") {
              return reply(400, { ok: false, error: "original required" });
            }
            if (!deleting && typeof replacement !== "string") {
              return reply(400, { ok: false, error: "replacement required" });
            }
            if (!deleting && original === replacement) {
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

            const hasMarkup = /<\/?(?:strong|em|br)\b/.test(original);

            // 1) Plain-text edits: prefer a JS/TS string literal whose *decoded*
            //    contents equal the original (covers prop strings and array
            //    entries — the bulk of slide content). Skipped when the original
            //    carries inline markup, which never lives in a string literal.
            if (!hasMarkup) {
              for (const file of files) {
                const src = await fs.readFile(file, "utf8");
                for (const m of src.matchAll(STRING_LITERAL)) {
                  if (decodeLiteral(m[0]) === original) {
                    hits.push({
                      file,
                      kind: "literal",
                      start: m.index!,
                      end: m.index! + m[0].length,
                    });
                  }
                }
              }
            }

            // 2) JSX text (between tags), incl. inline <strong>/<em>. Whitespace-
            //    tolerant: rendered HTML collapses the source's newlines/indent,
            //    so we match token-by-token with flexible gaps. Only when no
            //    literal hit, so plain content stays on the exact-literal path.
            if (hits.length === 0) {
              const re = flexibleMatcher(original);
              for (const file of files) {
                const src = await fs.readFile(file, "utf8");
                for (const m of src.matchAll(re)) {
                  hits.push({
                    file,
                    kind: "text",
                    start: m.index!,
                    end: m.index! + m[0].length,
                  });
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

            // Delete: remove the whole array element this text belongs to —
            // the string literal or <>…</> fragment plus its trailing comma —
            // so the bullet (icon and all, since the template renders one row
            // per entry) disappears. Refuse anything that isn't an array entry.
            if (deleting) {
              const range = arrayElementRange(src, hit.start, hit.end);
              if (!range) {
                return reply(409, {
                  ok: false,
                  error: "that text isn't a list item — only bullets can be removed",
                });
              }
              const next = src.slice(0, range[0]) + src.slice(range[1]);
              await fs.writeFile(hit.file, next, "utf8");
              return reply(200, { ok: true, file: path.basename(hit.file) });
            }

            const addsMarkup = /<\/?(?:strong|em|br)\b/.test(replacement);

            // Refuse the one case we can't write cleanly: markup landing in a
            // PARTIAL match inside a string literal (the flexible "text" path
            // matched only a slice of a quoted string). Rewriting there would
            // splice tags into the middle of a literal and render them verbatim.
            // A whole-literal hit is fine — we convert it to JSX below.
            if (
              addsMarkup &&
              hit.kind === "text" &&
              isInsideStringLiteral(src, hit.start, hit.end)
            ) {
              return reply(409, {
                ok: false,
                error:
                  "that text is stored as a plain string — formatting can't be added inline here",
              });
            }

            // Choose how to write the replacement:
            //   • literal + markup → convert the whole string literal to a JSX
            //     fragment so the bold/italic actually renders ("a" → <>a <strong>b</strong></>)
            //   • literal, no markup → keep it a string literal (plain edit)
            //   • text → JSX children: keep the markup tags, escape the rest
            let insert: string;
            if (hit.kind === "literal" && addsMarkup) {
              insert = literalToJsx(src, hit.start, replacement);
            } else if (hit.kind === "literal") {
              insert = encodeLiteral(replacement, src[hit.start]);
            } else {
              insert = jsxifyMarkup(replacement);
            }
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

/**
 * Matches a double-quoted JS string literal (with escapes). We deliberately do
 * NOT match single-quoted strings: deck source uses double quotes for every
 * literal, while apostrophes ('don't', "another pair's flow") are everywhere in
 * JSX prose. Treating those as string delimiters mis-pairs quotes and swallows
 * whole slides, so a real literal next to an apostrophe never gets found.
 */
const STRING_LITERAL = /"(?:[^"\\]|\\.)*"/g;

/**
 * True when the span [start, end) falls within a quoted string literal in `src`.
 * Used to reject markup edits that the flexible "text" matcher located *inside*
 * a literal — writing JSX tags there renders them verbatim, not as formatting.
 */
function isInsideStringLiteral(src: string, start: number, end: number): boolean {
  for (const m of src.matchAll(STRING_LITERAL)) {
    const lo = m.index!;
    const hi = lo + m[0].length;
    if (start >= lo && end <= hi) return true;
  }
  return false;
}

/**
 * Given the span [start, end) of a located item (a string literal, or the inner
 * text of a `<>…</>` fragment), return the [cutStart, cutEnd) range to splice
 * out so the whole array element — fragment wrapper and trailing comma included —
 * is removed, leaving neighbouring entries and their commas intact.
 *
 * Returns null when the span isn't a top-level array entry (e.g. it's a prop
 * value or an object field), so we never delete something that isn't a bullet.
 */
function arrayElementRange(
  src: string,
  start: number,
  end: number,
): [number, number] | null {
  // Walk left past whitespace and an opening `<>` to the element's boundary.
  let i = start - 1;
  while (i >= 0 && /\s/.test(src[i])) i--;
  if (src[i] === ">" && src[i - 1] === "<") {
    i -= 2;
    while (i >= 0 && /\s/.test(src[i])) i--;
  }
  const leftChar = src[i]; // expect ',' (prev entry) or '[' (first entry)

  // Walk right past whitespace and a closing `</>` to the following separator.
  let j = end;
  while (j < src.length && /\s/.test(src[j])) j++;
  if (src.slice(j, j + 3) === "</>") {
    j += 3;
    while (j < src.length && /\s/.test(src[j])) j++;
  }
  const rightChar = src[j]; // expect ',' (more entries) or ']' (last entry)

  const inArray = (leftChar === "," || leftChar === "[") &&
    (rightChar === "," || rightChar === "]");
  if (!inArray) return null;

  // Keep the left boundary char; drop from just after it through this entry's
  // trailing comma (or up to the closing ']' when it's the last entry).
  return [i + 1, rightChar === "," ? j + 1 : j];
}

/**
 * Convert the string literal at `start` into a JSX fragment carrying `body`
 * (which holds normalized <strong>/<em>/<br /> markup). This is what lets you
 * bold a word that lives in a plain string: "go back" → <>go <strong>back</strong></>.
 *
 * Picks the right wrapper for the literal's syntactic position:
 *   • a JSX attribute (`intro="…"`) needs braces → `intro={<>…</>}`
 *   • an array entry or expression slot takes the fragment bare → `<>…</>`
 * Stray braces in the prose are escaped so they stay literal text in JSX.
 */
function literalToJsx(src: string, start: number, body: string): string {
  const fragment = `<>${jsxifyMarkup(body)}</>`;
  let i = start - 1;
  while (i >= 0 && /\s/.test(src[i])) i--;
  return src[i] === "=" ? `{${fragment}}` : fragment;
}

/**
 * Turn a serialized unit (text plus normalized <strong>/<em>/<br /> tags) into
 * safe JSX children: the known tags pass through untouched, everything else is
 * escaped so JSX-special characters in prose — `<` ("padding < gaps"), `{`, `}`,
 * `&` — stay literal text instead of being parsed as tags or expressions.
 */
function jsxifyMarkup(body: string): string {
  const TAG = /(<\/?(?:strong|em)>|<br\s*\/?>)/g;
  return body
    .split(TAG)
    .map((part) => {
      if (!part) return "";
      if (/^<\/?(?:strong|em)>$/.test(part)) return part;
      if (/^<br\s*\/?>$/.test(part)) return "<br />";
      return part
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\{/g, "&#123;")
        .replace(/\}/g, "&#125;");
    })
    .join("");
}

/**
 * Build a global regex that matches `text` allowing any run of whitespace where
 * `text` has a single space. The browser sends content with newlines/indent
 * collapsed; the JSX source wraps and indents the same content across lines.
 * Matching token-by-token with `\s+` gaps bridges that without touching the
 * meaningful characters.
 */
function flexibleMatcher(text: string): RegExp {
  const pattern = text
    .trim()
    .split(/\s+/)
    .map((tok) => tok.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("\\s+");
  return new RegExp(pattern, "g");
}

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
