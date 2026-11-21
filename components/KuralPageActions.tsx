"use client";

import { Kural } from "@/types/thirukkural";
import { useUserKuralActions } from "@/lib/hooks/useUserKuralActions";
import { useLanguage } from "@/lib/context/LanguageContext";
import { useState } from "react";
import NoteModal from "@/components/NoteModal";

interface KuralPageActionsProps {
    kural: Kural;
    onOpenNote?: () => void;
}

export default function KuralPageActions({ kural, onOpenNote }: KuralPageActionsProps) {
    const { t } = useLanguage();
    const { isFavorite, toggleFavorite, hasNote } = useUserKuralActions();

    const isFav = isFavorite(kural.number);
    const hasCustomNote = hasNote(kural.number);
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
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

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Thirukkural ${kural.number}`,
                    text: kural.line1_ta + "\n" + kural.line2_ta,
                    url: window.location.href,
                });
            } catch (err) {
                // ignore
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        }
    };

    return (
        <div className="flex items-center gap-3 relative">
            {/* Note Button (Bookmark Ribbon - Opens Modal Dialog) */}
            <button
                onClick={() => onOpenNote ? onOpenNote() : setIsNoteModalOpen(true)}
                className={`p-2.5 rounded-full transition-all border ${hasCustomNote ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-800' : 'text-gray-400 bg-white dark:bg-black/20 border-gray-200 dark:border-white/10 hover:text-amber-500 hover:border-amber-200'}`}
                title={hasCustomNote ? t.note.editNote : t.note.addNote}
            >
                <svg className="w-5 h-5" fill={hasCustomNote ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
            </button>

            {/* Favorite Button (Heart) */}
            <button
                onClick={handleFavorite}
                className={`p-2.5 rounded-full transition-all border ${isFav ? 'text-rose-500 bg-rose-50 dark:bg-rose-900/20 border-rose-300 dark:border-rose-900' : 'text-gray-400 bg-white dark:bg-black/20 border-gray-200 dark:border-white/10 hover:text-rose-500 hover:border-rose-200'}`}
                title={isFav ? t.kural.favorited : t.kural.favorite}
            >
                <svg className="w-5 h-5" fill={isFav ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>

            {/* Copy Button */}
            <button
                onClick={handleCopyContent}
                className="p-2.5 rounded-full bg-white dark:bg-black/20 text-gray-400 border border-gray-200 dark:border-white/10 hover:text-blue-500 hover:border-blue-200 transition-all"
                title="நகல்"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            </button>

            {/* Share Button */}
            <button
                onClick={handleShare}
                className="p-2.5 rounded-full bg-white dark:bg-black/20 text-gray-400 border border-gray-200 dark:border-white/10 hover:text-blue-500 hover:border-blue-200 transition-all"
                title={t.kural.share}
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
            </button>

            {showToast && (
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-2 px-4 rounded-full backdrop-blur-md animate-pulse whitespace-nowrap z-50">
                    Link copied!
                </div>
            )}
            {contentCopiedToast && (
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-2 px-4 rounded-full backdrop-blur-md animate-pulse whitespace-nowrap z-50">
                    Copied!
                </div>
            )}
            {favoriteToast && (
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-rose-600/90 text-white text-xs font-bold py-2 px-4 rounded-full backdrop-blur-md animate-in fade-in zoom-in duration-300 z-50 flex items-center gap-1.5 shadow-xl whitespace-nowrap">
                    <span>❤️</span>
                    <span>{t.kural.favorited}</span>
                </div>
            )}

            {/* Note Modal Dialog (Fallback if no onOpenNote provided) */}
            {!onOpenNote && (
                <NoteModal
                    isOpen={isNoteModalOpen}
                    onClose={() => setIsNoteModalOpen(false)}
                    kuralNumber={kural.number}
                    adhigaram={kural.adhigaram}
                    line1={kural.line1_ta}
                    line2={kural.line2_ta}
                />
            )}
        </div>
    );
}
