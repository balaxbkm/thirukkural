"use client";

import { useLanguage } from "@/lib/context/LanguageContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import PaalIcon from "@/components/PaalIcon";

interface FooterProps {
    adhigaramData?: Record<string, string[]>;
}

export default function Footer({ adhigaramData = {} }: FooterProps) {
    const { t, language } = useLanguage();
    const [paalData, setPaalData] = useState<Record<string, string[]>>({});

    useEffect(() => {
        // Hydration mismatch avoidance: Calculate random Adhigarams only on client
        if (Object.keys(adhigaramData).length === 0) return;

        const hour = new Date().getHours();
        const seed = new Date().setHours(hour, 0, 0, 0);

        // Simple random generator function seeded by hour
        const getRandom = (seed: number) => {
            const x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };

        const newPaalData: Record<string, string[]> = {};

        Object.entries(adhigaramData).forEach(([paal, adhigarams]) => {
            if (!adhigarams || adhigarams.length === 0) return;

            // Convert set to array if needed, though we expect string[]
            const list = Array.from(adhigarams);
            const selected: string[] = [];
            let currentSeed = seed + paal.length; // Diversify seed by paal name

            // Pick 5 unique random items
            const indices = new Set<number>();
            while (selected.length < 5 && indices.size < list.length) {
                const r = getRandom(currentSeed++);
                const idx = Math.floor(r * list.length);
                if (!indices.has(idx)) {
                    indices.add(idx);
                    selected.push(list[idx]);
                }
            }
            newPaalData[paal] = selected;
        });

        setPaalData(newPaalData);
    }, [adhigaramData]);

    // Ordered Paal keys for display (Tamil)
    const paalOrder = ["அறத்துப்பால்", "பொருட்பால்", "காமத்துப்பால்", "இன்பத்துப்பால்"];
    const sortedKeys = Object.keys(paalData).sort((a, b) => {
        return paalOrder.indexOf(a) - paalOrder.indexOf(b);
    });

    const getPaalTitle = (paal: string) => {
        if (language === 'ta') return paal;
        if (paal === "அறத்துப்பால்") return "Virtue (Arathuppaal)";
        if (paal === "பொருட்பால்") return "Wealth (Porutpaal)";
        if (paal === "காமத்துப்பால்" || paal === "இன்பத்துப்பால்") return "Love (Kamathuppaal)";
        return paal;
    };

    return (
        <footer
            style={{ background: 'var(--theme-footer-bg)' }}
            className="relative w-full mt-auto pt-6 sm:pt-10 lg:pt-16 pb-[max(env(safe-area-inset-bottom,0px),1.5rem)] sm:pb-12 overflow-hidden backdrop-blur-md border-t border-[var(--theme-badge-border)] transition-colors duration-300"
        >
            {/* Subtle ambient gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b dark:from-white/[0.02] to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                {/* Main Footer Grid: Hidden on mobile view, 4 Columns on Desktop */}
                <div className="hidden sm:flex flex-col lg:grid lg:grid-cols-4 gap-10 mb-8 sm:mb-12 border-b border-black/5 dark:border-white/10 pb-8 sm:pb-12">

                    {/* Column 1: Brand & Intro */}
                    <div className="flex flex-col items-start space-y-4 sm:space-y-6 lg:col-span-1">
                        <div className="flex items-center gap-2.5 sm:gap-3">
                            <div className="relative w-10 h-10 sm:w-12 sm:h-12 overflow-hidden rounded-full shadow-lg ring-2 ring-[var(--theme-badge-border)] shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/valluvar-logo-v2.jpg" alt="Thiruvalluvar Logo" className="w-full h-full object-cover" />
                            </div>
                            <span
                                className="inline-flex items-center font-mukta font-extrabold text-[17px] sm:text-[21px] tracking-normal leading-none text-[var(--theme-hero-from)] pr-2 sm:pr-3 overflow-visible"
                            >
                                திருக்குறள்
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed text-left">
                            {t.footer.description}
                        </p>
                    </div>

                    {/* Columns 2, 3, 4: Paals (Scrollable on Mobile) */}
                    <div className="flex flex-row overflow-x-auto lg:grid lg:grid-cols-3 lg:col-span-3 gap-6 lg:gap-10 pb-6 lg:pb-0 w-full lg:w-auto snap-x -mx-4 px-4 scroll-pl-4 lg:mx-0 lg:px-0 no-scrollbar">
                        {sortedKeys.map((paal) => (
                            <div key={paal} className="min-w-[75vw] sm:min-w-[350px] lg:min-w-0 flex flex-col items-start space-y-4 snap-start lg:snap-align-none flex-shrink-0 lg:flex-shrink">
                                <div className="flex items-center justify-between w-full border-b-2 border-[var(--theme-badge-border)] pb-2 gap-4">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className="p-1.5 rounded-lg bg-[var(--theme-badge-bg)] text-[var(--theme-primary)] shrink-0" aria-hidden="true">
                                            <PaalIcon paal={paal} />
                                        </span>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                                            {getPaalTitle(paal)}
                                        </h3>
                                    </div>
                                    <Link
                                        href={`/browse?paal=${paal}`}
                                        className="text-xs font-semibold text-[var(--theme-primary)] hover:text-[var(--theme-primary-hover)] transition-colors whitespace-nowrap flex items-center gap-1 group/link"
                                    >
                                        See all <span className="group-hover/link:translate-x-0.5 transition-transform">→</span>
                                    </Link>
                                </div>
                                <ul className="space-y-2 w-full">
                                    {paalData[paal].map((adhigaram, idx) => (
                                        <li key={idx} className="flex items-center justify-start group">
                                            <Link
                                                href={`/browse?paal=${paal}&adhigaram=${adhigaram}`}
                                                className="text-sm text-gray-600 dark:text-gray-400 hover:text-[var(--theme-primary)] transition-colors flex items-center gap-2"
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-dot)] opacity-60 group-hover:opacity-100 transition-opacity"></span>
                                                {adhigaram}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                        {sortedKeys.length === 0 && (
                            <div className="col-span-1 lg:col-span-3 text-center text-gray-500 min-w-full">
                                Loading chapters...
                            </div>
                        )}
                    </div>
                </div>

                {/* Traditional Kolam Emblem in Footer */}
                <div className="flex justify-center items-center my-3 sm:my-5" aria-hidden="true">
                    <div
                        className="w-12 h-12 sm:w-16 sm:h-16 transition-colors duration-500 opacity-40 dark:opacity-50 pointer-events-none select-none"
                        style={{
                            WebkitMaskImage: `url(/kolams/sikku-kolam.png)`,
                            WebkitMaskSize: "contain",
                            WebkitMaskRepeat: "no-repeat",
                            WebkitMaskPosition: "center",
                            maskImage: `url(/kolams/sikku-kolam.png)`,
                            maskSize: "contain",
                            maskRepeat: "no-repeat",
                            maskPosition: "center",
                            backgroundColor: "var(--theme-primary)",
                        }}
                    />
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col sm:grid sm:grid-cols-3 gap-2 sm:gap-4 items-center text-center sm:text-left">
                    {/* Copyright - Left: Hidden on mobile view, shown on desktop */}
                    <div className="hidden sm:block text-xs text-gray-400 dark:text-gray-500">
                        <p>© 2025 EDITION. ALL RIGHTS RESERVED.</p>
                    </div>

                    {/* Site Link - Center */}
                    <div className="flex flex-col items-center gap-1.5 text-center">
                        <a
                            href="https://ansverse.xyz"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] hover:opacity-80 transition-all hover:scale-105"
                        >
                            ansverse.xyz
                        </a>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed">
                            Kolam icons made by{" "}
                            <a
                                href="https://www.flaticon.com/authors/amoghdesign"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-[var(--theme-primary)] transition-colors"
                            >
                                amoghdesign
                            </a>
                            {", "}
                            <a
                                href="https://www.flaticon.com/authors/magnific"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-[var(--theme-primary)] transition-colors"
                            >
                                Magnific
                            </a>
                            {" & "}
                            <a
                                href="https://www.flaticon.com/authors/metami-septiana"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-[var(--theme-primary)] transition-colors"
                            >
                                Metami septiana
                            </a>
                            {" from "}
                            <a
                                href="https://www.flaticon.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-[var(--theme-primary)] transition-colors"
                            >
                                www.flaticon.com
                            </a>
                        </p>
                    </div>

                    {/* Made With - Right */}
                    <div className="flex justify-center sm:justify-end items-center gap-4">
                        <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                            Made with <span className="text-red-500 animate-pulse">❤</span> for Tamil
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
