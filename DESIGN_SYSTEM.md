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
