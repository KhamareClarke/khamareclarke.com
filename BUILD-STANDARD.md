# BUILD-STANDARD

**Universal. Project-agnostic. Copied into the root of every build.**

This document governs how a site is built, what it may claim, how it reads, and how it looks. It contains no project-specific values. Colours, fonts, trade categories and claims live in the project brief, which is written per client and referenced by this document.

---

## 0. How to use this

**Every prompt names this document.**

```
Read only [one file] and BUILD-STANDARD.md.

[One instruction.]

str_replace only. No redesign, no restructuring, no styling changes.
```

Nothing after the last line. No file lists.

**Two documents govern a build.** This one, which never changes, and `PROJECT-BRIEF.md`, which is written fresh each time and holds everything specific: the palette, the type pairing, the permitted claims, the certifications, the trade categories.

**The division:** this document says what good looks like. The brief says what this client's version of it is.

---

## 1. First principle

The AI does the typing. The human does the deciding.

Every rule below exists because a model, left to complete text or layout unsupervised, regresses to the statistical average of everything it has seen. That average is competent, fluent, and identical to everything else. It also makes claims nobody checked.

The output of an unsupervised build is not wrong in obvious ways. It is wrong in ways that surface later, when a regulator asks what a claim is based on, or a bill arrives, or a customer notices the site says something the business cannot do.

---

## 2. Session discipline

Non-negotiable. Each rule was paid for.

| Rule | Reason |
|---|---|
| One file per session | Two large files plus a governing document exceeds the context window |
| Clear context between every file | Files stay loaded across compacts and drag back in |
| Never paste a file list into a prompt | It reads the whole list at once and dies |
| Name files it must not read | Especially API routes and config |
| Verify the governing document version first | Working from a stale document produces confident wrong output |
| Build after every file | Type checking stops at the first error, so one break hides the rest |
| Commit after every file | Recovery point |

**When a document is updated, replace the file manually.** Never ask the model to reproduce it from memory. It will write a plausible version and every downstream decision inherits the drift.

---

## 3. Build sequence

The order is load-bearing. Each phase depends on the one before it being settled.

| Phase | Output | Gate |
|---|---|---|
| 1. Discovery | Written brief | Client confirms every fact in it |
| 2. Claims specification | Permitted claims list | Client signs off, evidence seen |
| 3. Design tokens | Colours, type, spacing, radius in config | No page files touched yet |
| 4. Design direction | Written decisions, component inventory | Direction recorded in the brief |
| 5. Truth on the page | Every claim matches the specification | Audit greps return clean |
| 6. Copy | Reads as human-written | Read aloud on a phone |
| 7. Integrations | CRM, analytics, search console, payments | Live test produces a visible result |
| 8. Cost controls | Field masks, caching, budget caps | No paid call at request time |
| 9. Architecture | Routes, redirects, sitemap, robots | Build generates expected page count |
| 10. Legal | Policies, registrations, disclosures | No placeholders anywhere |

**Skipping ahead means doing it twice.** Copy written before claims are settled gets rewritten. Pages built before tokens exist fragment the palette. Design chosen before the claims are known ends up with nowhere to put the proof.

---

## 4. Claims and compliance

The part that protects the client. Universal framework, filled in per project.

### 4.1 The rule

**Every claim on the site maps to evidence, or it does not appear.**

Not "we are confident this is true". Evidence, held, current, and checkable.

### 4.2 Claim categories

| Category | Evidence required |
|---|---|
| Certification or registration | Registration number, issuing body, expiry, verified against the public register |
| Insurance | Certificate, cover type, limit, insurer, expiry |
| Legal status | Companies House number and status, or equivalent evidence for a sole trader |
| Experience or history | Verifiable. Trading records, filed accounts, dated evidence |
| Ratings or reviews | Real, sourced, and attributable to identifiable customers |
| Volume claims | Actual counts from actual records |
| Guarantees | A guarantee product that exists, with published terms |

### 4.3 Never permitted, on any project

- Any figure that is not real. Ratings, review counts, customer counts, years in business, jobs completed
- `AggregateRating`, `ratingValue` or `reviewCount` in structured data without real reviews behind it
- "Fully insured" without naming the cover type and limit
- "Approved", "accredited" or "certified" without naming who approved, accredited or certified
- "Guaranteed" without a guarantee product
- "Vetted", "screened", "checked" used loosely without stating what was checked
- Any regulator registration number that is a placeholder
- Any claim about a check that was not run

### 4.4 Structured data is the priority

A fabricated rating in JSON-LD publishes to search engines and feeds rich snippets. It reaches people who never visit the site. In the UK, fake reviews and misleading practices are caught by the Digital Markets, Competition and Consumers Act 2024, in force since April 2025.

Page copy is a problem. Structured data is a bigger one.

### 4.5 Where the claim can be stronger

The failure runs both ways. A model told to remove unsupported claims will also strip claims that are true and provable, and the site ends up saying less than it lawfully can.

**Instruction shape that avoids this:**

> Claims that map to real evidence are reworded, never deleted. Delete only claims with no evidence behind them at all.

**Named registrations beat vague reassurance.** "Registered with [scheme], number [X]" is stronger than "fully qualified", more specific, and checkable by the customer. Always prefer the specific.

### 4.6 Audit

```powershell
Get-ChildItem -Path app,components,lib -Include *.tsx,*.ts -Recurse -File |
  Select-String -Pattern "verified|vetted|approved|insured|guaranteed|certified|checked|accredited|rated|reviews|background" |
  Group-Object Path | Sort-Object Count -Descending | Select-Object Count, Name
```

```powershell
Get-ChildItem -Path app,components,lib -Include *.tsx,*.ts -Recurse -File |
  Select-String -Pattern "AggregateRating|ratingValue|reviewCount|[0-9],[0-9]{3}\+|[0-9]\.[0-9]/5"
```

---

## 5. Copy standard

### 5.1 The problem

A model writes toward the average of everything it has read. That average is corporate web copy. It is fluent, balanced, and says nothing.

**Test for any sentence:** could this appear on any company's site in this sector with the name swapped? If yes, it fails.

**Do not over-correct.** Stripping every pattern mechanically reads stiff in its own way. Fix what is present. Do not invent contortions to avoid a pattern that was never going to appear. Where two or more tells cluster, rewrite the section rather than patching words, because they come from the same instinct.

### 5.2 Banned constructions

**The em dash.** The strongest single tell. A model uses one where a person uses a full stop, a comma, or nothing. Hyphens in compound words are fine. Em dashes in code comments are out of scope.

**Negative parallelism.** `isn't just X, it's Y`, `not just X but Y`, `it's not about X, it's about Y`, `more than just X`. Always cut. Say the thing and drop the setup.

**The rule of three used for rhythm.** Three items because three sounds complete, not because there are three. If there are genuinely three, keep three. Two is fine. Four is fine.

**Stock openers.** `in today's [anything] world`, `when it comes to`, `whether you're X or Y`, `look no further`, `rest assured`, `at the end of the day`, `let's face it`, `here's the thing`.

**Consultant vocabulary.** Replace with the plain word.

```
seamless      effortless     elevate       unlock
leverage      empower        streamline    robust
cutting-edge  transform      revolutionise game-changing
holistic      bespoke        tailored      hassle-free
delve         intricate      tapestry      pivotal
underscore    landscape      foster        testament
enhance       crucial        showcase      garner
boasts        bolstered      vibrant       meticulous
```

**Transitional padding.** `Additionally`, `Furthermore`, `Moreover` used to force cohesion between paragraphs that do not connect. Cut them and check whether the paragraphs actually belong together.

**Copulative avoidance.** A model writes `is widely associated with` or `operates in connection with` where a person writes `is`. State the fact directly.

**Weasel attribution.** `it is widely believed`, `experts agree`, `studies show`, `many consider`. Either name the source or cut the claim.

**Tacked-on significance.** `highlighting its lasting impact`, `underscoring the importance of`, `a testament to`, `demonstrating our commitment to`. Delete the phrase. State the fact.

**Process narration.** `upon reviewing`, `an examination shows`, `it is worth noting that`, `when we look at`. Someone who knows the subject states the fact.

**Question restating.** Answer first, especially in FAQ blocks where this concentrates.

**Hedging stacks.** `can help you to potentially`, `may be able to assist with`, `we aim to try to`. One hedge maximum, and only where the uncertainty is real.

**Empty intensifiers.** `truly`, `really`, `very`, `incredibly`, `absolutely`, `simply`, `just`.

**Vague ranges.** `a range of services` instead of naming them. Name them.

**The parallel closer.** Ending a section by restating it in different words. The section already ended.

**Formatting overkill.** Bolding every key term until it reads like a glossary. Bullet lists where a sentence works.

### 5.3 Positive rules

- Short sentences. Under twenty words unless there is a reason
- One idea per sentence
- Concrete over abstract. A number, a name, a place beats an adjective
- Contractions are fine. Copy without them reads stiff
- Name the fear, not the feature. People buy to avoid something
- Left-align body copy. Centre headings only
- Button subtext is four words maximum. It renders under a button on a phone
- Use the vocabulary of the trade or sector. Domain-specific language a model would not reach for is the strongest signal a person wrote it

### 5.4 Never touch

Claims are governed by section 4 and by the project brief. If a sentence contains a claim about what is checked, registered, insured or certified, keep the claim word for word and rewrite only the language around it.

Registration numbers, scheme names, insurance limits and legal text are exact.

### 5.5 Audit

```powershell
Get-ChildItem -Path app,components -Include *.tsx -Recurse -File |
  Select-String -Pattern "—|isn't just|not just|it's not about|more than just|in today's|when it comes to|whether you're|look no further|rest assured|at the end of the day|seamless|effortless|elevate|unlock|dive into|leverage|empower|streamline|robust|cutting-edge|game-changing|holistic|hassle-free|delve|tapestry|pivotal|underscore|testament|a range of|it is worth noting|upon reviewing|studies show|experts agree" |
  Group-Object Path | Sort-Object Count -Descending | Select-Object Count, Name
```

The em dash inflates the count because it appears in comments. Rank by phrase patterns, not by total.

---

## 6. Design standard

### 6.1 The problem

The same averaging, applied to layout. The result is a Tailwind starter with a gradient hero and three feature cards, fluent and identical to everything else.

**Test for any page:** could this be any company in this sector with the logo swapped? If yes, it fails.

### 6.2 Banned patterns

**Gradient heroes.** Purple to blue especially. Any multi-hue gradient used to create the appearance of depth. Replace with a flat brand colour, or a gradient between two shades of the same hue if depth is genuinely needed.

**Ambient glow.** Radial background blurs, glowing border rings, neon vignettes, soft multi-layered drop shadows. These exist to mask a lack of structural substance.

**Glassmorphism.** Frosted translucent panels floating over a gradient. `backdrop-blur` on cards.

**The three card row.** Three cards across, each with a circled icon above a heading above two lines. The problem is not three cards. It is every section being three cards.

**Floating badge pills.** Small pill tags announcing a feature, often with an emoji or a pulsing dot.

**Off-the-shelf icons as the primary visual anchor.** Default Lucide or Bootstrap icons at the same size in a circle in every section.

**The ghost numeral.** Large translucent `01`, `02`, `03` behind step cards.

**Unsourced stat bars.** Four figures across a strip with no attribution. This is a compliance problem as well as a design one.

**Generic stock photography.** Hard hats and clipboards. Handshakes. Teams around laptops.

**Emoji as interface icons.**

**Radius chaos.** Three values total. One for cards, one for buttons, one for pills.

**Shadow soup.** One elevation, or none. Flat with a border reads more considered than five depths.

**Raw utility colours used as brand.** Every brand colour comes from the token set.

**Template repetition.** The deepest tell, and where the others come from. Every section the same height, the same padding, the same structure, differing only in copy.

### 6.3 Positive rules

**Fix by subtraction.** Cut to fewer, stronger sections, then make the one that carries the conversion look different from every other. A page written by a person has a section that matters most and it shows.

**Vary section shape.** One a row, one a list, one a single wide statement, one a table. Rhythm, not a loop.

**Intentional asymmetry.** A model defaults to symmetry because it is safe and heavily represented. Constrain content to offset portions of a strict grid rather than centring everything.

**Structural lines over shadows.** Hard one-pixel borders segment information cleanly. Cheaper visually than shadow and more precise.

**White space as an element.** Not leftover padding. Space that separates deliberately.

**One heading weight across the site.** Mixing 700 and 800 between pages is the most common drift.

**Two type families maximum.** Display for headings, workhorse for body.

**Section rhythm written down as a sequence.** Then followed. Alternation decided per page produces four consecutive identical sections.

**Two container widths.** One for content, one for wide.

**Spacing from a scale.** If the scale is 4, 8, 16, 24, 32, 48, 64, nothing uses 30.

**Hierarchy between sections.** Not every section is equally important.

### 6.4 Component inventory

Built once, used everywhere. Prevents five button recipes in one build.

```
Button        primary, secondary, ghost. One radius, one weight
Card          one radius, one border treatment, one padding scale
Section       heading, optional eyebrow, optional subhead, container width
Badge         pill, one size, one weight
Form field    label, input, error state, help text
Nav           header, mobile drawer, footer
```

A page needing something new adds it to the inventory rather than inventing it inline.

### 6.5 Page templates

Most sites need four shapes.

| Template | Used for |
|---|---|
| Home | Hero, proof, offer, conversion |
| Service | One service, with its proof |
| Programmatic | Service plus location or variant |
| Content | About, legal, FAQ. Single column, no hero |

A page fitting none means the site plan is wrong, not that a fifth template is needed.

### 6.6 Imagery

- Real photographs of the actual business beat everything, especially where the customer is looking for evidence rather than decoration
- Generated imagery only when directed. One written prompt style held constant across the whole set
- Never imagery implying something untrue. A large crew when the business is two people
- Alt text describes the image, not the page heading

### 6.7 Audit

```powershell
Get-ChildItem -Path app,components -Include *.tsx -Recurse -File |
  Select-String -Pattern "#[0-9A-Fa-f]{6}" -AllMatches |
  ForEach-Object { $_.Matches.Value } |
  Group-Object | Sort-Object Count -Descending | Select-Object Count, Name
```

```powershell
Get-ChildItem -Path app,components -Include *.tsx -Recurse -File |
  Select-String -Pattern "from-purple|via-purple|to-purple|from-indigo|via-indigo|backdrop-blur|blur-3xl"
```

```powershell
Get-ChildItem -Path app,components -Include *.tsx -Recurse -File |
  Select-String -Pattern "rounded-(sm|md|lg|xl|2xl|3xl|full)" -AllMatches |
  ForEach-Object { $_.Matches.Value } | Group-Object | Sort-Object Count -Descending
```

---

## 7. Typography system

With decoration removed, typography carries the visual architecture. This is the part most generated sites get wrong, because they hard-code sizes at arbitrary breakpoints.

### 7.1 Fluid modular scale

Sizes interpolate smoothly between a minimum and maximum viewport using `clamp()`, rather than jumping at breakpoints.

**Ratio.** Pick one and apply it consistently. Common choices: 1.200 minor third, 1.250 major third, 1.333 perfect fourth. Larger ratios suit display-led sites, smaller ratios suit dense information.

**Base.** 16px minimum for body text. Below this fails accessibility on mobile and forces zoom.

**Implementation.** Semantic tokens as CSS variables, never static pixel values inline.

```css
--font-size-body:    clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
--font-size-h3:      clamp(1.25rem, 1.1rem + 0.75vw, 1.75rem);
--font-size-h2:      clamp(1.75rem, 1.4rem + 1.75vw, 2.75rem);
--font-size-h1:      clamp(2.25rem, 1.6rem + 3.2vw, 4rem);
--font-size-display: clamp(2.75rem, 1.8rem + 4.75vw, 5.5rem);
```

Values above are illustrative. The project brief sets the actual scale.

### 7.2 Rules

| Element | Rule | Reason |
|---|---|---|
| Body size | 16px minimum | Accessibility. Prevents forced zoom |
| Line height | 1.5 to 1.7 body, 1.1 to 1.2 display | Unit-less so it inherits correctly |
| Line length | `max-inline-size: 65ch` | Eye tracking degrades past this |
| Tracking | Wide on uppercase labels, tight on display headings | Creates distinction without a second colour |
| Weight | One heading weight sitewide | The most common source of drift |

### 7.3 Pairing

Display face for headings, workhorse for body. Two families maximum.

A monospace third family is acceptable only where there is genuine technical data to set. Not as decoration.

**Decide before any print run.** Signage and vehicle livery lock the choice in.

---

## 8. Conversion

### 8.1 Benchmarks

Reference points, not targets. Sector and traffic source shift them considerably.

| Metric | Typical range |
|---|---|
| B2B lead form conversion | 2 to 5 per cent |
| Lead to qualified opportunity | around 13 per cent |
| Exit-intent recovery | up to 15 per cent of abandoning traffic |

Treat published benchmarks as orientation. Measure your own.

### 8.2 Form rules

- Every field is friction. Strip to the essential
- Phone number as a required field measurably reduces completion. Make it optional unless the business genuinely needs it to quote
- Single column on mobile, always
- Conditional logic to reveal fields progressively rather than showing everything at once
- Inline validation, not on submit
- Error messages that say what to do, not what went wrong

### 8.3 Landing page rules

- Remove competing navigation. A conversion page is a closed funnel
- One primary call to action. Secondary actions are visually subordinate or absent
- Proof adjacent to the form, not in a carousel elsewhere on the page
- Proof is specific and attributable. A named client, a stated outcome. Not a rotating wall of anonymous quotes

### 8.4 Trust placement

Trust signals work at the point of decision, not in a strip at the bottom of the page. Put the proof next to the thing the user is about to do.

Specific beats abundant. One verifiable registration number outperforms six vague badges.

### 8.5 Measurement

Session recording and heatmaps to find where users hesitate, retype, or abandon. Then single-variable testing on what you find, rather than redesigning on instinct.

---

## 9. Technical

### 9.1 Cost control

- Every paid API call carries an explicit field mask requesting the cheapest tier that satisfies the need
- No paid API call at request time. Cache to the database and read from cache. A live call on page view scales the bill with traffic
- Budget caps with alerts at 50, 90 and 100 per cent on every billable project
- Check what the field mask actually requests. Some fields silently move a call to a more expensive tier

### 9.2 Architecture

- One canonical route per page. Duplicate route trees compete with each other and double the maintenance
- Legacy paths deleted and redirected, constrained to a known slug list so the redirect does not swallow static routes
- Robots directives match intent. Not-found branches no-indexed, live pages not
- Sitemap emits only indexable canonical URLs
- Metadata carries the permitted claims. Titles and descriptions appear in search results, so they reach people who never visit the site

### 9.3 Performance

- Shallow DOM. Redundant wrapper elements degrade rendering
- Transitions instant and mechanical. Border and opacity shifts, not slow scale-up animations
- Images optimised and correctly sized. Not full-resolution assets scaled in CSS
- Third-party scripts audited. Each one costs load time and usually collects data

### 9.4 Data and legal

- Analytics gated behind consent, and the consent banner actually mounted, which is not the same as the component existing in the repo
- Every processor named in the privacy policy
- Data location stated accurately
- Regulator registration numbers real, never placeholders
- Cookie policy and privacy policy consistent with each other

---

## 10. Launch gate

```
[ ] Build passes clean
[ ] Every page checked at 375px on an actual phone
[ ] No placeholder text, numbers, images or registration numbers
[ ] Every claim maps to evidence in the project brief
[ ] Every registration number verified against its public register
[ ] No fabricated ratings, review counts or volume claims
[ ] Structured data contains no unsupported claims
[ ] Copy audit returns clean
[ ] Design audit returns clean
[ ] Every page assembled from the component inventory
[ ] Typography from the scale, no hard-coded sizes
[ ] Forms tested end to end, CRM receiving
[ ] No paid API call at request time
[ ] Budget caps set with alerts
[ ] Redirects tested for every legacy path
[ ] Sitemap and robots agree
[ ] Open Graph image renders in a link preview
[ ] Analytics gated on consent, banner firing
[ ] Legal pages published and internally consistent
```

---

## 11. Why this exists

Anyone can generate a website. The output is fluent, looks finished, and is usually wrong in ways that stay invisible until a regulator, a customer, or a bill arrives.

There is also a measurable cost to looking generated. Research on content provenance finds that perceived AI involvement reduces how much effort audiences attribute to a piece of work, and reduces what they will pay for it. One study on art prints found the exclusivity premium collapsing from 44 per cent to 21 per cent when the same work was described as AI-made rather than human-made. Whatever the exact figures, the direction is consistent: looking generated costs money.

This document is the difference between generating a site and delivering one.

The claims specification says what may be said and what backs it. The copy standard stops it reading like a machine. The design standard stops it looking like every other generated site. The sequence gates each phase so nothing ships unchecked.

The AI does the typing. This document holds the decisions.
