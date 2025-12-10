"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import { useLanguage } from "@/lib/context/LanguageContext";
import KuralPageActions from "@/components/KuralPageActions";
import kuralsData from "@/data/thirukkural.json";
import { Kural } from "@/types/thirukkural";

export default function KuralPage({ params }: { params: Promise<{ number: string }> }) {
    const { number } = use(params);
    const { t } = useLanguage();

    // Find Kural
    // We need to find purely by number
    // The JSON is array of Kural objects.
    const kurals = kuralsData as Kural[];
    const kural = kurals.find((k) => k.number.toString() === number.toString());

    if (!kural) {
        notFound();
    }

    const kuralNumber = kural.number;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Main Content Card */}
            <div className="glass-card p-6 md:p-12 relative overflow-hidden">
                {/* Background Decorative */}
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none md:opacity-10">
                    <span className="text-9xl font-serif font-black text-gray-900 dark:text-white">
                        {kural.number}
                    </span>
                </div>

                <div className="relative z-10 space-y-6">

                    {/* Header */}
                    <div className="flex flex-col gap-6 pb-2">
                        <div className="flex flex-wrap justify-between items-center gap-4">
                            <div className="flex flex-wrap gap-2 items-center">
                                <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-sm tracking-wide">
                                    {t.kural.number} {kural.number}
                                </span>
                                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 ml-2">
                                    <Link href={`/browse?paal=${encodeURIComponent(kural.paal)}`} className="hover:text-blue-500 hover:underline transition-colors">
                                        {kural.paal}
                                    </Link>
                                    <span>/</span>
                                    <Link href={`/browse?paal=${encodeURIComponent(kural.paal)}&iyal=${encodeURIComponent(kural.iyal)}`} className="hover:text-blue-500 hover:underline transition-colors">
                                        {kural.iyal}
                                    </Link>
                                    <span>/</span>
                                    <Link href={`/browse?paal=${encodeURIComponent(kural.paal)}&iyal=${encodeURIComponent(kural.iyal)}&adhigaram=${encodeURIComponent(kural.adhigaram)}`} className="hover:text-blue-500 hover:underline transition-colors">
                                        {kural.adhigaram}
                                    </Link>
                                </div>
                            </div>
                            <KuralPageActions kural={kural} />
                        </div>

                        {/* Mobile Breadcrumbs */}
                        <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-1">
                            <Link href={`/browse?paal=${encodeURIComponent(kural.paal)}`} className="hover:text-blue-500 hover:underline transition-colors">
                                {kural.paal}
                            </Link>
                            <span>/</span>
                            <Link href={`/browse?paal=${encodeURIComponent(kural.paal)}&iyal=${encodeURIComponent(kural.iyal)}`} className="hover:text-blue-500 hover:underline transition-colors">
                                {kural.iyal}
                            </Link>
                            <span>/</span>
                            <Link href={`/browse?paal=${encodeURIComponent(kural.paal)}&iyal=${encodeURIComponent(kural.iyal)}&adhigaram=${encodeURIComponent(kural.adhigaram)}`} className="hover:text-blue-500 hover:underline transition-colors">
                                {kural.adhigaram}
                            </Link>
                        </div>

                        <div className="space-y-4">
                            <h1 className="font-bold text-gray-900 dark:text-white leading-loose tracking-wide">
                                <div className="text-[32px] leading-[1.6]">
                                    {kural.line1_ta}
                                </div>
                                <div className="text-[32px] leading-[1.6] mt-0">
                                    {kural.line2_ta}
                                </div>
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-lg mt-2 font-medium">
                                {kural.transliteration_en}
                            </p>
                        </div>
                    </div>

                    {/* Meanings */}
                    <div className="space-y-10">

                        {/* Tamil Explanations */}
                        <div className="space-y-8">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2">
                                {t.kural.vilakam}
                            </h2>

                            <div className="grid grid-cols-1 gap-8">
                                {/* Mu. Varadarajan */}
                                {kural.mv && (
                                    <div className="space-y-2">
                                        <h3 className="text-md font-semibold text-blue-600 dark:text-blue-400">
                                            {t.kural.mv}
                                        </h3>
                                        <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                                            {kural.mv}
                                        </p>
                                    </div>
                                )}

                                {/* Solomon Pappaiah */}
                                {kural.sp && (
                                    <div className="space-y-2">
                                        <h3 className="text-md font-semibold text-blue-600 dark:text-blue-400">
                                            {t.kural.sp}
                                        </h3>
                                        <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                                            {kural.sp}
                                        </p>
                                    </div>
                                )}

                                {/* Kalaignar */}
                                {kural.mk && (
                                    <div className="space-y-2">
                                        <h3 className="text-md font-semibold text-blue-600 dark:text-blue-400">
                                            {t.kural.mk}
                                        </h3>
                                        <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                                            {kural.mk}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* English Meaning */}
                        <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-white/10">
                            <h2 className="text-lg font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                                {t.kural.english} {t.kural.meaning}
                            </h2>
                            <p className="text-lg text-gray-700 dark:text-gray-200 leading-loose italic">
                                &ldquo;{kural.meaning_en}&rdquo;
                            </p>
                        </div>

                    </div>

                    {/* Transliteration removed from here */}
                </div>
            </div>

            {/* Navigation Footer */}
            <div className="flex justify-between items-center pt-8">
                {kural.number > 1 ? (
                    <Link href={`/kural/${kuralNumber - 1}`} className="glass-btn px-6 py-3 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        &larr; {t.browse.previous}
                    </Link>
                ) : <div></div>}

                <Link href="/browse" className="text-blue-600 font-medium hover:underline">
                    {t.nav.browse}
                </Link>

                {kural.number < 1330 ? (
                    <Link href={`/kural/${kuralNumber + 1}`} className="glass-btn px-6 py-3 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        {t.browse.next} &rarr;
                    </Link>
                ) : <div></div>}
            </div>
        </div>
    );
}
