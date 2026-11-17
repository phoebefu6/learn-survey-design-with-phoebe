# Learn Survey Design & Sampling with Phoebe

Questionnaires, sampling frames, nonresponse and the bias a survey carries before the first answer.
Ten 45-minute sessions in two tracks, by Phoebe Fu:

- **Analyst track** (6 sessions): total survey error, questions that do not lead, frames and sample
  size, sample designs and the design effect, nonresponse and weighting, and the survey error lab.
- **Leader track** (4 sessions): reading a survey in five questions, commissioning one, what its
  number can carry for a decision, and reporting it honestly.

Open `index.html` to start. Everything runs in the browser; no install.

## The survey error lab

The bench asks one question of 20,000 real adults and measures every design choice against the
known truth: frame, design, sample size, who answers, weighting and trimming, each repeated 1,000
times to report bias and how often the honest margin covers the truth.

- Population: a seeded sample of 20,000 adults (16+) from the Office for National Statistics,
  *Public microdata teaching sample, England and Wales: Census 2021*. Contains public sector
  information licensed under the Open Government Licence v3.0.
- Simulated, and labelled on the widget: who joins the online panel, who passes the street
  intercept, who answers, and the grouping of residents into streets.
- Ottervale, its council and its reports are constructed.
- `materials/svy_reference.py` is an independent Python copy of the engine in `assets/svy-live.js`;
  `materials/compare-ladder.py` checks the two agree on every value.
