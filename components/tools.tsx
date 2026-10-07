"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { UI, type Locale, type ToolId } from "@/lib/content";
import {
  OFFERS, VEO_OFFERS, RESOLUTIONS, KLING, PLANS, PLAN_CREDIT_COSTS, pricePerSecond, compareAll, totalCost,
  budgetPlan, planVsApi, klingCredits, usdPerCredit, type Res, type Scene, type Offer,
} from "@/lib/calc";
import { Badge, Field, NumInput, Segmented, Stat, num, usd, usd3 } from "./ui";

type P = { locale: Locale };
const card = "glass p-4 sm:p-6";
const appear = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.25 } };

function ResSelect({ value, onChange, label }: { value: Res; onChange: (r: Res) => void; label: string }) {
  return (
    <Field label={label}>
      <Segmented value={value} onChange={onChange} options={RESOLUTIONS.map((r) => ({ value: r, label: r }))} />
    </Field>
  );
}

/* 1 ─ Compare all models */
function Compare({ locale }: P) {
  const t = UI[locale];
  const [seconds, setSeconds] = useState(10);
  const [clips, setClips] = useState(6);
  const [res, setRes] = useState<Res>("1080p");
  const [audio, setAudio] = useState(false);
  const [retake, setRetake] = useState(0);
  const r = useMemo(() => compareAll({ seconds, clips, res, audio, retakePct: retake }), [seconds, clips, res, audio, retake]);
  const max = r.available.at(-1)?.total ?? 1;
  return (
    <div className={card}>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Field label={t.secondsPerClip}><NumInput value={seconds} onChange={setSeconds} min={1} max={600} /></Field>
        <Field label={t.clips}><NumInput value={clips} onChange={setClips} min={1} max={1000} /></Field>
        <Field label={`${t.retakes} (%)`}><NumInput value={retake} onChange={setRetake} min={0} max={500} step={5} /></Field>
        <div className="col-span-2 flex items-end lg:col-span-1"><label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm"><input type="checkbox" className="h-5 w-5 accent-[#8b7cff]" checked={audio} onChange={(e) => setAudio(e.target.checked)} />{t.audio}</label></div>
      </div>
      <div className="mt-4"><ResSelect value={res} onChange={setRes} label={t.resolution} /></div>
      <ul className="mt-6 space-y-2" aria-live="polite">
        {r.available.map((row, i) => (
          <motion.li layout key={row.offer.id} {...appear} className={`rounded-xl border p-3 ${i === 0 ? "border-accent2/50 bg-accent2/5" : "border-white/10 bg-white/[0.03]"}`}>
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">{row.offer.name}</span>
                {i === 0 && <Badge tone="good">{t.cheapest}</Badge>}
                <Badge>{row.offer.kind === "credits" ? t.credit : t.api}</Badge>
              </div>
              <div className="text-right"><span className="text-xl font-bold tabular-nums">{usd(row.total!)}</span></div>
            </div>
            <div className="mt-1 flex justify-between text-xs text-muted"><span>{usd3(row.pps!)} {t.perSecond}</span><span>{usd(row.perClip!)} {t.perClip}</span></div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-accent to-accent2" style={{ width: `${Math.max(3, (row.total! / max) * 100)}%` }} /></div>
          </motion.li>
        ))}
      </ul>
      {r.unavailable.length > 0 && (
        <details className="mt-4 text-sm text-muted"><summary className="cursor-pointer">{t.notAvailable} ({r.unavailable.length})</summary>
          <p className="mt-2">{r.unavailable.map((u) => u.offer.name).join(" · ")}</p></details>
      )}
    </div>
  );
}

/* 2 ─ Veo */
function Veo({ locale }: P) {
  const t = UI[locale];
  const [id, setId] = useState("veo-3.1-fast");
  const [res, setRes] = useState<Res>("1080p");
  const [secs, setSecs] = useState(8);
  const [clips, setClips] = useState(5);
  const [retake, setRetake] = useState(30);
  const [budget, setBudget] = useState(50);
  const offer = VEO_OFFERS.find((o) => o.id === id)!;
  const pps = pricePerSecond(offer, res);
  const total = pps == null ? null : totalCost(pps, secs, clips, retake);
  const kept = secs * clips;
  const bought = pps == null ? null : budget / (pps * (1 + retake / 100));
  return (
    <div className={card}>
      <div className="grid grid-cols-2 gap-3">
        <Field label={t.variant}><select className="field" value={id} onChange={(e) => setId(e.target.value)}>{VEO_OFFERS.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}</select></Field>
        <ResSelect value={res} onChange={setRes} label={t.resolution} />
        <Field label={t.secondsPerClip}><Segmented value={String(secs)} onChange={(v) => setSecs(Number(v))} options={["4", "6", "8"].map((v) => ({ value: v, label: `${v}s` }))} /></Field>
        <Field label={t.clips}><NumInput value={clips} onChange={setClips} min={1} max={1000} /></Field>
        <Field label={`${t.retakes} (%)`}><NumInput value={retake} onChange={setRetake} min={0} max={500} step={5} /></Field>
      </div>
      {pps == null || total == null ? (
        <p className="mt-6 rounded-lg border border-white/10 p-4 text-muted">{t.notAvailable}</p>
      ) : (
        <motion.div {...appear} className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-live="polite">
          <Stat label={t.perSecond} value={usd3(pps)} />
          <Stat label={t.perClip} value={usd(pps * secs * (1 + retake / 100))} sub={`${secs}s · ${retake}% ${t.retakes.toLowerCase()}`} />
          <Stat label={t.total} value={usd(total)} accent />
          <Stat label={t.perMinute} value={usd(total / (kept / 60))} sub={`${num(kept)}s`} />
        </motion.div>
      )}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 p-4">
          <Field label={t.budget}><NumInput value={budget} onChange={setBudget} min={0} step={5} /></Field>
          <p className="mt-3 text-sm text-muted">{t.secondsBuys}: <strong className="text-lg text-white tabular-nums">{bought == null ? "—" : num(bought, 1)}s</strong></p>
        </div>
        <div className="rounded-xl border border-white/10 p-4">
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">{t.allVariants}</div>
          <table className="w-full text-sm"><tbody>
            {VEO_OFFERS.map((o) => { const p = pricePerSecond(o, res); return (
              <tr key={o.id} className="border-t border-white/5 first:border-0"><td className="py-1.5">{o.name}</td><td className="py-1.5 text-right tabular-nums">{p == null ? "—" : `${usd3(p)}/s`}</td></tr>
            ); })}
          </tbody></table>
        </div>
      </div>
    </div>
  );
}

/* 3 ─ Kling credits */
function Kling({ locale }: P) {
  const t = UI[locale];
  const [rateId, setRateId] = useState(KLING.rates[1].id);
  const [secs, setSecs] = useState(10);
  const [clips, setClips] = useState(4);
  const [retake, setRetake] = useState(0);
  const [basis, setBasis] = useState<"topup" | "plan">("topup");
  const [planPrice, setPlanPrice] = useState(37);
  const [planCredits, setPlanCredits] = useState(3000);
  const rate = KLING.rates.find((x) => x.id === rateId)!;
  const upc = basis === "topup" || planCredits <= 0 ? KLING.topUpUsdPerCredit : planPrice / planCredits;
  const r = klingCredits({ creditsPerSecond: rate.creditsPerSecond, seconds: secs, clips, retakePct: retake, usdPerCredit: upc });
  const apiOffer = OFFERS.find((o) => o.id === rate.apiModelId)!;
  const apiPps = pricePerSecond(apiOffer, rate.res as Res, rate.audio)!;
  const api = totalCost(apiPps, secs, clips, retake);
  return (
    <div className={card}>
      <div className="grid grid-cols-2 gap-3">
        <Field label={t.tier}><select className="field" value={rateId} onChange={(e) => setRateId(e.target.value)}>{KLING.rates.map((x) => <option key={x.id} value={x.id}>{x.label} — {x.creditsPerSecond} cr/s</option>)}</select></Field>
        <Field label={t.secondsPerClip}><NumInput value={secs} onChange={setSecs} min={1} max={600} /></Field>
        <Field label={t.clips}><NumInput value={clips} onChange={setClips} min={1} max={1000} /></Field>
        <Field label={`${t.retakes} (%)`}><NumInput value={retake} onChange={setRetake} min={0} max={500} step={5} /></Field>
      </div>
      <div className="mt-4"><Field label={t.priceBasis}><Segmented value={basis} onChange={setBasis} options={[{ value: "topup", label: t.topUp }, { value: "plan", label: t.ownPlan }]} /></Field></div>
      {basis === "plan" && (
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Field label={t.planPrice}><NumInput value={planPrice} onChange={setPlanPrice} step={1} /></Field>
          <Field label={t.planCredits} hint={locale === "es" ? "Valores de ejemplo: reemplázalos por los de tu plan." : "Example values — replace with your plan's."}><NumInput value={planCredits} onChange={setPlanCredits} step={100} /></Field>
        </div>
      )}
      <motion.div {...appear} className="mt-6 grid gap-3 sm:grid-cols-3" aria-live="polite">
        <Stat label={t.creditsNeeded} value={num(r.credits, 1)} sub={`${rate.creditsPerSecond} cr/s`} />
        <Stat label={t.usdCost} value={usd(r.usd)} sub={`$${upc.toFixed(4)} / credit`} accent />
        <Stat label={t.apiEquivalent} value={usd(api)} sub={`${usd3(apiPps)} ${t.perSecond}`} />
      </motion.div>
    </div>
  );
}

/* 4 ─ Budget planner */
let sid = 3;
function Budget({ locale }: P) {
  const t = UI[locale];
  const [scenes, setScenes] = useState<Scene[]>([
    { id: "1", name: "Intro", seconds: 8, offerId: "veo-3.1-fast", res: "1080p", takes: 3 },
    { id: "2", name: "Product", seconds: 5, offerId: "sora-2", res: "720p", takes: 2 },
    { id: "3", name: "Outro", seconds: 10, offerId: "runway-gen4.5", res: "720p", takes: 1 },
  ]);
  const [cont, setCont] = useState(10);
  const [copied, setCopied] = useState(false);
  const b = useMemo(() => budgetPlan(scenes, cont), [scenes, cont]);
  const upd = (id: string, patch: Partial<Scene>) => setScenes((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const resFor = (o: Offer) => RESOLUTIONS.filter((r) => o.prices[r] != null);
  const maxCost = Math.max(...b.lines.map((l) => l.cost ?? 0), 0.0001);
  async function copy() {
    const text = [`AI Video Cost Planner — ${usd(b.total)}`, ...b.lines.map((l) => `${l.scene.name}: ${l.scene.seconds}s × ${l.scene.takes} takes · ${OFFERS.find((o) => o.id === l.scene.offerId)!.name} ${l.scene.res} = ${usd(l.cost ?? 0)}`), `${t.contingency} ${cont}%: ${usd(b.contingency)}`].join("\n");
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* ignore */ }
  }
  return (
    <div className={card}>
      <div className="space-y-3">
        {b.lines.map((l) => {
          const s = l.scene; const o = OFFERS.find((x) => x.id === s.offerId)!;
          return (
            <motion.div layout key={s.id} {...appear} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
                <div className="col-span-2 lg:col-span-1"><Field label={t.sceneName}><input className="field" value={s.name} maxLength={40} onChange={(e) => upd(s.id, { name: e.target.value })} /></Field></div>
                <div className="col-span-2 lg:col-span-2"><Field label={t.model}>
                  <select className="field" value={s.offerId} onChange={(e) => { const no = OFFERS.find((x) => x.id === e.target.value)!; const rs = resFor(no); upd(s.id, { offerId: no.id, res: rs.includes(s.res) ? s.res : rs[0] }); }}>
                    {OFFERS.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                  </select></Field></div>
                <Field label={t.resolution}><select className="field" value={s.res} onChange={(e) => upd(s.id, { res: e.target.value as Res })}>{resFor(o).map((r) => <option key={r}>{r}</option>)}</select></Field>
                <Field label={t.seconds}><NumInput value={s.seconds} onChange={(v) => upd(s.id, { seconds: v })} min={1} max={600} /></Field>
                <Field label={t.takes}><NumInput value={s.takes} onChange={(v) => upd(s.id, { takes: v })} min={1} max={50} /></Field>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-accent to-accent2" style={{ width: `${Math.max(2, ((l.cost ?? 0) / maxCost) * 100)}%` }} /></div>
                <span className="w-24 text-right text-lg font-bold tabular-nums">{usd(l.cost ?? 0)}</span>
                <button type="button" className="btn !min-h-9 !px-3 text-xs" onClick={() => setScenes((x) => x.filter((y) => y.id !== s.id))} disabled={scenes.length <= 1}>{t.remove}</button>
              </div>
            </motion.div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" className="btn" onClick={() => setScenes((s) => [...s, { id: String(++sid), name: `${t.sceneName} ${s.length + 1}`, seconds: 5, offerId: "veo-3.1-fast", res: "720p", takes: 2 }])}>+ {t.addScene}</button>
        <button type="button" className="btn" onClick={copy}>{copied ? t.copied : t.copy}</button>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-4" aria-live="polite">
        <Field label={`${t.contingency} (%)`}><NumInput value={cont} onChange={setCont} min={0} max={200} step={5} /></Field>
        <Stat label={t.subtotal} value={usd(b.subtotal)} />
        <Stat label={t.finalFootage} value={`${num(b.finalSeconds)}s`} />
        <Stat label={t.grandTotal} value={usd(b.total)} sub={`+${usd(b.contingency)}`} accent />
      </div>
    </div>
  );
}

/* 5 ─ Subscription vs API */
const SUBAPI_OPTIONS = PLAN_CREDIT_COSTS;
function SubApi({ locale }: P) {
  const t = UI[locale];
  const [optId, setOptId] = useState(SUBAPI_OPTIONS[0].id);
  const [secs, setSecs] = useState(300);
  const [annual, setAnnual] = useState(true);
  const [cPrice, setCPrice] = useState(35);
  const [cCredits, setCCredits] = useState(2250);
  const [cCps, setCCps] = useState(12);
  const [cApi, setCApi] = useState(0.12);
  const custom = optId === "custom";
  const opt = SUBAPI_OPTIONS.find((o) => o.id === optId);
  const model = useMemo(() => {
    if (custom || !opt) return { cps: Math.max(cCps, 0.0001), apiPps: cApi, plans: [{ id: "custom", label: t.custom, price: cPrice, credits: Math.max(cCredits, 1) }] };
    const o = OFFERS.find((x) => x.id === opt.apiModelId)!;
    const res = ((opt as { apiRes?: string }).apiRes as Res | undefined) ?? (RESOLUTIONS.find((r) => o.prices[r] != null) as Res);
    const plans = PLANS.filter((p) => p.provider === opt.provider && p.credits != null).map((p) => ({
      id: p.id, label: `${p.provider} ${p.name}`, credits: p.credits as number,
      price: (annual && p.annualMonthly != null ? p.annualMonthly : (p.monthly ?? p.annualMonthly)) as number,
    }));
    return { cps: opt.creditsPerSecond, apiPps: o.prices[res]!, plans };
  }, [custom, opt, annual, cPrice, cCredits, cCps, cApi, t.custom]);
  const r = planVsApi({ secondsPerMonth: secs, creditsPerSecond: model.cps, apiPps: model.apiPps, annual, plans: model.plans });
  return (
    <div className={card}>
      <div className="grid grid-cols-2 gap-3">
        <Field label={t.provider}><select className="field" value={optId} onChange={(e) => setOptId(e.target.value)}>
          {SUBAPI_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}<option value="custom">{t.custom}</option></select></Field>
        <Field label={t.monthlySeconds}><NumInput value={secs} onChange={setSecs} min={1} max={1000000} step={30} /></Field>
        {!custom && <Field label={t.billing}><Segmented value={annual ? "a" : "m"} onChange={(v) => setAnnual(v === "a")} options={[{ value: "a", label: t.annual }, { value: "m", label: t.monthly }]} /></Field>}
      </div>
      {custom && (
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          <Field label={t.planPrice}><NumInput value={cPrice} onChange={setCPrice} /></Field>
          <Field label={t.planCredits}><NumInput value={cCredits} onChange={setCCredits} step={100} /></Field>
          <Field label={t.creditsPerSecond}><NumInput value={cCps} onChange={setCCps} step={1} /></Field>
          <Field label={t.apiPrice}><NumInput value={cApi} onChange={setCApi} step={0.01} /></Field>
        </div>
      )}
      <motion.div {...appear} className="mt-6 grid gap-3 sm:grid-cols-3" aria-live="polite">
        <Stat label={t.apiCost} value={usd(r.api)} sub={`${usd3(model.apiPps)} ${t.perSecond}`} />
        <Stat label={t.cost} value={usd(r.best.cost)} sub={`${r.best.count} × ${r.best.label}`} />
        <Stat label={r.winner === "api" ? t.winnerApi : t.winnerSub} value={usd(r.savings)} sub={t.youSave} accent />
      </motion.div>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[34rem] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-muted"><tr><th className="py-2">{t.planLabel}</th><th>{t.planPrice}</th><th>{t.included}</th><th>{t.effective}</th><th className="text-right">{t.using}</th></tr></thead>
          <tbody>
            {r.options.map((o) => (
              <tr key={o.id} className={`border-t border-white/5 ${o.id === r.best.id ? "text-accent2" : ""}`}>
                <td className="py-2">{o.label}</td><td className="tabular-nums">{usd(o.price)}</td><td className="tabular-nums">{num(o.includedSeconds, 0)}s</td><td className="tabular-nums">{usd3(o.effectivePps)}</td>
                <td className="text-right tabular-nums">{o.count} × → {usd(o.cost)} <span className="text-xs text-muted">({num(o.unusedCredits)} {t.unused})</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Tool({ id, locale }: { id: ToolId; locale: Locale }) {
  switch (id) {
    case "compare": return <Compare locale={locale} />;
    case "veo": return <Veo locale={locale} />;
    case "kling": return <Kling locale={locale} />;
    case "budget": return <Budget locale={locale} />;
    case "subapi": return <SubApi locale={locale} />;
  }
}
// keep helper referenced for tree-shaking-safe typing
void usdPerCredit;
