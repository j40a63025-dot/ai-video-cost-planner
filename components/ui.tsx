import type { ReactNode } from "react";

export const usd = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const usd3 = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`;
export const num = (n: number, d = 0) => n.toLocaleString("en-US", { maximumFractionDigits: d });

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function NumInput({ value, onChange, min = 0, max, step = 1 }: { value: number; onChange: (n: number) => void; min?: number; max?: number; step?: number }) {
  return (
    <input
      className="field" type="number" inputMode="decimal" min={min} max={max} step={step} value={Number.isFinite(value) ? value : ""}
      onChange={(e) => { const v = parseFloat(e.target.value); onChange(Number.isFinite(v) ? Math.max(min, max != null ? Math.min(max, v) : v) : 0); }}
    />
  );
}

export function Stat({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`glass p-4 ${accent ? "ring-1 ring-accent/50" : ""}`}>
      <div className="text-xs uppercase tracking-wide text-muted">{label}</div>
      <div className={`mt-1 text-2xl font-bold tabular-nums sm:text-3xl ${accent ? "neon-text" : ""}`}>{value}</div>
      {sub && <div className="mt-0.5 text-xs text-muted">{sub}</div>}
    </div>
  );
}

export function Badge({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "good" }) {
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${tone === "good" ? "border-accent2/40 text-accent2" : "border-white/15 text-muted"}`}>
      {children}
    </span>
  );
}

export function Segmented<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <div className="flex flex-wrap gap-2" role="group">
      {options.map((o) => (
        <button key={o.value} type="button" onClick={() => onChange(o.value)} aria-pressed={value === o.value}
          className={`btn ${value === o.value ? "btn-primary" : ""}`}>{o.label}</button>
      ))}
    </div>
  );
}

export const BLOG_IMGS = ["blog-time", "paths", "steps", "compare", "texture"];

/** Dark "control room" banner with a Flow image behind the page title. */
export function Banner({ img, kicker, title, children }: { img: string; kicker?: ReactNode; title: ReactNode; children?: ReactNode }) {
  return (
    <header className="hero-stage p-6 sm:p-10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/img/${img}.webp`} alt="" aria-hidden width={1376} height={768} fetchPriority="high" className="hero-img" />
      <div className="relative z-10">
        {kicker && <div className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">{kicker}</div>}
        <h1 className="neon-text mt-3 max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl">{title}</h1>
        {children}
      </div>
    </header>
  );
}
