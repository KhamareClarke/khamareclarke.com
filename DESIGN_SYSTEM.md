# Unified UI Design System (UAE Template)

This project uses a shared design system based on the **UAE Private Investor** structural template. Layout, spacing, typography, and component structure are standardized; **brand colors remain** (KhamareClarke amber/gold).

## Design Tokens

**File:** `src/app/design-tokens.css`

- **Spacing:** `--space-1` (8px) through `--space-6` (64px)
- **Typography:** H1 (hero), H2 (section), H3 (subsection), body – via `--font-size-h1`, etc.
- **Border radius:** `--radius-default` (12px), `--radius-lg`, `--radius-xl`
- **Shadows:** `--shadow-sm` through `--shadow-xl`
- **Containers:** `--container-main` (1200px), `--container-wide` (1400px), `--container-narrow` (896px)

Tokens are imported in `src/app/globals.css`. Tailwind theme extends: `max-w-content`, `rounded-ds`, `shadow-ds-*`, `py-ds-*`, `gap-ds-*`, etc.

## UI Components (`src/app/components/ui/`)

| Component        | Purpose                                              |
|-----------------|------------------------------------------------------|
| **Section**     | Page section with vertical rhythm (`as="section" \| "div" \| "footer"`). |
| **Container**   | Max-width + padding (`size="main" \| "wide" \| "narrow" \| "content"`).   |
| **NavbarWrapper** | Wraps navbar content with design-system container.  |

## Layout Structure (UAE Template)

1. **Navbar** (with NavbarWrapper)
2. **Main content** inside **Section** + **Container**
3. **Footer** (Section as="footer" + Container)

**Do not change:** backend logic, API routes, auth, routing, or file structure. Only layout, spacing, typography, and UI styling.

## Advisory quality-control skills

Three third-party skills are available as **advisory** review tools. They are
installed in Skyscraper at `~/.config/skyscraper/agents/slop-skills/`:

| Skill | Role |
|---|---|
| `no-ai-slop-writing` | Reviews prose for AI writing patterns |
| `unslop-ui-review` | Reviews UI for generic/template "tells" |
| `no-slop-design` | Design workflow + `slop_lint.py` source scan |

**They are advisory. They do not govern this site.**

### Order of authority

1. `BUILD-STANDARD.md`
2. This file, `src/app/design-tokens.css` and `tailwind.config.js`
3. `ANTI-AI-DESIGN.md`
4. `ANTI-AI-COPY.md`
5. …then the advisory skills

Where a skill and a project standard disagree, **the project standard wins.**

### Standing resolutions

These conflicts are recorded so they are not re-litigated on every run:

| Skill says | This project | Resolution |
|---|---|---|
| Don't ship Inter / Geist | Inter is the system face | **Inter stays.** |
| No gradient-clipped text | Gold gradient text is the brand signature | **Gold gradient text stays.** |
| `no-slop-design` requires `design/brief.md` + DTCG `tokens/` and `build_tokens.py` | This project governs via `tailwind.config.js` + `design-tokens.css` | **This project's token model stays.** The skill's record-keeping is not adopted as governance. |
| Flags `neon-on-black` / ambient glow | `.section-sep` glow is a dated, client-approved exception | **The exception stands** (`BUILD-STANDARD.md` §6.2). |

### Where the skills do bind

The skills bind where they **agree** with this project's standards — emoji as
interface icons, radius discipline, em dashes, focus visibility, contrast, mobile
overflow, word-safe truncation. A finding in that overlap is a genuine defect.

A skill recommendation that would change an approved brand decision is reported
to Master Clarke as a **proposal** and never applied automatically.

Full detail: `~/.config/skyscraper/agents/slop-skills/README.md`
