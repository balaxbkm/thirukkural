"use client";

import { useLanguage } from "@/lib/context/LanguageContext";
import Link from "next/link";
import { useState, useEffect } from "react";

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
        <footer className="relative w-full mt-auto pt-6 lg:pt-20 pb-10 overflow-hidden bg-slate-50 dark:bg-slate-950/30">
            {/* Decorative Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-50/50 dark:to-slate-900/50 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                {/* Main Footer Grid: 4 Columns on Desktop, Scrollable Row on Mobile */}
                <div className="flex flex-col lg:grid lg:grid-cols-4 gap-10 mb-16 border-t border-b border-gray-200 dark:border-white/5 py-12">

                    {/* Column 1: Brand & Intro */}
                    <div className="flex flex-col items-start space-y-6 lg:col-span-1">
                        <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 overflow-hidden rounded-full shadow-lg ring-1 ring-white/10">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/valluvar-logo-v2.jpg" alt="Thiruvalluvar Logo" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                                {language === 'ta' ? 'திருக்குறள்' : 'Thirukkural'}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed text-left">
                            {t.footer.description}
                        </p>
                    </div>

                    {/* Columns 2, 3, 4: Paals (Scrollable on Mobile) */}
                    <div className="flex flex-row overflow-x-auto lg:grid lg:grid-cols-3 lg:col-span-3 gap-6 lg:gap-10 pb-6 lg:pb-0 w-full lg:w-auto snap-x -mx-4 px-4 scroll-pl-4 lg:mx-0 lg:px-0 no-scrollbar">
                        {sortedKeys.map((paal) => (
                            <div key={paal} className="min-w-[75vw] sm:min-w-[350px] lg:min-w-0 flex flex-col items-start space-y-4 snap-start lg:snap-align-none flex-shrink-0 lg:flex-shrink">
                                <div className="flex items-center justify-between w-full border-b-2 border-blue-500/30 pb-2 gap-4">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                                        {getPaalTitle(paal)}
                                    </h3>
                                    <Link
                                        href={`/browse?paal=${paal}`}
                                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors whitespace-nowrap flex items-center gap-1 group/link"
                                    >
                                        See all <span className="group-hover/link:translate-x-0.5 transition-transform">→</span>
                                    </Link>
                                </div>
                                <ul className="space-y-2 w-full">
                                    {paalData[paal].map((adhigaram, idx) => (
                                        <li key={idx} className="flex items-center justify-start group">
                                            <Link
                                                href={`/browse?paal=${paal}&adhigaram=${adhigaram}`}
                                                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                                            >
                                                <span className="w-1 h-1 rounded-full bg-blue-400/50 group-hover:bg-blue-500 transition-colors"></span>
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

                {/* Bottom Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    {/* Copyright - Left */}
                    <div className="text-xs text-center md:text-left text-gray-400 dark:text-gray-500">
                        <p>© 2025 EDITION. ALL RIGHTS RESERVED.</p>
                    </div>

                    {/* Site Link - Center */}
                    <div className="flex justify-center">
                        <a
                            href="https://ansverse.xyz"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 transition-all hover:scale-105"
                        >
                            ansverse.xyz
                        </a>
                    </div>

                    {/* Made With - Right */}
                    <div className="flex justify-center md:justify-end items-center gap-4">
                        <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                            Made with <span className="text-red-500 animate-pulse">❤</span> for Tamil
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
