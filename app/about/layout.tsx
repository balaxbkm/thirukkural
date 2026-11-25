import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Thirukkural (திருக்குறள் அறிமுகம்)",
    description:
        "Learn about Saint Thiruvalluvar, the tripartite structure of Thirukkural (Aram, Porul, Inbam), classical commentaries, and this modern offline explorer.",
    alternates: {
        canonical: "/about",
    },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return children;
}
