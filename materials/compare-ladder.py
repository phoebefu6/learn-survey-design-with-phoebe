#!/usr/bin/env python3
"""Compare the Python reference canon with the browser engine run in node, BY VALUE.

Usage: python3 materials/compare-ladder.py <repo> [--reps N]
Runs both over the whole ladder and every preset, walks every key, and fails on any numeric
difference larger than 1e-12 or any differing printed line. Self-test: a planted 0.1% fault on
one headline estimate must make the comparison fail, or the checker itself is broken.
"""
import json, subprocess, sys
from pathlib import Path

def walk(a, b, path, diffs):
    if isinstance(a, dict) and isinstance(b, dict):
        for k in sorted(set(a) | set(b)):
            if k not in a or k not in b:
                diffs.append(f"{path}.{k}: missing on one side")
            else:
                walk(a[k], b[k], f"{path}.{k}", diffs)
    elif isinstance(a, list) and isinstance(b, list):
        if len(a) != len(b):
            diffs.append(f"{path}: length {len(a)} vs {len(b)}")
        for i, (x, y) in enumerate(zip(a, b)):
            walk(x, y, f"{path}[{i}]", diffs)
    elif isinstance(a, bool) or isinstance(b, bool):
        if a != b:
            diffs.append(f"{path}: {a} vs {b}")
    elif isinstance(a, (int, float)) and isinstance(b, (int, float)):
        if abs(a - b) > 1e-12:
            diffs.append(f"{path}: {a} vs {b}")
    elif a != b:
        diffs.append(f"{path}: {a!r} vs {b!r}")

repo = Path(sys.argv[1]).resolve()
reps = sys.argv[sys.argv.index("--reps") + 1] if "--reps" in sys.argv else "1000"
py = json.loads(subprocess.check_output([sys.executable, str(repo / "materials/svy_reference.py"), str(repo), "--json", "--reps", reps]))
nd = json.loads(subprocess.check_output(["node", str(repo / "materials/svy-node.js"), reps]))
diffs = []
walk(py, nd, "canon", diffs)
planted = json.loads(json.dumps(nd))
planted["runs"]["r3"]["draw"]["est"] *= 1.001
self_test = []
walk(py, planted, "canon", self_test)
n = [0]
def count(x):
    if isinstance(x, dict): [count(v) for v in x.values()]
    elif isinstance(x, list): [count(v) for v in x]
    else: n[0] += 1
count(py)
print(f"{n[0]} values compared over {len(py['runs'])} runs x {reps} repeat surveys; differences: {len(diffs)}")
for d in diffs[:20]:
    print("  ", d)
print(f"self-test with a planted 0.1% fault: {'caught' if self_test else 'MISSED'}")
sys.exit(0 if (not diffs and self_test) else 1)
