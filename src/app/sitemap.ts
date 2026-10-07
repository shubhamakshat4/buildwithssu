import type { MetadataRoute } from "next";
import { SITE } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE.url}/projects`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE.url}/collaborate`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
  ];
}
