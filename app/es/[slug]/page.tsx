import { allSlugs, renderSlug, slugMetadata } from "@/lib/pages";
export const dynamicParams = false;
export const generateStaticParams = () => allSlugs("es");
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { return slugMetadata("es", (await params).slug); }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { return renderSlug("es", (await params).slug); }
