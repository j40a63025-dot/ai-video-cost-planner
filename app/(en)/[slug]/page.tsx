import { allSlugs, renderSlug, slugMetadata } from "@/lib/pages";
export const dynamicParams = false;
export const generateStaticParams = () => allSlugs("en");
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { return slugMetadata("en", (await params).slug); }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { return renderSlug("en", (await params).slug); }
