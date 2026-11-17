# Source map - learn-survey-design-with-phoebe

Internal build document (never linked from an audience page). Built 2026-11-17 by the course lead.
Owned idea: **total survey error** - every gap between a survey's number and the truth, from the
question through frame, sampling, nonresponse and weighting. Sampling error is one term of several.
Question across the course: how far is this survey's number from the truth, and which choice put it there?

## Evidence tiers

- **read at source**: the page, abstract or PDF text was read on 2026-11-17 (URL in the appendix).
- **reported**: seen only in a secondary source or a search summary; pages must say "reported".
- **cut**: could not be verified; never stated on a page.

## Verified facts (use ONLY these; every number on a page comes from here or from the widget)

| # | Fact | Tier | Cite as |
|---|---|---|---|
| F1 | Pew: a typical Pew phone survey's response rate was 36% in 1997 and 9% in 2012. | read at source | Pew Research Center (2012), "Assessing the representativeness of public opinion surveys" |
| F2 | Pew 2012 compared a standard 5-day survey (n=1,507, 9% response) with a high-effort survey (n=2,226, Jan 5 to Mar 15, 22% response, incentives, refusal-conversion letters). Of 40 comparisons, 28 differed by 2 points or less, 7 by 3 points, 5 by 4 points. | read at source | same |
| F3 | Groves and Peytcheva (2008) meta-analysed 59 methodological studies that measured nonresponse bias (frame variables, record matches, follow-ups of nonrespondents). | read at source (abstract) | Groves and Peytcheva (2008), Public Opinion Quarterly 72(2) |
| F3r | The same meta-analysis covered 959 estimates and found response rate a weak predictor of bias. | reported (secondary: J. Wagner blog 2017) | say "reported" |
| F4 | Groves (2006): nonresponse can, but need not, induce bias; bias depends on how strongly answering is linked to the survey variable (propensity-variable correlation). | abstract read at source; propensity framing reported | Groves (2006), Public Opinion Quarterly 70(5) |
| F5 | Keeter et al. (2006) repeated a 1997 standard vs rigorous experiment and found little to suggest nonresponse seriously threatened estimates at the rates obtained. | reported | Keeter et al. (2006), POQ 70(5) |
| F6 | Biemer (2010): total survey error is a framework for optimising surveys for data quality within a budget; it sits inside "total survey quality" (fitness for use). | read at source (abstract) | Biemer (2010), Public Opinion Quarterly 74(5) |
| F6r | Error sources named in Biemer's introduction: frame, sampling, interviewers, respondents, missing data, coding and editing. | reported | say "reported" |
| F7 | AAPOR Standard Definitions, current edition the 10th (2023). Defines response, cooperation, refusal and contact rates (RR1 to RR6 family). | edition read at source; RR formulas cut (not read) | AAPOR, Standard Definitions, 10th ed. (2023) |
| F8 | AAPOR Transparency Initiative disclosure list (12 items): data collection strategy; sponsor and conductor; exact wording; population; sample generation and recruitment (frame, probability or not, quotas, incentives); modes and languages; dates; completes and precision (margin for probability samples, a precision statement for non-probability); weighting or a statement that none was used; data processing and quality checks; limitations; use of AI. | read at source | AAPOR, Transparency Initiative disclosure elements |
| F9 | AAPOR online panels report (2010): avoid nonprobability online panels when the goal is to estimate population values accurately; no accepted theoretical basis for projecting them; studies found them generally less accurate than probability methods against benchmarks; the report calls its conclusions tentative. | read at source | Baker et al. (2010), AAPOR Report on Online Panels, POQ 74(4) |
| F10 | AAPOR non-probability task force (2013): no single framework; methods sit on a continuum of expected accuracy; inference rests on modelling assumptions that must be stated; transparency carries a higher burden; most promising methods are model-based. | read at source | Baker et al. (2013), AAPOR Task Force on Non-Probability Sampling |
| F11 | Pew (2016): 9 nonprobability samples from 8 vendors against benchmarks; average estimated bias 15.1 points for Hispanic and 11.3 for Black respondents across them; Pew's own probability panel had the lowest bias on non-civic items (4.1) but tied for largest on civic engagement (13.4). Not "average absolute error". | read at source | Pew Research Center (2016), "Evaluating online nonprobability surveys" |
| F12 | Pew (2024): among adults under 30, 12% of an opt-in sample claimed a licence to operate a nuclear submarine; 20% agreed the Holocaust is a myth in an opt-in sample against 3% in a probability survey. | read at source | Pew Research Center (2024), "Online opt-in polls can produce misleading results, especially for young people and Hispanic adults" |
| F13 | Wang, Rothschild, Goel and Gelman (2015): Xbox opt-in polls in the 45 days before the 2012 US election, 750,148 interviews from 345,858 people, far from representative on age and sex; after multilevel regression and poststratification the estimates were in line with leading poll aggregators. | read at source | Wang et al. (2015), International Journal of Forecasting 31(3) |
| F14 | Kish (1992) via Little and Vartivarian (2005): proportional variance increase from weighting is approximately cv squared of the weights (so the design effect from weighting is about 1 + cv squared), a good approximation when the weighting variable is weakly linked to the outcome. | reported (secondary, read in Little and Vartivarian 2005) | say "reported"; on the bench the widget's design effect is computed, not approximated |
| F15 | Pew question wording: Jan 2003, favour military action in Iraq 68% (oppose 25%) without the clause; with "even if it meant that U.S. forces might suffer thousands of casualties" 43% favour, 48% oppose. | read at source | Pew Research Center, "Writing survey questions" |
| F16 | Pew question order: Dec 2008, 88% dissatisfied with the way things were going when asked after a presidential approval question, 78% without it. Oct 2003, legal agreements for same-sex couples favoured by 45% after the marriage question, 37% without. | read at source | same |
| F17 | ONS Labour Force Survey covers people in private households; most communal establishments are excluded (exceptions: NHS accommodation, students in halls via parents). | read at source | ONS, Labour Force Survey QMI |
| F18 | Kalton and Flores-Cervantes (2003): raking is iterative proportional fitting to marginal totals, row then column until convergence, usually fast, not guaranteed; bounding or trimming weights improves precision at some cost in bias reduction. | read at source | Kalton and Flores-Cervantes (2003), Journal of Official Statistics 19(2) |
| F19 | Krosnick (1991): satisficing, giving a merely satisfactory answer when optimal answering takes too much effort (pick the first reasonable option, agree, status quo). | reported | Krosnick (1991), Applied Cognitive Psychology 5(3) |
| F20 | ONS Census 2021 public microdata teaching sample: 1% of person records, England and Wales, 19 variables, lowest geography region; Open Government Licence v3.0. File read: 604,351 rows. | read at source + file | ONS (2023), Public microdata teaching sample, England and Wales: Census 2021 |

**Cut (not read at source, never stated):** Schuman and Presser's forbid/allow and reporters
experiments and any effect sizes; Groves et al. 2009 seven-component TSE list as a quote (pages
may name the components as the standard frame, without attributing a list to the book); the
cluster formula deff = 1 + (b-1)rho as a cited fact (pages may teach it as the textbook
approximation, labelled "the textbook approximation", and show the widget's computed value);
RR1 to RR6 formulas; Krosnick on the middle alternative; a "2% live in communal establishments" figure.

## Contested evidence (teach both sides, never resolve)

1. **Response rates vs nonresponse bias.** Side A: low rates need not mean bias (F2, F3r, F5);
   Pew's 9% vs 22% surveys differed by 2 points or less on 28 of 40 measures. Side B: bias is a
   property of the link between answering and the answer, not the rate (F4); low rates leave more
   room for that link and some estimates in F2 did move by 4 points, civic items most (F11). The
   bench shows the mechanism: at the SAME ~22% rate, uniform nonresponse is harmless (bias -0.3)
   and outcome-linked nonresponse is not (bias -8.9).
2. **Opt-in panels vs probability samples.** Side A: AAPOR 2010 says avoid them for population
   values (F9); Pew 2016/2024 show large errors, worst for young and Hispanic adults (F11, F12).
   Side B: AAPOR 2013 says methods sit on a continuum and model-based ones are promising (F10);
   Xbox with MRP matched aggregators (F13). The bench panel (simulated coverage) shows raking on
   age, sex and area leaves -5.7 bias when coverage tracks the answer within those cells.

## Bench canon (printed by assets/svy-live.js; materials/svy_reference.py agrees on every value
## at 1,000 repeats; planted 0.1% fault caught; regenerate with `node materials/svy-node.js 1000`)

Population: 20,000 adults (16+) drawn with seed 20211 from the 487,235 adults with a general
health answer in the ONS file. Truth = share whose general health is fair, bad or very bad:
**21.7%** (21.655%; full file 21.45%). Stand-in for an Ottervale question, labelled on the widget.
Areas 1 to 10 = the nine English regions and Wales, standing in for Ottervale's ten areas.
Simulated (labelled): panel coverage (by age, x0.7 for fair-or-worse health), intercept coverage
(by activity, x0.5 for fair-or-worse health), response propensities (uniform 22%; by age 10, 12, 16,
22, 30, 38%; outcome-linked: age rate x0.55 if fair-or-worse, x1.12 otherwise), streets of 20.
Frame sizes: address list 19,549 (communal residents excluded), panel 4,096, intercept 2,854.

All at sample 1 (seed 1), 1,000 issued unless noted. "This sample" lines, then the repeat line.

| Run | Estimate (honest, naive) | Total error = coverage, sampling, nonresponse, weighting | Answered, deff, eff n | 1,000 repeats: bias, SD, honest cover, naive cover |
|---|---|---|---|---|
| R0 convenience: street intercept (uniform answering) | 16.1% ±4.8, ±4.8 | -5.5 = -4.9, +0.1, -0.7, +0.0 | 223 (22%), 1.00, 222 | -4.9, 2.5, 51%, 51% |
| R1 address frame, simple random (skewed old) | 25.7% ±5.4, ±5.4 | +4.0 = -0.3, +1.9, +2.4, +0.0 | 249 (25%), 1.00, 248 | +5.2, 3.0, 58%, 58% |
| R2 stratified by area | 22.1% ±5.2, ±5.4 | +0.5 = -0.3, +1.3, -0.6, +0.0 | 226 (23%), 0.92, 245 | +5.3, 2.9, 58%, 58% |
| R3 stratified + raking | 20.2% ±5.5, ±5.2 | -1.5 = -0.3, +1.3, -0.6, -1.9 | 226 (23%), 1.10, 206 | -0.4, 2.8, 94%, 93% |
| R4 raking + trimming (cap 2x mean) | 20.1% ±5.4, ±5.2 | -1.6 = -0.3, +1.3, -0.6, -2.1 | 226 (23%), 1.05, 214 | +0.5, 2.8, 95%, 94% |
| R5 outcome-linked nonresponse (anti-lever) | 9.4% ±3.6, ±3.8 | -12.2 = -0.3, +1.3, -11.2, -2.0 | 227 (23%), 0.90, 251 | -8.9, 2.2, 5%, 4% |
| preset panel (opt-in, no weights) | 11.3% ±4.5, ±4.5 | -10.3 = -9.6, -0.2, -0.5, +0.0 | 194 (19%), 1.01, 193 | -5.9, 2.6, 40%, 40% |
| preset panelRake (opt-in, raked) | 13.0% ±5.6, ±4.7 | -8.6 = -9.6, -0.2, -0.5, +1.7 | 194 (19%), 1.38, 141 | -5.7, 2.7, 49%, 44% |
| preset cluster (address, streets) | 29.1% ±6.6, ±6.0 | +7.4 = -0.3, +0.2, +7.5, +0.0 | 223 (22%), 1.23, 181 | +5.2, 3.1, 63%, 58% |
| preset post (strat + post-strat age x sex) | 20.3% ±5.5, ±5.2 | -1.3 = -0.3, +1.3, -0.6, -1.8 | 226 (23%), 1.08, 209 | -0.4, 2.8, 94%, 94% |
| preset uniform (address, SRS, 22% even) | 21.1% ±5.4, ±5.4 | -0.6 = -0.3, +1.9, -2.2, +0.0 | 223 (22%), 1.00, 222 | -0.3, 2.8, 94%, 94% |
| preset big (address, SRS, 4,000 issued) | 27.2% ±2.8, ±2.8 | +5.6 = -0.3, +0.9, +5.0, +0.0 | 951 (24%), 1.00, 950 | +5.2, 1.4, 3%, 3% |

Average split over 1,000 repeats (coverage, sampling, nonresponse, weighting), printed as the
widget's last line: R0 -4.9, +0.0, +0.1, +0.0; R1 -0.3, +0.0, +5.6, +0.0; R2 -0.3, +0.0, +5.5, +0.0;
R3 -0.3, +0.0, +5.5, -5.6; R4 -0.3, +0.0, +5.5, -4.8; R5 -0.3, +0.0, -6.0, -2.6; panel -9.6, +0.0,
+3.8, +0.0; panelRake -9.6, +0.0, +3.8, +0.2; cluster -0.3, +0.0, +5.5, +0.0; post -0.3, +0.0, +5.5,
-5.6; uniform -0.3, +0.0, +0.0, +0.0; big -0.3, +0.0, +5.5, +0.0. (Rounded parts may differ from
the rounded bias by 0.1.)

Frame line (printed): "Frame: 19,549 of 20,000 adults could be reached" (address list), 4,096 (panel), 2,854 (intercept).

Answers per area (sample 1): R1 fewest 11 (area 1) most 43 (area 7); R2 to R4 fewest 9 (area 1)
most 42 (area 8); R5 fewest 11 (area 1) most 41 (area 8); cluster fewest 6 (area 1) most 34 (area 5);
big fewest 51 (area 10) most 143 (area 8); panel 8 (area 1) and 33 (area 7); R0 6 (area 1) and 38 (area 8).
R4 trimmed 10 weights on its first pass; R5 trimmed 7.

Sample-size planner (p = 22%): ±3 points needs 733 completes at simple random; with design effect
1.2, 879 completes, 3,996 issued at 22% response; at 100% response 879. ±5 points: 264 completes,
317 with deff 1.2, 1,441 issued at 22%; 1,200 issued at 22% with deff 1.0.

Widget text formats (quote exactly): "Estimate: 20.2% ± 5.5 (honest margin) · naive ±5.2";
"Over 1000 repeat surveys: bias -0.4 pts · spread (SD) 2.8 pts · honest margin covers the truth 94% · naive 93%".

## Per-session coverage

| Session | Teaches | Facts | Bench runs quoted |
|---|---|---|---|
| a1 Every way a survey misses | TSE frame (specification, coverage, sampling, nonresponse, measurement, processing, adjustment); the printed margin covers sampling only | F6, F6r | R0, R1 |
| a2 Questions that do not lead | wording, double-barrelled, leading, balanced scales, midpoint, don't know, order and context, cognitive pretests, satisficing | F15, F16, F19 | none (questionnaire v2 on the page) |
| a3 Who you could have reached | target population vs frame; address lists, panels, intercepts; communal establishments; sample size for a margin with a response rate | F17, F9 | R0, R1, panel; planner |
| a4 Designs that spend the budget well | SRS, stratified, cluster, systematic; design effect, effective n | F14 (reported), textbook deff | R1, R2, cluster, big |
| a5 Who stopped answering, and weighting them back | response rates vs bias (contested), post-strat, raking, trimming, weighting's variance cost | F1 to F5, F7, F14, F18 | R1, uniform, post, R3, R4, R5 |
| a6 The survey error lab | full ladder, anti-lever, capstone | all | every run |
| b1 Read a survey in five questions | population, frame, selection, who answered, weighting; the buried methods box | F8, F1 | R1, big |
| b2 Commissioning without regret | mode and vendor; methods statement; opt-in vs probability (contested) | F8, F9 to F13 | panel, panelRake, R3 |
| b3 What the number can carry | decision vs tolerable error; small cells; when a survey is the wrong tool | F2 | R3, R5, answers per area, planner |
| b4 Reporting it honestly | full margin with design effect; transparency items; what not to headline; describes, not explains | F8, F14 | R3, cluster, big |

## Seams (absolute links, never reteach)

- Statistics: https://phoebefu6.github.io/learn-statistics-with-phoebe/ (sampling distributions, CLT, intervals). a5 links its b7.
- Experimentation b2 (power for A/B tests): https://phoebefu6.github.io/learn-experimentation-with-phoebe/ - a3 links it.
- AI research b9 (interviews, qualitative coding): https://phoebefu6.github.io/learn-ai-research-with-phoebe/ - a2 links it.
- AI customer support 05 (CSAT nonresponse): https://phoebefu6.github.io/learn-ai-customer-support-with-phoebe/ - b2 links it.
- People analytics (engagement surveys): https://phoebefu6.github.io/learn-people-analytics-with-phoebe/ - b1 links it.
- Causal inference: https://phoebefu6.github.io/learn-causal-inference-with-phoebe/ - b4 links it.
- Data literacy: https://phoebefu6.github.io/learn-data-literacy-with-phoebe/ - b1 links it.
Exact pages (checked with ls 2026-11-17):
- statistics b7: https://phoebefu6.github.io/learn-statistics-with-phoebe/courses/b7-confidence-intervals.html ; a4: .../courses/a4-what-a-sample-can-say.html
- experimentation b2: https://phoebefu6.github.io/learn-experimentation-with-phoebe/courses/b2-power-and-sample-size.html
- ai-research b9: https://phoebefu6.github.io/learn-ai-research-with-phoebe/courses/b9-qualitative-coding.html
- ai-customer-support 05: https://phoebefu6.github.io/learn-ai-customer-support-with-phoebe/courses/05-qa-you-can-trust.html
- people-analytics a5: https://phoebefu6.github.io/learn-people-analytics-with-phoebe/courses/a5-surveys-as-evidence.html
- causal-inference home: https://phoebefu6.github.io/learn-causal-inference-with-phoebe/ (its a5 "not-everyone-responds" is about missing outcomes in causal work; do not reteach it)
- data-literacy home: https://phoebefu6.github.io/learn-data-literacy-with-phoebe/

## Not covered (honest list)

Questionnaire software (Qualtrics, SurveyMonkey), R survey and Python samplics packages (self-study
mentions only); mixed-mode effects in depth; small-area estimation and MRP mechanics; panel attrition
over waves; imputation; adaptive and responsive design; interviewer effects measurement; cognitive
interview fieldwork method (linked out to AI research b9); legal and ethics review; AAPOR RR formulas.

## Running case

Ottervale: a constructed town council choosing between keeping a bus route and extending library
hours, with one resident survey. Label "Constructed Ottervale example" every time. Its population is
stood in for by the real census rows above; its names, questions and decisions are constructed.

## Citation appendix

- Pew Research Center (2012). Assessing the representativeness of public opinion surveys. https://www.pewresearch.org/politics/2012/05/15/assessing-the-representativeness-of-public-opinion-surveys/
- Groves, R. M. and Peytcheva, E. (2008). The impact of nonresponse rates on nonresponse bias: a meta-analysis. Public Opinion Quarterly 72(2). https://academic.oup.com/poq/article-lookup/doi/10.1093/poq/nfn011
- Groves, R. M. (2006). Nonresponse rates and nonresponse bias in household surveys. Public Opinion Quarterly 70(5). https://academic.oup.com/poq/article/70/5/646/1853505
- Keeter, S. et al. (2006). Gauging the impact of growing nonresponse on estimates from a national RDD telephone survey. POQ 70(5). (reported)
- Biemer, P. P. (2010). Total survey error: design, implementation, and evaluation. Public Opinion Quarterly 74(5). https://academic.oup.com/poq/article/74/5/817/1815769
- AAPOR (2023). Standard Definitions, 10th edition. https://aapor.org/standards-and-ethics/standard-definitions/
- AAPOR. Transparency Initiative. https://aapor.org/standards-and-ethics/transparency-initiative/
- Baker, R. et al. (2010). AAPOR Report on Online Panels. POQ 74(4). https://www.aapor.org/wp-content/uploads/2022/11/nfq048.pdf
- Baker, R. et al. (2013). Report of the AAPOR Task Force on Non-Probability Sampling. https://www.aapor.org/wp-content/uploads/2022/11/NPS_TF_Report_Final_7_revised_FNL_6_22_13.pdf
- Pew Research Center (2016). Evaluating online nonprobability surveys. https://www.pewresearch.org/methods/2016/05/02/evaluating-online-nonprobability-surveys/
- Pew Research Center (2024). Online opt-in polls can produce misleading results, especially for young people and Hispanic adults. https://www.pewresearch.org/short-reads/2024/03/05/online-opt-in-polls-can-produce-misleading-results-especially-for-young-people-and-hispanic-adults/
- Wang, W., Rothschild, D., Goel, S. and Gelman, A. (2015). Forecasting elections with non-representative polls. International Journal of Forecasting 31(3). https://www.stat.berkeley.edu/~aldous/157/Papers/non-rep.pdf
- Little, R. J. and Vartivarian, S. (2005). Does weighting for nonresponse increase the variance of survey means? Survey Methodology 31(2). https://www150.statcan.gc.ca/n1/pub/12-001-x/2005002/article/9046-eng.pdf (secondary for Kish 1992)
- Pew Research Center. Writing survey questions. https://www.pewresearch.org/writing-survey-questions/
- ONS. Labour Force Survey QMI. https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/employmentandemployeetypes/methodologies/labourforcesurveylfsqmi
- Kalton, G. and Flores-Cervantes, I. (2003). Weighting methods. Journal of Official Statistics 19(2). https://www.scb.se/contentassets/ca21efb41fee47d293bbee5bf7be7fb3/weighting-methods.pdf
- Krosnick, J. A. (1991). Response strategies for coping with the cognitive demands of attitude measures in surveys. Applied Cognitive Psychology 5(3). (reported)
- ONS (2023). Public microdata teaching sample, England and Wales: Census 2021. Open Government Licence v3.0. https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates/datasets/publicmicrodatateachingsampleenglandandwalescensus2021
