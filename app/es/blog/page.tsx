import { BlogIndex, blogIndexMetadata } from "@/lib/blog-pages";
export const metadata = blogIndexMetadata("es");
export default function Page() { return <BlogIndex l="es" />; }
