import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  INFO, INFO_IDS, SITE_NAME, SITE_URL, SLUGS, TOOLS, TOOL_IDS, UI, path, toolFromSlug, toolPath, type InfoId, type Locale, type ToolId,
} from "./content";
import { ALL_SOURCES, COVERAGE_NOTES, DISCLAIMER, PRICES_UPDATED_AT } from "./calc";
import { Shell } from "@/components/Shell";
import { AdSlot } from "@/components/AdSlot";
import { Tool } from "@/components/tools";
import { Banner } from "@/components/ui";
import { ContactForm } from "@/components/ContactForm";
import { POSTS } from "./blog";
import { BLOG_UI } from "./blog-ui";

export const abs = (p: string) => `${SITE_URL}${p === "/" ? "" : p}`;
export const fmtDate = (l: Locale) => new Date(`${PRICES_UPDATED_AT}T00:00:00Z`).toLocaleDateString(l === "es" ? "es-CO" : "en-US", { timeZone: "UTC", year: "numeric", month: "long", day: "numeric" });

export function metaFor(l: Locale, title: string, description: string, enPath: string, esPath: string): Metadata {
  const self = l === "en" ? enPath : esPath;
  return {
    metadataBase: new URL(SITE_URL),
    title: { absolute: title },
    description,
    alternates: { canonical: self, languages: { en: enPath, es: esPath, "x-default": enPath } },
    openGraph: { type: "website", title, description, url: self, siteName: SITE_NAME, locale: l === "es" ? "es_CO" : "en_US", alternateLocale: l === "es" ? ["en_US"] : ["es_CO"] },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true },
  };
}

export function homeMetadata(l: Locale): Metadata {
  const title = l === "en" ? `${SITE_NAME} — Free AI Video Cost Calculators` : `${SITE_NAME} — Calculadoras gratuitas de costo de video con IA`;
  return metaFor(l, title, UI[l].heroSub, "/", "/es");
}

export function slugMetadata(l: Locale, slug: string): Metadata {
  const tool = toolFromSlug(l, slug);
  if (tool) {
    const c = TOOLS[tool][l];
    return metaFor(l, c.title, c.description, toolPath("en", tool), toolPath("es", tool));
  }
  if ((INFO_IDS as readonly string[]).includes(slug)) {
    const c = INFO[slug as InfoId][l];
    return metaFor(l, `${c.title} | ${SITE_NAME}`, c.description, path("en", slug), path("es", slug));
  }
  return {};
}

export const allSlugs = (l: Locale) => [...TOOL_IDS.map((t) => SLUGS[t][l]), ...INFO_IDS].map((slug) => ({ slug }));

export function altPathFor(l: Locale, slug?: string): string {
  const o: Locale = l === "en" ? "es" : "en";
  if (!slug) return path(o);
  const tool = toolFromSlug(l, slug);
  return tool ? toolPath(o, tool) : path(o, slug);
}

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function Sources({ l, tool }: { l: Locale; tool?: ToolId }) {
  const t = UI[l];
  const list = tool === "veo" ? ALL_SOURCES.slice(0, 1) : tool === "kling" ? [ALL_SOURCES[4], { label: "Kling credit rates (CloudZero)", url: "https://www.cloudzero.com/blog/kling-ai-pricing/" }] : ALL_SOURCES;
  return (
    <section aria-labelledby="sources" className="mt-10">
      <h2 id="sources" className="text-lg font-semibold">{t.sources}</h2>
      <p className="mt-1 text-sm text-muted">{t.pricesUpdated}: {fmtDate(l)}</p>
      <ul className="mt-3 flex flex-wrap gap-2 text-sm">
        {list.map((s) => <li key={s.url}><a className="rounded-full border border-white/10 px-3 py-1 text-accent2 hover:border-accent2/60" href={s.url} target="_blank" rel="noopener noreferrer nofollow">{s.label} ↗</a></li>)}
      </ul>
      <p className="mt-3 text-xs text-muted">{DISCLAIMER}</p>
      <ul className="mt-2 list-disc pl-5 text-xs text-muted">{COVERAGE_NOTES.map((n) => <li key={n}>{n}</li>)}</ul>
    </section>
  );
}

export function MoreTools({ l, current }: { l: Locale; current?: ToolId }) {
  const t = UI[l];
  return (
    <section aria-labelledby="more" className="mt-12">
      <h2 id="more" className="text-lg font-semibold">{t.moreTools}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {TOOL_IDS.filter((x) => x !== current).map((x) => (
          <Link key={x} href={toolPath(l, x)} className="glass block p-4 transition hover:border-accent/60">
            <div className="font-semibold">{TOOLS[x][l].h1}</div>
            <div className="mt-1 text-sm text-muted">{TOOLS[x][l].blurb}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}

const TOOL_IMG: Record<string, string> = { compare: "tool-calculator", veo: "tool-veo", kling: "tool-kling", budget: "tool-budget", subapi: "compare" };

function ToolPage({ l, id }: { l: Locale; id: ToolId }) {
  const t = UI[l]; const c = TOOLS[id][l];
  const url = abs(toolPath(l, id));
  const ld = [
    { "@context": "https://schema.org", "@type": "SoftwareApplication", name: c.h1, description: c.description, url, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", inLanguage: l, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: c.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  return (
    <Shell locale={l} altHref={toolPath(l === "en" ? "es" : "en", id)}>
      <JsonLd data={ld} />
      <article>
        <Banner img={TOOL_IMG[id]} kicker={<>CALC · {t.pricesUpdated}: {fmtDate(l)}</>} title={c.h1}>
          <p className="mt-4 max-w-2xl text-[#c3c7d8]">{c.lead}</p>
          <p className="mt-4 text-sm"><a href="#sources" className="text-accent2 underline underline-offset-4">{t.sources}</a></p>
        </Banner>
        <div className="mt-6"><Tool id={id} locale={l} /></div>
        <AdSlot locale={l} />
        <div className="prose-site">
          <h2>{t.howCalc}</h2>
          <div className="formula" role="math" aria-label={c.formula}>{c.formula}</div>
          <p className="mt-3">{c.formulaNote}</p>
          <h2>{t.example}</h2>
          {c.example.map((p) => <p key={p} className="mb-2">{p}</p>)}
          <h2>{t.limits}</h2>
          <ul className="space-y-1">{c.limitations.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
        <AdSlot locale={l} variant="rectangle" />
        <section aria-labelledby="faq">
          <h2 id="faq" className="text-xl font-bold">{t.faq}</h2>
          <div className="mt-4 space-y-2">
            {c.faq.map((f) => (
              <details key={f.q} className="glass group p-4">
                <summary className="cursor-pointer list-none font-medium marker:hidden">{f.q}</summary>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
        <Sources l={l} tool={id} />
        <MoreTools l={l} current={id} />
      </article>
    </Shell>
  );
}

function InfoPage({ l, id }: { l: Locale; id: InfoId }) {
  const c = INFO[id][l];
  return (
    <Shell locale={l} altHref={path(l === "en" ? "es" : "en", id)}>
      <article className="prose-site max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{c.title}</h1>
        {c.sections.map((s) => (<section key={s.h}><h2>{s.h}</h2>{s.p.map((p) => <p key={p} className="mb-2">{p}</p>)}</section>))}
        {id === "contact" && <ContactForm locale={l} />}
      </article>
    </Shell>
  );
}

export function renderSlug(l: Locale, slug: string) {
  const tool = toolFromSlug(l, slug);
  if (tool) return <ToolPage l={l} id={tool} />;
  if ((INFO_IDS as readonly string[]).includes(slug)) return <InfoPage l={l} id={slug as InfoId} />;
  notFound();
}

export function Home({ l }: { l: Locale }) {
  const t = UI[l];
  const ld = { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: abs(path(l)), inLanguage: l, description: t.heroSub };
  return (
    <Shell locale={l} altHref={path(l === "en" ? "es" : "en")}>
      <JsonLd data={ld} />
      <section className="hero-stage mt-2 p-6 sm:p-12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/hero.webp" alt="" aria-hidden width={1376} height={768} fetchPriority="high" className="hero-img" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-cyan"><span className="rec-dot" aria-hidden /> LIVE · {t.pricesUpdated}: {fmtDate(l)}</div>
          <h1 className="neon-text mt-5 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">{t.heroTitle}</h1>
          <p className="mt-5 max-w-2xl text-lg text-[#c3c7d8]">{t.heroSub}</p>
          <div className="mt-8 grid max-w-xl gap-3 font-mono text-xs text-muted" aria-hidden>
            {["VEO", "KLING", "SORA"].map((m, i) => (
              <div key={m} className="flex items-center gap-3"><span className="w-12">{m}</span><div className="meter flex-1"><i style={{ width: `${[78, 54, 91][i]}%` }} /></div></div>
            ))}
          </div>
          <Link href={toolPath(l, TOOL_IDS[0])} className="btn btn-primary mt-8">{t.openTool} →</Link>
        </div>
      </section>
      <section aria-label={t.tools} className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOL_IDS.map((id, i) => (
          <Link key={id} href={toolPath(l, id)} className={`glass group block overflow-hidden transition hover:-translate-y-0.5 hover:border-accent/60 ${i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/img/${TOOL_IMG[id]}.webp`} alt="" aria-hidden width={1376} height={768} loading="lazy" className="h-32 w-full object-cover opacity-80 transition group-hover:opacity-100" />
            <div className="p-5"><div className="text-xs font-semibold uppercase tracking-widest text-accent">{String(i + 1).padStart(2, "0")}</div>
            <h2 className="mt-2 text-xl font-semibold">{TOOLS[id][l].h1}</h2>
            <p className="mt-2 text-sm text-muted">{TOOLS[id][l].blurb}</p>
            <span className="mt-4 inline-block text-sm text-accent2 group-hover:underline">{t.openTool} →</span></div>
          </Link>
        ))}
      </section>
      <section aria-labelledby="latest" className="mt-12">
        <div className="flex items-end justify-between gap-3">
          <h2 id="latest" className="text-xl font-bold">{BLOG_UI[l].blog}</h2>
          <Link href={path(l, "blog")} className="text-sm text-accent2 hover:underline">{BLOG_UI[l].allArticles} →</Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.slice(0, 3).map((po) => (
            <Link key={po.id} href={path(l, `blog/${po.slug[l]}`)} className="glass block p-4 transition hover:border-accent/60">
              <div className="font-semibold">{po.content[l].title}</div>
              <div className="mt-1 text-sm text-muted">{po.content[l].description}</div>
            </Link>
          ))}
        </div>
      </section>
      <AdSlot locale={l} />
      <Sources l={l} />
    </Shell>
  );
}
