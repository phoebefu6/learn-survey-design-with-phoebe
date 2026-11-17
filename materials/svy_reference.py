#!/usr/bin/env python3
"""Python reference for the survey error lab, by Phoebe Fu.

A line-for-line copy of the engine in assets/svy-live.js. It reads the same shipped sample
(assets/svy-sample.js), runs the same seeded draws, and must print the same numbers as the
browser to the last bit (materials/compare-ladder.py checks every value).

    python3 materials/svy_reference.py <repo> [--json] [--reps 1000]

Real: the census rows (ONS 2021 teaching sample, OGL v3.0). Simulated, and labelled on the
widget: panel and intercept coverage, response propensities, the street grouping.
"""
import json
import math
from decimal import Decimal, ROUND_HALF_UP
import sys
from pathlib import Path

M32 = 0xFFFFFFFF

SIM = {
    "panelCover": [0.30, 0.30, 0.26, 0.22, 0.16, 0.09],
    "panelBadFactor": 0.7,
    "interceptCover": [0.10, 0.30, 0.22],
    "interceptBadFactor": 0.5,
    "respUniform": 0.22,
    "respAge": [0.10, 0.12, 0.16, 0.22, 0.30, 0.38],
    "respOutcomeBad": 0.55,
    "respOutcomeGood": 1.12,
    "rakeIters": 20,
    "trimCap": 2.0,
    "trimIters": 10,
    "frameSeed": 7001,
    "perStreet": 10,
}

LADDER = [
    {"id": "r0", "label": "Convenience: street intercept", "frame": "intercept", "design": "srs", "n": 1000, "nr": "uniform", "weight": "none", "trim": False},
    {"id": "r1", "label": "Address frame, simple random", "frame": "address", "design": "srs", "n": 1000, "nr": "age", "weight": "none", "trim": False},
    {"id": "r2", "label": "Stratified by area", "frame": "address", "design": "strat", "n": 1000, "nr": "age", "weight": "none", "trim": False},
    {"id": "r3", "label": "Stratified + raking", "frame": "address", "design": "strat", "n": 1000, "nr": "age", "weight": "rake", "trim": False},
    {"id": "r4", "label": "Raking + trimming", "frame": "address", "design": "strat", "n": 1000, "nr": "age", "weight": "rake", "trim": True},
    {"id": "r5", "label": "Outcome-linked nonresponse", "frame": "address", "design": "strat", "n": 1000, "nr": "outcome", "weight": "rake", "trim": True},
]

PRESETS = {
    "panel": {"frame": "panel", "design": "srs", "n": 1000, "nr": "age", "weight": "none", "trim": False},
    "panelRake": {"frame": "panel", "design": "srs", "n": 1000, "nr": "age", "weight": "rake", "trim": False},
    "cluster": {"frame": "address", "design": "cluster", "n": 1000, "nr": "age", "weight": "none", "trim": False},
    "post": {"frame": "address", "design": "strat", "n": 1000, "nr": "age", "weight": "post", "trim": False},
    "uniform": {"frame": "address", "design": "srs", "n": 1000, "nr": "uniform", "weight": "none", "trim": False},
    "big": {"frame": "address", "design": "srs", "n": 4000, "nr": "age", "weight": "none", "trim": False},
}


def imul(a, b):
    return (a * b) & M32


def rng(seed):
    state = [seed & M32]

    def nxt():
        a = (state[0] + 0x6D2B79F5) & M32
        state[0] = a
        t = imul(a ^ (a >> 15), 1 | a)
        t = ((t + imul(t ^ (t >> 7), 61 | t)) & M32) ^ t
        return (t ^ (t >> 14)) / 4294967296

    return nxt


def decode(data):
    P = {"age": [], "sex": [], "area": [], "comm": [], "econ": [], "bad": [], "street": []}
    for v in data["codes"]:
        P["bad"].append(v % 2); v //= 2
        P["econ"].append(v % 3); v //= 3
        P["comm"].append(v % 2); v //= 2
        P["area"].append(v % 10); v //= 10
        P["sex"].append(v % 2); v //= 2
        P["age"].append(v)
    for j, size in enumerate(data["streets"]):
        P["street"] += [j] * size
    N = len(data["codes"])
    P["N"] = N
    T = {"age": [0] * 6, "sex": [0] * 2, "area": [0] * 10, "cell": [0] * 12}
    s = 0
    for i in range(N):
        T["age"][P["age"][i]] += 1
        T["sex"][P["sex"][i]] += 1
        T["area"][P["area"][i]] += 1
        T["cell"][P["age"][i] * 2 + P["sex"][i]] += 1
        s += P["bad"][i]
    P["T"] = T
    P["truth"] = s / N
    P["_frames"] = {}
    return P


def build_frame(P, frame):
    if frame in P["_frames"]:
        return P["_frames"][frame]
    F = []
    if frame == "address":
        F = [i for i in range(P["N"]) if P["comm"][i] == 0]
    else:
        r = rng(SIM["frameSeed"] + (1 if frame == "panel" else 2))
        for i in range(P["N"]):
            if frame == "panel":
                p = SIM["panelCover"][P["age"][i]] * (SIM["panelBadFactor"] if P["bad"][i] else 1)
            else:
                p = SIM["interceptCover"][P["econ"][i]] * (SIM["interceptBadFactor"] if P["bad"][i] else 1)
            if r() < p:
                F.append(i)
    s = 0
    for i in F:
        s += P["bad"][i]
    by_area = [[] for _ in range(10)]
    streets, street_list = {}, []
    for i in F:
        by_area[P["area"][i]].append(i)
        st = P["street"][i]
        if st not in streets:
            streets[st] = []
            street_list.append(st)
        streets[st].append(i)
    out = {"F": F, "mean": s / len(F), "byArea": by_area, "streets": streets, "streetList": street_list}
    P["_frames"][frame] = out
    return out


def pick(arr, k, r):
    M = len(arr)
    if k > M:
        k = M
    sw, out = [], []
    for i in range(k):
        j = i + math.floor(r() * (M - i))
        arr[i], arr[j] = arr[j], arr[i]
        sw.append(j)
        out.append(arr[i])
    for i in range(k - 1, -1, -1):
        j = sw[i]
        arr[i], arr[j] = arr[j], arr[i]
    return out


def draw(P, cfg, seed):
    fr = build_frame(P, cfg["frame"])
    r = rng(seed)
    design = cfg["design"]
    if design == "cluster" and cfg["frame"] != "address":
        design = "srs"
    sel, dw, strat, psu = [], [], [], []
    n = min(cfg["n"], len(fr["F"]))
    if design == "srs":
        ps = pick(fr["F"], n, r)
        w0 = len(fr["F"]) / len(ps)
        for i, x in enumerate(ps):
            sel.append(x); dw.append(w0); strat.append(0); psu.append(i)
    elif design == "strat":
        M = len(fr["F"])
        alloc, rem, tot = [], [], 0
        for h in range(10):
            exact = n * len(fr["byArea"][h]) / M
            alloc.append(math.floor(exact)); rem.append(exact - math.floor(exact)); tot += math.floor(exact)
        left = n - tot
        while left > 0:
            best = -1
            for h in range(10):
                if best < 0 or rem[h] > rem[best]:
                    best = h
            alloc[best] += 1; rem[best] = -1; left -= 1
        for h in range(10):
            nh = min(alloc[h], len(fr["byArea"][h]))
            if nh <= 0:
                continue
            ph = pick(fr["byArea"][h], nh, r)
            wh = len(fr["byArea"][h]) / len(ph)
            for x in ph:
                sel.append(x); dw.append(wh); strat.append(h); psu.append(len(sel) - 1)
    else:
        S = len(fr["streetList"])
        m = js_round(n / SIM["perStreet"])
        chosen = pick(fr["streetList"], m, r)
        for c in chosen:
            mem = fr["streets"][c]
            take = min(SIM["perStreet"], len(mem))
            pc = pick(mem, take, r)
            wc = (S / len(chosen)) * (len(mem) / len(pc))
            for x in pc:
                sel.append(x); dw.append(wc); strat.append(0); psu.append(c)
    resp = []
    for k in sel:
        if cfg["nr"] == "none":
            p = 1
        elif cfg["nr"] == "uniform":
            p = SIM["respUniform"]
        elif cfg["nr"] == "age":
            p = SIM["respAge"][P["age"][k]]
        else:
            p = SIM["respAge"][P["age"][k]] * (SIM["respOutcomeBad"] if P["bad"][k] else SIM["respOutcomeGood"])
        resp.append(1 if r() < p else 0)
    sd = sy = rd = ry = 0.0
    R = []
    for i in range(len(sel)):
        sd += dw[i]; sy += dw[i] * P["bad"][sel[i]]
        if resp[i]:
            rd += dw[i]; ry += dw[i] * P["bad"][sel[i]]; R.append(i)
    out = {"issued": len(sel), "respondents": len(R), "frameSize": len(fr["F"]), "frameMean": fr["mean"], "sampleMean": sy / sd, "design": design}
    if len(R) < 2:
        out["ok"] = False
        return out
    area_n = [0] * 10
    for ri in R:
        area_n[P["area"][sel[ri]]] += 1
    out["areaN"] = area_n
    out["ok"] = True
    out["respMean"] = ry / rd
    w = [dw[i] for i in R]
    if cfg["weight"] == "post":
        cs = [0.0] * 12
        for i, ri in enumerate(R):
            kk = sel[ri]
            cs[P["age"][kk] * 2 + P["sex"][kk]] += w[i]
        empty = sum(1 for h in range(12) if cs[h] == 0)
        for i, ri in enumerate(R):
            k2 = sel[ri]
            cc = P["age"][k2] * 2 + P["sex"][k2]
            w[i] = w[i] * P["T"]["cell"][cc] / cs[cc]
        out["emptyCells"] = empty
    elif cfg["weight"] == "rake":
        dims = [("age", 6), ("sex", 2), ("area", 10)]
        for _ in range(SIM["rakeIters"]):
            for nm, K in dims:
                sums = [0.0] * K
                for i, ri in enumerate(R):
                    sums[P[nm][sel[ri]]] += w[i]
                for i, ri in enumerate(R):
                    cat = P[nm][sel[ri]]
                    if sums[cat] > 0:
                        w[i] = w[i] * P["T"][nm][cat] / sums[cat]
    trimmed = 0
    if cfg["trim"]:
        for ti in range(SIM["trimIters"]):
            tw = 0.0
            for x in w:
                tw += x
            cap = SIM["trimCap"] * tw / len(w)
            nt, tw2 = 0, 0.0
            for i in range(len(w)):
                if w[i] > cap:
                    w[i] = cap; nt += 1
                tw2 += w[i]
            for i in range(len(w)):
                w[i] = w[i] * tw / tw2
            if ti == 0:
                trimmed = nt
    out["trimmed"] = trimmed
    sw = swy = sw2 = 0.0
    for i, ri in enumerate(R):
        sw += w[i]; swy += w[i] * P["bad"][sel[ri]]; sw2 += w[i] * w[i]
    est = swy / sw
    out["est"] = est
    out["kish"] = len(R) * sw2 / (sw * sw)
    psu_key, psu_s, psu_z = {}, [], []
    for i, ri in enumerate(R):
        key = f"{strat[ri]}:{psu[ri]}"
        z = w[i] * (P["bad"][sel[ri]] - est) / sw
        if key not in psu_key:
            psu_key[key] = len(psu_z); psu_z.append(0.0); psu_s.append(strat[ri])
        psu_z[psu_key[key]] += z
    v = 0.0
    for h in range(10):
        cnt, sm = 0, 0.0
        for j in range(len(psu_z)):
            if psu_s[j] == h:
                cnt += 1; sm += psu_z[j]
        if cnt < 2:
            continue
        mean = sm / cnt
        ss = 0.0
        for j in range(len(psu_z)):
            if psu_s[j] == h:
                ss += (psu_z[j] - mean) * (psu_z[j] - mean)
        v += cnt / (cnt - 1) * ss
    srs_var = est * (1 - est) / len(R)
    out["honest"] = 1.96 * math.sqrt(v)
    out["naive"] = 1.96 * math.sqrt(srs_var)
    out["deff"] = v / srs_var if srs_var > 0 else 1
    out["neff"] = len(R) / out["deff"] if out["deff"] > 0 else len(R)
    return out


def size(margin, p, rr, deff):
    srs = 1.96 * 1.96 * p * (1 - p) / (margin * margin)
    completes = math.ceil(srs * deff)
    return {"srs": math.ceil(srs), "completes": completes, "issued": math.ceil(completes / rr)}


def js_round(x):
    return math.floor(x + 0.5)


def run(P, cfg, reps=1000):
    seed = cfg.get("seed", 1) & M32
    T = P["truth"]
    one = draw(P, cfg, seed)
    res = {"truth": T, "popN": P["N"], "draw": one}
    if one["ok"]:
        res["err"] = {"total": one["est"] - T, "coverage": one["frameMean"] - T, "sampling": one["sampleMean"] - one["frameMean"],
                      "nonresponse": one["respMean"] - one["sampleMean"], "weighting": one["est"] - one["respMean"]}
    k = 0
    s = s2 = 0.0
    cH = cN = 0
    sSamp = sNR = sW = sRR = sDeff = 0.0
    for rep in range(1, reps + 1):
        d = draw(P, cfg, (seed + imul(rep, 0x9E3779B9)) & M32)
        if not d["ok"]:
            continue
        k += 1; s += d["est"]; s2 += d["est"] * d["est"]
        if abs(d["est"] - T) <= d["honest"]:
            cH += 1
        if abs(d["est"] - T) <= d["naive"]:
            cN += 1
        sSamp += d["sampleMean"] - d["frameMean"]; sNR += d["respMean"] - d["sampleMean"]; sW += d["est"] - d["respMean"]
        sRR += d["respondents"] / d["issued"]; sDeff += d["deff"]
    if k > 0:
        mean = s / k
        varr = s2 / k - mean * mean
        if varr < 0:
            varr = 0
        res["reps"] = {"n": k, "meanEst": mean, "bias": mean - T, "sd": math.sqrt(varr), "rmse": math.sqrt(varr + (mean - T) * (mean - T)),
                       "coverHonest": cH / k, "coverNaive": cN / k, "biasCoverage": one["frameMean"] - T,
                       "biasSampling": sSamp / k, "biasNonresponse": sNR / k, "biasWeighting": sW / k, "rr": sRR / k, "deff": sDeff / k}
    return res


def to_fixed(x, d):
    """JavaScript Number.prototype.toFixed: exact binary value, ties round up (away from zero)."""
    q = Decimal(1).scaleb(-d)
    v = Decimal(x).quantize(q, rounding=ROUND_HALF_UP)
    s = f"{v:.{d}f}"
    return "0" if s in ("-0", "-0.0") and d == 0 else s


def pct(x, d=1):
    return to_fixed(x * 100, d)


def pts(x):
    v = to_fixed(x * 100, 1)
    if v == "-0.0":
        v = "0.0"
    return v if v.startswith("-") else "+" + v


def lines(res):
    d = res["draw"]
    out = [f"Truth (census rows): {pct(res['truth'])}%"]
    if not d["ok"]:
        out.append("Too few respondents to estimate")
        return out
    e = res["err"]
    out.append(f"Estimate: {pct(d['est'])}% ± {pct(d['honest'])} (honest margin) · naive ±{pct(d['naive'])}")
    out.append(f"Total error: {pts(e['total'])} pts = coverage {pts(e['coverage'])} · sampling {pts(e['sampling'])} · nonresponse {pts(e['nonresponse'])} · weighting {pts(e['weighting'])}")
    out.append(f"Issued {d['issued']} · answered {d['respondents']} ({pct(d['respondents'] / d['issued'], 0)}%) · design effect {to_fixed(d['deff'], 2)} · effective n {js_round(d['neff'])}")
    out.append(f"Frame: {d['frameSize']:,} of {res['popN']:,} adults could be reached")
    mn = mx = 0
    for a in range(1, 10):
        if d["areaN"][a] < d["areaN"][mn]:
            mn = a
        if d["areaN"][a] > d["areaN"][mx]:
            mx = a
    out.append(f"Answers per area: fewest {d['areaN'][mn]} (area {mn + 1}) \u00b7 most {d['areaN'][mx]} (area {mx + 1})")
    if "reps" in res:
        R = res["reps"]
        out.append(f"Over {R['n']} repeat surveys: bias {pts(R['bias'])} pts · spread (SD) {pct(R['sd'])} pts · honest margin covers the truth {pct(R['coverHonest'], 0)}% · naive {pct(R['coverNaive'], 0)}%")
        out.append(f"Average split over {R['n']}: coverage {pts(R['biasCoverage'])} · sampling {pts(R['biasSampling'])} · nonresponse {pts(R['biasNonresponse'])} · weighting {pts(R['biasWeighting'])}")
    return out


def load(repo):
    txt = (Path(repo) / "assets" / "svy-sample.js").read_text(encoding="utf-8")
    body = txt[txt.index("window.SVY_DATA = ") + len("window.SVY_DATA = "):].strip().rstrip(";")
    return json.loads(body)


def canon(repo, reps):
    P = decode(load(repo))
    cfgs = {}
    for r in LADDER:
        c = dict(r); c["seed"] = 1; cfgs[r["id"]] = c
    for k, v in PRESETS.items():
        c = dict(v); c["seed"] = 1; cfgs[k] = c
    out = {"truth": P["truth"], "runs": {}}
    for k, c in cfgs.items():
        res = run(P, c, reps)
        out["runs"][k] = {"draw": res["draw"], "err": res.get("err"), "reps": res.get("reps"), "lines": lines(res)}
    out["size"] = {f"{m}-{rr}-{de}": size(m, 0.22, rr, de) for m in (0.03, 0.05) for rr in (0.22, 1) for de in (1, 1.2)}
    return out


if __name__ == "__main__":
    args = sys.argv[1:]
    repo = args[0] if args and not args[0].startswith("--") else str(Path(__file__).resolve().parent.parent)
    reps = int(args[args.index("--reps") + 1]) if "--reps" in args else 1000
    c = canon(repo, reps)
    if "--json" in args:
        print(json.dumps(c))
    else:
        for k, v in c["runs"].items():
            print("==", k)
            print("\n".join(v["lines"]))
