"use client";

import { useUserKuralActions } from "@/lib/hooks/useUserKuralActions";
import KuralCard from "@/components/KuralCard";
import kuralsData from "@/data/thirukkural.json";
import { useLanguage } from "@/lib/context/LanguageContext";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { Kural } from "@/types/thirukkural";

export default function FavoritesPage() {
    const { favorites } = useUserKuralActions();
    const { t } = useLanguage();
    const kurals = kuralsData as Kural[];

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const favoriteList = useMemo(() => {
        const kuralMap = new Map(kurals.map((k) => [k.number, k]));
        return favorites
            .map((num) => kuralMap.get(num))
            .filter((k): k is Kural => Boolean(k));
    }, [favorites, kurals]);

    if (!mounted) return null;

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500 pb-16">
            <div className="text-center space-y-4 pt-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--theme-badge-bg)] border border-[var(--theme-badge-border)] text-[var(--theme-badge-text)] font-semibold text-xs tracking-wider uppercase backdrop-blur-md shadow-sm">
                    ❤️ {t.nav.favorites}
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[var(--theme-hero-from)] via-[var(--theme-hero-via)] to-[var(--theme-hero-to)] tracking-tight pb-2 leading-normal">
                    {t.favorites.title}
                </h1>

                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                    <span className="font-bold text-[var(--theme-badge-text)] px-2 py-0.5 rounded-md bg-[var(--theme-badge-bg)] border border-[var(--theme-badge-border)] font-mono">
                        {favoriteList.length}
                    </span>{" "}
                    {t.favorites.savedCount}
                </p>
            </div>

            {favoriteList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteList.map((kural) => (
                        <KuralCard key={kural.number} kural={kural} showNote={false} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-white/40 dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-300 dark:border-white/10 p-8 backdrop-blur-md max-w-xl mx-auto">
                    <div className="w-20 h-20 bg-[var(--theme-badge-bg)] rounded-full flex items-center justify-center text-4xl border border-[var(--theme-badge-border)]">
                        ❤️
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            {t.favorites.emptyTitle}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            {t.favorites.emptyMsg}
                        </p>
                    </div>
                    <Link
                        href="/browse"
                        className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] hover:opacity-90 text-white font-semibold text-sm shadow-lg shadow-[var(--theme-glow)] transition-all active:scale-95"
                    >
                        {t.favorites.startBrowsing}
                    </Link>
                </div>
            )}
        </div>
    );
}
