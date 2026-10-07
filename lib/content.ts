export type Locale = "en" | "es";
export type ToolId = "compare" | "veo" | "kling" | "budget" | "subapi";
export const TOOL_IDS: ToolId[] = ["compare", "veo", "kling", "budget", "subapi"];
export const SITE_NAME = "AI Video Cost Planner";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://ai-video-cost-planner.vercel.app").replace(/\/$/, "");

export const SLUGS: Record<ToolId, Record<Locale, string>> = {
  compare: { en: "ai-video-cost-calculator", es: "calculadora-costo-video-ia" },
  veo: { en: "veo-cost-per-second-calculator", es: "calculadora-costo-por-segundo-veo" },
  kling: { en: "kling-credits-calculator", es: "calculadora-creditos-kling" },
  budget: { en: "ai-video-budget-planner", es: "planificador-presupuesto-video-ia" },
  subapi: { en: "ai-video-subscription-vs-api-cost", es: "suscripcion-vs-api-video-ia" },
};
export const INFO_IDS = ["about", "contact", "privacy", "terms"] as const;
export type InfoId = (typeof INFO_IDS)[number];

export const path = (l: Locale, slug = "") => (l === "es" ? `/es${slug ? "/" + slug : ""}` : slug ? `/${slug}` : "/");
export const toolPath = (l: Locale, id: ToolId) => path(l, SLUGS[id][l]);
export const toolFromSlug = (l: Locale, slug: string): ToolId | undefined => TOOL_IDS.find((t) => SLUGS[t][l] === slug);

export type ToolContent = {
  nav: string; keyword: string; title: string; description: string; h1: string; lead: string; blurb: string;
  formula: string; formulaNote: string; example: string[]; limitations: string[]; faq: { q: string; a: string }[];
};

export const TOOLS: Record<ToolId, Record<Locale, ToolContent>> = {
  compare: {
    en: {
      nav: "Cost calculator", keyword: "ai video cost calculator",
      title: "AI Video Cost Calculator — Compare Veo, Kling, Sora, Runway, Luma",
      description: "Free AI video cost calculator: compare what Veo, Sora, Kling, Runway, Luma, Pika and Higgsfield charge for your clip length, resolution and number of takes. No login.",
      h1: "AI Video Cost Calculator", blurb: "Compare every model side by side for your clip length and resolution.",
      lead: "Enter your clip length, number of clips and resolution to see what each AI video model would cost, ranked from cheapest to most expensive.",
      formula: "Total = price per second × seconds per clip × clips × (1 + retake %)",
      formulaNote: "API models use the published USD price per second. Credit-based tools (Pika, Higgsfield) use credits per clip ÷ clip seconds × the price of one credit on a reference plan, so they show an effective rate. Retake % adds the cost of regenerating clips you discard.",
      example: ["You need 6 clips of 10 seconds at 1080p with no retakes (60 seconds of generation).", "Veo 3.1 Fast: $0.12 × 10 × 6 = $7.20. Veo 3.1 Lite: $0.08 × 60 = $4.80. Kling 3.0 Pro (no audio): $0.112 × 60 = $6.72. Luma Ray 3.2: $0.24 × 60 = $14.40. Veo 3.1: $0.40 × 60 = $24.00. Sora 2 Pro: $0.70 × 60 = $42.00."],
      limitations: ["Models differ in quality, motion, audio and prompt adherence — the cheapest option is not always the best value.", "Not every model offers every resolution; unavailable combinations are listed separately instead of guessed.", "Credit-based rows depend on which plan you buy; real cost changes if you use top-ups, annual billing or unused credits.", "Batch discounts, free tiers, taxes and enterprise contracts are not included."],
      faq: [
        { q: "How much does AI video cost per second?", a: "Published API prices in our dataset range from about $0.05 to $0.70 per second of generated video depending on model and resolution. Use the calculator to see the exact figure for your settings." },
        { q: "Which AI video model is cheapest?", a: "At 720p and 1080p the lowest published per-second rates are usually Veo 3.1 Lite and Runway Gen-4 Turbo, but quality differs a lot. Check the ranking for your resolution." },
        { q: "Why include a retake percentage?", a: "Most generations are not usable on the first try. A 30% retake rate means you pay for 30% more footage than you keep, which is realistic for prompt-driven work." },
        { q: "Are these official prices?", a: "Each price links to its source. Where the official page could not be read directly, we mark the entry as secondary and show the page it was read through." },
        { q: "How often are prices updated?", a: "The 'Prices updated' date at the top of the tool shows the last verification. Providers change prices often, so always confirm on the source before committing budget." },
      ],
    },
    es: {
      nav: "Calculadora de costos", keyword: "calculadora costo video ia",
      title: "Calculadora de costo de video con IA — Veo, Kling, Sora, Runway, Luma",
      description: "Calculadora gratuita del costo de video con IA: compara lo que cobran Veo, Sora, Kling, Runway, Luma, Pika y Higgsfield según duración, resolución y número de tomas. Sin registro.",
      h1: "Calculadora de costo de video con IA", blurb: "Compara todos los modelos según tu duración y resolución.",
      lead: "Ingresa la duración de tus clips, la cantidad y la resolución para ver cuánto costaría cada modelo de video con IA, ordenado del más barato al más caro.",
      formula: "Total = precio por segundo × segundos por clip × clips × (1 + % de repeticiones)",
      formulaNote: "Los modelos por API usan el precio publicado en USD por segundo. Las herramientas por créditos (Pika, Higgsfield) usan créditos por clip ÷ segundos del clip × precio de un crédito en un plan de referencia, por lo que muestran una tarifa efectiva. El % de repeticiones suma el costo de regenerar clips descartados.",
      example: ["Necesitas 6 clips de 10 segundos en 1080p sin repeticiones (60 segundos de generación).", "Veo 3.1 Fast: $0.12 × 10 × 6 = $7.20. Veo 3.1 Lite: $0.08 × 60 = $4.80. Kling 3.0 Pro (sin audio): $0.112 × 60 = $6.72. Luma Ray 3.2: $0.24 × 60 = $14.40. Veo 3.1: $0.40 × 60 = $24.00. Sora 2 Pro: $0.70 × 60 = $42.00."],
      limitations: ["Los modelos difieren en calidad, movimiento, audio y fidelidad al prompt: el más barato no siempre es el mejor valor.", "No todos los modelos ofrecen todas las resoluciones; las combinaciones no disponibles se listan aparte en lugar de estimarse.", "Las filas por créditos dependen del plan que compres; el costo real cambia con recargas, facturación anual o créditos sin usar.", "No se incluyen descuentos por lote, planes gratuitos, impuestos ni contratos empresariales."],
      faq: [
        { q: "¿Cuánto cuesta un segundo de video con IA?", a: "Los precios de API de nuestro conjunto de datos van de unos $0.05 a $0.70 por segundo generado según modelo y resolución. Usa la calculadora para ver la cifra exacta de tu caso." },
        { q: "¿Cuál es el modelo de video con IA más barato?", a: "En 720p y 1080p las tarifas por segundo más bajas suelen ser Veo 3.1 Lite y Runway Gen-4 Turbo, pero la calidad varía mucho. Revisa el ranking para tu resolución." },
        { q: "¿Por qué incluir un porcentaje de repeticiones?", a: "La mayoría de las generaciones no sirven al primer intento. Un 30% significa pagar 30% más metraje del que conservas, algo realista al trabajar con prompts." },
        { q: "¿Son precios oficiales?", a: "Cada precio enlaza a su fuente. Donde no pudimos leer la página oficial directamente, marcamos la entrada como secundaria y mostramos la página por la que se leyó." },
        { q: "¿Con qué frecuencia se actualizan los precios?", a: "La fecha 'Precios actualizados' muestra la última verificación. Los proveedores cambian precios seguido, confirma siempre en la fuente antes de comprometer presupuesto." },
      ],
    },
  },
  veo: {
    en: {
      nav: "Veo cost per second", keyword: "veo cost per second",
      title: "Veo Cost Per Second Calculator — Veo 3.1, Fast and Lite",
      description: "Calculate Veo 3.1, Veo 3.1 Fast and Veo 3.1 Lite cost per second, per clip and per minute at 720p, 1080p or 4K. Includes a reverse budget-to-seconds mode.",
      h1: "Veo Cost Per Second Calculator", blurb: "Veo 3.1, Fast and Lite priced per second, clip and minute.",
      lead: "Pick a Veo variant and resolution to see the cost per second, per clip and per finished minute — or enter a budget to see how many seconds it buys.",
      formula: "Cost = Veo price per second × clip seconds × clips × (1 + retake %)",
      formulaNote: "Cost per finished minute divides the total by the footage you keep (clip seconds × clips ÷ 60). Budget mode inverts it: seconds = budget ÷ (price per second × (1 + retake %)).",
      example: ["Veo 3.1 Fast at 1080p costs $0.12 per second. You generate 5 clips of 8 seconds and expect 30% retakes.", "$0.12 × 8 × 5 = $4.80, then × 1.30 = $6.24 total. You keep 40 seconds of footage, so each usable second really costs $6.24 ÷ 40 = $0.156."],
      limitations: ["Prices reflect the Gemini API per-second rate; Veo through Vertex AI, Google AI subscriptions or resellers can differ.", "Check the source for how audio is billed; the tool uses the published per-second rate.", "Veo 3.1 Lite has no published 4K price, so that combination is shown as unavailable.", "Retake rate is your estimate; real rates vary with prompt quality and scene complexity."],
      faq: [
        { q: "How much does Veo 3.1 cost per second?", a: "In our data Veo 3.1 is $0.40 per second at 720p and 1080p and $0.60 at 4K. Veo 3.1 Fast and Lite are cheaper — see the table in the tool." },
        { q: "How much is a Veo 3.1 clip?", a: "Multiply the clip length by the per-second price. An 8-second Veo 3.1 clip at 1080p is 8 × $0.40 = $3.20 before retakes." },
        { q: "Is Veo 3.1 Fast worth it?", a: "Fast costs a fraction of standard Veo 3.1 per second, so it suits drafts and iteration. Many creators draft on Fast and render finals on the standard model." },
        { q: "Does 4K cost more?", a: "Yes. 4K is published at $0.60/s for Veo 3.1 and $0.30/s for Fast, higher than 1080p." },
        { q: "Where do these prices come from?", a: "The Google Gemini API pricing page is the source of record; the page is linked below with the date each price was last verified." },
      ],
    },
    es: {
      nav: "Costo por segundo de Veo", keyword: "costo por segundo veo",
      title: "Calculadora de costo por segundo de Veo — Veo 3.1, Fast y Lite",
      description: "Calcula el costo de Veo 3.1, Veo 3.1 Fast y Veo 3.1 Lite por segundo, por clip y por minuto en 720p, 1080p o 4K. Incluye modo inverso de presupuesto a segundos.",
      h1: "Calculadora de costo por segundo de Veo", blurb: "Veo 3.1, Fast y Lite por segundo, clip y minuto.",
      lead: "Elige una variante de Veo y la resolución para ver el costo por segundo, por clip y por minuto terminado, o ingresa un presupuesto para ver cuántos segundos compra.",
      formula: "Costo = precio de Veo por segundo × segundos del clip × clips × (1 + % de repeticiones)",
      formulaNote: "El costo por minuto terminado divide el total entre el metraje que conservas (segundos del clip × clips ÷ 60). El modo presupuesto lo invierte: segundos = presupuesto ÷ (precio por segundo × (1 + % de repeticiones)).",
      example: ["Veo 3.1 Fast en 1080p cuesta $0.12 por segundo. Generas 5 clips de 8 segundos y esperas 30% de repeticiones.", "$0.12 × 8 × 5 = $4.80, luego × 1.30 = $6.24 en total. Conservas 40 segundos, así que cada segundo útil cuesta $6.24 ÷ 40 = $0.156."],
      limitations: ["Los precios reflejan la tarifa por segundo de la API de Gemini; Veo en Vertex AI, suscripciones de Google AI o revendedores puede diferir.", "Revisa la fuente para saber cómo se factura el audio; la herramienta usa la tarifa por segundo publicada.", "Veo 3.1 Lite no tiene precio 4K publicado, por eso esa combinación aparece como no disponible.", "El porcentaje de repeticiones es una estimación tuya; varía con la calidad del prompt y la complejidad de la escena."],
      faq: [
        { q: "¿Cuánto cuesta Veo 3.1 por segundo?", a: "En nuestros datos Veo 3.1 cuesta $0.40 por segundo en 720p y 1080p y $0.60 en 4K. Veo 3.1 Fast y Lite son más baratos: mira la tabla de la herramienta." },
        { q: "¿Cuánto cuesta un clip de Veo 3.1?", a: "Multiplica la duración por el precio por segundo. Un clip de 8 segundos en 1080p con Veo 3.1 cuesta 8 × $0.40 = $3.20 sin repeticiones." },
        { q: "¿Vale la pena Veo 3.1 Fast?", a: "Fast cuesta una fracción de Veo 3.1 estándar por segundo, ideal para borradores e iteración. Muchos creadores iteran en Fast y renderizan finales en el modelo estándar." },
        { q: "¿El 4K cuesta más?", a: "Sí. El 4K se publica a $0.60/s en Veo 3.1 y $0.30/s en Fast, más que en 1080p." },
        { q: "¿De dónde salen estos precios?", a: "La página de precios de la API de Gemini es la fuente de referencia; abajo la enlazamos con la fecha de la última verificación de cada precio." },
      ],
    },
  },
  kling: {
    en: {
      nav: "Kling credits", keyword: "kling credits calculator",
      title: "Kling Credits Calculator — Credits and USD per Video",
      description: "Free Kling credits calculator: convert clip length, resolution and audio into Kling 3.0 credits and dollars, with your own plan price or the published top-up rate.",
      h1: "Kling Credits Calculator", blurb: "Turn seconds into Kling credits and dollars.",
      lead: "Choose a Kling 3.0 quality tier, set your clip length and count, and see how many credits you need and what they cost in USD.",
      formula: "Credits = credits per second × seconds × clips × (1 + retake %)   ·   USD = credits × price per credit",
      formulaNote: "Published Kling 3.0 rates used here: 6 credits/s (720p, no audio), 12 credits/s (1080p, native audio) and 30 credits/s (4K). Price per credit defaults to the published top-up rate of $1 per 66 credits; you can instead enter your own plan price and credit allowance.",
      example: ["You want 4 clips of 10 seconds at 1080p with native audio (12 credits per second).", "12 × 10 × 4 = 480 credits. At the top-up rate of $1 per 66 credits that is 480 ÷ 66 ≈ $7.27. If your plan gives you 3,000 credits for $37, each credit is $0.0123 and the same job costs about $5.92."],
      limitations: ["Only the three published credit rates are built in; other mode and input combinations (for example video input or motion control) may cost different amounts.", "Monthly credit allowances per Kling plan were not confirmed from an official page, so enter your own plan values for subscription math.", "Kling's separate developer API is billed in dollars per second, not credits; see the comparison tool.", "Credits can expire; unused credits make the real cost per video higher."],
      faq: [
        { q: "How many credits does a Kling video cost?", a: "At the published Kling 3.0 rates a 5-second 720p clip without audio is 30 credits and a 5-second 1080p clip with native audio is 60 credits." },
        { q: "How much is one Kling credit worth?", a: "At the published top-up rate of $1 per 66 credits, one credit is about $0.0152. Subscription credits are usually cheaper per credit." },
        { q: "Does native audio cost more?", a: "Yes. The published 1080p rate with native audio is 12 credits per second compared with 6 credits at 720p without audio." },
        { q: "What does 4K cost on Kling?", a: "The published native 4K rate is 30 credits per second, so a 5-second 4K clip is 150 credits." },
        { q: "Is Kling credits pricing the same as the Kling API?", a: "No. The consumer app uses credits; the developer API is priced in USD per second. The comparison calculator shows both." },
      ],
    },
    es: {
      nav: "Créditos de Kling", keyword: "calculadora créditos kling",
      title: "Calculadora de créditos de Kling — créditos y USD por video",
      description: "Calculadora gratuita de créditos de Kling: convierte duración, resolución y audio en créditos y dólares de Kling 3.0, con el precio de tu plan o la tarifa de recarga publicada.",
      h1: "Calculadora de créditos de Kling", blurb: "Convierte segundos en créditos y dólares de Kling.",
      lead: "Elige un nivel de calidad de Kling 3.0, define duración y cantidad de clips, y mira cuántos créditos necesitas y cuánto cuestan en USD.",
      formula: "Créditos = créditos por segundo × segundos × clips × (1 + % de repeticiones)   ·   USD = créditos × precio por crédito",
      formulaNote: "Tarifas publicadas de Kling 3.0 usadas aquí: 6 créditos/s (720p, sin audio), 12 créditos/s (1080p, audio nativo) y 30 créditos/s (4K). El precio por crédito usa por defecto la recarga publicada de $1 por 66 créditos; también puedes ingresar el precio y los créditos de tu plan.",
      example: ["Quieres 4 clips de 10 segundos en 1080p con audio nativo (12 créditos por segundo).", "12 × 10 × 4 = 480 créditos. Con la recarga de $1 por 66 créditos son 480 ÷ 66 ≈ $7.27. Si tu plan da 3,000 créditos por $37, cada crédito vale $0.0123 y el mismo trabajo cuesta unos $5.92."],
      limitations: ["Solo incluimos las tres tarifas de créditos publicadas; otras combinaciones (por ejemplo video de entrada o control de movimiento) pueden costar distinto.", "No pudimos confirmar en una página oficial los créditos mensuales de cada plan de Kling, así que ingresa los valores de tu plan.", "La API para desarrolladores de Kling se cobra en dólares por segundo, no en créditos; mira la herramienta de comparación.", "Los créditos pueden vencer; los créditos sin usar elevan el costo real por video."],
      faq: [
        { q: "¿Cuántos créditos cuesta un video de Kling?", a: "Con las tarifas publicadas de Kling 3.0, un clip de 5 segundos en 720p sin audio son 30 créditos y uno de 5 segundos en 1080p con audio nativo son 60 créditos." },
        { q: "¿Cuánto vale un crédito de Kling?", a: "Con la recarga publicada de $1 por 66 créditos, un crédito vale unos $0.0152. Los créditos de suscripción suelen salir más baratos." },
        { q: "¿El audio nativo cuesta más?", a: "Sí. La tarifa publicada en 1080p con audio nativo es 12 créditos por segundo frente a 6 créditos en 720p sin audio." },
        { q: "¿Cuánto cuesta el 4K en Kling?", a: "La tarifa publicada de 4K nativo es 30 créditos por segundo, así que un clip de 5 segundos en 4K son 150 créditos." },
        { q: "¿El precio por créditos es igual al de la API de Kling?", a: "No. La app usa créditos; la API para desarrolladores se cobra en USD por segundo. La calculadora de comparación muestra ambos." },
      ],
    },
  },
  budget: {
    en: {
      nav: "Budget planner", keyword: "ai video budget planner",
      title: "AI Video Budget Planner — Cost a Multi-Scene Project",
      description: "Plan an AI video project scene by scene: pick a model, resolution, length and takes per scene and get a total budget with contingency. Free, no login.",
      h1: "AI Video Budget Planner", blurb: "Budget a whole project scene by scene, with contingency.",
      lead: "Add your scenes, choose a model and resolution for each, set how many takes you expect, and get a per-scene and total budget.",
      formula: "Scene cost = price per second × scene seconds × takes   ·   Total = Σ scenes × (1 + contingency %)",
      formulaNote: "'Takes' is how many times you expect to generate the scene before you are happy with it (1 = first try). Contingency covers surprises such as extra scenes or a model switch.",
      example: ["A 23-second spot with three scenes and 10% contingency.", "Scene 1: Veo 3.1 Fast 1080p, 8 s × 3 takes = $0.12 × 24 = $2.88. Scene 2: Sora 2 720p, 5 s × 2 takes = $0.10 × 10 = $1.00. Scene 3: Runway Gen-4.5, 10 s × 1 take = $1.20. Subtotal $5.08, plus 10% = $5.59."],
      limitations: ["Mixing models is realistic but each has its own look; budget editing time to make scenes match.", "Does not include voice, music, editing, upscaling or stock assets.", "Takes are your estimate; complex scenes often need more.", "Credit-based models use an effective rate that depends on the plan you buy."],
      faq: [
        { q: "How do I budget an AI video project?", a: "Break it into scenes, estimate seconds and takes per scene, price each with the model you plan to use, then add 10–25% contingency." },
        { q: "How many takes should I plan for?", a: "Two to four is common for prompt-driven scenes. Simple establishing shots may need one; character or motion-heavy scenes often need more." },
        { q: "Can I use different models per scene?", a: "Yes. Pick a model for each scene — for example a cheap fast model for drafts and a premium model for hero shots." },
        { q: "What contingency percentage is reasonable?", a: "10–20% for a defined script, up to 30% when the concept is still changing." },
        { q: "Does this include audio?", a: "It uses the per-second rate without separately priced audio. Use the cost calculator to see audio-specific pricing where it exists." },
      ],
    },
    es: {
      nav: "Planificador de presupuesto", keyword: "planificador presupuesto video ia",
      title: "Planificador de presupuesto de video con IA — proyectos con varias escenas",
      description: "Planifica un proyecto de video con IA escena por escena: elige modelo, resolución, duración y tomas y obtén el presupuesto total con contingencia. Gratis, sin registro.",
      h1: "Planificador de presupuesto de video con IA", blurb: "Presupuesta un proyecto completo escena por escena.",
      lead: "Agrega tus escenas, elige modelo y resolución para cada una, define cuántas tomas esperas y obtén el presupuesto por escena y total.",
      formula: "Costo de escena = precio por segundo × segundos de la escena × tomas   ·   Total = Σ escenas × (1 + % de contingencia)",
      formulaNote: "'Tomas' es cuántas veces esperas generar la escena hasta quedar conforme (1 = a la primera). La contingencia cubre imprevistos como escenas extra o cambio de modelo.",
      example: ["Un spot de 23 segundos con tres escenas y 10% de contingencia.", "Escena 1: Veo 3.1 Fast 1080p, 8 s × 3 tomas = $0.12 × 24 = $2.88. Escena 2: Sora 2 720p, 5 s × 2 tomas = $0.10 × 10 = $1.00. Escena 3: Runway Gen-4.5, 10 s × 1 toma = $1.20. Subtotal $5.08, más 10% = $5.59."],
      limitations: ["Mezclar modelos es realista pero cada uno tiene su estilo; reserva tiempo de edición para unificar escenas.", "No incluye voz, música, edición, escalado ni recursos de stock.", "Las tomas son tu estimación; las escenas complejas suelen necesitar más.", "Los modelos por créditos usan una tarifa efectiva que depende del plan que compres."],
      faq: [
        { q: "¿Cómo presupuesto un proyecto de video con IA?", a: "Divídelo en escenas, estima segundos y tomas por escena, calcula cada una con el modelo que usarás y suma 10–25% de contingencia." },
        { q: "¿Cuántas tomas debo planear?", a: "Entre dos y cuatro es común en escenas guiadas por prompt. Planos de establecimiento simples pueden necesitar una; escenas con personajes o mucho movimiento, más." },
        { q: "¿Puedo usar modelos distintos por escena?", a: "Sí. Elige un modelo por escena, por ejemplo uno rápido y barato para borradores y uno premium para los planos principales." },
        { q: "¿Qué porcentaje de contingencia es razonable?", a: "10–20% con guion definido, hasta 30% si el concepto aún cambia." },
        { q: "¿Incluye audio?", a: "Usa la tarifa por segundo sin audio facturado aparte. Usa la calculadora de costos para ver precios con audio donde existan." },
      ],
    },
  },
  subapi: {
    en: {
      nav: "Subscription vs API", keyword: "ai video subscription vs api cost",
      title: "AI Video Subscription vs API Cost — Which Is Cheaper?",
      description: "Compare AI video subscription plans against pay-per-second API pricing. Enter your monthly seconds and see the cheapest option and break-even point for Runway, Luma or your own plan.",
      h1: "AI Video Subscription vs API Cost", blurb: "Find out when a plan beats pay-per-second API pricing.",
      lead: "Enter how many seconds of video you generate per month. We compare the cheapest combination of subscription plans against the pay-as-you-go API price.",
      formula: "Subscription = ⌈seconds × credits per second ÷ plan credits⌉ × plan price   ·   API = seconds × API price per second",
      formulaNote: "For each plan we buy as many copies as needed to cover your credits and compare the total with the API. Break-even is reached when a plan's price equals the API cost of the seconds it includes.",
      example: ["Runway Gen-4.5 costs 12 credits per second; the API charges $0.12 per second. At 300 seconds per month you need 3,600 credits.", "API: 300 × $0.12 = $36. Cheapest annual-billed plan combination: 2 × Pro (2,250 credits each, $28) = $56. The API wins by $20. At 750 seconds you need 9,000 credits: 1 × Max at $76 beats the API's $90 by $14."],
      limitations: ["Only Runway and Luma have both a published plan credit rate and an API rate in our data; use 'Custom' for any other provider.", "Buying several copies of a plan may not be allowed by every provider; treat it as a pricing comparison.", "Plans bundle extra features (editing tools, storage, commercial rights) that the API does not.", "Unused credits usually expire monthly, so a plan only wins when you actually use most of it."],
      faq: [
        { q: "Is a subscription or API cheaper for AI video?", a: "It depends on volume. Runway's API credit costs $0.01, while subscription credits cost more per credit, so low and medium volume is often cheaper via API. Large plans can win at high usage." },
        { q: "What is the break-even point?", a: "The monthly seconds at which a plan costs the same as the API. The tool shows each plan's price, included seconds and effective cost per second." },
        { q: "Do subscription credits roll over?", a: "On most plans unused credits reset monthly; some top tiers allow limited rollover. Check the provider's page." },
        { q: "Why does the API need engineering work?", a: "The API is billed per second but you must integrate it or use a third-party tool. Plans come with a ready-made editor." },
        { q: "Can I compare a provider that isn't listed?", a: "Yes. Choose 'Custom' and enter plan price, plan credits, credits per second and the API price per second." },
      ],
    },
    es: {
      nav: "Suscripción vs API", keyword: "suscripción vs api video ia costo",
      title: "Costo de video con IA: suscripción vs API — ¿cuál es más barato?",
      description: "Compara planes de suscripción de video con IA contra el precio por segundo de la API. Ingresa tus segundos mensuales y ve la opción más barata y el punto de equilibrio en Runway, Luma o tu propio plan.",
      h1: "Costo de video con IA: suscripción vs API", blurb: "Descubre cuándo un plan supera el precio por segundo de la API.",
      lead: "Ingresa cuántos segundos de video generas al mes. Comparamos la combinación más barata de planes contra el precio de la API por uso.",
      formula: "Suscripción = ⌈segundos × créditos por segundo ÷ créditos del plan⌉ × precio del plan   ·   API = segundos × precio de la API por segundo",
      formulaNote: "Para cada plan compramos tantas copias como hagan falta para cubrir tus créditos y comparamos el total con la API. El punto de equilibrio llega cuando el precio del plan iguala el costo en API de los segundos que incluye.",
      example: ["Runway Gen-4.5 cuesta 12 créditos por segundo; la API cobra $0.12 por segundo. Con 300 segundos al mes necesitas 3,600 créditos.", "API: 300 × $0.12 = $36. Mejor combinación de planes con facturación anual: 2 × Pro (2,250 créditos c/u, $28) = $56. Gana la API por $20. Con 750 segundos necesitas 9,000 créditos: 1 × Max a $76 supera los $90 de la API por $14."],
      limitations: ["Solo Runway y Luma tienen en nuestros datos tarifa de créditos del plan y tarifa de API; usa 'Personalizado' para otros proveedores.", "Comprar varias copias de un plan puede no estar permitido en todos los proveedores; tómalo como comparación de precios.", "Los planes incluyen extras (herramientas de edición, almacenamiento, derechos comerciales) que la API no.", "Los créditos sin usar suelen vencer cada mes, así que un plan solo gana si usas casi todo."],
      faq: [
        { q: "¿Es más barato suscripción o API para video con IA?", a: "Depende del volumen. El crédito de la API de Runway cuesta $0.01, mientras que los créditos de suscripción cuestan más, así que con volumen bajo o medio suele ser más barata la API. Los planes grandes pueden ganar con uso alto." },
        { q: "¿Qué es el punto de equilibrio?", a: "Los segundos mensuales en que un plan cuesta lo mismo que la API. La herramienta muestra precio, segundos incluidos y costo efectivo por segundo de cada plan." },
        { q: "¿Los créditos de suscripción se acumulan?", a: "En la mayoría de planes los créditos sin usar se reinician cada mes; algunos niveles altos permiten acumulación limitada. Revisa la página del proveedor." },
        { q: "¿Por qué la API requiere trabajo técnico?", a: "La API se cobra por segundo, pero debes integrarla o usar una herramienta de terceros. Los planes incluyen un editor listo para usar." },
        { q: "¿Puedo comparar un proveedor que no aparece?", a: "Sí. Elige 'Personalizado' e ingresa precio del plan, créditos del plan, créditos por segundo y precio de la API por segundo." },
      ],
    },
  },
};

export const UI = {
  en: {
    home: "Home", tools: "Tools", pro: "Pro", language: "Español", skip: "Skip to content",
    pricesUpdated: "Prices updated", sources: "Sources", howCalc: "How it's calculated", example: "Worked example", limits: "Limitations", faq: "Frequently asked questions", moreTools: "More free tools", advert: "Advertisement",
    heroTitle: "Know what your AI video costs before you generate it", heroSub: "Free calculators comparing Veo, Kling, Sora, Runway, Luma, Pika and Higgsfield — with sources and the date every price was checked.",
    openTool: "Open tool", footerNote: "Independent estimates from public pricing pages. Not affiliated with any provider.",
    about: "About", contact: "Contact", privacy: "Privacy", terms: "Terms",
    // tool UI
    secondsPerClip: "Seconds per clip", clips: "Number of clips", resolution: "Resolution", audio: "Native audio (where priced separately)", retakes: "Retakes", model: "Model", perSecond: "per second", perClip: "per clip", total: "Total", cheapest: "Cheapest", notAvailable: "Not available at this resolution", credit: "credit-based", api: "API", secondary: "secondary source", official: "official",
    perMinute: "per finished minute", variant: "Variant", budget: "Budget (USD)", secondsBuys: "Seconds this budget buys", allVariants: "All Veo variants at this resolution",
    tier: "Quality tier", creditsNeeded: "Credits needed", usdCost: "Cost in USD", priceBasis: "Price per credit", topUp: "Published top-up ($1 / 66 credits)", ownPlan: "My plan", planPrice: "Plan price (USD)", planCredits: "Plan credits", apiEquivalent: "Kling API equivalent",
    scenes: "Scenes", addScene: "Add scene", remove: "Remove", sceneName: "Scene", seconds: "Seconds", takes: "Takes", contingency: "Contingency", subtotal: "Subtotal", grandTotal: "Project total", finalFootage: "Final footage", copy: "Copy summary", copied: "Copied!",
    monthlySeconds: "Seconds generated per month", provider: "Provider / model", billing: "Billing", annual: "Annual", monthly: "Monthly", custom: "Custom", creditsPerSecond: "Credits per second", apiPrice: "API price per second (USD)", planLabel: "Plan", included: "Included seconds", effective: "Effective $/s", cost: "Monthly cost", apiCost: "API cost", winnerApi: "API is cheaper", winnerSub: "Subscription is cheaper", youSave: "You save", using: "Cheapest plan mix", unused: "unused credits",
    proTitle: "Join the Pro waitlist", proSub: "Saved projects, price-change alerts and CSV export. Leave your email and we'll tell you when Pro opens.", email: "Email address", join: "Join waitlist", joined: "You're on the list. Thank you!", close: "Close", invalidEmail: "Please enter a valid email.", error: "Something went wrong. Please try again.",
    send: "Send message", name: "Your name", message: "Message", sent: "Message received — thank you.",
  },
  es: {
    home: "Inicio", tools: "Herramientas", pro: "Pro", language: "English", skip: "Saltar al contenido",
    pricesUpdated: "Precios actualizados", sources: "Fuentes", howCalc: "Cómo se calcula", example: "Ejemplo resuelto", limits: "Limitaciones", faq: "Preguntas frecuentes", moreTools: "Más herramientas gratuitas", advert: "Publicidad",
    heroTitle: "Sabe cuánto cuesta tu video con IA antes de generarlo", heroSub: "Calculadoras gratuitas que comparan Veo, Kling, Sora, Runway, Luma, Pika y Higgsfield, con fuentes y la fecha en que se verificó cada precio.",
    openTool: "Abrir herramienta", footerNote: "Estimaciones independientes a partir de páginas públicas de precios. Sin afiliación con ningún proveedor.",
    about: "Acerca de", contact: "Contacto", privacy: "Privacidad", terms: "Términos",
    secondsPerClip: "Segundos por clip", clips: "Cantidad de clips", resolution: "Resolución", audio: "Audio nativo (donde se cobra aparte)", retakes: "Repeticiones", model: "Modelo", perSecond: "por segundo", perClip: "por clip", total: "Total", cheapest: "Más barato", notAvailable: "No disponible en esta resolución", credit: "por créditos", api: "API", secondary: "fuente secundaria", official: "oficial",
    perMinute: "por minuto terminado", variant: "Variante", budget: "Presupuesto (USD)", secondsBuys: "Segundos que compra este presupuesto", allVariants: "Todas las variantes de Veo en esta resolución",
    tier: "Nivel de calidad", creditsNeeded: "Créditos necesarios", usdCost: "Costo en USD", priceBasis: "Precio por crédito", topUp: "Recarga publicada ($1 / 66 créditos)", ownPlan: "Mi plan", planPrice: "Precio del plan (USD)", planCredits: "Créditos del plan", apiEquivalent: "Equivalente en API de Kling",
    scenes: "Escenas", addScene: "Agregar escena", remove: "Quitar", sceneName: "Escena", seconds: "Segundos", takes: "Tomas", contingency: "Contingencia", subtotal: "Subtotal", grandTotal: "Total del proyecto", finalFootage: "Metraje final", copy: "Copiar resumen", copied: "¡Copiado!",
    monthlySeconds: "Segundos generados al mes", provider: "Proveedor / modelo", billing: "Facturación", annual: "Anual", monthly: "Mensual", custom: "Personalizado", creditsPerSecond: "Créditos por segundo", apiPrice: "Precio de API por segundo (USD)", planLabel: "Plan", included: "Segundos incluidos", effective: "$/s efectivo", cost: "Costo mensual", apiCost: "Costo en API", winnerApi: "La API es más barata", winnerSub: "La suscripción es más barata", youSave: "Ahorras", using: "Mejor combinación de planes", unused: "créditos sin usar",
    proTitle: "Únete a la lista de espera Pro", proSub: "Proyectos guardados, alertas de cambios de precio y exportación CSV. Deja tu correo y te avisamos cuando abra Pro.", email: "Correo electrónico", join: "Unirme a la lista", joined: "¡Estás en la lista! Gracias.", close: "Cerrar", invalidEmail: "Ingresa un correo válido.", error: "Algo salió mal. Inténtalo de nuevo.",
    send: "Enviar mensaje", name: "Tu nombre", message: "Mensaje", sent: "Mensaje recibido, gracias.",
  },
} as const;
export type Dict = (typeof UI)[Locale];

type Section = { h: string; p: string[] };
export const INFO: Record<InfoId, Record<Locale, { title: string; description: string; sections: Section[] }>> = {
  about: {
    en: { title: "About AI Video Cost Planner", description: "Why AI Video Cost Planner exists and how its prices are collected and verified.", sections: [
      { h: "What this site is", p: ["AI Video Cost Planner is a set of free calculators that estimate what it costs to generate video with AI models such as Veo, Kling, Sora, Runway, Luma, Pika and Higgsfield.", "Pricing for AI video is spread across API docs, credit tables and subscription pages that change often. We collect it in one place so creators, agencies and developers can budget before they generate."] },
      { h: "How prices are collected", p: ["Every price is read from a public provider page and stored with its source URL and the date we checked it. When an official page could not be read directly, we say so and show the secondary page the figure came from.", "We do not invent or extrapolate prices. If a model does not offer a resolution, the calculators show it as unavailable."] },
      { h: "Independence", p: ["This site is independent and is not affiliated with, endorsed by, or sponsored by any provider named here. Product names belong to their owners."] },
    ] },
    es: { title: "Acerca de AI Video Cost Planner", description: "Por qué existe AI Video Cost Planner y cómo se recopilan y verifican sus precios.", sections: [
      { h: "Qué es este sitio", p: ["AI Video Cost Planner es un conjunto de calculadoras gratuitas que estiman cuánto cuesta generar video con modelos de IA como Veo, Kling, Sora, Runway, Luma, Pika y Higgsfield.", "Los precios del video con IA están repartidos entre documentación de API, tablas de créditos y páginas de suscripción que cambian seguido. Los reunimos en un solo lugar para que creadores, agencias y desarrolladores presupuesten antes de generar."] },
      { h: "Cómo se recopilan los precios", p: ["Cada precio se lee de una página pública del proveedor y se guarda con su URL de origen y la fecha en que lo revisamos. Cuando no pudimos leer la página oficial directamente, lo indicamos y mostramos la página secundaria de donde salió la cifra.", "No inventamos ni extrapolamos precios. Si un modelo no ofrece una resolución, las calculadoras la muestran como no disponible."] },
      { h: "Independencia", p: ["Este sitio es independiente y no está afiliado, respaldado ni patrocinado por ningún proveedor mencionado. Los nombres de producto pertenecen a sus dueños."] },
    ] },
  },
  contact: {
    en: { title: "Contact", description: "Contact AI Video Cost Planner to report a price change or send feedback.", sections: [
      { h: "Report a price or send feedback", p: ["Found a price that changed, a missing model or a bug? Send us a message with a link to the source and we'll review it.", "We read every message but may not reply to each one."] },
    ] },
    es: { title: "Contacto", description: "Contacta a AI Video Cost Planner para reportar un cambio de precio o enviar comentarios.", sections: [
      { h: "Reporta un precio o envía comentarios", p: ["¿Encontraste un precio que cambió, un modelo faltante o un error? Envíanos un mensaje con el enlace a la fuente y lo revisaremos.", "Leemos todos los mensajes, aunque quizá no respondamos a cada uno."] },
    ] },
  },
  privacy: {
    en: { title: "Privacy Policy", description: "How AI Video Cost Planner handles data, cookies, advertising and waitlist emails.", sections: [
      { h: "Summary", p: ["The calculators run in your browser. The numbers you type into them are not sent to our servers or stored.", "Last updated: October 1, 2026."] },
      { h: "Information we collect", p: ["If you join the Pro waitlist or use the contact form we receive the email address, name and message you submit, which we use only to respond and to tell you when Pro is available. You can ask us to delete it at any time using the contact page.", "Like most sites, our hosting provider (Vercel) may process technical data such as IP address and request logs to deliver and secure the site."] },
      { h: "Cookies and advertising", p: ["We plan to show ads served by Google AdSense. When ads are enabled, Google and its partners may use cookies or similar technologies to serve and measure ads, including personalized ads where permitted. You can manage ad personalization at adssettings.google.com. Where required by law, we will ask for your consent before ads that use cookies are shown.", "We may also add privacy-friendly analytics to understand which tools are used."] },
      { h: "Third-party links", p: ["We link to provider pricing pages. Those sites have their own privacy practices."] },
      { h: "Your rights", p: ["Depending on where you live you may have the right to access, correct or delete your personal data. Contact us through the contact page to make a request."] },
    ] },
    es: { title: "Política de privacidad", description: "Cómo AI Video Cost Planner maneja datos, cookies, publicidad y correos de la lista de espera.", sections: [
      { h: "Resumen", p: ["Las calculadoras se ejecutan en tu navegador. Los números que ingresas no se envían a nuestros servidores ni se almacenan.", "Última actualización: 1 de octubre de 2026."] },
      { h: "Información que recopilamos", p: ["Si te unes a la lista de espera Pro o usas el formulario de contacto recibimos el correo, nombre y mensaje que envíes, y los usamos solo para responderte y avisarte cuando Pro esté disponible. Puedes pedirnos que los eliminemos en cualquier momento desde la página de contacto.", "Como la mayoría de sitios, nuestro proveedor de alojamiento (Vercel) puede procesar datos técnicos como la dirección IP y registros de solicitudes para entregar y proteger el sitio."] },
      { h: "Cookies y publicidad", p: ["Planeamos mostrar anuncios de Google AdSense. Cuando los anuncios estén activos, Google y sus socios pueden usar cookies o tecnologías similares para mostrar y medir anuncios, incluidos anuncios personalizados donde esté permitido. Puedes gestionar la personalización en adssettings.google.com. Donde la ley lo exija, pediremos tu consentimiento antes de mostrar anuncios que usen cookies.", "También podemos añadir analítica respetuosa con la privacidad para entender qué herramientas se usan."] },
      { h: "Enlaces de terceros", p: ["Enlazamos a páginas de precios de los proveedores. Esos sitios tienen sus propias prácticas de privacidad."] },
      { h: "Tus derechos", p: ["Según dónde vivas, puedes tener derecho a acceder, corregir o eliminar tus datos personales. Contáctanos desde la página de contacto para hacer una solicitud."] },
    ] },
  },
  terms: {
    en: { title: "Terms of Use", description: "Terms of use for AI Video Cost Planner.", sections: [
      { h: "Estimates only", p: ["The calculators provide estimates based on publicly listed prices. Providers can change prices at any time. Always confirm the price on the provider's own page before buying or committing budget.", "Last updated: October 1, 2026."] },
      { h: "No warranty", p: ["The site and its data are provided 'as is' without warranties of any kind. We are not liable for decisions made or costs incurred based on the information shown."] },
      { h: "Acceptable use", p: ["You may use the site for personal or business budgeting. Do not scrape it at a rate that harms availability or misrepresent our data as official provider pricing."] },
      { h: "Trademarks", p: ["Veo, Kling, Sora, Runway, Luma, Pika, Higgsfield and other names are trademarks of their respective owners and are used only to identify the products being priced."] },
      { h: "Changes", p: ["We may update these terms. Continued use of the site means you accept the updated terms."] },
    ] },
    es: { title: "Términos de uso", description: "Términos de uso de AI Video Cost Planner.", sections: [
      { h: "Solo estimaciones", p: ["Las calculadoras ofrecen estimaciones basadas en precios listados públicamente. Los proveedores pueden cambiar precios en cualquier momento. Confirma siempre el precio en la página del proveedor antes de comprar o comprometer presupuesto.", "Última actualización: 1 de octubre de 2026."] },
      { h: "Sin garantía", p: ["El sitio y sus datos se ofrecen 'tal cual', sin garantías de ningún tipo. No somos responsables de decisiones o costos derivados de la información mostrada."] },
      { h: "Uso aceptable", p: ["Puedes usar el sitio para presupuestos personales o de negocio. No lo extraigas a un ritmo que afecte su disponibilidad ni presentes nuestros datos como precios oficiales de un proveedor."] },
      { h: "Marcas", p: ["Veo, Kling, Sora, Runway, Luma, Pika, Higgsfield y otros nombres son marcas de sus respectivos dueños y se usan solo para identificar los productos cuyo precio se calcula."] },
      { h: "Cambios", p: ["Podemos actualizar estos términos. El uso continuo del sitio implica que aceptas los términos actualizados."] },
    ] },
  },
};
