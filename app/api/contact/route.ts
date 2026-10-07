import { NextResponse } from "next/server";
import { notify } from "@/lib/notify";
export const runtime = "nodejs";

export async function POST(req: Request) {
  let b: Record<string, string>;
  try { b = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  if (b.website) return NextResponse.json({ ok: true });
  const name = String(b.name ?? "").slice(0, 80), email = String(b.email ?? "").slice(0, 120), message = String(b.message ?? "").slice(0, 2000);
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return NextResponse.json({ ok: false }, { status: 400 });
  await notify({ tag: "CONTACT", subject: `Contact form: ${name}`, lines: [["Name", name], ["Email", email], ["Message", message]], replyTo: email });
  return NextResponse.json({ ok: true });
}
