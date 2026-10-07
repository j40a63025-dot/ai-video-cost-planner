"use client";
import { useState } from "react";
import { UI, type Locale } from "@/lib/content";

export function ContactForm({ locale }: { locale: Locale }) {
  const t = UI[locale];
  const [s, setS] = useState<"idle" | "loading" | "done" | "error">("idle");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setS("loading");
    try {
      const r = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.fromEntries(f)) });
      setS(r.ok ? "done" : "error");
    } catch { setS("error"); }
  }
  if (s === "done") return <p className="glass mt-6 p-4 text-accent2" role="status">{t.sent}</p>;
  return (
    <form onSubmit={submit} className="glass mt-6 space-y-4 p-5">
      <label className="block text-xs uppercase tracking-wide text-muted">{t.name}<input name="name" required maxLength={80} className="field mt-1.5 normal-case" /></label>
      <label className="block text-xs uppercase tracking-wide text-muted">{t.email}<input name="email" type="email" required maxLength={120} className="field mt-1.5 normal-case" /></label>
      <label className="block text-xs uppercase tracking-wide text-muted">{t.message}<textarea name="message" required maxLength={2000} rows={5} className="field mt-1.5 normal-case" /></label>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      {s === "error" && <p className="text-sm text-red-300" role="alert">{t.error}</p>}
      <button className="btn btn-primary" disabled={s === "loading"}>{t.send}</button>
    </form>
  );
}
