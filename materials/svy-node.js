// Runs the browser engine in Node over the whole ladder and presets; prints canon JSON.
// usage: node materials/svy-node.js [reps]   (loads assets/svy-live.js; the widget half skips itself without a document)
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.resolve(__dirname, "..");
const ctx = { window: {}, Math, JSON, console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, "assets/svy-sample.js"), "utf8"), ctx);
vm.runInContext(fs.readFileSync(path.join(root, "assets/svy-live.js"), "utf8"), ctx);
const E = ctx.window.SVY_ENGINE, P = E.decode(ctx.window.SVY_DATA);
const reps = process.argv[2] ? parseInt(process.argv[2], 10) : 1000;
const out = { truth: P.truth, runs: {} };
const cfgs = {};
E.LADDER.forEach(r => { cfgs[r.id] = Object.assign({}, r, { seed: 1 }); });
Object.keys(E.PRESETS).forEach(k => { cfgs[k] = Object.assign({}, E.PRESETS[k], { seed: 1 }); });
for (const k of Object.keys(cfgs)) {
  const res = E.run(P, cfgs[k], { reps });
  out.runs[k] = { draw: res.draw, err: res.err || null, reps: res.reps || null, lines: E.lines(res) };
}
out.size = {};
for (const m of [0.03, 0.05]) for (const rr of [0.22, 1]) for (const de of [1, 1.2]) out.size[`${m}-${rr}-${de}`] = E.size(m, 0.22, rr, de);
process.stdout.write(JSON.stringify(out, null, 1));
