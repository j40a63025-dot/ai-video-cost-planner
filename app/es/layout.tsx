import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/content";
import "../globals.css";

export const metadata: Metadata = { metadataBase: new URL(SITE_URL) };
export const viewport: Viewport = { themeColor: "#07080d", width: "device-width", initialScale: 1 };

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
