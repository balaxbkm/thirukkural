import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Kural Thedal (குறள் தேடல்) — Search & Browse All 1330 Kurals",
    description:
        "Search and filter all 1330 Thirukkural couplets by Paal, Iyal, Adhigaram, verse number, Tamil keywords, or English meaning.",
    alternates: {
        canonical: "/browse",
    },
};

export default function BrowseLayout({ children }: { children: React.ReactNode }) {
    return children;
}
