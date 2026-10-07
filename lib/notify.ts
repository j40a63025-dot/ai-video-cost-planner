// Sends a notification email through Resend's REST API. Falls back to logging when not configured.
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

export async function notify(opts: { tag: string; subject: string; lines: [string, string][]; replyTo?: string }) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  console.log(JSON.stringify({ tag: opts.tag, ...Object.fromEntries(opts.lines), at: new Date().toISOString() }));
  if (!key || !to) return false;
  const html = opts.lines.map(([k, v]) => `<p><b>${esc(k)}:</b><br>${esc(v).replace(/\n/g, "<br>")}</p>`).join("");
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.NOTIFY_FROM || "AI Video Cost Planner <onboarding@resend.dev>",
        to: [to],
        subject: opts.subject,
        html,
        ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
      }),
    });
    if (!r.ok) console.error("RESEND_ERROR", r.status, (await r.text()).slice(0, 300));
    return r.ok;
  } catch (e) {
    console.error("RESEND_FAIL", String(e));
    return false;
  }
}
