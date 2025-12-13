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

    const [aiExplanation, setAiExplanation] = useState<{
        context: string;
        insight: string;
        modern: string;
    } | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAskAI = () => {
        setIsAnalyzing(true);
        // Simulate AI Analysis
        setTimeout(() => {
            setAiExplanation({
                context: `This couplet belongs to the ${kural.paal} (Division of ${kural.paal === 'Arathuppaal' ? 'Virtue' : kural.paal === 'Porutpaal' ? 'Wealth' : 'Love'}) and specifically the ${kural.adhigaram} chapter.`,
                insight: `Thiruvalluvar helps us understand that "${kural.meaning_en}"`,
                modern: `In today's fast-paced world, this wisdom reminds us to embody the principles of ${kural.adhigaram} to lead a balanced and fulfilling life.`
            });
            setIsAnalyzing(false);
        }, 2000);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Main Content Card */}
            <div className="glass-card p-6 md:p-12 relative overflow-hidden">
                {/* Background Decorative */}
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none md:opacity-10" style={{ top: '58px' }}>
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
                                {t.kural.englishMeaning}
                            </h2>
                            <p className="text-lg text-gray-700 dark:text-gray-200 leading-loose italic">
                                &ldquo;{kural.meaning_en}&rdquo;
                            </p>
                        </div>

                        {/* AI Explanation Section */}
                        <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-white/10">
                            <h2 className="text-lg font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                    <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
                                    <path d="M12 12 2.1 12a10.1 10.1 0 0 0 16.9 3" />
                                    <path d="M22 12h-10" />
                                </svg>
                                {t.kural.aiExplanation}
                            </h2>

                            {!aiExplanation && !isAnalyzing && (
                                <button
                                    onClick={handleAskAI}
                                    className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-medium shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                    </svg>
                                    {t.kural.askAI}
                                </button>
                            )}

                            {isAnalyzing && (
                                <div className="flex items-center gap-3 text-teal-600 dark:text-teal-400 animate-pulse">
                                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                    <span className="font-medium">{t.kural.analyzing}</span>
                                </div>
                            )}

                            {aiExplanation && (
                                <div className="rounded-2xl bg-teal-50/50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-900/30 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-sm">
                                    <div className="p-6 space-y-6">
                                        {/* Context Section */}
                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0 mt-0.5">
                                                <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-800/50 flex items-center justify-center text-teal-600 dark:text-teal-300">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-200 opacity-70">Context</h3>
                                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                                    {aiExplanation.context}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Insight Section */}
                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0 mt-0.5">
                                                <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-300">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 2a10 10 0 1 0 10 10H12V2z" /><path d="M12 12 2.1 12a10.1 10.1 0 0 0 16.9 3" /><path d="M22 12h-10" /></svg>
                                                </div>
                                            </div>
                                            <div className="space-y-2 w-full">
                                                <h3 className="text-xs font-bold uppercase tracking-wider text-violet-800 dark:text-violet-200 opacity-70">Core Insight</h3>
                                                <div className="p-4 rounded-xl bg-white/60 dark:bg-black/20 border border-violet-100 dark:border-violet-900/30 text-gray-800 dark:text-gray-100 font-medium italic relative">
                                                    <span className="absolute top-2 left-2 text-4xl text-violet-200 dark:text-violet-900 select-none font-serif leading-none">&ldquo;</span>
                                                    <p className="relative z-10 pl-4">{aiExplanation.insight}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Modern Context Section */}
                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0 mt-0.5">
                                                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-500">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-200 opacity-70">Modern Relevance</h3>
                                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                                    {aiExplanation.modern}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-6 py-3 bg-teal-100/30 dark:bg-teal-900/20 border-t border-teal-100 dark:border-teal-900/30 flex justify-between items-center">
                                        <span className="text-[10px] bg-teal-200/50 dark:bg-teal-900/50 px-2 py-1 rounded text-teal-800 dark:text-teal-200 font-medium tracking-wide">AI GENERATED</span>
                                        <button
                                            onClick={() => setAiExplanation(null)}
                                            className="text-xs font-medium text-teal-700 dark:text-teal-300 hover:text-teal-900 dark:hover:text-teal-100 transition-colors flex items-center gap-1 group"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 group-hover:-rotate-180 transition-transform duration-500"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                                            Reset Analysis
                                        </button>
                                    </div>
                                </div>
                            )}
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
