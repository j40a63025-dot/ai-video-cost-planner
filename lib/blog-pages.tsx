import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, TOOLS, UI, path, toolPath, type Locale } from "./content";
import { POSTS, postFromSlug } from "./blog";
import { BLOG_UI } from "./blog-ui";
import { abs, fmtDate, JsonLd, metaFor, Sources } from "./pages";
import { Shell } from "@/components/Shell";
import { AdSlot } from "@/components/AdSlot";
import { Banner, BLOG_IMGS } from "@/components/ui";

export const blogSlugs = (l: Locale) => POSTS.map((p) => ({ slug: p.slug[l] }));

export function blogIndexMetadata(l: Locale): Metadata {
  const t = BLOG_UI[l];
  return metaFor(l, `${t.blogTitle} | ${SITE_NAME}`, t.blogSub, "/blog", "/es/blog");
}

export function postMetadata(l: Locale, slug: string): Metadata {
  const p = postFromSlug(l, slug);
  if (!p) return {};
  const c = p.content[l];
  const base = metaFor(l, `${c.title} | ${SITE_NAME}`, c.description, `/blog/${p.slug.en}`, `/es/blog/${p.slug.es}`);
  return { ...base, openGraph: { ...base.openGraph, type: "article", publishedTime: p.date } };
}

export function BlogIndex({ l }: { l: Locale }) {
  const t = { ...UI[l], ...BLOG_UI[l] };
  const alt = path(l === "en" ? "es" : "en", "blog");
  return (
    <Shell locale={l} altHref={alt}>
      <Banner img="texture" kicker="BLOG" title={t.blogTitle}><p className="mt-4 max-w-2xl text-[#c3c7d8]">{t.blogSub}</p></Banner>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {POSTS.map((p, i) => (
          <Link key={p.id} href={path(l, `blog/${p.slug[l]}`)} className="glass group block overflow-hidden transition hover:-translate-y-0.5 hover:border-accent/60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/img/${BLOG_IMGS[i % BLOG_IMGS.length]}.webp`} alt="" aria-hidden width={1376} height={768} loading="lazy" className="h-36 w-full object-cover opacity-80 transition group-hover:opacity-100" />
            <div className="p-5">
              <h2 className="text-lg font-semibold">{p.content[l].title}</h2>
              <p className="mt-2 text-sm text-muted">{p.content[l].description}</p>
              <span className="mt-3 inline-block text-sm text-accent2">{t.readArticle} →</span>
            </div>
          </Link>
        ))}
      </div>
      <AdSlot locale={l} />
    </Shell>
  );
}

export function BlogPost({ l, slug }: { l: Locale; slug: string }) {
  const p = postFromSlug(l, slug);
  if (!p) notFound();
  const t = { ...UI[l], ...BLOG_UI[l] }, c = p.content[l];
  const url = abs(path(l, `blog/${p.slug[l]}`));
  const altSlug = path(l === "en" ? "es" : "en", `blog/${p.slug[l === "en" ? "es" : "en"]}`);
  const ld = [
    { "@context": "https://schema.org", "@type": "Article", headline: c.title, description: c.description, inLanguage: l, datePublished: p.date, dateModified: p.date, mainEntityOfPage: url, author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL }, publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: c.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  const related = POSTS.filter((x) => x.id !== p.id).slice(0, 3);
  return (
    <Shell locale={l} altHref={altSlug}>
      <JsonLd data={ld} />
      <article className="max-w-3xl">
        <p className="text-sm"><Link href={path(l, "blog")} className="text-accent2 hover:underline">← {t.blog}</Link></p>
        <div className="mt-3"><Banner img={BLOG_IMGS[POSTS.indexOf(p) % BLOG_IMGS.length]} kicker={<>{t.published}: {fmtDate(l)}</>} title={c.title} /></div>
        <div className="prose-site mt-6">
          {c.intro.map((x) => <p key={x} className="mb-3">{x}</p>)}
          <p className="mb-3"><Link href={toolPath(l, p.tool)}>{t.tryCalc}: {TOOLS[p.tool][l].h1} →</Link></p>
          <AdSlot locale={l} />
          {c.blocks.map((b) => (
            <section key={b.h}>
              <h2>{b.h}</h2>
              {b.p?.map((x) => <p key={x} className="mb-3">{x}</p>)}
              {b.table && (
                <div className="glass my-4 overflow-x-auto">
                  <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                    <thead><tr>{b.table.head.map((h) => <th key={h} className="border-b border-white/10 px-3 py-2 text-xs uppercase tracking-wide text-muted">{h}</th>)}</tr></thead>
                    <tbody>{b.table.rows.map((r, i) => <tr key={i} className="border-b border-white/5 last:border-0">{r.map((cell, j) => <td key={j} className={`px-3 py-2 ${j === 0 ? "font-medium text-white" : "tabular-nums text-[#c3c7d8]"}`}>{cell}</td>)}</tr>)}</tbody>
                  </table>
                </div>
              )}
              {b.note && <p className="text-xs text-muted">{b.note}</p>}
            </section>
          ))}
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
        <Sources l={l} />
        <section aria-labelledby="rel" className="mt-12">
          <h2 id="rel" className="text-lg font-semibold">{t.related}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {related.map((x) => (
              <Link key={x.id} href={path(l, `blog/${x.slug[l]}`)} className="glass block p-4 transition hover:border-accent/60">
                <div className="text-sm font-semibold">{x.content[l].title}</div>
              </Link>
            ))}
          </div>
        </section>
      </article>
    </Shell>
  );
}
