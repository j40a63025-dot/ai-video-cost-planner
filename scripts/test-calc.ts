import assert from "node:assert/strict";
import { OFFERS, pricePerSecond, totalCost, compareAll, budgetPlan, planVsApi, klingCredits, KLING, usdPerCredit, PLANS, round } from "../lib/calc";
const o = (id: string) => OFFERS.find((x) => x.id === id)!;
const near = (a: number, b: number) => assert.ok(Math.abs(a - b) < 1e-6, `${a} != ${b}`);

// Tool 1 – compare. Case A: Veo 3.1 Fast 1080p, 10s x 6 clips = 0.12*60 = 7.20
near(totalCost(pricePerSecond(o("veo-3.1-fast"), "1080p")!, 10, 6), 7.2);
// Case B: Sora 2 Pro 1080p 10s x 6 + 25% retakes = 0.70*60*1.25 = 52.5; cheapest at 720p is Veo Lite 0.05 → 3.0
const cmp = compareAll({ seconds: 10, clips: 6, res: "720p", audio: false, retakePct: 0 });
assert.equal(cmp.available[0].offer.id, "veo-3.1-lite"); near(cmp.available[0].total!, 3.0);
near(totalCost(0.7, 10, 6, 25), 52.5);

// Tool 2 – Veo. Case A: Fast 1080p 8s x5 +30% → 0.12*8*5*1.3 = 6.24. Case B: Veo 3.1 4K 6s x 2 = 0.6*12 = 7.2
near(totalCost(0.12, 8, 5, 30), 6.24); near(totalCost(pricePerSecond(o("veo-3.1"), "4K")!, 6, 2), 7.2);
assert.equal(pricePerSecond(o("veo-3.1-lite"), "4K"), null);

// Tool 3 – Kling. Case A: 1080p audio 12cr/s, 10s x4 = 480 credits → $7.2727. Case B: 720p silent 6cr/s, 5s x10 +40% = 420 credits → $6.36
near(klingCredits({ creditsPerSecond: 12, seconds: 10, clips: 4, retakePct: 0, usdPerCredit: KLING.topUpUsdPerCredit }).credits, 480);
near(round(klingCredits({ creditsPerSecond: 12, seconds: 10, clips: 4, retakePct: 0, usdPerCredit: KLING.topUpUsdPerCredit }).usd, 4), 7.2727);
const kb = klingCredits({ creditsPerSecond: 6, seconds: 5, clips: 10, retakePct: 40, usdPerCredit: KLING.topUpUsdPerCredit });
near(kb.credits, 420); near(round(kb.usd, 2), 6.36);
near(pricePerSecond(o("kling-3-pro"), "1080p", true)!, 0.14);

// Tool 4 – budget. 3 scenes
const b = budgetPlan([
  { id: "1", name: "a", seconds: 8, offerId: "veo-3.1-fast", res: "1080p", takes: 3 },   // .12*8*3 = 2.88
  { id: "2", name: "b", seconds: 5, offerId: "sora-2", res: "720p", takes: 2 },          // .10*5*2 = 1.00
  { id: "3", name: "c", seconds: 10, offerId: "runway-gen4.5", res: "720p", takes: 1 },  // .12*10 = 1.20
], 10);
near(b.subtotal, 5.08); near(b.total, 5.588); assert.equal(b.finalSeconds, 23);

// Tool 5 – subscription vs API. Runway Gen-4.5, 300 s/mo, annual: need 3600 credits
const rp = (id: string) => PLANS.find((p) => p.id === id)!;
const plans = ["runway-standard", "runway-pro", "runway-max"].map((id) => ({ id, label: id, price: rp(id).annualMonthly!, credits: rp(id).credits! }));
const r = planVsApi({ secondsPerMonth: 300, creditsPerSecond: 12, apiPps: 0.12, annual: true, plans });
near(r.api, 36); assert.equal(r.best.id, "runway-pro"); assert.equal(r.best.count, 2); near(r.best.cost, 56); assert.equal(r.winner, "api");
// Case B: 750 s/mo → 9000 credits: Max x1 = $76 vs API $90 → subscription wins by $14
const r2 = planVsApi({ secondsPerMonth: 750, creditsPerSecond: 12, apiPps: 0.12, annual: true, plans });
assert.equal(r2.best.id, "runway-max"); near(r2.best.cost, 76); assert.equal(r2.winner, "subscription"); near(r2.savings, 14);
near(usdPerCredit(rp("pika-starter"), false), 10 / 900);
console.log("All calculator tests passed ✔");
