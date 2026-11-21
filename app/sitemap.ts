import type { MetadataRoute } from "next";

const siteUrl = "https://www.kotakarigari.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/collections`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/contact`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${siteUrl}/shipping-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/return-exchange-refund-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms-%26-conditions`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
