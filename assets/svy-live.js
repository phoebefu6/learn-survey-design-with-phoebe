/* Survey error lab engine, by Phoebe Fu. Pure functions, no DOM; the same file runs in Node.
   Population: real census rows (assets/svy-sample.js). Frame coverage of the panel and intercept,
   response propensities and the street grouping are SIMULATED parameters, stated below.
   materials/svy_reference.py is a line-for-line Python copy; both must print the same numbers. */
(function (root) {
  "use strict";

  var SIM = {
    panelCover: [0.30, 0.30, 0.26, 0.22, 0.16, 0.09],   // by age band, x0.7 if fair-or-worse health
    panelBadFactor: 0.7,
    interceptCover: [0.10, 0.30, 0.22],                 // by activity: active, retired, other inactive
    interceptBadFactor: 0.5,
    respUniform: 0.22,
    respAge: [0.10, 0.12, 0.16, 0.22, 0.30, 0.38],      // older residents answer more
    respOutcomeBad: 0.55,                               // outcome-linked: fair-or-worse health answers less
    respOutcomeGood: 1.12,
    rakeIters: 20,
    trimCap: 2.0,                                       // cap weights at 2x the mean weight
    trimIters: 10,
    frameSeed: 7001,
    perStreet: 10
  };

  var LADDER = [
    { id: "r0", label: "Convenience: street intercept", frame: "intercept", design: "srs", n: 1000, nr: "uniform", weight: "none", trim: false },
    { id: "r1", label: "Address frame, simple random", frame: "address", design: "srs", n: 1000, nr: "age", weight: "none", trim: false },
    { id: "r2", label: "Stratified by area", frame: "address", design: "strat", n: 1000, nr: "age", weight: "none", trim: false },
    { id: "r3", label: "Stratified + raking", frame: "address", design: "strat", n: 1000, nr: "age", weight: "rake", trim: false },
    { id: "r4", label: "Raking + trimming", frame: "address", design: "strat", n: 1000, nr: "age", weight: "rake", trim: true },
    { id: "r5", label: "Outcome-linked nonresponse", frame: "address", design: "strat", n: 1000, nr: "outcome", weight: "rake", trim: true }
  ];

  var PRESETS = {
    panel: { frame: "panel", design: "srs", n: 1000, nr: "age", weight: "none", trim: false },
    panelRake: { frame: "panel", design: "srs", n: 1000, nr: "age", weight: "rake", trim: false },
    cluster: { frame: "address", design: "cluster", n: 1000, nr: "age", weight: "none", trim: false },
    post: { frame: "address", design: "strat", n: 1000, nr: "age", weight: "post", trim: false },
    uniform: { frame: "address", design: "srs", n: 1000, nr: "uniform", weight: "none", trim: false },
    big: { frame: "address", design: "srs", n: 4000, nr: "age", weight: "none", trim: false }
  };

  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a) >>> 0;
      t = ((t + (Math.imul(t ^ (t >>> 7), 61 | t) >>> 0)) >>> 0) ^ t;
      t = t >>> 0;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function decode(data) {
    var c = data.codes, N = c.length, P = { N: N, age: [], sex: [], area: [], comm: [], econ: [], bad: [], street: [] };
    for (var i = 0; i < N; i++) {
      var v = c[i];
      P.bad.push(v % 2); v = Math.floor(v / 2);
      P.econ.push(v % 3); v = Math.floor(v / 3);
      P.comm.push(v % 2); v = Math.floor(v / 2);
      P.area.push(v % 10); v = Math.floor(v / 10);
      P.sex.push(v % 2); v = Math.floor(v / 2);
      P.age.push(v);
    }
    var s = 0, k = 0;
    for (var j = 0; j < data.streets.length; j++) {
      for (var m = 0; m < data.streets[j]; m++) { P.street.push(j); k++; }
    }
    P.nStreets = data.streets.length;
    P.T = { age: [0, 0, 0, 0, 0, 0], sex: [0, 0], area: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], cell: [] };
    for (var q = 0; q < 12; q++) P.T.cell.push(0);
    for (i = 0; i < N; i++) {
      P.T.age[P.age[i]] += 1; P.T.sex[P.sex[i]] += 1; P.T.area[P.area[i]] += 1;
      P.T.cell[P.age[i] * 2 + P.sex[i]] += 1; s += P.bad[i];
    }
    P.truth = s / N;
    P._frames = {};
    return P;
  }

  function buildFrame(P, frame) {
    if (P._frames[frame]) return P._frames[frame];
    var F = [], i;
    if (frame === "address") {
      for (i = 0; i < P.N; i++) if (P.comm[i] === 0) F.push(i);
    } else {
      var r = rng(SIM.frameSeed + (frame === "panel" ? 1 : 2));
      for (i = 0; i < P.N; i++) {
        var p;
        if (frame === "panel") p = SIM.panelCover[P.age[i]] * (P.bad[i] ? SIM.panelBadFactor : 1);
        else p = SIM.interceptCover[P.econ[i]] * (P.bad[i] ? SIM.interceptBadFactor : 1);
        if (r() < p) F.push(i);
      }
    }
    var s = 0;
    for (i = 0; i < F.length; i++) s += P.bad[F[i]];
    var byArea = [], streets = {}, streetList = [];
    for (i = 0; i < 10; i++) byArea.push([]);
    for (i = 0; i < F.length; i++) {
      byArea[P.area[F[i]]].push(F[i]);
      var st = P.street[F[i]];
      if (!streets.hasOwnProperty(st)) { streets[st] = []; streetList.push(st); }
      streets[st].push(F[i]);
    }
    var out = { F: F, mean: s / F.length, byArea: byArea, streets: streets, streetList: streetList };
    P._frames[frame] = out;
    return out;
  }

  // partial Fisher-Yates: picks k of arr in place, returns the picks, then undoes the swaps
  function pick(arr, k, r) {
    var M = arr.length, sw = [], out = [], i, j, t;
    if (k > M) k = M;
    for (i = 0; i < k; i++) {
      j = i + Math.floor(r() * (M - i));
      t = arr[i]; arr[i] = arr[j]; arr[j] = t; sw.push(j);
      out.push(arr[i]);
    }
    for (i = k - 1; i >= 0; i--) { j = sw[i]; t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
    return out;
  }

  function draw(P, cfg, seed) {
    var fr = buildFrame(P, cfg.frame), r = rng(seed);
    var design = cfg.design;
    if (design === "cluster" && cfg.frame !== "address") design = "srs";
    var sel = [], dw = [], strat = [], psu = [], i, h;
    var n = Math.min(cfg.n, fr.F.length);
    if (design === "srs") {
      var ps = pick(fr.F, n, r), w0 = fr.F.length / ps.length;
      for (i = 0; i < ps.length; i++) { sel.push(ps[i]); dw.push(w0); strat.push(0); psu.push(i); }
    } else if (design === "strat") {
      var M = fr.F.length, alloc = [], rem = [], tot = 0;
      for (h = 0; h < 10; h++) {
        var exact = n * fr.byArea[h].length / M;
        alloc.push(Math.floor(exact)); rem.push(exact - Math.floor(exact)); tot += Math.floor(exact);
      }
      var left = n - tot;
      while (left > 0) {
        var best = -1;
        for (h = 0; h < 10; h++) if (best < 0 || rem[h] > rem[best]) best = h;
        alloc[best] += 1; rem[best] = -1; left -= 1;
      }
      for (h = 0; h < 10; h++) {
        var nh = Math.min(alloc[h], fr.byArea[h].length);
        if (nh <= 0) continue;
        var ph = pick(fr.byArea[h], nh, r), wh = fr.byArea[h].length / ph.length;
        for (i = 0; i < ph.length; i++) { sel.push(ph[i]); dw.push(wh); strat.push(h); psu.push(sel.length - 1); }
      }
    } else {
      var S = fr.streetList.length, m = Math.round(n / SIM.perStreet);
      var chosen = pick(fr.streetList, m, r);
      for (var c = 0; c < chosen.length; c++) {
        var mem = fr.streets[chosen[c]], take = Math.min(SIM.perStreet, mem.length);
        var pc = pick(mem, take, r), wc = (S / chosen.length) * (mem.length / pc.length);
        for (i = 0; i < pc.length; i++) { sel.push(pc[i]); dw.push(wc); strat.push(0); psu.push(chosen[c]); }
      }
    }
    // nonresponse (simulated propensities)
    var resp = [];
    for (i = 0; i < sel.length; i++) {
      var k = sel[i], p;
      if (cfg.nr === "none") p = 1;
      else if (cfg.nr === "uniform") p = SIM.respUniform;
      else if (cfg.nr === "age") p = SIM.respAge[P.age[k]];
      else p = SIM.respAge[P.age[k]] * (P.bad[k] ? SIM.respOutcomeBad : SIM.respOutcomeGood);
      resp.push(r() < p ? 1 : 0);
    }
    var sd = 0, sy = 0, rd = 0, ry = 0, R = [];
    for (i = 0; i < sel.length; i++) {
      sd += dw[i]; sy += dw[i] * P.bad[sel[i]];
      if (resp[i]) { rd += dw[i]; ry += dw[i] * P.bad[sel[i]]; R.push(i); }
    }
    var out = { issued: sel.length, respondents: R.length, frameSize: fr.F.length, frameMean: fr.mean, sampleMean: sy / sd, design: design };
    if (R.length < 2) { out.ok = false; return out; }
    var areaN = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < R.length; i++) areaN[P.area[sel[R[i]]]] += 1;
    out.areaN = areaN;
    out.ok = true;
    out.respMean = ry / rd;
    var w = [];
    for (i = 0; i < R.length; i++) w.push(dw[R[i]]);
    if (cfg.weight === "post") {
      var cs = [];
      for (h = 0; h < 12; h++) cs.push(0);
      for (i = 0; i < R.length; i++) { var kk = sel[R[i]]; cs[P.age[kk] * 2 + P.sex[kk]] += w[i]; }
      var empty = 0;
      for (h = 0; h < 12; h++) if (cs[h] === 0) empty += 1;
      for (i = 0; i < R.length; i++) { var k2 = sel[R[i]], cc = P.age[k2] * 2 + P.sex[k2]; w[i] = w[i] * P.T.cell[cc] / cs[cc]; }
      out.emptyCells = empty;
    } else if (cfg.weight === "rake") {
      var dims = [["age", 6], ["sex", 2], ["area", 10]];
      for (var it = 0; it < SIM.rakeIters; it++) {
        for (var dI = 0; dI < 3; dI++) {
          var nm = dims[dI][0], K = dims[dI][1], sums = [];
          for (h = 0; h < K; h++) sums.push(0);
          for (i = 0; i < R.length; i++) sums[P[nm][sel[R[i]]]] += w[i];
          for (i = 0; i < R.length; i++) { var cat = P[nm][sel[R[i]]]; if (sums[cat] > 0) w[i] = w[i] * P.T[nm][cat] / sums[cat]; }
        }
      }
    }
    var trimmed = 0;
    if (cfg.trim) {
      for (var ti = 0; ti < SIM.trimIters; ti++) {
        var tw = 0;
        for (i = 0; i < w.length; i++) tw += w[i];
        var cap = SIM.trimCap * tw / w.length, nt = 0, tw2 = 0;
        for (i = 0; i < w.length; i++) { if (w[i] > cap) { w[i] = cap; nt += 1; } tw2 += w[i]; }
        for (i = 0; i < w.length; i++) w[i] = w[i] * tw / tw2;
        if (ti === 0) trimmed = nt;
      }
    }
    out.trimmed = trimmed;
    var sw = 0, swy = 0, sw2 = 0;
    for (i = 0; i < R.length; i++) { sw += w[i]; swy += w[i] * P.bad[sel[R[i]]]; sw2 += w[i] * w[i]; }
    var est = swy / sw;
    out.est = est;
    out.kish = R.length * sw2 / (sw * sw);
    // linearised variance, strata and PSUs in first-appearance order
    var psuKey = {}, psuS = [], psuZ = [];
    for (i = 0; i < R.length; i++) {
      var key = strat[R[i]] + ":" + psu[R[i]];
      var z = w[i] * (P.bad[sel[R[i]]] - est) / sw;
      if (!psuKey.hasOwnProperty(key)) { psuKey[key] = psuZ.length; psuZ.push(0); psuS.push(strat[R[i]]); }
      psuZ[psuKey[key]] += z;
    }
    var v = 0;
    for (h = 0; h < 10; h++) {
      var cnt = 0, sum = 0, j;
      for (j = 0; j < psuZ.length; j++) if (psuS[j] === h) { cnt += 1; sum += psuZ[j]; }
      if (cnt < 2) continue;
      var mean = sum / cnt, ss = 0;
      for (j = 0; j < psuZ.length; j++) if (psuS[j] === h) ss += (psuZ[j] - mean) * (psuZ[j] - mean);
      v += cnt / (cnt - 1) * ss;
    }
    var srsVar = est * (1 - est) / R.length;
    out.honest = 1.96 * Math.sqrt(v);
    out.naive = 1.96 * Math.sqrt(srsVar);
    out.deff = srsVar > 0 ? v / srsVar : 1;
    out.neff = out.deff > 0 ? R.length / out.deff : R.length;
    return out;
  }

  function run(P, cfg, opts) {
    opts = opts || {};
    var seed = (cfg.seed === undefined ? 1 : cfg.seed) >>> 0, reps = opts.reps === undefined ? 1000 : opts.reps;
    var T = P.truth;
    var one = draw(P, cfg, seed);
    var res = { truth: T, popN: P.N, cfg: cfg, draw: one };
    if (one.ok) {
      res.err = {
        total: one.est - T, coverage: one.frameMean - T, sampling: one.sampleMean - one.frameMean,
        nonresponse: one.respMean - one.sampleMean, weighting: one.est - one.respMean
      };
    }
    var k = 0, s = 0, s2 = 0, cH = 0, cN = 0, sSamp = 0, sNR = 0, sW = 0, sRR = 0, sDeff = 0;
    for (var rep = 1; rep <= reps; rep++) {
      var d = draw(P, cfg, (seed + Math.imul(rep, 0x9E3779B9)) >>> 0);
      if (!d.ok) continue;
      if (opts.keep) opts.keep.push(d.est);
      k += 1; s += d.est; s2 += d.est * d.est;
      if (Math.abs(d.est - T) <= d.honest) cH += 1;
      if (Math.abs(d.est - T) <= d.naive) cN += 1;
      sSamp += d.sampleMean - d.frameMean; sNR += d.respMean - d.sampleMean; sW += d.est - d.respMean;
      sRR += d.respondents / d.issued; sDeff += d.deff;
    }
    if (k > 0) {
      var mean = s / k, varr = s2 / k - mean * mean;
      if (varr < 0) varr = 0;
      res.reps = {
        n: k, meanEst: mean, bias: mean - T, sd: Math.sqrt(varr), rmse: Math.sqrt(varr + (mean - T) * (mean - T)),
        coverHonest: cH / k, coverNaive: cN / k,
        biasCoverage: one.frameMean - T, biasSampling: sSamp / k, biasNonresponse: sNR / k, biasWeighting: sW / k,
        rr: sRR / k, deff: sDeff / k
      };
    }
    return res;
  }

  // completes and issued sample needed for a target margin (all inputs as proportions)
  function size(margin, p, rr, deff) {
    var srs = 1.96 * 1.96 * p * (1 - p) / (margin * margin);
    var completes = Math.ceil(srs * deff);
    return { srs: Math.ceil(srs), completes: completes, issued: Math.ceil(completes / rr) };
  }

  function comma(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

  function pct(x, d) { return (x * 100).toFixed(d === undefined ? 1 : d); }
  function pts(x) { var v = (x * 100).toFixed(1); if (v === "-0.0") v = "0.0"; return v.charAt(0) === "-" ? v : "+" + v; }

  // the lines the widget prints; the canon and the pages quote exactly these
  function lines(res) {
    var d = res.draw, out = [];
    out.push("Truth (census rows): " + pct(res.truth) + "%");
    if (!d.ok) { out.push("Too few respondents to estimate"); return out; }
    out.push("Estimate: " + pct(d.est) + "% ± " + pct(d.honest) + " (honest margin) · naive ±" + pct(d.naive));
    out.push("Total error: " + pts(res.err.total) + " pts = coverage " + pts(res.err.coverage) + " · sampling " + pts(res.err.sampling) +
      " · nonresponse " + pts(res.err.nonresponse) + " · weighting " + pts(res.err.weighting));
    out.push("Issued " + d.issued + " · answered " + d.respondents + " (" + pct(d.respondents / d.issued, 0) + "%) · design effect " +
      d.deff.toFixed(2) + " · effective n " + Math.round(d.neff));
    out.push("Frame: " + comma(d.frameSize) + " of " + comma(res.popN) + " adults could be reached");
    var mn = 0, mx = 0;
    for (var a = 1; a < 10; a++) { if (d.areaN[a] < d.areaN[mn]) mn = a; if (d.areaN[a] > d.areaN[mx]) mx = a; }
    out.push("Answers per area: fewest " + d.areaN[mn] + " (area " + (mn + 1) + ") · most " + d.areaN[mx] + " (area " + (mx + 1) + ")");
    if (res.reps) {
      var R = res.reps;
      out.push("Over " + R.n + " repeat surveys: bias " + pts(R.bias) + " pts · spread (SD) " + pct(R.sd) + " pts · honest margin covers the truth " +
        pct(R.coverHonest, 0) + "% · naive " + pct(R.coverNaive, 0) + "%");
      out.push("Average split over " + R.n + ": coverage " + pts(R.biasCoverage) + " · sampling " + pts(R.biasSampling) + " · nonresponse " + pts(R.biasNonresponse) + " · weighting " + pts(R.biasWeighting));
    }
    return out;
  }

  var API = { SIM: SIM, LADDER: LADDER, PRESETS: PRESETS, size: size, rng: rng, decode: decode, buildFrame: buildFrame, draw: draw, run: run, lines: lines, pct: pct, pts: pts };
  root.SVY_ENGINE = API;
  if (typeof module !== "undefined" && module.exports) module.exports = API;
})(typeof window !== "undefined" ? window : this);

/* ---------- the widget (browser only) ---------- */
(function () {
  "use strict";
  if (typeof document === "undefined") return;
  var E = window.SVY_ENGINE, P = null;
  var FRAMES = [["address", "Address list (households)"], ["panel", "Online opt-in panel"], ["intercept", "Street intercept"]];
  var DESIGNS = [["srs", "Simple random"], ["strat", "Stratified by area"], ["cluster", "Clustered by street"]];
  var SIZES = [["500", "500 issued"], ["1000", "1,000 issued"], ["2000", "2,000 issued"], ["4000", "4,000 issued"]];
  var NRS = [["none", "Everyone answers"], ["uniform", "22% answer, evenly"], ["age", "Skewed old (older answer more)"], ["outcome", "Linked to the answer itself"]];
  var WEIGHTS = [["none", "No weighting"], ["post", "Post-stratify: age x sex"], ["rake", "Rake: age, sex, area"]];
  var benches = [];

  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt !== undefined) e.textContent = txt; return e; }
  function sel(label, opts, val, on) {
    var w = el("label", "svy-ctl"), s = el("select", "svy-select");
    w.appendChild(el("span", "svy-clab", label));
    opts.forEach(function (o) { var op = el("option", null, o[1]); op.value = o[0]; s.appendChild(op); });
    s.value = String(val); s.addEventListener("change", function () { on(s.value); });
    w.appendChild(s); return { wrap: w, input: s };
  }
  function f1(x) { return (x * 100).toFixed(1); }

  function Bench(root) {
    var self = this;
    this.root = root;
    var start = root.getAttribute("data-rung"), preset = root.getAttribute("data-preset");
    this.cfg = { frame: "address", design: "srs", n: 1000, nr: "age", weight: "none", trim: false, seed: 1 };
    this.rung = null;
    root.classList.add("svy-bench");
    var head = el("div", "svy-head");
    head.appendChild(el("h4", null, "The survey error lab: Ottervale's question, asked of real census rows"));
    head.appendChild(el("p", "svy-rail", "Population: 20,000 real adults from the ONS Census 2021 public microdata teaching sample (Open Government Licence v3.0); the share whose general health is fair, bad or very bad stands in for an Ottervale question, and it is the truth. Simulated, not measured: who joins the panel or walks past the intercept, who answers (the response propensities), and the street grouping. Ottervale is constructed."));
    root.appendChild(head);
    root.appendChild(el("span", "svy-clabel", "Ladder"));
    var lad = el("div", "svy-ladder");
    this.rungBtns = {};
    E.LADDER.forEach(function (r) {
      var b = el("button", "svy-rung" + (r.id === "r5" ? " svy-trap" : ""));
      b.type = "button"; b.innerHTML = "<b>" + r.id.toUpperCase() + "</b> "; b.appendChild(document.createTextNode(r.label));
      b.addEventListener("click", function () { self.setRung(r.id); });
      lad.appendChild(b); self.rungBtns[r.id] = b;
    });
    root.appendChild(lad);
    root.appendChild(el("span", "svy-clabel", "Your choices"));
    var ctl = el("div", "svy-ctls");
    this.inputs = {};
    var mk = function (key, label, opts, num) {
      var c = sel(label, opts, self.cfg[key], function (v) { self.rung = null; self.cfg[key] = num ? parseInt(v, 10) : v; self.render(); });
      self.inputs[key] = c.input; ctl.appendChild(c.wrap);
    };
    mk("frame", "Frame", FRAMES); mk("design", "Design", DESIGNS); mk("n", "Sample size", SIZES, true);
    mk("nr", "Who answers (simulated)", NRS); mk("weight", "Weighting", WEIGHTS);
    var tl = el("label", "svy-ctl svy-check"), tc = el("input"); tc.type = "checkbox";
    tc.addEventListener("change", function () { self.rung = null; self.cfg.trim = tc.checked; self.render(); });
    tl.appendChild(tc); tl.appendChild(el("span", null, "Trim weights at 2x the mean")); ctl.appendChild(tl); this.inputs.trim = tc;
    root.appendChild(ctl);
    var bar = el("div", "svy-bar");
    var again = el("button", "svy-btn", "Draw another sample"); again.type = "button";
    again.addEventListener("click", function () { self.cfg.seed += 1; self.render(); });
    var reset = el("button", "svy-btn", "Back to sample 1"); reset.type = "button";
    reset.addEventListener("click", function () { self.cfg.seed = 1; self.render(); });
    this.seedEl = el("span", "svy-seed");
    bar.appendChild(again); bar.appendChild(reset); bar.appendChild(this.seedEl);
    root.appendChild(bar);
    this.note = el("p", "svy-note"); root.appendChild(this.note);
    this.headline = el("div", "svy-headline"); root.appendChild(this.headline);
    this.fig = el("div", "svy-fig"); root.appendChild(this.fig);
    this.stats = el("ul", "svy-stats"); root.appendChild(this.stats);
    if (start) this.setRung(start, true);
    else if (preset && E.PRESETS[preset]) this.setPreset(preset, true);
    this.render();
  }

  Bench.prototype.sync = function () {
    var c = this.cfg, i = this.inputs;
    i.frame.value = c.frame; i.design.value = c.design; i.n.value = String(c.n); i.nr.value = c.nr; i.weight.value = c.weight; i.trim.checked = !!c.trim;
    for (var k in this.rungBtns) this.rungBtns[k].classList.toggle("is-on", k === this.rung);
  };
  Bench.prototype.setRung = function (id, quiet) {
    var r = null;
    E.LADDER.forEach(function (x) { if (x.id === id) r = x; });
    if (!r) return;
    this.rung = id;
    this.cfg = { frame: r.frame, design: r.design, n: r.n, nr: r.nr, weight: r.weight, trim: r.trim, seed: 1 };
    if (!quiet) this.render();
  };
  Bench.prototype.setPreset = function (name, quiet) {
    var p = E.PRESETS[name]; if (!p) return;
    this.rung = null;
    this.cfg = { frame: p.frame, design: p.design, n: p.n, nr: p.nr, weight: p.weight, trim: p.trim, seed: 1 };
    if (!quiet) this.render();
  };
  Bench.prototype.render = function () {
    this.sync();
    if (!P) P = E.decode(window.SVY_DATA);
    var c = this.cfg;
    var notes = [];
    if (c.design === "cluster" && c.frame !== "address") notes.push("Streets exist only on the address list, so this frame is drawn as simple random.");
    if (c.frame === "intercept") notes.push("A street intercept has no list to draw from: it reaches whoever walks past, so its margin assumes a probability sample it is not.");
    if (c.nr === "outcome") notes.push("Here, answering depends on the answer itself: residents in fair or worse health answer less, within every age band. Weighting on age, sex and area cannot see that.");
    this.note.textContent = notes.join(" ");
    this.note.style.display = notes.length ? "" : "none";
    this.seedEl.textContent = "Sample " + c.seed;
    var keep = [];
    var res = E.run(P, c, { reps: 1000, keep: keep });
    this.ests = keep;
    this.res = res;
    var L = E.lines(res);
    this.lines = L;
    this.headline.innerHTML = "";
    if (res.draw.ok) {
      var b = el("b", null, f1(res.draw.est) + "%");
      this.headline.appendChild(b);
      this.headline.appendChild(document.createTextNode(" estimated, against a truth of " + f1(res.truth) + "%. Total error " + E.pts(res.err.total) + " points."));
    } else {
      this.headline.textContent = "Too few respondents to estimate.";
    }
    this.stats.innerHTML = "";
    for (var i = 1; i < L.length; i++) this.stats.appendChild(el("li", null, L[i]));
    this.drawFig(res);
  };
  Bench.prototype.drawFig = function (res) {
    var NS = "http://www.w3.org/2000/svg", W = 880, H = 230, x0 = 70, x1 = 840, lo = 0, hi = 0.45;
    var X = function (v) { return x0 + (Math.max(lo, Math.min(hi, v)) - lo) / (hi - lo) * (x1 - x0); };
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 " + W + " " + H); svg.setAttribute("role", "img");
    var d = res.draw;
    svg.setAttribute("aria-label", d.ok ? ("Estimate " + f1(d.est) + " percent with honest margin " + f1(d.honest) + ", truth " + f1(res.truth) + " percent, and the spread of 1,000 repeat surveys.") : "No estimate");
    function add(tag, attrs, txt) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (txt !== undefined) e.textContent = txt; svg.appendChild(e); return e; }
    add("text", { x: 20, y: 22, "class": "svy-fh" }, "THIS SAMPLE, AND 1,000 REPEAT SURVEYS OF THE SAME DESIGN");
    // histogram of repeat estimates
    var bins = [], nb = 45, i;
    for (i = 0; i < nb; i++) bins.push(0);
    var ests = this.ests;
    var mx = 1;
    ests.forEach(function (e) { var k = Math.floor((e - lo) / (hi - lo) * nb); if (k < 0) k = 0; if (k >= nb) k = nb - 1; bins[k] += 1; });
    bins.forEach(function (v) { if (v > mx) mx = v; });
    var bw = (x1 - x0) / nb;
    for (i = 0; i < nb; i++) if (bins[i]) add("rect", { x: (x0 + i * bw + 1).toFixed(1), y: (120 - bins[i] / mx * 80).toFixed(1), width: (bw - 2).toFixed(1), height: (bins[i] / mx * 80).toFixed(1), "class": "svy-fbar" });
    add("line", { x1: x0, y1: 120, x2: x1, y2: 120, "class": "svy-faxis" });
    for (var t = 0; t <= 0.45; t += 0.05) {
      var tx = X(t);
      add("line", { x1: tx, y1: 120, x2: tx, y2: 126, "class": "svy-faxis" });
      add("text", { x: tx, y: 140, "text-anchor": "middle", "class": "svy-fs" }, Math.round(t * 100) + "%");
    }
    add("text", { x: 20, y: 70, "class": "svy-fs" }, "repeats");
    // truth line
    var tX = X(res.truth);
    add("line", { x1: tX, y1: 36, x2: tX, y2: 190, "class": "svy-ftruth" });
    add("text", { x: tX + 8, y: 46, "class": "svy-fb" }, "truth " + f1(res.truth) + "%");
    if (d.ok) {
      var eX = X(d.est);
      add("line", { x1: X(d.est - d.naive), y1: 168, x2: X(d.est + d.naive), y2: 168, "class": "svy-fnaive" });
      add("line", { x1: X(d.est - d.honest), y1: 184, x2: X(d.est + d.honest), y2: 184, "class": "svy-fhonest" });
      add("circle", { cx: eX, cy: 176, r: 7, "class": "svy-fdot" });
      add("text", { x: 20, y: 172, "class": "svy-fs" }, "naive margin");
      add("text", { x: 20, y: 188, "class": "svy-fs" }, "honest margin");
      add("text", { x: 20, y: 214, "class": "svy-fn" }, "This sample: " + f1(d.est) + "% ± " + f1(d.honest) + ". Bars: where 1,000 repeat surveys of the same design landed.");
    }
    this.fig.innerHTML = ""; this.fig.appendChild(svg);
  };
  /* sample-size planner: completes and issued addresses for a target margin */
  function Planner(root) {
    root.classList.add("svy-bench", "svy-planner");
    var head = el("div", "svy-head");
    head.appendChild(el("h4", null, "Sample size planner: completes needed, then addresses to issue"));
    head.appendChild(el("p", "svy-rail", "Formula: completes = 1.96² × p(1 − p) ÷ margin² × design effect; issued = completes ÷ expected response rate. It plans precision only: no sample size buys back a biased frame or nonresponse that tracks the answer."));
    root.appendChild(head);
    var ctl = el("div", "svy-ctls"), st = { m: 0.03, p: 0.22, rr: 0.22, de: 1.2 };
    var out = el("div", "svy-headline"), list = el("ul", "svy-stats");
    function go() {
      var s = E.size(st.m, st.p, st.rr, st.de);
      out.innerHTML = "";
      var b = el("b", null, s.issued.toLocaleString("en-GB"));
      out.appendChild(b); out.appendChild(document.createTextNode(" addresses to issue for ±" + (st.m * 100).toFixed(0) + " points"));
      list.innerHTML = "";
      list.appendChild(el("li", null, "Completes at simple random: " + s.srs.toLocaleString("en-GB")));
      list.appendChild(el("li", null, "Completes after the design effect " + st.de.toFixed(1) + ": " + s.completes.toLocaleString("en-GB")));
      list.appendChild(el("li", null, "Issued at a " + Math.round(st.rr * 100) + "% response rate: " + s.issued.toLocaleString("en-GB")));
    }
    var add = function (key, label, opts) {
      var c = sel(label, opts, String(st[key]), function (v) { st[key] = parseFloat(v); go(); });
      ctl.appendChild(c.wrap);
    };
    add("m", "Target margin", [["0.03", "±3 points"], ["0.05", "±5 points"]]);
    add("p", "Expected share", [["0.22", "22%"], ["0.5", "50% (worst case)"]]);
    add("rr", "Expected response rate", [["0.22", "22%"], ["0.4", "40%"], ["1", "100% (nobody refuses)"]]);
    add("de", "Design effect", [["1", "1.0"], ["1.2", "1.2"], ["1.5", "1.5"]]);
    root.appendChild(ctl); root.appendChild(out); root.appendChild(list);
    go();
  }

  function init() {
    document.querySelectorAll(".svy-widget").forEach(function (root) {
      if (root.getAttribute("data-mode") === "size") Planner(root);
      else benches.push(new Bench(root));
    });
    window.SVY_BENCH = {
      all: benches,
      setRung: function (id, k) { benches[k || 0].setRung(id); return benches[k || 0].lines; },
      setPreset: function (name, k) { benches[k || 0].setPreset(name); return benches[k || 0].lines; },
      lines: function (k) { return benches[k || 0].lines; }
    };
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
