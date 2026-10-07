import { ImageResponse } from "next/og";
export const alt = "AI Video Cost Planner";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "linear-gradient(135deg,#07080d 0%,#161233 60%,#0b3a36 100%)", color: "#fff", fontFamily: "sans-serif" }}>
        <div style={{ fontSize: 30, color: "#38e1c6", letterSpacing: 4 }}>$ AI VIDEO COST PLANNER</div>
        <div style={{ fontSize: 76, fontWeight: 800, marginTop: 24, lineHeight: 1.05 }}>What will your AI video cost?</div>
        <div style={{ fontSize: 30, color: "#aab0c6", marginTop: 28 }}>Veo · Kling · Sora · Runway · Luma · Pika · Higgsfield</div>
      </div>
    ),
    size,
  );
}
