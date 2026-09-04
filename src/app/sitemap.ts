import type { MetadataRoute } from "next";

import { publicSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = publicSiteUrl();
  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/privacy`, lastModified: new Date() },
  ];
}
