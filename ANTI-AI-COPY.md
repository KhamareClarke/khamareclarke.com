# ANTI-AI-COPY

**Purpose:** stop copy on this site reading as machine-generated.
**Applies to:** every user-facing string. Page copy, headings, button labels, metadata, schema descriptions, email templates, form labels, error messages.
**Does not apply to:** code comments, variable names, commit messages.

---

## 0. How to use this

Two ways.

**As a governing document.** Name it in the prompt when running any copy work:

```
Read only [file] and ANTI-AI-COPY.md.

Rewrite the copy in this file so it passes every rule in ANTI-AI-COPY.md.

Do not change any trust claim wording. Those are set by the specification and
are already correct. If a sentence contains a trust claim, keep the claim exactly
as written and rewrite only the language around it.

str_replace only. No structural, layout or styling changes.
```

**As a detection pass.** Run the greps in section 5 to find which files need work and in what order.

---

## 1. The underlying problem

A language model writes toward the average of everything it has read. That average is corporate web copy from 2015 to now. It is fluent, balanced, and says nothing.

The tells below are not stylistic preferences. Each one is a specific habit that comes from that averaging, and each one signals to a reader that nobody was actually present when the sentence was written.

**The test for any sentence:** could this appear on any company's website in this sector, with the name swapped? If yes, it fails.

**Do not over-correct.** Stripping every pattern mechanically reads as stiff and artificial in its own way. Fix what is actually present. Do not invent contortions to avoid a pattern that was never going to appear. If two or more tells cluster in one section, rewrite the section rather than patching individual words, because they usually come from the same instinct rather than from one bad word choice.

---

## 2. Banned constructions

### 2.1 The em dash

The single strongest tell. A model uses an em dash where a person would use a full stop, a comma, or nothing.

```
Bad   We check everything — identity, insurance, the lot.
Good  We check everything. Identity, insurance, the lot.
```

Hyphens in compound words are fine. `identity-checked`, `pay-as-you-go`, `no-shows`. Those are normal English.

Em dashes in code comments are out of scope. Nobody reads those.

### 2.2 The false dichotomy

```
isn't just X, it's Y
not just X but Y
it's not about X, it's about Y
more than just X
X isn't enough. You need Y.
```

Always cut. Say the thing you actually mean and drop the setup.

```
Bad   This isn't just a directory, it's a trust platform.
Good  Every tradesperson is checked before they're listed.
```

### 2.3 Stock openers

```
in today's [fast-paced / digital / competitive] world
when it comes to
whether you're X or Y
look no further
rest assured
at the end of the day
let's face it
here's the thing
in this article we'll
```

All cut. None of them carry information.

### 2.4 Consultant vocabulary

```
seamless          effortless        elevate
unlock            dive into         navigate the world of
leverage          empower           streamline
robust            cutting-edge      state-of-the-art
transform         revolutionise     game-changing
holistic          bespoke solution  tailored approach
peace of mind     hassle-free       stress-free
```

Replace with the plain word. `Use` not `leverage`. `Easy` not `effortless`, and better still, say why it is easy.

### 2.5 The rhythm triad

Three items listed because three sounds complete, not because there are three things.

```
Bad   Fast, reliable, and affordable.
Bad   We check their identity, their insurance, and their qualifications.
      (when you also check four other things)
```

If there are genuinely three, keep three. If the third is filler, cut it. Two is fine. Four is fine.

### 2.6 Question restating

```
Bad   How much does a roofer cost? The cost of a roofer depends on several factors.
Good  How much does a roofer cost? Between £35 and £55 an hour.
```

Answer first. Especially in FAQ blocks, which is where this concentrates.

### 2.7 Hedging stacks

```
can help you to potentially
may be able to assist with
we aim to try to
could possibly
generally tends to
```

One hedge maximum, and only where the uncertainty is real. Stacked hedges mean the writer did not know the answer.

### 2.8 Empty intensifiers

```
truly     really     very     incredibly     absolutely
literally     genuinely     simply     just
```

Cut. If the sentence needs the intensifier to land, rewrite the sentence.

### 2.9 The parallel closer

Ending a section by restating it with slightly different words.

```
Bad   ...so you can get on with your day. Simple, straightforward, sorted.
```

Cut the closer. The section already ended.

### 2.10 Tacked-on significance

A phrase that inflates a plain fact without adding information.

```
highlighting its lasting impact
underscoring the importance of
a testament to
demonstrating our commitment to
which speaks to
```

Delete the phrase. State the fact.

### 2.11 Process narration

Describing the act of producing the text instead of stating the content.

```
upon reviewing the details
an examination shows
it is worth noting that
when we look at
```

A person who knows the subject states the fact. This phrasing is what someone sounds like when they have just read about it for the first time.

### 2.12 Formatting overkill

Bolding every key term until the page reads like a textbook glossary. Bullet lists where a sentence would do. Headings every two lines.

Bold sparingly, and only where a reader scanning needs to land on it.

### 2.13 Vague hedged ranges

```
Bad   A range of roofing services.
Good  Flat roofs, tiling, guttering, and emergency repairs.
```

Name them. A vague range means the writer did not know the specifics.

### 2.14 Second person overload

```
Bad   You post your job, you get your quotes, you choose your tradesperson,
      and you get your work done.
```

Vary the subject or cut to one sentence.

---

## 3. Positive rules

**Short sentences.** Under twenty words unless there is a reason.

**Plain British English.** Not American. `Organise`, `specialise`, `licence` as noun and `license` as verb, `£` before the figure, dates as 19 August 2026.

**Concrete over abstract.** A number, a name, a place beats an adjective.

```
Weak    Fast response times.
Strong  Most quotes arrive within a few hours.
```

**Name the fear, not the feature.** People buy to avoid something. A homeowner hiring a roofer is afraid of a bodged job that leaks in six months and a contractor who cannot be found afterwards. Say that.

**Contractions are fine.** `Don't`, `won't`, `you'll`. Copy without contractions reads stiff.

**One idea per sentence.**

**Button subtext is four words maximum.** It renders under a button on a phone. Anything longer wraps and looks broken.

**Write like the trade, not like a marketing department.** `Cowboy job`, `no-shows`, `bodged`, `snagging`, `first fix`. Trade language a model would not reach for on its own is the strongest signal a person wrote it.

---

## 4. What not to touch

**Trust claims are governed elsewhere.** They come from the project specification and are legally constrained. If a sentence contains a claim about what is checked, verified, registered or insured, keep the claim word for word and rewrite only the language around it.

Rewriting a compliant claim into better-sounding copy is the most expensive mistake available in this pass.

**Legal pages** follow their own conventions and read stiff by design.

**Registration numbers, scheme names and insurance limits** are exact. Never reworded for flow.

---

## 5. Detection

Run from the repo root.

**Find the worst files first:**

```powershell
Get-ChildItem -Path app,components -Include *.tsx -Recurse -File |
  Select-String -Pattern "—|isn't just|not just|it's not about|more than just|in today's|when it comes to|whether you're|look no further|rest assured|at the end of the day|let's face it|highlighting its|underscoring the|a testament to|upon reviewing|an examination shows|it is worth noting|a range of|seamless|effortless|elevate|unlock|dive into|navigate the world of|leverage|empower|streamline|robust|cutting-edge|game-changing|holistic|peace of mind|hassle-free|stress-free" |
  Group-Object Path | Sort-Object Count -Descending | Select-Object Count, Name
```

**Em dashes only, excluding comments:**

```powershell
Get-ChildItem -Path app,components -Include *.tsx -Recurse -File |
  Select-String -Pattern "—" |
  Where-Object { $_.Line -notmatch "^\s*(//|\*|/\*)" } |
  Select-Object Path, LineNumber, Line
```

**Hedging and intensifiers:**

```powershell
Get-ChildItem -Path app,components -Include *.tsx -Recurse -File |
  Select-String -Pattern "can help you to|may be able to|we aim to|could possibly|generally tends to|truly |incredibly |absolutely " |
  Select-Object Path, LineNumber, Line
```

**Note on counts.** The em dash inflates results because it appears in code comments. A file with fourteen hits may have one real problem. Rank by the phrase patterns rather than the total.

---

## 6. Skills

Where the marketing skills pack is installed, name it in the prompt so the pass uses it rather than working from this document alone.

| Task | Skills |
|---|---|
| General copy pass | `copy-editing` |
| Hero, headlines, conversion copy | `page-cro`, `marketing-psychology`, `copy-editing` |
| Forms and signup | `form-cro`, `signup-flow-cro` |
| Newsletter and email | `email-sequence`, `marketing-psychology` |
| Landing pages | `page-cro`, `marketing-psychology` |
| Product and service descriptions | `product-marketing-context`, `copy-editing` |

Skills do the thinking. This document sets the constraints they work inside.

**`anti-ai-writing-tells`** is already built as an installable skill and covers the same ground in a form the model loads automatically. Where it is installed, this document is the reference and the skill is the enforcement. Keep both in step.

---

## 7. Order of work

1. Claims sweep first. Copy written before the claims are correct gets rewritten twice.
2. Detection greps to rank the files.
3. One file per session, `/clear` between.
4. Highest traffic first. Home, then the templates that generate the most pages, then static pages.
5. Metadata last but never skipped. Titles and descriptions appear in search results, so they reach people who never visit the site.

---

## 8. The final test

Read it out loud on a phone.

If you would not say the sentence to someone standing in front of you, it fails.
