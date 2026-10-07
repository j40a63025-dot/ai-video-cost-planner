import { BlogPost, blogSlugs, postMetadata } from "@/lib/blog-pages";
export const dynamicParams = false;
export const generateStaticParams = () => blogSlugs("es");
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { return postMetadata("es", (await params).slug); }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { return <BlogPost l="es" slug={(await params).slug} />; }
