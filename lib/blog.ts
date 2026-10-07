import { OFFERS, PLANS, PLAN_CREDIT_COSTS, KLING, PRICES_UPDATED_AT, budgetPlan, klingCredits, planVsApi, pricePerSecond, totalCost, usdPerCredit, type Res, type Scene } from "./calc";
import type { Locale, ToolId } from "./content";

export type Block = { h: string; p?: string[]; table?: { head: string[]; rows: string[][] }; note?: string };
export type PostContent = { title: string; description: string; intro: string[]; blocks: Block[]; faq: { q: string; a: string }[] };
export type Post = { id: string; slug: Record<Locale, string>; date: string; tool: ToolId; content: Record<Locale, PostContent> };

const m = (id: string) => OFFERS.find((o) => o.id === id)!;
const pps = (id: string, res: Res, audio = false) => pricePerSecond(m(id), res, audio)!;
const d2 = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const d3 = (n: number) => `$${n.toFixed(3)}`;
const n0 = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });
const lbl = (o: { provider: string; name: string }) => (o.name.toLowerCase().startsWith(o.provider.toLowerCase()) ? o.name : `${o.provider} ${o.name}`);
const label = (id: string) => lbl(m(id));
const planByIdOrThrow = (id: string) => PLANS.find((p) => p.id === id)!;

/* ---------- 1. Veo 60 s ---------- */
function veo60(): Record<Locale, PostContent> {
  const ids = ["veo-3.1", "veo-3.1-fast", "veo-3.1-lite"];
  const rows = ids.map((id) => {
    const p = pps(id, "1080p");
    return [m(id).name, d3(p), d2(totalCost(p, 60, 1, 0)), d2(totalCost(p, 60, 1, 200)), d2(p * 3600)];
  });
  const std = pps("veo-3.1", "1080p"), fast = pps("veo-3.1-fast", "1080p"), lite = pps("veo-3.1-lite", "1080p");
  const e = {
    title: "How much does a 60-second AI video cost with Veo 3.1?",
    description: `A 60-second Veo 3.1 video costs ${d2(std * 60)} for one clean pass at 1080p, or ${d2(fast * 60)} with Veo 3.1 Fast. Full breakdown with retakes.`,
    intro: [
      `Veo is billed per second of generated video, so the cost of a one-minute video is simple arithmetic: price per second × 60. At 1080p, the Veo 3.1 rate in our dataset is ${d2(std)} per second, which makes a single 60-second pass ${d2(std * 60)}. Veo 3.1 Fast is ${d2(fast)} per second (${d2(fast * 60)}) and Veo 3.1 Lite is ${d3(lite)} per second (${d2(lite * 60)}).`,
      "The number that surprises most people is not the price per second, it is how many seconds they actually generate. Almost nobody keeps the first take, so a realistic budget multiplies the clean cost by the number of attempts.",
    ],
    blocks: [
      { h: "Cost of 60 seconds at 1080p by Veo variant", table: { head: ["Variant", "$/second", "60 s, one pass", "60 s, 3 attempts per second kept", "Per hour of footage"], rows }, note: "The “3 attempts” column assumes you generate three times the footage you keep (retakes = 200%). That multiplier is an example, not a measured average. Change it in the calculator." },
      { h: "Why the retake multiplier matters more than the model", p: [
        `With Veo 3.1 at 1080p, a 60-second video generated once costs ${d2(std * 60)}. If you need three attempts on average to get each shot right, the real spend is ${d2(totalCost(std, 60, 1, 200))}. Switching to Veo 3.1 Fast brings the same three-attempt project to ${d2(totalCost(fast, 60, 1, 200))}.`,
        "A common workflow is to explore with a cheaper variant and only render the final selected shots with the higher-quality one. Because cost scales linearly with seconds, that approach lets you spend the premium rate only on footage you will actually use.",
      ] },
      { h: "Resolution and audio", p: [
        `Prices change with resolution. At 4K the Veo 3.1 rate in our dataset is ${d2(pps("veo-3.1", "4K"))} per second, so a 60-second 4K pass is ${d2(pps("veo-3.1", "4K") * 60)}. Veo 3.1 Fast at 4K is ${d2(pps("veo-3.1-fast", "4K"))} per second. Always check whether the rate you are reading includes audio, because some providers price it separately.`,
      ] },
    ],
    faq: [
      { q: "How much does 1 minute of Veo 3.1 video cost?", a: `At the 1080p rate in our dataset (${d2(std)}/s), one minute costs ${d2(std * 60)} for a single pass. With Veo 3.1 Fast it is ${d2(fast * 60)}.` },
      { q: "Is Veo 3.1 Fast good enough for final video?", a: "That depends on your project. It is cheaper per second, so many creators use it for drafts and use the standard model for final shots. Compare outputs on your own prompts." },
      { q: "Do retakes change the price per second?", a: "No. The price per second is fixed; retakes simply mean you generate more seconds in total." },
    ],
  };
  const s = {
    title: "¿Cuánto cuesta un video de 60 segundos con Veo 3.1?",
    description: `Un video de 60 segundos con Veo 3.1 cuesta ${d2(std * 60)} en una sola pasada a 1080p, o ${d2(fast * 60)} con Veo 3.1 Fast. Desglose completo con repeticiones.`,
    intro: [
      `Veo cobra por segundo de video generado, así que el costo de un video de un minuto es una cuenta simple: precio por segundo × 60. A 1080p, la tarifa de Veo 3.1 en nuestros datos es ${d2(std)} por segundo, lo que da ${d2(std * 60)} por una sola pasada de 60 segundos. Veo 3.1 Fast cuesta ${d2(fast)} por segundo (${d2(fast * 60)}) y Veo 3.1 Lite ${d3(lite)} por segundo (${d2(lite * 60)}).`,
      "Lo que más sorprende no es el precio por segundo, sino cuántos segundos terminas generando. Casi nadie se queda con la primera toma, así que un presupuesto realista multiplica el costo limpio por el número de intentos.",
    ],
    blocks: [
      { h: "Costo de 60 segundos a 1080p por variante de Veo", table: { head: ["Variante", "$/segundo", "60 s, una pasada", "60 s, 3 intentos por segundo usado", "Por hora de metraje"], rows }, note: "La columna de “3 intentos” supone que generas el triple del metraje que conservas (repeticiones = 200%). Ese multiplicador es un ejemplo, no un promedio medido. Cámbialo en la calculadora." },
      { h: "Por qué el multiplicador de repeticiones pesa más que el modelo", p: [
        `Con Veo 3.1 a 1080p, un video de 60 segundos generado una vez cuesta ${d2(std * 60)}. Si necesitas tres intentos en promedio para acertar cada plano, el gasto real es ${d2(totalCost(std, 60, 1, 200))}. Con Veo 3.1 Fast el mismo proyecto de tres intentos baja a ${d2(totalCost(fast, 60, 1, 200))}.`,
        "Un flujo común es explorar con una variante más barata y renderizar solo los planos finales elegidos con la de mayor calidad. Como el costo crece de forma lineal con los segundos, así pagas la tarifa premium solo por el metraje que vas a usar.",
      ] },
      { h: "Resolución y audio", p: [
        `Los precios cambian con la resolución. A 4K, la tarifa de Veo 3.1 en nuestros datos es ${d2(pps("veo-3.1", "4K"))} por segundo, así que una pasada de 60 segundos en 4K cuesta ${d2(pps("veo-3.1", "4K") * 60)}. Veo 3.1 Fast a 4K cuesta ${d2(pps("veo-3.1-fast", "4K"))} por segundo. Revisa siempre si la tarifa que lees incluye audio, porque algunos proveedores lo cobran aparte.`,
      ] },
    ],
    faq: [
      { q: "¿Cuánto cuesta 1 minuto de video con Veo 3.1?", a: `Con la tarifa de 1080p de nuestros datos (${d2(std)}/s), un minuto cuesta ${d2(std * 60)} en una sola pasada. Con Veo 3.1 Fast son ${d2(fast * 60)}.` },
      { q: "¿Veo 3.1 Fast sirve para el video final?", a: "Depende de tu proyecto. Es más barato por segundo, por eso muchos creadores lo usan para borradores y usan el modelo estándar para los planos finales. Compara resultados con tus propios prompts." },
      { q: "¿Las repeticiones cambian el precio por segundo?", a: "No. El precio por segundo es fijo; repetir solo significa que generas más segundos en total." },
    ],
  };
  return { en: e, es: s };
}

/* ---------- 2. Cheapest per second ---------- */
function cheapest(): Record<Locale, PostContent> {
  const rank = (res: Res, n: number) =>
    OFFERS.map((o) => ({ o, p: pricePerSecond(o, res, false) })).filter((r): r is { o: (typeof OFFERS)[number]; p: number } => r.p != null).sort((a, b) => a.p - b.p).slice(0, n);
  const r1080 = rank("1080p", 8), r720 = rank("720p", 6);
  const row = (r: { o: (typeof OFFERS)[number]; p: number }) => [lbl(r.o), d3(r.p), d2(r.p * 60), r.o.kind === "credits" ? "credit-based (effective rate)" : "API price"];
  const rowEs = (r: { o: (typeof OFFERS)[number]; p: number }) => [lbl(r.o), d3(r.p), d2(r.p * 60), r.o.kind === "credits" ? "por créditos (tarifa efectiva)" : "precio de API"];
  const a = r1080[0], b = r720[0];
  return {
    en: {
      title: "Cheapest AI video model per second (1080p and 720p)",
      description: `Ranking of AI video models by price per second at 1080p and 720p, from public pricing. Cheapest 1080p: ${lbl(a.o)} at ${d3(a.p)}/s.`,
      intro: [
        `If you only look at price, the cheapest 1080p option in our dataset is ${lbl(a.o)} at ${d3(a.p)} per second, and the cheapest at 720p is ${lbl(b.o)} at ${d3(b.p)} per second. But price per second is only one input: quality, motion, audio and how many takes you need all change the real cost.`,
        "The tables below rank every model we track by published price per second, without native audio. Credit-based tools such as Pika and Higgsfield do not publish a per-second API price, so their rows show an effective rate derived from credits per clip and the price of a credit on a reference plan.",
      ],
      blocks: [
        { h: "Cheapest at 1080p", table: { head: ["Model", "$/second", "Per minute", "Price type"], rows: r1080.map(row) } },
        { h: "Cheapest at 720p", table: { head: ["Model", "$/second", "Per minute", "Price type"], rows: r720.map(row) } },
        { h: "How to read this ranking", p: [
          "A lower price per second does not automatically mean a lower project cost. A model that needs four attempts to produce a usable shot can cost more than one that is twice as expensive per second but nails it in two.",
          "Use the ranking to shortlist models, then test your own prompts with each shortlisted model for a few seconds before committing the whole budget.",
        ] },
      ],
      faq: [
        { q: "What is the cheapest AI video generator?", a: `By published price per second in our dataset, ${lbl(a.o)} is cheapest at 1080p (${d3(a.p)}/s) and ${lbl(b.o)} at 720p (${d3(b.p)}/s). Quality is not part of this ranking.` },
        { q: "Why do credit-based tools appear with an effective rate?", a: "They charge in credits rather than dollars per second. We convert using credits per clip and the annual-billing price of a credit on a reference plan." },
        { q: "How often do prices change?", a: `Providers change prices often. This ranking uses data checked on ${PRICES_UPDATED_AT}; always confirm on the provider's page.` },
      ],
    },
    es: {
      title: "El modelo de video con IA más barato por segundo (1080p y 720p)",
      description: `Ranking de modelos de video con IA por precio por segundo a 1080p y 720p, según precios públicos. Más barato a 1080p: ${lbl(a.o)} a ${d3(a.p)}/s.`,
      intro: [
        `Si solo miras el precio, la opción más barata a 1080p en nuestros datos es ${lbl(a.o)} a ${d3(a.p)} por segundo, y a 720p es ${lbl(b.o)} a ${d3(b.p)} por segundo. Pero el precio por segundo es solo un factor: la calidad, el movimiento, el audio y cuántas tomas necesitas cambian el costo real.`,
        "Las tablas siguientes ordenan todos los modelos que seguimos por precio publicado por segundo, sin audio nativo. Las herramientas por créditos como Pika y Higgsfield no publican un precio de API por segundo, así que sus filas muestran una tarifa efectiva calculada con los créditos por clip y el precio de un crédito en un plan de referencia.",
      ],
      blocks: [
        { h: "Más baratos a 1080p", table: { head: ["Modelo", "$/segundo", "Por minuto", "Tipo de precio"], rows: r1080.map(rowEs) } },
        { h: "Más baratos a 720p", table: { head: ["Modelo", "$/segundo", "Por minuto", "Tipo de precio"], rows: r720.map(rowEs) } },
        { h: "Cómo leer este ranking", p: [
          "Un precio por segundo menor no significa automáticamente un costo de proyecto menor. Un modelo que necesita cuatro intentos para lograr una toma usable puede costar más que uno que cuesta el doble por segundo pero acierta en dos.",
          "Usa el ranking para preseleccionar modelos y luego prueba tus propios prompts con cada uno durante unos segundos antes de comprometer todo el presupuesto.",
        ] },
      ],
      faq: [
        { q: "¿Cuál es el generador de video con IA más barato?", a: `Por precio publicado por segundo en nuestros datos, ${lbl(a.o)} es el más barato a 1080p (${d3(a.p)}/s) y ${lbl(b.o)} a 720p (${d3(b.p)}/s). La calidad no entra en este ranking.` },
        { q: "¿Por qué las herramientas por créditos aparecen con tarifa efectiva?", a: "Cobran en créditos y no en dólares por segundo. Convertimos con los créditos por clip y el precio de un crédito con facturación anual en un plan de referencia." },
        { q: "¿Cada cuánto cambian los precios?", a: `Los proveedores cambian precios con frecuencia. Este ranking usa datos verificados el ${PRICES_UPDATED_AT}; confirma siempre en la página del proveedor.` },
      ],
    },
  };
}

/* ---------- 3. Subscription vs API ---------- */
function subVsApi(): Record<Locale, PostContent> {
  const secs = 300;
  const mk = (ids: string[]) => ids.map((id) => { const p = planByIdOrThrow(id); return { id, label: `${p.provider} ${p.name}`, price: (p.annualMonthly ?? p.monthly)!, credits: p.credits as number }; });
  const rw = planVsApi({ secondsPerMonth: secs, creditsPerSecond: PLAN_CREDIT_COSTS.find((x) => x.id === "runway-gen4.5")!.creditsPerSecond, apiPps: pps("runway-gen4.5", "720p"), annual: true, plans: mk(["runway-standard", "runway-pro", "runway-max"]) });
  const lm = planVsApi({ secondsPerMonth: secs, creditsPerSecond: PLAN_CREDIT_COSTS.find((x) => x.id === "luma-ray-3.2-1080p")!.creditsPerSecond, apiPps: pps("luma-ray-3.2", "1080p"), annual: true, plans: mk(["luma-plus", "luma-pro", "luma-ultra"]) });
  const rows = (r: ReturnType<typeof planVsApi>, es = false) => [
    [es ? "API (pago por segundo)" : "API (pay per second)", d2(r.api), ""],
    ...r.options.map((o) => [`${o.label} ×${o.count}`, d2(o.cost), `${n0(o.includedSeconds)} s ${es ? "incluidos por plan" : "included per plan"}`]),
  ];
    return {
    en: {
      title: "AI video subscription vs API: which costs less?",
      description: `Subscription or API for ${secs} seconds of AI video per month? Worked comparison for Runway Gen-4.5 and Luma Ray 3.2 using published plan and API prices.`,
      intro: [
        `In our data the API is ${rw.winner === "api" && lm.winner === "api" ? "cheaper for both providers" : "not cheaper for every provider"} at ${secs} seconds per month: ${d2(rw.api)} through the Runway Gen-4.5 API versus ${d2(rw.best.cost)} on the best Runway plan, and ${d2(lm.api)} through the Luma Ray 3.2 API versus ${d2(lm.best.cost)} on the best Luma plan. The gap is large for Runway and small for Luma, so the answer depends on the provider and your volume.`,
        "A subscription converts dollars into a monthly pool of credits, and each model spends credits at its own rate per second. The API charges dollars per second directly. The comparison is credits needed ÷ plan credits (rounded up to whole plans) × plan price, against seconds × API price.",
      ],
      blocks: [
        { h: `Runway Gen-4.5, ${secs} seconds per month (720p)`, table: { head: ["Option", "Monthly cost", "Notes"], rows: rows(rw) }, note: "Plan prices use annual billing. Credits needed = seconds × credits per second." },
        { h: `Luma Ray 3.2, ${secs} seconds per month (1080p)`, table: { head: ["Option", "Monthly cost", "Notes"], rows: rows(lm) } },
        { h: "What the table does not capture", p: [
          "Subscriptions usually include features the API does not: a web editor, unlimited access to some models, or a team workspace. If you value those, the cheaper line on paper may not be the better deal.",
          "Unused credits are a hidden cost. If your usage changes month to month, the plan you buy for your peak month can leave credits idle in quiet months, while the API charges only for what you generate.",
        ] },
      ],
      faq: [
        { q: "Is a subscription cheaper than the API?", a: `Not in our worked example: at ${secs} seconds per month the API was cheaper for both Runway Gen-4.5 and Luma Ray 3.2, by a wide margin for Runway and a narrow one for Luma. Higher volumes or different models can change that, so run your own numbers.` },
        { q: "Do unused credits roll over?", a: "Rules vary by provider and plan. Check the provider's terms; the calculator does not assume rollover." },
        { q: "Which plan billing does the comparison use?", a: "Annual-billing monthly prices where the provider publishes them. Monthly billing is higher." },
      ],
    },
    es: {
      title: "Suscripción vs API de video con IA: ¿cuál cuesta menos?",
      description: `¿Suscripción o API para ${secs} segundos de video con IA al mes? Comparación resuelta para Runway Gen-4.5 y Luma Ray 3.2 con precios publicados.`,
      intro: [
        `En nuestros datos la API ${rw.winner === "api" && lm.winner === "api" ? "es más barata con ambos proveedores" : "no es más barata con todos los proveedores"} a ${secs} segundos al mes: ${d2(rw.api)} con la API de Runway Gen-4.5 frente a ${d2(rw.best.cost)} en el mejor plan de Runway, y ${d2(lm.api)} con la API de Luma Ray 3.2 frente a ${d2(lm.best.cost)} en el mejor plan de Luma. La diferencia es grande en Runway y pequeña en Luma, así que la respuesta depende del proveedor y de tu volumen.`,
        "Una suscripción convierte dólares en un fondo mensual de créditos, y cada modelo gasta créditos a su propio ritmo por segundo. La API cobra dólares por segundo directamente. La comparación es créditos necesarios ÷ créditos del plan (redondeando a planes enteros) × precio del plan, contra segundos × precio de la API.",
      ],
      blocks: [
        { h: `Runway Gen-4.5, ${secs} segundos al mes (720p)`, table: { head: ["Opción", "Costo mensual", "Notas"], rows: rows(rw, true) }, note: "Los precios de los planes usan facturación anual. Créditos necesarios = segundos × créditos por segundo." },
        { h: `Luma Ray 3.2, ${secs} segundos al mes (1080p)`, table: { head: ["Opción", "Costo mensual", "Notas"], rows: rows(lm, true) } },
        { h: "Lo que la tabla no captura", p: [
          "Las suscripciones suelen incluir funciones que la API no tiene: un editor web, acceso ilimitado a algunos modelos o un espacio de equipo. Si las valoras, la línea más barata en papel puede no ser la mejor oferta.",
          "Los créditos sin usar son un costo oculto. Si tu uso cambia cada mes, el plan que compras para tu mes más fuerte puede dejar créditos ociosos en los meses tranquilos, mientras que la API cobra solo lo que generas.",
        ] },
      ],
      faq: [
        { q: "¿Una suscripción es más barata que la API?", a: `No en nuestro ejemplo: a ${secs} segundos al mes la API fue más barata con Runway Gen-4.5 y con Luma Ray 3.2, por un margen amplio en Runway y estrecho en Luma. Volúmenes mayores u otros modelos pueden cambiarlo, así que haz tus propios cálculos.` },
        { q: "¿Los créditos sin usar se acumulan?", a: "Las reglas varían según el proveedor y el plan. Revisa los términos del proveedor; la calculadora no supone acumulación." },
        { q: "¿Qué facturación usa la comparación?", a: "Los precios mensuales con facturación anual cuando el proveedor los publica. Con facturación mensual es más caro." },
      ],
    },
  };
}

/* ---------- 4. Kling credits ---------- */
function klingPost(): Record<Locale, PostContent> {
  const upc = KLING.topUpUsdPerCredit;
  const lengths = [60, 180, 600];
  const retake = 30;
  const rows = (es: boolean) => KLING.rates.map((r) => [es ? r.label.replace("no audio", "sin audio").replace("native audio", "audio nativo") : r.label, String(r.creditsPerSecond), ...lengths.map((s) => { const k = klingCredits({ creditsPerSecond: r.creditsPerSecond, seconds: s, clips: 1, retakePct: retake, usdPerCredit: upc }); return `${n0(k.credits)} cr · ${d2(k.usd)}`; })]);
  const r1 = KLING.rates[0];
  const k180 = klingCredits({ creditsPerSecond: r1.creditsPerSecond, seconds: 180, clips: 1, retakePct: retake, usdPerCredit: upc });
  const head = (es: boolean) => [es ? "Nivel" : "Tier", es ? "Créditos/s" : "Credits/s", "60 s", "3 min", "10 min"];
  return {
    en: {
      title: "How many Kling credits do you need for a video?",
      description: `Kling credit cost by quality tier: a 3-minute video at 720p without audio needs about ${n0(k180.credits)} credits (${d2(k180.usd)} at top-up price) with 30% retakes.`,
      intro: [
        `Kling charges credits per second of generated video, and the rate depends on the tier. In our data, ${r1.label} uses ${r1.creditsPerSecond} credits per second, so one finished minute is ${r1.creditsPerSecond * 60} credits before retakes.`,
        `To turn credits into dollars we use the published top-up rate (1 USD per 66 credits, about ${d3(upc)} per credit). Subscription plans give cheaper effective credits, but we could not confirm the credits each plan includes, so we do not price plans here.`,
      ],
      blocks: [
        { h: `Credits and top-up cost with ${retake}% retakes`, table: { head: head(false), rows: rows(false) }, note: `Retakes add ${retake}% on top of the final length (an example value). Dollar figures use the published top-up price of ${d3(upc)} per credit and are an upper bound if you buy through a plan.` },
        { h: "How to estimate your own total", p: [
          "Multiply credits per second by the seconds you plan to generate, then by 1 plus your retake rate. For example, 60 seconds at 12 credits per second with 50% retakes is 60 × 12 × 1.5 = 1,080 credits.",
          "Because the rate jumps with quality tier, the cheapest way to control cost is to draft at the lowest tier and re-render only the approved shots at a higher one.",
        ] },
      ],
      faq: [
        { q: "How many credits is one second of Kling video?", a: `In our data it ranges from ${KLING.rates[0].creditsPerSecond} credits per second (720p, no audio) to ${KLING.rates[2].creditsPerSecond} (4K), depending on the tier.` },
        { q: "How much is a Kling credit worth in dollars?", a: `The published top-up rate is $1 per 66 credits (about ${d3(upc)}). Plans can lower the effective price.` },
        { q: "Why are plan prices not shown?", a: "We could not confirm how many credits each Kling plan includes, so we avoid guessing." },
      ],
    },
    es: {
      title: "¿Cuántos créditos de Kling necesitas para un video?",
      description: `Costo en créditos de Kling por nivel: un video de 3 minutos a 720p sin audio necesita unos ${n0(k180.credits)} créditos (${d2(k180.usd)} al precio de recarga) con 30% de repeticiones.`,
      intro: [
        `Kling cobra créditos por segundo de video generado y la tarifa depende del nivel. En nuestros datos, ${r1.label.replace("no audio", "sin audio")} usa ${r1.creditsPerSecond} créditos por segundo, así que un minuto terminado son ${r1.creditsPerSecond * 60} créditos antes de repeticiones.`,
        `Para convertir créditos en dólares usamos la tarifa de recarga publicada (1 USD por 66 créditos, unos ${d3(upc)} por crédito). Los planes de suscripción dan créditos más baratos, pero no pudimos confirmar cuántos créditos incluye cada plan, así que no calculamos planes aquí.`,
      ],
      blocks: [
        { h: `Créditos y costo de recarga con ${retake}% de repeticiones`, table: { head: head(true), rows: rows(true) }, note: `Las repeticiones suman ${retake}% sobre la duración final (valor de ejemplo). Los dólares usan el precio de recarga publicado de ${d3(upc)} por crédito y son un máximo si compras mediante un plan.` },
        { h: "Cómo estimar tu propio total", p: [
          "Multiplica los créditos por segundo por los segundos que planeas generar, y luego por 1 más tu tasa de repeticiones. Por ejemplo, 60 segundos a 12 créditos por segundo con 50% de repeticiones son 60 × 12 × 1.5 = 1,080 créditos.",
          "Como la tarifa sube con el nivel de calidad, la forma más barata de controlar el costo es hacer borradores en el nivel más bajo y volver a renderizar en uno superior solo las tomas aprobadas.",
        ] },
      ],
      faq: [
        { q: "¿Cuántos créditos es un segundo de video de Kling?", a: `En nuestros datos va de ${KLING.rates[0].creditsPerSecond} créditos por segundo (720p, sin audio) a ${KLING.rates[2].creditsPerSecond} (4K), según el nivel.` },
        { q: "¿Cuánto vale un crédito de Kling en dólares?", a: `La tarifa de recarga publicada es $1 por 66 créditos (unos ${d3(upc)}). Los planes pueden bajar el precio efectivo.` },
        { q: "¿Por qué no se muestran precios de planes?", a: "No pudimos confirmar cuántos créditos incluye cada plan de Kling, así que evitamos adivinar." },
      ],
    },
  };
}

/* ---------- 5. Short film budget ---------- */
function film(): Record<Locale, PostContent> {
  const scenes: (Scene & { en: string; es: string })[] = [
    { id: "1", name: "", en: "Opening establishing shot", es: "Plano general de apertura", seconds: 12, offerId: "veo-3.1-fast", res: "1080p", takes: 3 },
    { id: "2", name: "", en: "Character close-ups", es: "Primeros planos del personaje", seconds: 24, offerId: "kling-3-pro", res: "1080p", takes: 4 },
    { id: "3", name: "", en: "Chase sequence", es: "Secuencia de persecución", seconds: 30, offerId: "luma-ray-3.2", res: "1080p", takes: 3 },
    { id: "4", name: "", en: "Dialogue scene", es: "Escena de diálogo", seconds: 20, offerId: "veo-3.1", res: "1080p", takes: 3 },
    { id: "5", name: "", en: "Closing shot", es: "Plano final", seconds: 8, offerId: "runway-gen4.5", res: "720p", takes: 2 },
  ];
  const cont = 15;
  const plan = budgetPlan(scenes, cont);
  const mk = (es: boolean) => scenes.map((s, i) => [es ? s.es : s.en, label(s.offerId), `${s.res}`, `${s.seconds} s × ${s.takes}`, d2(plan.lines[i].cost!)]);
  const per = plan.total / (plan.finalSeconds / 60);
  return {
    en: {
      title: "How to budget an AI short film (worked example)",
      description: `Budget example for a ${plan.finalSeconds}-second AI short film across five scenes and four models: ${d2(plan.total)} including ${cont}% contingency.`,
      intro: [
        `A multi-scene project is cheaper to plan scene by scene than with one average rate. Different scenes call for different models, and the number of takes varies by how hard the shot is. In this example, a ${plan.finalSeconds}-second film with five scenes costs ${d2(plan.subtotal)} before contingency and ${d2(plan.total)} with ${cont}% contingency.`,
        "The scene models and take counts below are illustrative choices, not recommendations. Prices come from our dataset and are per second of generated video, without audio.",
      ],
      blocks: [
        { h: "Scene-by-scene budget", table: { head: ["Scene", "Model", "Resolution", "Seconds × takes", "Cost"], rows: [...mk(false), ["Subtotal", "", "", "", d2(plan.subtotal)], [`Contingency (${cont}%)`, "", "", "", d2(plan.contingency)], ["Total", "", "", `${plan.finalSeconds} s final`, d2(plan.total)]] } },
        { h: "What the number means", p: [
          `The total works out to about ${d2(per)} per finished minute. Most of the spend is concentrated in the scenes with the most generated seconds, so reducing takes on those scenes saves more than switching models on short ones.`,
          "Contingency covers shots that fail repeatedly, scope changes and the occasional re-render. Fifteen percent is a starting point; increase it if your concept relies on hard-to-control motion or consistent characters.",
        ] },
        { h: "Costs this budget leaves out", p: ["Music, voice, editing software, upscaling and your own time are not included. Native audio may also be priced separately by some providers."] },
      ],
      faq: [
        { q: "How much does an AI short film cost?", a: `In our example, ${plan.finalSeconds} seconds of final footage costs ${d2(plan.total)} including contingency. Your number depends on models, resolution and takes.` },
        { q: "How many takes should I budget per scene?", a: "It varies with shot complexity. Two to four is a common planning range, but measure your own retake rate on a test scene." },
        { q: "Why add contingency?", a: "Because generation is not deterministic: some shots need many more attempts than planned." },
      ],
    },
    es: {
      title: "Cómo presupuestar un cortometraje con IA (ejemplo resuelto)",
      description: `Ejemplo de presupuesto para un cortometraje de ${plan.finalSeconds} segundos con cinco escenas y cuatro modelos: ${d2(plan.total)} con ${cont}% de contingencia.`,
      intro: [
        `Un proyecto de varias escenas se planifica mejor escena por escena que con una tarifa promedio. Cada escena pide un modelo distinto y el número de tomas cambia según lo difícil del plano. En este ejemplo, un cortometraje de ${plan.finalSeconds} segundos con cinco escenas cuesta ${d2(plan.subtotal)} antes de contingencia y ${d2(plan.total)} con ${cont}% de contingencia.`,
        "Los modelos por escena y las tomas de abajo son elecciones ilustrativas, no recomendaciones. Los precios vienen de nuestros datos y son por segundo de video generado, sin audio.",
      ],
      blocks: [
        { h: "Presupuesto escena por escena", table: { head: ["Escena", "Modelo", "Resolución", "Segundos × tomas", "Costo"], rows: [...mk(true), ["Subtotal", "", "", "", d2(plan.subtotal)], [`Contingencia (${cont}%)`, "", "", "", d2(plan.contingency)], ["Total", "", "", `${plan.finalSeconds} s finales`, d2(plan.total)]] } },
        { h: "Qué significa el número", p: [
          `El total equivale a unos ${d2(per)} por minuto terminado. La mayor parte del gasto se concentra en las escenas con más segundos generados, así que reducir tomas en ellas ahorra más que cambiar de modelo en las cortas.`,
          "La contingencia cubre planos que fallan repetidamente, cambios de alcance y algún re-render. Quince por ciento es un punto de partida; súbela si tu idea depende de movimientos difíciles de controlar o de personajes consistentes.",
        ] },
        { h: "Costos que este presupuesto no incluye", p: ["No incluye música, voz, software de edición, escalado ni tu propio tiempo. Algunos proveedores también cobran aparte el audio nativo."] },
      ],
      faq: [
        { q: "¿Cuánto cuesta un cortometraje con IA?", a: `En nuestro ejemplo, ${plan.finalSeconds} segundos de metraje final cuestan ${d2(plan.total)} con contingencia. Tu número depende de modelos, resolución y tomas.` },
        { q: "¿Cuántas tomas debo presupuestar por escena?", a: "Varía con la complejidad del plano. De dos a cuatro es un rango común de planificación, pero mide tu propia tasa de repeticiones en una escena de prueba." },
        { q: "¿Por qué agregar contingencia?", a: "Porque la generación no es determinista: algunos planos necesitan muchos más intentos de los previstos." },
      ],
    },
  };
}

/* ---------- 6. Runway vs Luma vs Pika ---------- */
function rlp(): Record<Locale, PostContent> {
  const ids: [string, Res][] = [["runway-gen4-turbo", "720p"], ["luma-ray-3.2", "720p"], ["pika-wan-3", "720p"], ["runway-gen4.5", "720p"], ["pika-seedance-2.5", "720p"], ["luma-ray-3.2", "1080p"]];
  const rows = (es: boolean) => ids.map(([id, res]) => [label(id), res, d3(pps(id, res)), d2(pps(id, res) * 60), m(id).kind === "credits" ? (es ? "tarifa efectiva por créditos" : "effective credit rate") : (es ? "precio de API" : "API price")]);
  const pika = pps("pika-wan-3", "720p"), turbo = pps("runway-gen4-turbo", "720p"), lumaLow = pps("luma-ray-3.2", "720p");
  const head = (es: boolean) => es ? ["Modelo", "Resolución", "$/segundo", "Por minuto", "Tipo"] : ["Model", "Resolution", "$/second", "Per minute", "Type"];
  return {
    en: {
      title: "Runway vs Luma vs Pika: cost per second compared",
      description: `Runway, Luma and Pika compared by cost per second. At 720p: Runway Gen-4 Turbo ${d3(turbo)}/s, Luma Ray 3.2 ${d3(lumaLow)}/s, Pika Wan 3.0 about ${d3(pika)}/s effective.`,
      intro: [
        `At 720p, the lowest published rate among these three providers is Runway Gen-4 Turbo at ${d3(turbo)} per second, followed by Luma Ray 3.2 at ${d3(lumaLow)} per second. Pika Wan 3.0 works out to about ${d3(pika)} per second as an effective rate.`,
        "These tools do not price the same way: Runway and Luma publish API prices per second, while Pika sells credits inside subscription plans. To compare them fairly we convert credit prices into an effective dollar rate per second.",
      ],
      blocks: [
        { h: "Cost per second, side by side", table: { head: head(false), rows: rows(false) }, note: "Pika rows are effective rates: credits per 5-second clip ÷ 5 × the annual-billing price of one credit on the Pika Starter plan. They are not an official per-second API price." },
        { h: "How to choose", p: [
          "If you generate in bulk or through an API, the published per-second price is the number to optimize. If you mostly work in a web app, the plan you pay for matters more than the per-second rate, because credits you do not use are wasted.",
          "Resolution changes the picture: Luma Ray 3.2 more than triples in price between 720p and 1080p in our data, so compare at the resolution you will actually deliver.",
        ] },
      ],
      faq: [
        { q: "Which is cheaper, Runway, Luma or Pika?", a: `At 720p in our data, Runway Gen-4 Turbo (${d3(turbo)}/s) is the cheapest of the three, but models differ in quality and features.` },
        { q: "Why is Pika shown as an effective rate?", a: "Pika sells credits in subscription plans and does not publish a per-second API price in our sources." },
        { q: "Are these prices current?", a: `They were checked on ${PRICES_UPDATED_AT}. Confirm on each provider's page before buying.` },
      ],
    },
    es: {
      title: "Runway vs Luma vs Pika: costo por segundo comparado",
      description: `Runway, Luma y Pika comparados por costo por segundo. A 720p: Runway Gen-4 Turbo ${d3(turbo)}/s, Luma Ray 3.2 ${d3(lumaLow)}/s, Pika Wan 3.0 unos ${d3(pika)}/s efectivos.`,
      intro: [
        `A 720p, la tarifa publicada más baja entre estos tres proveedores es Runway Gen-4 Turbo con ${d3(turbo)} por segundo, seguida de Luma Ray 3.2 con ${d3(lumaLow)} por segundo. Pika Wan 3.0 equivale a unos ${d3(pika)} por segundo como tarifa efectiva.`,
        "Estas herramientas no cobran de la misma forma: Runway y Luma publican precios de API por segundo, mientras que Pika vende créditos dentro de planes de suscripción. Para compararlas con justicia convertimos los precios por créditos en una tarifa efectiva en dólares por segundo.",
      ],
      blocks: [
        { h: "Costo por segundo, lado a lado", table: { head: head(true), rows: rows(true) }, note: "Las filas de Pika son tarifas efectivas: créditos por clip de 5 segundos ÷ 5 × el precio con facturación anual de un crédito en el plan Pika Starter. No son un precio oficial de API por segundo." },
        { h: "Cómo elegir", p: [
          "Si generas en volumen o por API, el precio publicado por segundo es el número a optimizar. Si trabajas sobre todo en la aplicación web, el plan que pagas pesa más que la tarifa por segundo, porque los créditos que no usas se pierden.",
          "La resolución cambia el panorama: Luma Ray 3.2 cuesta más del triple entre 720p y 1080p en nuestros datos, así que compara en la resolución que realmente vas a entregar.",
        ] },
      ],
      faq: [
        { q: "¿Qué es más barato, Runway, Luma o Pika?", a: `A 720p en nuestros datos, Runway Gen-4 Turbo (${d3(turbo)}/s) es el más barato de los tres, pero los modelos difieren en calidad y funciones.` },
        { q: "¿Por qué Pika aparece como tarifa efectiva?", a: "Pika vende créditos en planes de suscripción y en nuestras fuentes no publica un precio de API por segundo." },
        { q: "¿Estos precios están al día?", a: `Se verificaron el ${PRICES_UPDATED_AT}. Confírmalos en la página de cada proveedor antes de comprar.` },
      ],
    },
  };
}

const D = PRICES_UPDATED_AT;
export const POSTS: Post[] = [
  { id: "veo-60s", slug: { en: "veo-3-1-60-second-video-cost", es: "costo-video-60-segundos-veo-3-1" }, date: D, tool: "veo", content: veo60() },
  { id: "cheapest", slug: { en: "cheapest-ai-video-model-per-second", es: "modelo-video-ia-mas-barato-por-segundo" }, date: D, tool: "compare", content: cheapest() },
  { id: "sub-vs-api", slug: { en: "ai-video-subscription-vs-api-which-costs-less", es: "suscripcion-vs-api-video-ia-cual-cuesta-menos" }, date: D, tool: "subapi", content: subVsApi() },
  { id: "kling", slug: { en: "how-many-kling-credits-for-a-video", es: "cuantos-creditos-kling-para-un-video" }, date: D, tool: "kling", content: klingPost() },
  { id: "film", slug: { en: "how-to-budget-an-ai-short-film", es: "como-presupuestar-un-cortometraje-con-ia" }, date: D, tool: "budget", content: film() },
  { id: "rlp", slug: { en: "runway-vs-luma-vs-pika-cost-per-second", es: "runway-vs-luma-vs-pika-costo-por-segundo" }, date: D, tool: "compare", content: rlp() },
];
export const postFromSlug = (l: Locale, slug: string) => POSTS.find((p) => p.slug[l] === slug);
void usdPerCredit;
