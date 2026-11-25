"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useLanguage } from "@/lib/context/LanguageContext";
import KuralPageActions from "@/components/KuralPageActions";
import kuralsData from "@/data/thirukkural.json";
import { generateKuralExplanation, AIExplanationResponse } from "@/app/actions/generate-kural-explanation";
import { Kural } from "@/types/thirukkural";
import { useUserKuralActions } from "@/lib/hooks/useUserKuralActions";
import NoteModal from "@/components/NoteModal";
import SectionHeader from "@/components/SectionHeader";

export default function KuralPage({ params }: { params: Promise<{ number: string }> }) {
    const { number } = use(params);
    const { t, language } = useLanguage();
    const { recordView, hasNote, getNote } = useUserKuralActions();

    // Find Kural
    // We need to find purely by number
    // The JSON is array of Kural objects.
    const kurals = kuralsData as Kural[];
    const kural = kurals.find((k) => k.number.toString() === number.toString());

    if (!kural) {
        notFound();
    }

    const kuralNumber = kural.number;
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        if (kuralNumber) {
            recordView(kuralNumber);
        }
    }, [kuralNumber, recordView]);

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

    const hasCustomNote = hasNote(kuralNumber);

    const mainCard = (
        <div className="glass-card p-4 sm:p-8 md:p-12 relative overflow-hidden">
            {/* Background Decorative */}
            <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-5 pointer-events-none md:opacity-10" style={{ top: '58px' }}>
                <span className="text-7xl sm:text-9xl font-serif font-black text-[var(--theme-primary)]">
                    {kural.number}
                </span>
            </div>

            <div className="relative z-10 space-y-6">

                {/* Header */}
                <div className="flex flex-col gap-4 sm:gap-6 pb-2">
                    <div className="flex flex-wrap justify-between items-center gap-3">
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="inline-flex items-center justify-center px-3.5 sm:px-4 py-1.5 rounded-full bg-[var(--theme-badge-bg)] border border-[var(--theme-badge-border)] text-[var(--theme-badge-text)] font-bold text-xs sm:text-sm tracking-wide shadow-sm font-mono">
                                {t.kural.number} {kural.number}
                            </span>
                            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 ml-2">
                                <Link href={`/browse?paal=${encodeURIComponent(kural.paal)}`} className="hover:text-[var(--theme-primary)] hover:underline transition-colors">
                                    {kural.paal}
                                </Link>
                                <span>/</span>
                                <Link href={`/browse?paal=${encodeURIComponent(kural.paal)}&iyal=${encodeURIComponent(kural.iyal)}`} className="hover:text-[var(--theme-primary)] hover:underline transition-colors">
                                    {kural.iyal}
                                </Link>
                                <span>/</span>
                                <Link href={`/browse?paal=${encodeURIComponent(kural.paal)}&iyal=${encodeURIComponent(kural.iyal)}&adhigaram=${encodeURIComponent(kural.adhigaram)}`} className="hover:text-[var(--theme-primary)] hover:underline transition-colors">
                                    {kural.adhigaram}
                                </Link>
                            </div>
                        </div>
                        <KuralPageActions kural={kural} onOpenNote={() => setIsNoteModalOpen(true)} />
                    </div>

                    {/* Mobile Breadcrumbs */}
                    <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-1 items-center">
                        <Link href={`/browse?paal=${encodeURIComponent(kural.paal)}`} className="hover:text-[var(--theme-primary)] hover:underline transition-colors">
                            {kural.paal}
                        </Link>
                        <span>/</span>
                        <Link href={`/browse?paal=${encodeURIComponent(kural.paal)}&iyal=${encodeURIComponent(kural.iyal)}`} className="hover:text-[var(--theme-primary)] hover:underline transition-colors">
                            {kural.iyal}
                        </Link>
                        <span>/</span>
                        <Link href={`/browse?paal=${encodeURIComponent(kural.paal)}&iyal=${encodeURIComponent(kural.iyal)}&adhigaram=${encodeURIComponent(kural.adhigaram)}`} className="hover:text-[var(--theme-primary)] hover:underline transition-colors">
                            {kural.adhigaram}
                        </Link>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        <h1 className="font-bold text-gray-900 dark:text-white leading-relaxed tracking-wide">
                            <div className="text-xl xs:text-2xl sm:text-3xl md:text-[32px] leading-snug sm:leading-[1.6]">
                                {kural.line1_ta}
                            </div>
                            <div className="text-xl xs:text-2xl sm:text-3xl md:text-[32px] leading-snug sm:leading-[1.6] mt-1 sm:mt-0">
                                {kural.line2_ta}
                            </div>
                        </h1>
                        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-200 leading-relaxed italic">
                            &ldquo;{kural.meaning_en}&rdquo;
                        </p>
                    </div>
                </div>

                {/* Meanings */}
                <div className="space-y-8 sm:space-y-10">

                    {/* Tamil Explanations */}
                    <div className="space-y-6 sm:space-y-8">
                        <SectionHeader
                            className="border-b border-gray-200 dark:border-white/10 pb-3"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                                </svg>
                            }
                            title={t.kural.vilakam}
                            subtitle={t.kural.vilakamSubtitle}
                        />

                        <div className="grid grid-cols-1 gap-6 sm:gap-8">
                            {/* Simple Explanation (MK, SP, MV) */}
                            {kural.meaning_ta && (
                                <div className="space-y-1.5 sm:space-y-2">
                                    <h3 className="text-sm sm:text-md font-semibold text-[var(--theme-primary)]">
                                        {t.kural.meaningTa}
                                    </h3>
                                    <p className="text-base sm:text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                                        {kural.meaning_ta}
                                    </p>
                                </div>
                            )}

                            {/* Parimelazhagar */}
                            {kural.pm && (
                                <div className="space-y-1.5 sm:space-y-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm sm:text-md font-semibold text-[var(--theme-primary)]">
                                            {t.kural.pm}
                                        </h3>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--theme-badge-bg)] text-[var(--theme-badge-text)] border border-[var(--theme-badge-border)] whitespace-nowrap shrink-0">
                                            {language === 'ta' ? 'செவ்வியல் உரை' : 'Classical Urai'}
                                        </span>
                                    </div>
                                    <p className="text-base sm:text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                                        {kural.pm}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const aiCard = (
        <div className="glass-card p-6 sm:p-7 rounded-3xl border border-[var(--theme-badge-border)] bg-white/70 dark:bg-slate-900/60 backdrop-blur-md space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-200/60 dark:border-white/10 pb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--theme-primary)] flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
                        <path d="M12 12 2.1 12a10.1 10.1 0 0 0 16.9 3" />
                        <path d="M22 12h-10" />
                    </svg>
                    {t.kural.aiExplanation}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--theme-badge-bg)] text-[var(--theme-badge-text)] border border-[var(--theme-badge-border)] whitespace-nowrap">
                    Gemini AI
                </span>
            </div>

            {!aiExplanation && !isAnalyzing && (
                <div className="space-y-4">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {language === 'ta'
                            ? 'இக்குறளுக்கான வரலாற்றுச் சூழல், ஆழ்ந்த நோக்கு மற்றும் நவீன வாழ்க்கைக்கான வழிகாட்டலை செயற்கை நுண்ணறிவு மூலம் பெற்றிடுங்கள்.'
                            : 'Get contextual background, deep philosophical insights, and modern practical takeaways powered by AI.'}
                    </p>
                    <button
                        onClick={handleAskAI}
                        className="w-full justify-center px-5 py-3 bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white rounded-xl font-semibold shadow-md shadow-[var(--theme-glow)] hover:opacity-95 hover:scale-[1.01] active:scale-95 transition-all flex items-center gap-2 text-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        {t.kural.askAI}
                    </button>
                </div>
            )}

            {isAnalyzing && (
                <div className="py-8 flex flex-col items-center justify-center gap-3 text-[var(--theme-primary)] animate-pulse text-center">
                    <div className="w-7 h-7 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-medium">{t.kural.analyzing}</span>
                </div>
            )}

            {error && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs sm:text-sm font-medium animate-in fade-in space-y-2">
                    <p>{error}</p>
                    <button
                        onClick={handleAskAI}
                        className="text-xs font-semibold underline hover:no-underline text-[var(--theme-primary)]"
                    >
                        {t.kural.askAI}
                    </button>
                </div>
            )}

            {aiExplanation && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Context Section */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[var(--theme-primary)]">
                            <div className="p-1.5 rounded-lg bg-[var(--theme-badge-bg)] text-[var(--theme-primary)]">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                            </div>
                            <h3 className="text-xs font-bold uppercase tracking-wider">Context</h3>
                        </div>
                        <p className="text-gray-700 dark:text-gray-200 leading-relaxed text-xs sm:text-sm">
                            {aiExplanation[language] ? aiExplanation[language].context : aiExplanation['en']!.context}
                        </p>
                    </div>

                    {/* Core Insight Section */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[var(--theme-primary)]">
                            <div className="p-1.5 rounded-lg bg-[var(--theme-badge-bg)] text-[var(--theme-primary)]">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M12 2a10 10 0 1 0 10 10H12V2z" /><path d="M12 12 2.1 12a10.1 10.1 0 0 0 16.9 3" /><path d="M22 12h-10" /></svg>
                            </div>
                            <h3 className="text-xs font-bold uppercase tracking-wider">Core Insight</h3>
                        </div>
                        <div className="relative">
                            <p className="text-sm sm:text-base text-gray-800 dark:text-gray-100 font-medium leading-relaxed italic border-l-4 border-[var(--theme-primary)]/50 pl-3 py-1 bg-[var(--theme-badge-bg)]/30 rounded-r-xl">
                                &ldquo;{aiExplanation[language] ? aiExplanation[language].insight : aiExplanation['en']!.insight}&rdquo;
                            </p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>

                    {/* Modern Relevance / Take Away */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[var(--theme-primary)]">
                            <div className="p-1.5 rounded-lg bg-[var(--theme-badge-bg)] text-[var(--theme-primary)]">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            </div>
                            <h3 className="text-xs font-bold uppercase tracking-wider">Take Away</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {(aiExplanation[language] ? aiExplanation[language].modern : aiExplanation['en']!.modern).slice(0, 2).map((step, index) => (
                                <div
                                    key={index}
                                    className="group/card relative p-4 rounded-xl transition-all duration-300 border bg-white/80 dark:bg-slate-900/50 border-[var(--theme-badge-border)] hover:border-[var(--theme-primary)] backdrop-blur-md shadow-sm overflow-hidden"
                                >
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-primary)] mb-1.5">
                                        <span className="w-6 h-[1.5px] rounded-full bg-current opacity-60"></span>
                                        {index === 0 ? 'WISDOM' : 'INSIGHT'}
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-900 dark:text-white/90 font-medium leading-relaxed">
                                        {step}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200/60 dark:border-white/10">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)]">
                            AI Generated Analysis
                        </span>
                        <button
                            onClick={() => setAiExplanation(null)}
                            className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                            Reset
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
            {/* Two Column Layout on Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Main Kural Content */}
                <div className="lg:col-span-7 xl:col-span-7 2xl:col-span-7 space-y-8">
                    {mainCard}
                </div>

                {/* Right Column: Custom Notes & AI Feature */}
                <div className="lg:col-span-5 xl:col-span-5 2xl:col-span-5 space-y-6 lg:sticky lg:top-24">
                    {/* Custom Notes Section */}
                    {hasCustomNote ? (
                        <div className="glass-card p-6 sm:p-7 rounded-3xl border border-[var(--theme-badge-border)] bg-[var(--theme-badge-bg)] space-y-4 backdrop-blur-md shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-[var(--theme-badge-text)] uppercase tracking-wider flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-[var(--theme-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                    {t.note.title}
                                </span>
                                <button
                                    onClick={() => setIsNoteModalOpen(true)}
                                    className="text-xs font-semibold text-[var(--theme-badge-text)] hover:underline px-3 py-1 rounded-full bg-[var(--theme-badge-bg)] border border-[var(--theme-badge-border)] hover:bg-[var(--theme-badge-border)]/20 transition-colors"
                                >
                                    {t.note.editNote}
                                </button>
                            </div>
                            <p className="text-sm sm:text-base text-slate-800 dark:text-slate-100 leading-relaxed italic whitespace-pre-wrap font-serif">
                                &ldquo;{getNote(kuralNumber)}&rdquo;
                            </p>
                        </div>
                    ) : (
                        <div className="glass-card p-6 sm:p-7 rounded-3xl border border-dashed border-gray-300 dark:border-white/20 bg-white/40 dark:bg-slate-900/40 space-y-4 backdrop-blur-md text-left transition-all hover:border-[var(--theme-primary)]/50">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-[var(--theme-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                    {t.note.title}
                                </span>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed text-left">
                                {t.note.empty}
                            </p>
                            <div>
                                <button
                                    onClick={() => setIsNoteModalOpen(true)}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-[var(--theme-badge-bg)] border border-[var(--theme-badge-border)] text-[var(--theme-badge-text)] hover:scale-[1.02] active:scale-95 transition-all shadow-sm"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    {t.note.addNote}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* AI Feature Section */}
                    {aiCard}
                </div>
            </div>

            {/* Note Modal Dialog */}
            <NoteModal
                isOpen={isNoteModalOpen}
                onClose={() => setIsNoteModalOpen(false)}
                kuralNumber={kuralNumber}
                adhigaram={kural.adhigaram}
                line1={kural.line1_ta}
                line2={kural.line2_ta}
            />

            {/* Navigation Footer */}
            <div className="flex justify-between items-center gap-2 pt-6 sm:pt-8 border-t border-gray-200/60 dark:border-white/10">
                {kural.number > 1 ? (
                    <Link href={`/kural/${kuralNumber - 1}`} className="glass-btn px-3 sm:px-6 py-2.5 sm:py-3 flex items-center gap-1.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:text-[var(--theme-primary)]">
                        <span>&larr;</span>
                        <span className="hidden xs:inline">{t.browse.previous}</span>
                    </Link>
                ) : <div className="w-12 sm:w-16"></div>}

                <Link href="/browse" className="glass-btn px-3.5 sm:px-6 py-2.5 sm:py-3 flex items-center gap-1.5 text-xs sm:text-sm text-[var(--theme-primary)] font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5">
                        <circle cx="12" cy="12" r="10" />
                        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                    </svg>
                    <span>{t.nav.browse}</span>
                </Link>

                {kural.number < 1330 ? (
                    <Link href={`/kural/${kuralNumber + 1}`} className="glass-btn px-3 sm:px-6 py-2.5 sm:py-3 flex items-center gap-1.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:text-[var(--theme-primary)]">
                        <span className="hidden xs:inline">{t.browse.next}</span>
                        <span>&rarr;</span>
                    </Link>
                ) : <div className="w-12 sm:w-16"></div>}
            </div>
        </div>
    );
}
