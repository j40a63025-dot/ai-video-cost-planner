import data from "@/data/pricing.json";

export type Res = "720p" | "1080p" | "4K";
export const RESOLUTIONS: Res[] = ["720p", "1080p", "4K"];

type ApiModel = (typeof data.apiModels)[number] & { pricesAudio?: Partial<Record<Res, number>> };
export type Plan = (typeof data.plans)[number];

export type Offer = {
  id: string;
  provider: string;
  name: string;
  kind: "api" | "credits";
  prices: Partial<Record<Res, number>>;
  pricesAudio?: Partial<Record<Res, number>>;
  source: string;
  readVia?: string;
  confidence: string;
  notes?: string;
};

const planById = (id: string) => data.plans.find((p) => p.id === id)!;

/** USD per credit for a plan: annual-billed price when available, else monthly. */
export function usdPerCredit(plan: Plan, annual = true): number {
  const price = annual && plan.annualMonthly != null ? plan.annualMonthly : (plan.monthly ?? plan.annualMonthly)!;
  return price / (plan.credits as number);
}

const apiOffers: Offer[] = (data.apiModels as ApiModel[]).map((m) => ({
  id: m.id, provider: m.provider, name: m.name, kind: "api",
  prices: m.prices as Offer["prices"], pricesAudio: m.pricesAudio,
  source: m.source, readVia: (m as { readVia?: string }).readVia, confidence: m.confidence, notes: m.notes,
}));

const creditOffers: Offer[] = data.creditModels.map((m) => {
  const plan = planById(m.planId);
  const upc = usdPerCredit(plan, true);
  const prices: Offer["prices"] = {};
  for (const [res, credits] of Object.entries(m.creditsPerClip)) {
    prices[res as Res] = (credits / m.clipSeconds) * upc;
  }
  return {
    id: m.id, provider: m.provider, name: m.name, kind: "credits", prices,
    source: m.source, readVia: (m as { readVia?: string }).readVia, confidence: m.confidence,
    notes: `${m.notes ?? ""} Effective rate at ${plan.provider} ${plan.name} (annual billing) = $${upc.toFixed(4)}/credit.`.trim(),
  };
});

export const OFFERS: Offer[] = [...apiOffers, ...creditOffers];
export const VEO_OFFERS = OFFERS.filter((o) => o.id.startsWith("veo-"));
export const PRICES_UPDATED_AT: string = data.updatedAt;

export function pricePerSecond(o: Offer, res: Res, audio = false): number | null {
  if (audio && o.pricesAudio && o.pricesAudio[res] != null) return o.pricesAudio[res]!;
  const p = o.prices[res];
  return p == null ? null : p;
}

export const round = (n: number, d = 2) => Math.round((n + Number.EPSILON) * 10 ** d) / 10 ** d;

/** Total = $/s × seconds per clip × clips × (1 + retake%) */
export function totalCost(pps: number, secondsPerClip: number, clips: number, retakePct = 0) {
  const base = pps * secondsPerClip * clips;
  return base * (1 + retakePct / 100);
}

export function compareAll(opts: { seconds: number; clips: number; res: Res; audio: boolean; retakePct: number }) {
  const rows = OFFERS.map((o) => {
    const pps = pricePerSecond(o, opts.res, opts.audio);
    return { offer: o, pps, perClip: pps == null ? null : pps * opts.seconds * (1 + opts.retakePct / 100), total: pps == null ? null : totalCost(pps, opts.seconds, opts.clips, opts.retakePct) };
  });
  return {
    available: rows.filter((r) => r.total != null).sort((a, b) => a.total! - b.total!),
    unavailable: rows.filter((r) => r.total == null),
  };
}

export type Scene = { id: string; name: string; seconds: number; offerId: string; res: Res; takes: number };
export function budgetPlan(scenes: Scene[], contingencyPct: number) {
  const lines = scenes.map((s) => {
    const o = OFFERS.find((x) => x.id === s.offerId)!;
    const pps = pricePerSecond(o, s.res, false);
    return { scene: s, pps, cost: pps == null ? null : pps * s.seconds * s.takes };
  });
  const subtotal = lines.reduce((a, l) => a + (l.cost ?? 0), 0);
  const contingency = subtotal * (contingencyPct / 100);
  const seconds = scenes.reduce((a, s) => a + s.seconds, 0);
  return { lines, subtotal, contingency, total: subtotal + contingency, finalSeconds: seconds };
}

export type PlanVsApiInput = { secondsPerMonth: number; creditsPerSecond: number; apiPps: number; annual: boolean; plans: { id: string; label: string; price: number; credits: number }[] };
export function planVsApi(i: PlanVsApiInput) {
  const creditsNeeded = i.secondsPerMonth * i.creditsPerSecond;
  const api = i.secondsPerMonth * i.apiPps;
  const options = i.plans.map((p) => {
    const count = Math.max(1, Math.ceil(creditsNeeded / p.credits));
    const cost = count * p.price;
    const includedSeconds = p.credits / i.creditsPerSecond;
    return { ...p, count, cost, includedSeconds, effectivePps: (p.price * i.creditsPerSecond) / p.credits, unusedCredits: count * p.credits - creditsNeeded };
  });
  const best = options.reduce((a, b) => (b.cost < a.cost ? b : a));
  return { creditsNeeded, api, options, best, winner: best.cost < api ? ("subscription" as const) : ("api" as const), savings: Math.abs(api - best.cost) };
}

export function klingCredits(opts: { creditsPerSecond: number; seconds: number; clips: number; retakePct: number; usdPerCredit: number }) {
  const credits = opts.creditsPerSecond * opts.seconds * opts.clips * (1 + opts.retakePct / 100);
  return { credits, usd: credits * opts.usdPerCredit };
}

export const KLING = data.klingCredits;
export const PLANS = data.plans;
export const PLAN_CREDIT_COSTS = data.planCreditCosts;
export const COVERAGE_NOTES = data.coverageNotes;
export const DISCLAIMER = data.disclaimer;
export const ALL_SOURCES: { label: string; url: string }[] = [
  { label: "Google Gemini API pricing (Veo)", url: "https://ai.google.dev/gemini-api/docs/pricing" },
  { label: "OpenAI API pricing (Sora)", url: "https://platform.openai.com/docs/pricing" },
  { label: "Runway API pricing", url: "https://docs.dev.runwayml.com/guides/pricing/" },
  { label: "Runway plans", url: "https://runway.com/pricing" },
  { label: "Kling developer pricing", url: "https://kling.ai/dev/pricing" },
  { label: "Luma API pricing", url: "https://lumalabs.ai/api/pricing" },
  { label: "Luma plans", url: "https://lumalabs.ai/pricing" },
  { label: "Pika pricing", url: "https://pika.art/pricing" },
  { label: "Higgsfield pricing", url: "https://higgsfield.ai/pricing" },
];
