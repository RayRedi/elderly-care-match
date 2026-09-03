import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://127.0.0.1:4317";
  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/privacy`, lastModified: new Date() },
  ];
}
