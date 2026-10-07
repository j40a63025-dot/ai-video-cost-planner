import Link from "next/link";
import { INFO_IDS, SITE_NAME, TOOLS, TOOL_IDS, UI, path, toolPath, type Locale } from "@/lib/content";
import { ProButton } from "./ProButton";
import { BLOG_UI } from "@/lib/blog-ui";

export function Shell({ locale, altHref, children }: { locale: Locale; altHref: string; children: React.ReactNode }) {
  const t = UI[locale];
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-black">{t.skip}</a>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07080d]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <Link href={path(locale)} className="flex items-center gap-2 font-bold tracking-tight">
            <span aria-hidden className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-accent to-accent2 text-sm text-black">$</span>
            <span className="text-sm sm:text-base">{SITE_NAME}</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href={altHref} hrefLang={locale === "en" ? "es" : "en"} className="btn !min-h-9 !px-3 text-xs" aria-label={locale === "en" ? "Ver en español" : "View in English"}>{t.language}</Link>
            <ProButton locale={locale} />
          </div>
        </div>
        <nav aria-label={t.tools} className="mx-auto flex max-w-5xl gap-2 overflow-x-auto px-4 pb-3 text-sm [scrollbar-width:none]">
          {TOOL_IDS.map((id) => (
            <Link key={id} href={toolPath(locale, id)} className="whitespace-nowrap rounded-full border border-white/10 px-3 py-1 text-muted hover:border-accent/60 hover:text-white">{TOOLS[id][locale].nav}</Link>
          ))}
          <Link href={path(locale, "blog")} className="whitespace-nowrap rounded-full border border-white/10 px-3 py-1 text-muted hover:border-accent/60 hover:text-white">{BLOG_UI[locale].blog}</Link>
        </nav>
      </header>
      <main id="main" className="mx-auto max-w-5xl px-4 pb-16 pt-8">{children}</main>
      <footer className="border-t border-white/10 py-8 text-sm text-muted">
        <div className="mx-auto max-w-5xl space-y-4 px-4">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {TOOL_IDS.map((id) => <Link key={id} href={toolPath(locale, id)} className="hover:text-white">{TOOLS[id][locale].nav}</Link>)}
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href={path(locale, "blog")} className="hover:text-white">{BLOG_UI[locale].blog}</Link>
            {INFO_IDS.map((id) => <Link key={id} href={path(locale, id)} className="hover:text-white">{t[id]}</Link>)}
          </div>
          <p>© {new Date().getUTCFullYear()} {SITE_NAME}. {t.footerNote}</p>
        </div>
      </footer>
    </>
  );
}
