import { UI, type Locale } from "@/lib/content";

/** Reserved ad space: fixed height so layout never shifts when ads load. */
export function AdSlot({ locale, variant = "leaderboard" }: { locale: Locale; variant?: "leaderboard" | "rectangle" }) {
  const h = variant === "rectangle" ? "h-[250px]" : "h-[100px] md:h-[90px]";
  return (
    <aside aria-label={UI[locale].advert} className={`my-8 flex ${h} w-full items-center justify-center rounded-xl border border-dashed border-white/10 text-[11px] uppercase tracking-widest text-white/25`} data-ad-slot={variant}>
      {UI[locale].advert}
    </aside>
  );
}
