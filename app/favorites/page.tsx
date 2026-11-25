"use client";

import { useUserKuralActions } from "@/lib/hooks/useUserKuralActions";
import KuralCard from "@/components/KuralCard";
import PageTitle from "@/components/PageTitle";
import KuralCountPill from "@/components/KuralCountPill";
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
            <div className="text-center space-y-3 sm:space-y-4 pt-2">
                <PageTitle title={t.favorites.title} />

                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto px-2">
                    {t.favorites.subtitle}
                </p>
            </div>

            {favoriteList.length > 0 ? (
                <div className="space-y-4">
                    <KuralCountPill count={favoriteList.length} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {favoriteList.map((kural) => (
                            <KuralCard key={kural.number} kural={kural} showNote={false} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-center space-y-5 sm:space-y-6 bg-white/40 dark:bg-slate-900/40 rounded-2xl sm:rounded-3xl border border-dashed border-slate-300 dark:border-white/10 p-6 sm:p-8 backdrop-blur-md max-w-xl mx-auto">
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
