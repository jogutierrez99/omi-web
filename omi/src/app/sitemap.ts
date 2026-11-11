import type { MetadataRoute } from "next";
import { SITE_URL } from "@/src/lib/site";

const publicPages = ["/", "/contacto", "/galeria", "/noticias"];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPages.map((path) => ({ url: new URL(path, SITE_URL).href }));
}
