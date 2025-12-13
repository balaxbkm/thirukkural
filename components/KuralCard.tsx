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
    const { isLiked, isBookmarked, toggleLike, toggleBookmark } = useUserKuralActions();
    const liked = isLiked(kural.number);
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
            <div className="px-4 py-3 bg-white/50 dark:bg-black/20 border-t border-gray-100 dark:border-white/5 flex justify-between items-center">
                <div className="flex gap-2">
                    <button
                        onClick={() => toggleLike(kural.number)}
                        className={`p-2 rounded-lg transition-all ${liked ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                        title={liked ? t.kural.liked : t.kural.like}
                    >
                        <svg className="w-5 h-5" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                    <button
                        onClick={handleBookmark}
                        className={`p-2 rounded-lg transition-all ${bookmarked ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-400 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                        title={bookmarked ? t.kural.saved : t.kural.save}
                    >
                        <svg className="w-5 h-5" fill={bookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                    </button>
                    <button
                        onClick={handleShare}
                        className="p-2 text-gray-400 hover:text-blue-500 rounded-lg transition-colors"
                        title={t.kural.share}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </button>
                </div>
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
