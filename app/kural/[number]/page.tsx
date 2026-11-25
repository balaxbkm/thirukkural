import type { Metadata } from "next";
import { notFound } from "next/navigation";
import kuralsData from "@/data/thirukkural.json";
import { Kural } from "@/types/thirukkural";
import { getSiteUrl } from "@/lib/seo";
import KuralDetailsClient from "./KuralDetailsClient";

const kurals = kuralsData as Kural[];

function findKural(numStr: string): Kural | undefined {
    const num = Number(numStr);
    if (!Number.isInteger(num) || num < 1 || num > 1330) return undefined;
    return kurals.find((k) => k.number === num);
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ number: string }>;
}): Promise<Metadata> {
    const { number } = await params;
    const kural = findKural(number);

    if (!kural) {
        return {
            title: "Kural Not Found",
        };
    }

    const siteUrl = getSiteUrl();
    const title = `குறள் ${kural.number} (${kural.adhigaram}) — Thirukkural ${kural.number}`;
    const couplet = `${kural.line1_ta} ${kural.line2_ta}`;
    const description = `${couplet} — ${kural.meaning_ta} | ${kural.meaning_en}`;

    return {
        title,
        description,
        keywords: [
            `Thirukkural ${kural.number}`,
            `Kural ${kural.number}`,
            `குறள் ${kural.number}`,
            kural.adhigaram,
            kural.iyal,
            kural.paal,
            "Thiruvalluvar",
            "திருவள்ளுவர்",
        ],
        alternates: {
            canonical: `/kural/${kural.number}`,
        },
        openGraph: {
            type: "article",
            url: `${siteUrl}/kural/${kural.number}`,
            title,
            description,
            images: [
                {
                    url: "/valluvar-logo-v2.jpg",
                    width: 512,
                    height: 512,
                    alt: `Thirukkural ${kural.number} - ${kural.adhigaram}`,
                },
            ],
        },
        twitter: {
            card: "summary",
            title,
            description,
            images: ["/valluvar-logo-v2.jpg"],
        },
    };
}

export default async function KuralPage({
    params,
}: {
    params: Promise<{ number: string }>;
}) {
    const { number } = await params;
    const kural = findKural(number);

    if (!kural) {
        notFound();
    }

    const siteUrl = getSiteUrl();
    const couplet = `${kural.line1_ta} ${kural.line2_ta}`;

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    {
                        "@type": "ListItem",
                        position: 1,
                        name: "Home",
                        item: siteUrl,
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: kural.paal,
                        item: `${siteUrl}/browse?paal=${encodeURIComponent(kural.paal)}`,
                    },
                    {
                        "@type": "ListItem",
                        position: 3,
                        name: kural.adhigaram,
                        item: `${siteUrl}/browse?paal=${encodeURIComponent(kural.paal)}&iyal=${encodeURIComponent(kural.iyal)}&adhigaram=${encodeURIComponent(kural.adhigaram)}`,
                    },
                    {
                        "@type": "ListItem",
                        position: 4,
                        name: `குறள் ${kural.number}`,
                        item: `${siteUrl}/kural/${kural.number}`,
                    },
                ],
            },
            {
                "@type": "CreativeWork",
                name: `Thirukkural ${kural.number} - ${kural.adhigaram}`,
                headline: couplet,
                text: couplet,
                description: `${kural.meaning_ta} ${kural.meaning_en}`,
                inLanguage: ["ta", "en"],
                author: {
                    "@type": "Person",
                    name: "Thiruvalluvar",
                },
                isPartOf: {
                    "@type": "Book",
                    name: "Thirukkural (திருக்குறள்)",
                },
                url: `${siteUrl}/kural/${kural.number}`,
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <KuralDetailsClient kural={kural} />
        </>
    );
}
