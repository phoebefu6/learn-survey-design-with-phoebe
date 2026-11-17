#!/usr/bin/env python3
"""Writes index.html (landing page); the knowledge-map data is serialised with json.dumps.
Internal build script; never linked from an audience page."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
A = [("a1-every-way-a-survey-misses", "Every way a survey misses", "Every way a\nsurvey misses", "#34D399", "🎯",
      "Total survey error: specification, coverage, sampling, nonresponse, measurement, processing and adjustment. Why the printed margin covers one of them, and a first run of the lab.",
      ["Total survey error", "The margin covers one", "Error budget"], "start here"),
     ("a2-questions-that-do-not-lead", "Questions that do not lead", "Questions that\ndo not lead", "#FBBF24", "✏️",
      "Wording, double-barrelled and leading items, balanced scales, the midpoint and don't know, order and context effects, cognitive pretests. Rewrite Ottervale's draft.",
      ["Wording moves answers", "Order and context", "Pretest it"], None),
     ("a3-who-you-could-have-reached", "Who you could have reached", "Who you could\nhave reached", "#FBBF24", "📮",
      "Target population against frame: address lists, online panels, street intercepts, the households a frame never lists, and sample size for a target margin with a response rate.",
      ["Population vs frame", "Undercoverage", "Size for a margin"], None),
     ("a4-designs-that-spend-the-budget-well", "Designs that spend the budget well", "Designs that\nspend the budget", "#FB923C", "🧮",
      "Simple random, stratified, clustered and systematic samples; design effect and effective sample size; why clustering widens the margin and stratifying can narrow it.",
      ["Stratify", "Cluster", "Design effect"], None),
     ("a5-who-stopped-answering", "Who stopped answering, and weighting them back", "Who stopped\nanswering", "#FB923C", "⚖️",
      "Response rates against nonresponse bias, taught as the live disagreement it is; post-stratification and raking to census margins; trimming; what weights cost in variance.",
      ["Rate is not bias", "Raking", "Trimming"], None),
     ("a6-the-survey-error-lab", "The survey error lab", "The survey\nerror lab", "#F87171", "🧪",
      "The full ladder on 20,000 real census adults: from a street intercept to raking and trimming, the nonresponse no weight can see, and Ottervale's plan scored with an honest margin.",
      ["The ladder", "The anti-lever", "Honest margin"], "bench night")]
B = [("b1-read-a-survey-in-five-questions", "Read a survey in five questions", "Read a survey in\nfive questions", "#34D399", "🔎",
      "Who was the population, who could be reached, how were they picked, who answered, how was it weighted: the methods box most reports bury, read first.",
      ["Five questions", "Rate is a question", "Big is not right"], "start here"),
     ("b2-commissioning-without-regret", "Commissioning without regret", "Commissioning\nwithout regret", "#FBBF24", "🤝",
      "Choosing mode and vendor, what to demand in the methods statement, and opt-in panels against probability samples, taught as the live disagreement it is.",
      ["Mode and vendor", "Methods statement", "Opt-in vs probability"], None),
     ("b3-what-the-number-can-carry", "What the number can carry", "What the number\ncan carry", "#FB923C", "🚌",
      "The decision the survey informs, the error it can tolerate, subgroup cells too small to report, and when a survey is the wrong tool. Ottervale's bus against library call.",
      ["Tolerable error", "Small cells", "Wrong tool"], None),
     ("b4-reporting-it-honestly", "Reporting it honestly", "Reporting it\nhonestly", "#F87171", "📰",
      "The full margin with its design effect, the methods statement, the transparency items, what not to headline, and why a survey describes but does not explain.",
      ["Full margin", "Transparency items", "Describe, not explain"], "capstone")]

def card(f, title, icon, blurb, pill, track, n, tag):
    lab = f"{track} session {n}" + (f" · {tag}" if tag else "")
    return (f'      <a class="course-card" href="courses/{f}.html" style="--diff:{pill}"><span class="cicon">{icon}</span>'
            f'<span class="cnum">{lab}</span><h3>{title}</h3><p>{blurb}</p></a>')

cards_a = "\n".join(card(f, t, ic, bl, c, "Analyst", i + 1, tg) for i, (f, t, _, c, ic, bl, _, tg) in enumerate(A))
cards_b = "\n".join(card(f, t, ic, bl, c, "Leader", i + 1, tg) for i, (f, t, _, c, ic, bl, _, tg) in enumerate(B))
mm = {"title": "Survey design\n& sampling", "centerColor": "#55064A",
      "sessions": [{"label": l, "href": f"courses/{f}.html", "color": c,
                    "concepts": [{"label": x, "href": f"courses/{f}.html"} for x in cs]} for (f, _, l, c, _, _, cs, _) in A + B]}
tpl = open(os.path.join(HERE, "index.template.html")).read()
out = tpl.replace("{{CARDS_A}}", cards_a).replace("{{CARDS_B}}", cards_b).replace("{{MINDMAP}}", json.dumps(mm, indent=2, ensure_ascii=False))
open(os.path.join(HERE, "..", "index.html"), "w").write(out)
print("index.html written")
