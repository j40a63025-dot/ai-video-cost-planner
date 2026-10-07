"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UI, type Locale } from "@/lib/content";

export function ProButton({ locale }: { locale: Locale }) {
  const t = UI[locale];
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error" | "invalid">("idle");
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return setState("invalid");
    setState("loading");
    try {
      const r = await fetch("/api/waitlist", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, locale, hp }) });
      setState(r.ok ? "done" : "error");
    } catch { setState("error"); }
  }

  return (
    <>
      <button type="button" className="btn btn-primary" onClick={() => { setOpen(true); setState("idle"); }}>✦ {t.pro}</button>
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
            <motion.div role="dialog" aria-modal="true" aria-labelledby="pro-title" className="glass w-full max-w-md bg-[#0e1018] p-6" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
              <h2 id="pro-title" className="text-xl font-bold">{t.proTitle}</h2>
              <p className="mt-2 text-sm text-muted">{t.proSub}</p>
              {state === "done" ? (
                <p className="mt-5 rounded-lg border border-accent2/40 bg-accent2/10 p-3 text-sm text-accent2" role="status">{t.joined}</p>
              ) : (
                <form onSubmit={submit} className="mt-5 space-y-3" noValidate>
                  <label className="block text-xs uppercase tracking-wide text-muted">{t.email}
                    <input ref={ref} type="email" required autoComplete="email" className="field mt-1.5 normal-case" placeholder="you@example.com" value={email} onChange={(e) => { setEmail(e.target.value); setState("idle"); }} />
                  </label>
                  <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" value={hp} onChange={(e) => setHp(e.target.value)} name="website" />
                  {state === "invalid" && <p className="text-sm text-red-300" role="alert">{t.invalidEmail}</p>}
                  {state === "error" && <p className="text-sm text-red-300" role="alert">{t.error}</p>}
                  <button type="submit" disabled={state === "loading"} className="btn btn-primary w-full">{t.join}</button>
                </form>
              )}
              <button type="button" className="btn mt-3 w-full" onClick={() => setOpen(false)}>{t.close}</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
