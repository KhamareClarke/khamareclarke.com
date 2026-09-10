# ANTI-AI-DESIGN

**Purpose:** stop this site looking machine-generated.
**Applies to:** layout, colour, type, spacing, components, imagery.
**Pairs with:** ANTI-AI-COPY.md. Both are governing documents, named in the prompt.

---

## 0. How to use this

**As a governing document:**

```
Read only [file] and ANTI-AI-DESIGN.md.

Fix every violation of ANTI-AI-DESIGN.md in this file.

Use only the brand tokens defined in tailwind.config.js. Do not introduce
new colours, radii or shadow values.

str_replace only.
```

**As an audit.** Run the greps in section 6 to find which files diverge and by how much.

---

## 1. The underlying problem

A model builds toward the average of every template it has seen. That average is a Tailwind starter kit with a gradient hero and three feature cards.

The result is fluent and competent and looks exactly like everything else. Every section built to the same shape, no hierarchy between them, nothing that could only belong to this business.

**The test for any page:** could this be any company in this sector with the logo swapped? If yes, it fails.

---

## 2. Banned patterns

### 2.1 The purple to blue gradient

The strongest visual tell. Appears on hero backgrounds, buttons, and icon fills.

Replace with a flat brand colour, or a gradient between two shades of the same brand hue if depth is genuinely needed.

Also banned: `from-blue-900 via-blue-800 to-indigo-900` and every variant of it.

### 2.2 The three card row

Three cards across, each with a circled icon above a heading above two lines of text. Repeated down the page for features, benefits, and steps.

The problem is not three cards. It is that every section is three cards.

**Fix:** vary the shape. One section a row, one a list, one a single wide statement, one a table. Give the page a rhythm instead of a loop.

### 2.3 Everything centred

Centred at every breakpoint, in every section, with no left-aligned content anywhere.

Centre a hero. Left-align body content, lists, and anything over two lines. Reading centred paragraphs is genuinely harder.

### 2.4 Glassmorphism

Frosted translucent panels floating over a gradient. `backdrop-blur` on cards.

Dated and universal. Cut it.

### 2.5 The icon in a circle

A lucide icon inside a coloured circle, at the same size, in every section.

Use icons where they carry meaning, at varied scale, and not always in a circle. A section with no icon at all is fine.

### 2.6 The ghost numeral

Large translucent `01`, `02`, `03` sitting behind step cards.

Number the steps in normal text or do not number them.

### 2.7 The unsourced stat bar

Four large figures across a strip. `10,000+ customers`, `4.9 rating`, `24/7 support`, `100% satisfaction`.

If the figure is not real and attributable, it does not go on the page. This is a legal problem as well as a design one, since fabricated ratings are caught by the DMCC Act.

### 2.8 Generic stock photography

People in hard hats pointing at clipboards. Smiling diverse teams around laptops. Handshakes.

Real photographs of the actual business beat all of it, especially for trade work, where the customer is looking for evidence rather than decoration.

### 2.9 Emoji as interface icons

Never in UI. Fine in a genuinely informal context, which a service business site is not.

### 2.10 Radius chaos

`rounded-full` on cards, `rounded-lg` on some buttons, `rounded-xl` on others, `rounded-2xl` on a panel.

Three values total. One for cards, one for buttons, one for pills.

### 2.11 Shadow soup

Multiple elevation depths on one page. `shadow-sm`, `shadow-lg`, `shadow-xl`, `shadow-2xl` competing.

One elevation, or none. Flat with a border reads more considered than five shadow depths.

### 2.12 Raw utility colours as brand

`blue-900`, `blue-100`, `amber-400` used where a brand token belongs. Tailwind's blue is more saturated than most brand navies and the mismatch is visible.

Every brand colour comes from the token set. No exceptions.

### 2.13 Template repetition

The deepest tell, and the one the others come from. Every section the same height, the same padding, the same internal structure, differing only in copy.

**Fix by subtraction.** Cut to fewer, stronger sections, then make the one that carries the conversion look different from every other. A page written by a person has a section that matters most, and it shows.

---

## 3. Positive rules

**One heading weight across the site.** Pick it, use it everywhere. Mixing 700 and 800 between pages is the most common drift.

**Two type families maximum.** A display face for headings, a workhorse for body. Decide before any print run, because signage locks it in.

**Section rhythm written down as a sequence.** For example: white, tint, white, navy, tint. Then followed. Alternation decided per page is how sites end up with four consecutive white sections.

**Two container widths.** One for content, one for wide sections.

**Spacing from a scale.** Not arbitrary values. If the scale is 4, 8, 16, 24, 32, 48, 64, then nothing uses 30.

**Hierarchy between sections.** Not every section is equally important. The one that converts should be visually louder than the one that lists services.

**Left-align body copy.** Centre headings and heroes only.

**Real photographs where they exist.** Ask for them in discovery.

**Generated imagery only when directed.** A written prompt style held constant across the whole set, otherwise the images look like they came from four different sites.

---

## 4. Component inventory

Built once, used everywhere. Prevents five button recipes appearing across one build.

```
Button        primary, secondary, ghost. One radius, one weight
Card          one radius, one border treatment, one padding scale
Section       heading, optional eyebrow, optional subhead, container width
Badge         pill, one size, one weight
Form field    label, input, error state, help text
Nav           header, mobile drawer, footer
```

A page that needs something new adds it to the inventory rather than inventing it inline.

---

## 5. Responsive

Checked on a device, not a browser resize.

| Breakpoint | Note |
|---|---|
| 375px | The real gate. Most trade customers are on a phone |
| 768px | Where grids usually break |
| 1280px | Desktop |

**Common failures at 375px:** button subtext wrapping to three lines, a wide logo lockup shrinking past legibility, tables overflowing, headings breaking mid-word, sticky elements covering the conversion button.

---

## 6. Audit

**Colour fragmentation.** Shows how many shades of the brand colour are actually in use.

```powershell
Get-ChildItem -Path app,components -Include *.tsx -Recurse -File |
  Select-String -Pattern "#[0-9A-Fa-f]{6}" -AllMatches |
  ForEach-Object { $_.Matches.Value } |
  Group-Object | Sort-Object Count -Descending | Select-Object Count, Name
```

**Raw utility colours used as brand:**

```powershell
Get-ChildItem -Path app,components -Include *.tsx -Recurse -File |
  Select-String -Pattern "blue-[0-9]{2,3}|indigo-[0-9]{2,3}|amber-[0-9]{2,3}|purple-[0-9]{2,3}" |
  Group-Object Path | Sort-Object Count -Descending | Select-Object Count, Name
```

**Radius spread:**

```powershell
Get-ChildItem -Path app,components -Include *.tsx -Recurse -File |
  Select-String -Pattern "rounded-(sm|md|lg|xl|2xl|3xl|full)" -AllMatches |
  ForEach-Object { $_.Matches.Value } |
  Group-Object | Sort-Object Count -Descending
```

**Gradient tells:**

```powershell
Get-ChildItem -Path app,components -Include *.tsx -Recurse -File |
  Select-String -Pattern "from-purple|via-purple|to-purple|from-indigo|via-indigo|backdrop-blur" |
  Select-Object Path, LineNumber, Line
```

---

## 7. Skills

| Task | Skills |
|---|---|
| Page layout and conversion | `page-cro`, `marketing-psychology` |
| Forms | `form-cro` |
| Signup flow | `signup-flow-cro`, `onboarding-cro` |
| Popups and interstitials | `popup-cro` |
| Paywall or upgrade prompts | `paywall-upgrade-cro` |

Skills do the thinking. This document sets the constraints they work inside.

---

## 8. Order of work

1. Brand tokens into the config first. Nothing else until they exist.
2. Colour collapse, one file per session, hardcoded hex and raw utilities to tokens.
3. Radius and shadow, one value each, decided before the pass starts.
4. Component inventory built.
5. Pattern fixes per page, worst first from the audit.
6. Responsive check on a real device, last.

---

## 9. The final test

Open the homepage next to three competitor sites on a phone.

If a stranger could not tell which one is yours with the logos covered, it fails.
