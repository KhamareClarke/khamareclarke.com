/**
 * Split a page title into the plain part and the part that carries the gold
 * gradient, so a template can render
 *
 *   <>{lead} <span className="gold-text">{gold}</span></>
 *
 * without hand-editing every heading.
 *
 * THE RULE — the trailing segment goes gold:
 *   1. Split at the first structural separator (`:`, `—`, `|`) and take everything
 *      after it. The separator stays with `lead`, so the gold reads as a clause
 *      rather than starting on stray punctuation.
 *   2. With no separator, take the final word.
 *   3. A single word stays entirely plain, and is returned as `lead` with an empty
 *      `gold`, so a heading can never render an empty gold span.
 *
 * This is not a rule invented for the pages that needed it. It describes what the
 * site already does everywhere the gold is applied to a title:
 *
 *   homepage   "Khamare "            + gold "Clarke"
 *   expertise  "SEO Specialist "     + gold "— What a Specialist Does That an Agency Won't"
 *   location   "SEO Specialist "     + gold "in Stoke-on-Trent"
 *
 * so the two templates that lacked it (service pages, glossary terms) get the same
 * treatment rather than a third variation.
 *
 * IMPORTANT — this must not change the heading's text. `lead + " " + gold` is
 * asserted to equal the input, because the h1 is the primary on-page signal on 85
 * keyword-targeted pages and it is what the metadata and structured data describe.
 * The split only adds markup around text that was already there.
 *
 * @param {string} text - the full heading, exactly as it appears today
 * @returns {{ lead: string, gold: string }}
 */
export function splitHeroTitle(text) {
  if (typeof text !== "string" || !text.trim()) return { lead: "", gold: "" };

  const withSeparator = text.match(/^([^:—|]*[:—|])\s*(.+)$/);
  if (withSeparator) {
    return { lead: withSeparator[1], gold: withSeparator[2] };
  }

  const lastSpace = text.lastIndexOf(" ");
  if (lastSpace === -1) return { lead: text, gold: "" };

  return { lead: text.slice(0, lastSpace), gold: text.slice(lastSpace + 1) };
}

/**
 * Rebuild the heading from a split, so callers and tests agree on exactly how the
 * two parts are joined. Templates render the JSX equivalent of this.
 */
/**
 * The same split, but with the trailing clause broken once more so a template can
 * stack the heading as THREE blocks.
 *
 *   "Search Engine Optimisation: What It Is and Why It Matters"
 *     -> term "Search Engine Optimisation:"   (white)
 *        mid  "What It Is"                    (gold)
 *        last "and Why It Matters"            (gold)
 *
 * The break inside the clause falls before the LAST " and ", which is the pattern
 * these headings are written to. A clause with no " and " stays whole in `mid` and
 * returns an empty `last`, so a caller can render two blocks instead of three
 * without special-casing anything; a title with no separator at all returns only
 * `term`, and a caller renders one.
 *
 * `term + " " + mid + " " + last` equals the input, separator included, so the h1's
 * textContent is byte-identical to the title it came from — the h1 is the primary
 * on-page signal on these pages and only the line breaks are new.
 */
export function splitHeroTitleThree(text) {
  const { lead, gold } = splitHeroTitle(text);
  if (!gold) return { term: lead, mid: "", last: "" };

  const at = gold.lastIndexOf(" and ");
  if (at === -1) return { term: lead, mid: gold, last: "" };

  return { term: lead, mid: gold.slice(0, at), last: gold.slice(at + 1) };
}

export function joinHeroTitle({ lead, gold }) {
  return gold ? `${lead} ${gold}` : lead;
}
