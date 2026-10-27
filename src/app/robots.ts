import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/subjects/", "/deadlines/"],
        disallow: ["/dashboard/", "/admin/", "/login", "/api/", "/403"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
