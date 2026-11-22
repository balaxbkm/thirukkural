"use client";

import { useUserKuralActions } from "@/lib/hooks/useUserKuralActions";
import KuralCard from "@/components/KuralCard";
import kuralsData from "@/data/thirukkural.json";
import { useLanguage } from "@/lib/context/LanguageContext";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { Kural } from "@/types/thirukkural";

export default function HistoryPage() {
    const { recentKuralNumbers, clearHistory } = useUserKuralActions();
    const { t } = useLanguage();
    const kurals = kuralsData as Kural[];

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const historyList = useMemo(() => {
        const kuralMap = new Map(kurals.map((k) => [k.number, k]));
        return recentKuralNumbers
            .map((num) => kuralMap.get(num))
            .filter((k): k is Kural => Boolean(k));
    }, [recentKuralNumbers, kurals]);

    if (!mounted) return null;

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500 pb-16">
            <div className="text-center space-y-4 pt-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--theme-badge-bg)] border border-[var(--theme-badge-border)] text-[var(--theme-badge-text)] font-semibold text-xs tracking-wider uppercase backdrop-blur-md shadow-sm">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-3.5 h-3.5"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {t.history?.title || t.home.recentTitle}
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[var(--theme-hero-from)] via-[var(--theme-hero-via)] to-[var(--theme-hero-to)] tracking-tight">
                    {t.history?.title || t.home.recentTitle}
                </h1>

                <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-sm sm:text-base">
                    {t.history?.subtitle || t.home.recentSubtitle}
                </p>

                <div className="flex items-center justify-center gap-4 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                    <p>
                        <span className="font-bold text-[var(--theme-badge-text)] px-2 py-0.5 rounded-md bg-[var(--theme-badge-bg)] border border-[var(--theme-badge-border)] font-mono">
                            {historyList.length}
                        </span>{" "}
                        {t.history?.viewedCount || "Kurals viewed"}
                    </p>

                    {historyList.length > 0 && (
                        <>
                            <span>•</span>
                            <button
                                onClick={clearHistory}
                                className="text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 font-medium hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-3.5 h-3.5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M3 6h18" />
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                </svg>
                                {t.history?.clearAll || "Clear all"}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {historyList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {historyList.map((kural) => (
                        <KuralCard key={`history-${kural.number}`} kural={kural} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-white/40 dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-300 dark:border-white/10 p-8 backdrop-blur-md max-w-xl mx-auto">
                    <div className="w-20 h-20 bg-[var(--theme-badge-bg)] rounded-full flex items-center justify-center text-3xl text-[var(--theme-primary)] border border-[var(--theme-badge-border)]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-10 h-10"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            {t.history?.emptyTitle || "No Reading History"}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-sm">
                            {t.history?.emptyMsg || "You haven't viewed any Kurals yet. Explore Kurals and they will appear here."}
                        </p>
                    </div>
                    <Link
                        href="/browse"
                        className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] hover:opacity-90 text-white font-medium text-sm shadow-lg shadow-[var(--theme-glow)] transition-all"
                    >
                        {t.history?.startBrowsing || t.favorites.startBrowsing}
                    </Link>
                </div>
            )}
        </div>
    );
}
