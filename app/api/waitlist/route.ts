import { NextResponse } from "next/server";
import { notify } from "@/lib/notify";
export const runtime = "nodejs";

export async function POST(req: Request) {
  let b: { email?: string; locale?: string; hp?: string };
  try { b = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  if (b.hp) return NextResponse.json({ ok: true }); // honeypot: pretend success
  const email = String(b.email ?? "").trim().toLowerCase();
  if (email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return NextResponse.json({ ok: false }, { status: 400 });
  await notify({ tag: "WAITLIST", subject: "New Pro waitlist signup", lines: [["Email", email], ["Locale", b.locale === "es" ? "es" : "en"]], replyTo: email });
  return NextResponse.json({ ok: true });
}
