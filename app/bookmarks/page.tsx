"use client";

import { useUserKuralActions } from "@/lib/hooks/useUserKuralActions";
import KuralCard from "@/components/KuralCard";
import kuralsData from "@/data/thirukkural.json";
import { useLanguage } from "@/lib/context/LanguageContext";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { Kural } from "@/types/thirukkural";

export default function BookmarksPage() {
    const { bookmarkedKurals } = useUserKuralActions();
    const { t } = useLanguage();
    const kurals = kuralsData as Kural[];

    // Hydration fix for localStorage
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const bookmarkedList = useMemo(() => {
        return kurals.filter((k) => bookmarkedKurals.includes(k.number));
    }, [bookmarkedKurals, kurals]);

    if (!mounted) return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                    {t.bookmarks.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold text-gray-900 dark:text-white">{bookmarkedList.length}</span> {t.bookmarks.savedCount}
                </p>
            </div>

            {bookmarkedList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookmarkedList.map((kural) => (
                        <KuralCard key={kural.number} kural={kural} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-white/5 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center text-4xl">
                        🔖
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t.bookmarks.emptyTitle}</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                            {t.bookmarks.emptyMsg}
                        </p>
                    </div>
                    <Link
                        href="/browse"
                        className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all shadow-lg hover:shadow-blue-500/25"
                    >
                        {t.bookmarks.startBrowsing}
                    </Link>
                </div>
            )}
        </div>
    );
}
