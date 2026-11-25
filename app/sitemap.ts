import type { MetadataRoute } from "next";
import kuralsData from "@/data/thirukkural.json";
import { Kural } from "@/types/thirukkural";
import { getSiteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
    const siteUrl = getSiteUrl();
    const kurals = kuralsData as Kural[];
    const lastModified = new Date();

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${siteUrl}/`,
            lastModified,
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            url: `${siteUrl}/browse`,
            lastModified,
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${siteUrl}/about`,
            lastModified,
            changeFrequency: "monthly",
            priority: 0.7,
        },
    ];

    const kuralRoutes: MetadataRoute.Sitemap = kurals.map((k) => ({
        url: `${siteUrl}/kural/${k.number}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.8,
    }));

    return [...staticRoutes, ...kuralRoutes];
}
