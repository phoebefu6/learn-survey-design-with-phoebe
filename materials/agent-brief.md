# Agent brief - shared by every fan-out page of learn-survey-design-with-phoebe

Internal build document; never linked from an audience page. Filled 2026-11-17 from
`~/.claude/skills/course-builder/references/agent-brief.template.md`.

You are writing ONE static HTML session page. No servers, no npm. **If your target file already
exists on disk, do not write it; report that and stop.** Write the file, return its path and one
line of coverage. No HTML in your reply.

## Read first, in this order

1. The template page for YOUR track. Copy its structure, classes, SVG grammar and quiz markup
   EXACTLY, including 4 options per quiz question:
   - Analyst: `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-survey-design-with-phoebe/courses/a1-every-way-a-survey-misses.html`
   - Leader: `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-survey-design-with-phoebe/courses/b1-read-a-survey-in-five-questions.html`
   Also skim the bench page `courses/a6-the-survey-error-lab.html` for how lab numbers are quoted.
2. The source map: every verified number, its evidence tier, per-session coverage, the seams, the
   bench canon. Use ONLY its numbers; never invent a statistic; if a fact is missing, teach the
   uncertainty. `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-survey-design-with-phoebe/materials/official-course-map.md`
3. The stylesheet `:root` block for the palette tokens: `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-survey-design-with-phoebe/assets/style.css` (first 40 lines).

## Page skeleton (keep every component)

toolbar (crumb EXACTLY "Analyst session N of 6" or "Leader session N of 4" after the repo link,
#toggle-all, #zoom-toggle) · masthead (eyebrow "Learn Survey Design &amp; Sampling with Phoebe ·
Analyst session N of 6" / "· Leader session N of 4", h1 with one `<span class="accent">`, .sub,
.chip-row with the level chip "🟡 Analyst" / "🟠 Analyst" / "🟡 Leader" / "🟠 Leader" / "🔴 Leader"
by difficulty, the template's audience chips, .chip.time "45 min", .agenda a1-a4) · main.wrap ·
section#intro (Part 0 "Where we start": kicker, .lede, .legend pills copied from your template,
.callout.win "★ What you walk out with tonight.") · 3 Parts, each `section.section#part-N` with
section-kicker (klabel "Part N · covers ...", h2, `.tag.concept "N min live"`), a `.lede`, ONE
figure, `details.card` accordions (summary: `.mode.live` or `.mode.self`, title, `.mini`,
`.caret ▶`), at least one `.callout.example` with `span.ex-pill` "Real world" on the page ·
section#demo-1 Build-along (kicker `.tag.demo "★ 22 min · everyone builds"` for Analyst or
"★ 22 min · everyone works it through" for Leader, .lede, the widget div if the outline names one,
ONE figure, `.steps > .step`, each with a `.prompt-box.good` carrying a `span.label`) ·
section#exercise Homework (ol, 4 items) · section#quiz (3 x `.quiz-q data-answer="0-based"`,
`p.qtext`, 4 x `button.qopt` "A · ...", `p.qwhy`; one `p.quiz-score` after the last; vary the
correct letter) · section#official, h2 EXACTLY "What this session teaches, and where it came from",
`.covered > .covered-row` (pill solid ✓ for read at source / light ◐ for reported or computed +
name + note), then the `.mono` line EXACTLY "Every fact on this page, and its verification tier,
is recorded in the course's source map." · section.cheat#cheatsheet (h3 "Analyst session N cheat
sheet <span>· pin this</span>" / "Leader session N cheat sheet ...", .grid-2 of six .cheat-item) ·
`.callout.next` with `.nx-pill` "Next session" · footer.pagefoot · scripts at the end, in this
order, exactly as the templates have them:
`<script src="../assets/svy-sample.js?v=1"></script>`, `<script src="../assets/svy-live.js?v=1"></script>`,
`<script src="../assets/app.js?v=1"></script>` (include the two svy scripts on every page, widget
or not).

Head: the template's social meta block with this page's own title/description/url (url
`https://phoebefu6.github.io/learn-survey-design-with-phoebe/courses/<file>`, og-image the same
assets/og-cover.png path as the template); `<title>Analyst session N · <Title> - learn survey
design and sampling with phoebe</title>` (Leader likewise); `<link rel="stylesheet"
href="../assets/style.css?v=1">`. Nothing else external.

First `details.card` in the FIRST Part is `open`; no other. Sentence case headings. Warm
practitioner voice, concrete, never dry. Inside prompt-boxes escape `&` `<` `>`. 450 to 650 lines
is guidance about depth, never a target.

## The widget (the survey error lab)

- Embed with `<div class="svy-widget" data-rung="r1"></div>` (rungs r0 to r5) or
  `<div class="svy-widget" data-preset="panel"></div>` (presets: panel, panelRake, cluster, post,
  uniform, big). The sample-size planner: `<div class="svy-widget" data-mode="size"></div>`.
- The widget prints these lines (exact format, see the map's canon table):
  "Truth (census rows): 21.7%" · "Estimate: X% ± H (honest margin) · naive ±N" · "Total error: ...
  pts = coverage ... · sampling ... · nonresponse ... · weighting ..." · "Issued 1000 · answered
  R (P%) · design effect D · effective n E" · "Answers per area: fewest A (area k) · most B (area
  m)" · "Over 1000 repeat surveys: bias ... pts · spread (SD) ... pts · honest margin covers the
  truth C% · naive C%" · "Average split over 1000: coverage ... · sampling ... · nonresponse ... ·
  weighting ...". The planner prints "Completes at simple random: N", "Completes after the design
  effect D: N", "Issued at a R% response rate: N" and a headline "N addresses to issue for ±M points".
- **Every number on your page must be one the widget prints or one in the map's verified facts.**
  Copy lab numbers from the map's canon table ONLY, for sample 1 (the default). Never round
  differently, never compute a new lab number yourself. If the outline needs a number the canon
  does not hold, say "your numbers will differ" or leave a blank for the learner.
- The widget controls: Frame (Address list (households) / Online opt-in panel / Street intercept),
  Design (Simple random / Stratified by area / Clustered by street), Sample size (500 / 1,000 /
  2,000 / 4,000 issued), Who answers (simulated) (Everyone answers / 22% answer, evenly / Skewed old
  (older answer more) / Linked to the answer itself), Weighting (No weighting / Post-stratify: age
  x sex / Rake: age, sex, area), a "Trim weights at 2x the mean" checkbox, and buttons "Draw
  another sample" / "Back to sample 1". Ladder buttons R0 to R5 as labelled in the map.
- What is real and simulated (say it the way a1 and a6 do): the 20,000 adults and the truth are
  real ONS Census 2021 rows (Open Government Licence v3.0); the share in fair, bad or very bad
  health STANDS IN for an Ottervale question; panel and intercept reach, response propensities
  and streets are SIMULATED.

## Hard rules (a violation is rework)

- NEVER an em dash or en dash, anywhere (prose, code, aria-labels, comments). Hyphen only.
- No meta text: never "this course", "in this course", "the course teaches", "banned here". State
  the professional norm directly with its reason. The two exact estate phrases above are the only
  self-references; "Analyst session 5" cross-references are fine.
- Attribution "by Phoebe Fu". Never "built with" a tool.
- Every number comes from the map or is labelled constructed. For constructed data print "your
  numbers will differ", never invented outputs as if run.
- Contested evidence: teach the disagreement with sources on both sides; never resolve it. The two
  contested topics are spelled out in the map ("Contested evidence").
- Citations in the exact form of the map's appendix; anything marked reported says "reported" on
  the page. Items under "Cut" in the map are never stated.
- Copyright: no long quotes from sources; at most ONE quotation per page, under 15 words, in
  quotation marks with attribution. Paraphrase everything else.
- NEVER "lottery" or "lotteries"; say the mechanism ("a random draw", "decided by chance").
- Default to the English word. No Chinese terms.
- Titles, widget ids and class names must not collide with siblings. Banned headings (any h1/h2):
  "What a sample can say", "The number and its error bars", anything starting "Sampling and the",
  "Confidence intervals,", "Power and sample size,", "What a panel survey can and cannot carry",
  "The survey hears only from the customers who answer it", "Surveys as evidence". Do not reuse
  an h2 already used on a1, a6 or b1 (grep them) except "Where we start", "Three questions" and
  the exact estate headings.
- Ottervale is constructed: write "Constructed Ottervale example" in every figure or callout that
  uses it at least once per page, and never name a real company, employer or client. Avoid these
  names entirely: Quarrybank, Harborlight, Halyard, Pellmoor, Brightwater, Lumina, Lumen, Beacon,
  Cadence, Kettle & Co, Marchmont, Thornbury, Quayside, Westfield.
- Light surfaces only. Never a dark-filled panel behind text (no ink or deep-plum fills under
  text; the deep plum may be a small dot or a stroke).

## Figure grammar (hand-drawn, every figure)

Palette, ONLY these hexes (no invented greys): primary `#7F0A67` · deep `#55064A` · mid `#9B2A84`
· soft `#E3BBD8` · tint `#F9EDF5` · ink `#2A1526` · muted `#654F60` · faint `#D9CAD4` · hairline
`#EFE5EB` · marigold `#F5C04A` (a FILL, the truth line or the one thing the figure is about) ·
marigold ink `#6E4A00` (text) · marigold tint `#FFF5DB` · paper `#FFFCF6` · `#FFFFFF` · universal
reds `#991B1B` `#FEF2F2` `#FCA5A5` only for a wrong-way panel.

- `<figure class="zoomable">` > `<svg viewBox="0 0 880 H" xmlns="http://www.w3.org/2000/svg"
  role="img" aria-label="the data, not the shape">` > `<defs>` + `<style>` + content, then
  `<figcaption>🔍 Click to zoom - takeaway</figcaption>`. Grow H, never W.
- Prefix unique per figure, used for every class and id: `<page><letter>`, e.g. a2a, a2b, a2c,
  a2d (Part 1, 2, 3, build-along). Never reuse a1/a6/b1 prefixes.
- `<defs>` holds three things with the figure prefix P: a wobble filter `id="PSk"`
  (`feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="<int>"` +
  `feDisplacementMap scale="2.4" xChannelSelector="R" yChannelSelector="G"`, `x="-3%" y="-3%"
  width="106%" height="106%"`), a hachure pattern `id="PHc"` (7x7 userSpaceOnUse, rotate(-38),
  one `#7F0A67` line, opacity .5), an open arrowhead `id="PAr"` (path `M1 1 L9 5 L1 9`, fill none,
  `#2A1526` stroke 1.6). ALL shapes sit inside ONE `<g filter="url(#PSk)" fill="none"
  stroke="#2A1526" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">`; rects carry
  a tiny rotation (-4 to 4 degrees for hand-placed items, under 1 for panels). Fills: white,
  `#F9EDF5`, the hachure for "the pile" or "the data", and marigold ONLY for the one thing the
  figure is about. One doodle anchor per figure, simple strokes, never a mascot. Text classes
  (copy the template's `<style>` lines with your prefix): `.PH` 800 12px ink heading · `.PL` 600
  12px ink label · `.PS` 400 11px muted · `.PB` 800 11px `#6E4A00` · `.PV` 800 18px `#55064A`
  value · `.PN` 400 12px muted note; `.PR` 800 11px `#991B1B` only on a wrong-way panel.
- A truth marker is a thick marigold `<path>` (stroke `#F5C04A`, stroke-width 6, round caps,
  fill none) OUTSIDE the filtered group, never a thin rect laid over other rects (the scanner
  flags painted-rect overlap). A white label backing rect may sit fully inside a panel rect.
- ALL `<text>` outside any filtered group, sans stack, never below 11px.
- Fit: max chars about (box width - 20) / 7 at 12px, 6.4px per char at 11px; full-width note
  under 110 chars; 40px between neighbouring point labels; bottom note 22px below the last row,
  H clears it by 8px. Rotated labels anchor start. When in doubt, shorten.
- Floor: one figure per Part plus one in the build-along (four figures). Draw the MECHANISM
  (the household the frame never listed, the group that stopped answering, the weight that pulled
  a small cell too hard, the question order that moved the answer), never a metaphor literally,
  never decoration.

## Voice and honesty

Every Part gets a real-world story from the map's verified facts (Pew, AAPOR, ONS, Kalton and
Flores-Cervantes, Wang et al.). Constructed cases say "constructed" on the page: Ottervale's
council, cabinet member, consultant, questionnaire drafts, vendor quotes and memos. A constructed
cost or quote is labelled constructed and never presented as data.

## Cross-links (absolute URLs; never reteach the sibling's material)

From the map's "Seams" section; each page links the ones its outline names.
- Hub: https://phoebefu6.github.io/learn-with-phoebe/

## Footer chains and session titles

Analyst: a1 Every way a survey misses · a2 Questions that do not lead · a3 Who you could have
reached · a4 Designs that spend the budget well · a5 Who stopped answering, and weighting them back
· a6 The survey error lab.
Leader: b1 Read a survey in five questions · b2 Commissioning without regret · b3 What the number
can carry · b4 Reporting it honestly.
Files: a2-questions-that-do-not-lead.html, a3-who-you-could-have-reached.html,
a4-designs-that-spend-the-budget-well.html, a5-who-stopped-answering.html, a6-the-survey-error-lab.html,
b2-commissioning-without-regret.html, b3-what-the-number-can-carry.html, b4-reporting-it-honestly.html.
Footer left: "Analyst session N of 6 · learn-survey-design-with-phoebe · by Phoebe Fu &nbsp;·&nbsp; 📚
<a href="https://phoebefu6.github.io/learn-with-phoebe/">Learn with Phoebe ↗</a>" (Leader likewise).
Footer right: "<a href="PREV">← Prev: <title></a> &nbsp;·&nbsp; <a href="NEXT">Next: <title> →</a>"
(last Leader page b4: "← Prev" and "Course home" to ../index.html).
h1: "<Title>: <span class="accent">a short phrase</span>" as the templates do.

## Before you return

grep your file for the characters U+2014 and U+2013 (must be 0), for "lottery", "this course",
"source map" outside the exact estate line; count `<figure` = `</figure>`, `<svg` = `</svg>`,
`<details` = `</details>`, `<section` = `</section>`; confirm every lab number appears in the map's
canon table.
