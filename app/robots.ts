import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/api/",
        "/account/",
        "/cart/",
        "/checkout/",
        "/forgot-password/",
        "/login/",
        "/reset-password/",
        "/signup/",
        "/success/",
        "/test/",
        "/verify-email/",
        "/wishlist/",
      ],
    },
    sitemap: "https://www.kotakarigari.com/sitemap.xml",
    host: "https://www.kotakarigari.com",
  };
}
