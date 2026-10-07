import type { MetadataRoute } from "next";
import { INFO_IDS, SITE_URL, SLUGS, TOOL_IDS, path } from "@/lib/content";
import { PRICES_UPDATED_AT } from "@/lib/calc";
import { POSTS } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(PRICES_UPDATED_AT);
  const entry = (en: string, es: string, priority: number) => (["en", "es"] as const).map((l) => ({
    url: `${SITE_URL}${l === "en" ? en : es}`.replace(/\/$/, "") || SITE_URL,
    lastModified, changeFrequency: "weekly" as const, priority,
    alternates: { languages: { en: `${SITE_URL}${en}`.replace(/\/$/, ""), es: `${SITE_URL}${es}` } },
  }));
  return [
    ...entry("/", "/es", 1),
    ...TOOL_IDS.flatMap((id) => entry(path("en", SLUGS[id].en), path("es", SLUGS[id].es), 0.9)),
    ...entry("/blog", "/es/blog", 0.8),
    ...POSTS.flatMap((p) => entry(`/blog/${p.slug.en}`, `/es/blog/${p.slug.es}`, 0.7)),
    ...INFO_IDS.flatMap((id) => entry(path("en", id), path("es", id), 0.3)),
  ];
}
