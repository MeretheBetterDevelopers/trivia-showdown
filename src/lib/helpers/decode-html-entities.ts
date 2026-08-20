import { decode } from "he";

// OTDB encodes question/answer text with HTML entities (not just the
// basic &amp;/&quot;/etc. — things like &deg; or accented letters too).
// he.decode() covers the full HTML5 named + numeric entity set instead
// of a hand-maintained allowlist that silently misses ones we haven't
// hit yet.
export function decodeHtmlEntities(str: string): string {
  return decode(str);
}
