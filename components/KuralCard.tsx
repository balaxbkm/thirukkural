"use client";

import { Kural } from "@/types/thirukkural";
import Link from "next/link";
import { useState } from "react";
import { useUserKuralActions } from "@/lib/hooks/useUserKuralActions";
import { useLanguage } from "@/lib/context/LanguageContext";

interface KuralCardProps {
    kural: Kural;
}

export default function KuralCard({ kural }: KuralCardProps) {
    const { t } = useLanguage();
    const { isFavorite, toggleFavorite, hasNote, getNote } = useUserKuralActions();
    const isFav = isFavorite(kural.number);
    const hasCustomNote = hasNote(kural.number);

    const [showToast, setShowToast] = useState(false);
    const [contentCopiedToast, setContentCopiedToast] = useState(false);
    const [favoriteToast, setFavoriteToast] = useState(false);

    const handleCopyContent = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const content = `திருக்குறள் ${kural.number}
அதிகாரம்: ${kural.adhigaram}

${kural.line1_ta}
${kural.line2_ta}

விளக்கம்:
${kural.mv}

English Explanation:
${kural.meaning_en}`;

        navigator.clipboard.writeText(content);
        setContentCopiedToast(true);
        setTimeout(() => setContentCopiedToast(false), 2000);
    };

    const handleFavorite = () => {
        toggleFavorite(kural.number);
        if (!isFav) {
            setFavoriteToast(true);
            setTimeout(() => setFavoriteToast(false), 2000);
        }
    };

    const handleShare = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Thirukkural ${kural.number}`,
                    text: kural.line1_ta + "\n" + kural.line2_ta,
                    url: window.location.origin + `/kural/${kural.number}`,
                });
            } catch (err) {
                // ignore
            }
        } else {
            navigator.clipboard.writeText(window.location.origin + `/kural/${kural.number}`);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        }
    };

    return (
        <div
            className="glass-card relative flex flex-col group overflow-hidden"
        >
            {/* Decoration */}
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <span className="text-6xl font-serif font-black text-gray-900 dark:text-white">
                    {kural.number}
                </span>
            </div>

            <Link href={`/kural/${kural.number}`} className="flex-grow p-5 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[var(--theme-badge-bg)] text-[var(--theme-badge-text)]">
                        {kural.number}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {kural.adhigaram}
                    </span>
                </div>

                <div className="space-y-3 flex-grow">
                    {/* Tamil Lines */}
                    <div className="space-y-0.5">
                        <p className="font-bold text-lg leading-snug text-gray-800 dark:text-gray-100">
                            {kural.line1_ta}
                        </p>
                        <p className="font-bold text-lg leading-snug text-gray-800 dark:text-gray-100">
                            {kural.line2_ta}
                        </p>
                    </div>

                    {/* Meaning Preview */}
                    <div className="pt-2 border-t border-gray-200 dark:border-white/10">
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 italic">
                            {kural.meaning_en}
                        </p>
                    </div>

                    {/* Custom Note Preview if present */}
                    {hasCustomNote && (
                        <div className="pt-1">
                            <div className="p-2.5 rounded-xl bg-[var(--theme-badge-bg)] border border-[var(--theme-badge-border)] text-xs text-[var(--theme-badge-text)] flex items-start gap-2 backdrop-blur-sm">
                                <span className="text-[var(--theme-primary)] text-xs shrink-0 mt-0.5">📝</span>
                                <p className="line-clamp-2 italic font-medium">{getNote(kural.number)}</p>
                            </div>
                        </div>
                    )}
                </div>
            </Link>

            {/* Action Bar */}
            <div className="px-4 py-3 bg-gray-50/80 dark:bg-white/5 border-t border-gray-100 dark:border-white/5 flex justify-between items-center group-hover:bg-[var(--theme-badge-bg)] transition-colors duration-300">
                <div className="flex gap-2 items-center">
                    {/* Favorite Button */}
                    <button
                        onClick={handleFavorite}
                        className={`group/btn w-8 h-8 flex items-center justify-center rounded-full border transition-all duration-300 ${isFav
                            ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-400/30'
                            : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-rose-300 dark:hover:border-rose-700 hover:text-rose-600 dark:hover:text-rose-400 shadow-sm'
                            }`}
                        title={isFav ? t.kural.favorited : t.kural.favorite}
                        aria-label={isFav ? t.kural.favorited : t.kural.favorite}
                    >
                        <svg className={`w-4 h-4 ${isFav ? 'fill-current text-rose-500' : 'group-hover/btn:scale-110 transition-transform'}`} fill={isFav ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>

                    {/* Copy Button */}
                    <button
                        onClick={handleCopyContent}
                        className="group/btn w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-white transition-all shadow-sm"
                        title="Copy Content"
                        aria-label="Copy Content"
                    >
                        <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </button>

                    {/* Share Button */}
                    <button
                        onClick={handleShare}
                        className="group/btn w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-white transition-all shadow-sm"
                        title={t.kural.share}
                        aria-label={t.kural.share}
                    >
                        <svg className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </button>
                </div>

                <Link
                    href={`/kural/${kural.number}`}
                    className="flex items-center gap-1 text-xs font-bold text-gray-900 dark:text-white hover:text-[var(--theme-primary)] transition-colors group/read"
                >
                    Read
                    <svg className="w-3.5 h-3.5 group-hover/read:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </Link>
            </div>

            {/* Toast */}
            {
                showToast && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white text-xs py-2 px-4 rounded-full backdrop-blur-md animate-pulse z-50">
                        Link copied!
                    </div>
                )
            }
            {
                contentCopiedToast && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white text-xs py-2 px-4 rounded-full backdrop-blur-md animate-pulse z-50">
                        Copied!
                    </div>
                )
            }
            {
                favoriteToast && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-rose-600/90 text-white text-xs font-bold py-2 px-4 rounded-full backdrop-blur-md animate-in fade-in zoom-in duration-300 z-50 flex items-center gap-2 shadow-xl">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        {t.kural.favorited}
                    </div>
                )
            }
        </div>
    );
}
