import { MetadataRoute } from "next";
import { getDeadlines, getSubjects } from "@/lib/storage";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const deadlines = await getDeadlines();
  const subjects = await getSubjects();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/deadlines`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
  ];

  // Subject routes
  const subjectRoutes: MetadataRoute.Sitemap = subjects.map((subject) => ({
    url: `${baseUrl}/subjects/${subject.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Dynamic deadline routes
  const deadlineRoutes: MetadataRoute.Sitemap = deadlines.map((dl) => ({
    url: `${baseUrl}/deadlines/${dl.id}`,
    lastModified: new Date(dl.createdAt || dl.dueDate),
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [...staticRoutes, ...subjectRoutes, ...deadlineRoutes];
}
