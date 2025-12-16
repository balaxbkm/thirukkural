"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import { useLanguage } from "@/lib/context/LanguageContext";
import KuralPageActions from "@/components/KuralPageActions";
import kuralsData from "@/data/thirukkural.json";
import { generateKuralExplanation, AIExplanationResponse } from "@/app/actions/generate-kural-explanation";
import { Kural } from "@/types/thirukkural";

export default function KuralPage({ params }: { params: Promise<{ number: string }> }) {
    const { number } = use(params);
    const { t, language } = useLanguage();

    // Find Kural
    // We need to find purely by number
    // The JSON is array of Kural objects.
    const kurals = kuralsData as Kural[];
    const kural = kurals.find((k) => k.number.toString() === number.toString());

    if (!kural) {
        notFound();
    }

    const kuralNumber = kural.number;

    const [aiExplanation, setAiExplanation] = useState<AIExplanationResponse | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAskAI = async () => {
        setIsAnalyzing(true);
        setError(null);
        try {
            const explanation = await generateKuralExplanation(
                kural.number,
                kural.line1_ta,
                kural.line2_ta,
                kural.meaning_en
            );
            if (explanation) {
                setAiExplanation(explanation);
            } else {
                setError(t.kural.aiError || "Unable to generate explanation. Please try again.");
            }
        } catch (err) {
            setError(t.kural.aiError || "An error occurred. Please try again.");
        }
        setIsAnalyzing(false);
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

                            {error && (
                                <div className="text-red-500 text-sm font-medium animate-in fade-in">
                                    {error}
                                </div>
                            )}

                            {aiExplanation && (
                                <div className="relative group rounded-2xl p-[1px] bg-gradient-to-br from-teal-500 via-purple-500 to-amber-500 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="rounded-2xl bg-white dark:bg-gray-900/95 p-6 md:p-8 space-y-8 relative overflow-hidden backdrop-blur-xl">

                                        {/* Background Glow */}
                                        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
                                        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

                                        {/* Top Section: Context & Insight */}
                                        <div className="flex flex-col gap-6">
                                            {/* Context Section */}
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                                                    <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-900/30">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                                                    </div>
                                                    <h3 className="text-sm font-bold uppercase tracking-wider opacity-80">Context</h3>
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base">
                                                    {aiExplanation[language] ? aiExplanation[language].context : aiExplanation['en']!.context}
                                                </p>
                                            </div>

                                            {/* Insight Section */}
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
                                                    <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-900/30">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 2a10 10 0 1 0 10 10H12V2z" /><path d="M12 12 2.1 12a10.1 10.1 0 0 0 16.9 3" /><path d="M22 12h-10" /></svg>
                                                    </div>
                                                    <h3 className="text-sm font-bold uppercase tracking-wider opacity-80">Core Insight</h3>
                                                </div>
                                                <div className="relative">
                                                    <p className="text-lg md:text-xl text-gray-800 dark:text-gray-100 font-medium leading-relaxed italic border-l-4 border-violet-500/30 pl-4 py-1">
                                                        "{aiExplanation[language] ? aiExplanation[language].insight : aiExplanation['en']!.insight}"
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>

                                        {/* Bottom Section: Modern Relevance */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-2">
                                                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/30">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                                </div>
                                                <h3 className="text-sm font-bold uppercase tracking-wider opacity-80">Modern Application</h3>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {(aiExplanation[language] ? aiExplanation[language].modern : aiExplanation['en']!.modern).map((step, index) => (
                                                    <div key={index} className="group/card relative p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors border border-gray-100 dark:border-gray-800 hover:border-amber-200 dark:hover:border-amber-800/50">
                                                        <div className="absolute top-4 right-4 text-6xl font-black text-gray-200 dark:text-gray-800 group-hover/card:text-amber-500/10 transition-colors select-none -z-10 font-sans">
                                                            {index + 1}
                                                        </div>
                                                        <div className="flex flex-col gap-2 h-full">
                                                            <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 flex items-center justify-center text-xs font-bold mb-1">
                                                                {index + 1}
                                                            </div>
                                                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                                                                {step}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Footer Actions */}
                                        <div className="flex justify-between items-center pt-2">
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-purple-500/80">
                                                AI Generated Analysis
                                            </span>
                                            <button
                                                onClick={() => setAiExplanation(null)}
                                                className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                                                Reset
                                            </button>
                                        </div>
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

                <Link href="/browse" className="glass-btn px-6 py-3 flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <circle cx="12" cy="12" r="10" />
                        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                    </svg>
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
