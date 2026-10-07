import { BlogPost, blogSlugs, postMetadata } from "@/lib/blog-pages";
export const dynamicParams = false;
export const generateStaticParams = () => blogSlugs("en");
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { return postMetadata("en", (await params).slug); }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { return <BlogPost l="en" slug={(await params).slug} />; }
