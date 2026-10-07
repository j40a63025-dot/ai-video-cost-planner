import type { Locale } from "./content";
export const BLOG_UI: Record<Locale, { blog: string; allArticles: string; blogTitle: string; blogSub: string; readArticle: string; tryCalc: string; related: string; published: string }> = {
  en: { blog: "Blog", allArticles: "All articles", blogTitle: "AI video cost guides", blogSub: "Worked examples and comparisons built from the same public price data as the calculators.", readArticle: "Read article", tryCalc: "Try the calculator", related: "Related articles", published: "Data checked" },
  es: { blog: "Blog", allArticles: "Todos los artículos", blogTitle: "Guías de costos de video con IA", blogSub: "Ejemplos resueltos y comparaciones hechas con los mismos precios públicos de las calculadoras.", readArticle: "Leer artículo", tryCalc: "Probar la calculadora", related: "Artículos relacionados", published: "Datos verificados" },
};
