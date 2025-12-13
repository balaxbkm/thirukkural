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
    const { isBookmarked, toggleBookmark } = useUserKuralActions();
    const bookmarked = isBookmarked(kural.number);

    const [showToast, setShowToast] = useState(false);
    const [bookmarkToast, setBookmarkToast] = useState(false);

    const handleBookmark = () => {
        toggleBookmark(kural.number);
        if (!bookmarked) {
            setBookmarkToast(true);
            setTimeout(() => setBookmarkToast(false), 2000);
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
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
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
                </div>
            </Link>

            {/* Action Bar */}
            <div className="px-4 py-3 bg-gray-50/80 dark:bg-white/5 border-t border-gray-100 dark:border-white/5 flex justify-between items-center group-hover:bg-blue-50/30 dark:group-hover:bg-blue-900/10 transition-colors duration-300">
                <div className="flex gap-2">
                    <button
                        onClick={handleBookmark}
                        className={`group/btn flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 ${bookmarked
                            ? 'bg-blue-100/50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                            : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 shadow-sm'
                            }`}
                        title={bookmarked ? t.kural.saved : t.kural.save}
                    >
                        <svg className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : 'group-hover/btn:scale-110 transition-transform'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        <span>{bookmarked ? t.kural.saved : t.kural.save}</span>
                    </button>
                    <button
                        onClick={handleShare}
                        className="group/btn flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-white transition-all shadow-sm"
                        title={t.kural.share}
                    >
                        <svg className="w-3.5 h-3.5 group-hover/btn:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        <span className="hidden sm:inline">{t.kural.share}</span>
                    </button>
                </div>

                <Link
                    href={`/kural/${kural.number}`}
                    className="flex items-center gap-1 text-xs font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors group/read"
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
                bookmarkToast && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600/90 text-white text-xs font-bold py-2 px-4 rounded-full backdrop-blur-md animate-in fade-in zoom-in duration-300 z-50 flex items-center gap-2 shadow-xl">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Saved to Bookmarks
                    </div>
                )
            }
        </div>
    );
}
