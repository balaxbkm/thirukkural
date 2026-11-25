"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useLanguage } from "@/lib/context/LanguageContext";
import KuralPageActions from "@/components/KuralPageActions";
import kuralsData from "@/data/thirukkural.json";
import { Kural } from "@/types/thirukkural";
import { useUserKuralActions } from "@/lib/hooks/useUserKuralActions";
import NoteModal from "@/components/NoteModal";
import SectionHeader from "@/components/SectionHeader";

export default function KuralPage({ params }: { params: Promise<{ number: string }> }) {
    const { number } = use(params);
    const router = useRouter();
    const { t, language } = useLanguage();
    const { recordView, getNotesForKural, deleteNoteById } = useUserKuralActions();
    const touchStartRef = useRef<{ x: number; y: number } | null>(null);

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
    const [editingNote, setEditingNote] = useState<{ id: number; text: string } | null>(null);
    const [swipeOffset, setSwipeOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isTransitioningOut, setIsTransitioningOut] = useState(false);
    const [enterDir, setEnterDir] = useState<"next" | "prev" | null>(null);
    const thresholdReachedRef = useRef(false);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        setSwipeOffset(0);
        setIsDragging(false);
        setIsTransitioningOut(false);
        try {
            const dir = sessionStorage.getItem("kural_swipe_dir");
            if (dir === "next" || dir === "prev") {
                setEnterDir(dir);
                sessionStorage.removeItem("kural_swipe_dir");
            }
        } catch {
            // ignore sessionStorage errors
        }
        if (kuralNumber) {
            recordView(kuralNumber);
        }
    }, [kuralNumber, recordView]);

    const kuralNotes = getNotesForKural(kuralNumber);

    const openAddNoteModal = () => {
        setEditingNote(null);
        setIsNoteModalOpen(true);
    };

    const openEditNoteModal = (id: number, text: string) => {
        setEditingNote({ id, text });
        setIsNoteModalOpen(true);
    };

    const SWIPE_THRESHOLD = 60;

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if (isNoteModalOpen || isTransitioningOut || e.touches.length !== 1) return;
        touchStartRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
        };
        thresholdReachedRef.current = false;
        setIsDragging(false);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (isNoteModalOpen || isTransitioningOut || !touchStartRef.current || e.touches.length !== 1) return;
        const deltaX = e.touches[0].clientX - touchStartRef.current.x;
        const deltaY = e.touches[0].clientY - touchStartRef.current.y;

        if (Math.abs(deltaX) > 12 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25) {
            setIsDragging(true);
            const atStartBoundary = deltaX > 0 && kuralNumber <= 1;
            const atEndBoundary = deltaX < 0 && kuralNumber >= 1330;
            const damping = atStartBoundary || atEndBoundary ? 0.15 : 0.5;
            const offset = Math.max(-160, Math.min(160, deltaX * damping));
            setSwipeOffset(offset);

            const crossed = Math.abs(deltaX) > SWIPE_THRESHOLD && !atStartBoundary && !atEndBoundary;
            if (crossed && !thresholdReachedRef.current) {
                thresholdReachedRef.current = true;
                if (typeof navigator !== "undefined" && navigator.vibrate) {
                    navigator.vibrate(10);
                }
            } else if (!crossed) {
                thresholdReachedRef.current = false;
            }
        }
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
        if (isNoteModalOpen || isTransitioningOut || !touchStartRef.current || e.changedTouches.length !== 1) return;
        const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
        const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
        touchStartRef.current = null;
        thresholdReachedRef.current = false;
        setIsDragging(false);

        // Trigger only on clear horizontal swipes (> 60px and dominant over vertical scroll)
        if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY) * 1.35) {
            if (deltaX < 0 && kuralNumber < 1330) {
                setIsTransitioningOut(true);
                setSwipeOffset(-180);
                try { sessionStorage.setItem("kural_swipe_dir", "next"); } catch {}
                setTimeout(() => router.push(`/kural/${kuralNumber + 1}`), 160);
                return;
            } else if (deltaX > 0 && kuralNumber > 1) {
                setIsTransitioningOut(true);
                setSwipeOffset(180);
                try { sessionStorage.setItem("kural_swipe_dir", "prev"); } catch {}
                setTimeout(() => router.push(`/kural/${kuralNumber - 1}`), 160);
                return;
            }
        }
        setSwipeOffset(0);
    };

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
                        <KuralPageActions kural={kural} onOpenNote={openAddNoteModal} />
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

    const enterAnimationClass =
        enterDir === "next"
            ? "animate-in fade-in slide-in-from-right-8 duration-300"
            : enterDir === "prev"
                ? "animate-in fade-in slide-in-from-left-8 duration-300"
                : "animate-in fade-in duration-500";

    const swipeProgress = Math.min(Math.abs(swipeOffset) / 30, 1);
    const isSwipeReady = Math.abs(swipeOffset) >= 30;
    const isSwipingPrev = swipeOffset > 8 && kuralNumber > 1;
    const isSwipingNext = swipeOffset < -8 && kuralNumber < 1330;

    return (
        <>
            {/* Interactive Mobile Swipe Peek Indicators */}
            {isDragging && isSwipingPrev && (
                <div
                    style={{
                        opacity: swipeProgress,
                        transform: `translateY(-50%) scale(${0.82 + swipeProgress * 0.18})`,
                    }}
                    className={`md:hidden fixed left-3 top-1/2 z-40 pointer-events-none flex items-center gap-1.5 px-3 py-2 rounded-full border shadow-lg backdrop-blur-md transition-colors duration-150 ${
                        isSwipeReady
                            ? "bg-[var(--theme-primary)] border-[var(--theme-primary)] text-white"
                            : "bg-white/90 dark:bg-slate-900/90 border-[var(--theme-badge-border)] text-slate-700 dark:text-slate-200"
                    }`}
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-xs font-bold font-mono">#{kuralNumber - 1}</span>
                </div>
            )}

            {isDragging && isSwipingNext && (
                <div
                    style={{
                        opacity: swipeProgress,
                        transform: `translateY(-50%) scale(${0.82 + swipeProgress * 0.18})`,
                    }}
                    className={`md:hidden fixed right-3 top-1/2 z-40 pointer-events-none flex items-center gap-1.5 px-3 py-2 rounded-full border shadow-lg backdrop-blur-md transition-colors duration-150 ${
                        isSwipeReady
                            ? "bg-[var(--theme-primary)] border-[var(--theme-primary)] text-white"
                            : "bg-white/90 dark:bg-slate-900/90 border-[var(--theme-badge-border)] text-slate-700 dark:text-slate-200"
                    }`}
                >
                    <span className="text-xs font-bold font-mono">#{kuralNumber + 1}</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            )}

            <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                    transform: swipeOffset !== 0
                        ? `translateX(${swipeOffset}px) rotate(${swipeOffset * 0.015}deg) scale(${Math.max(0.95, 1 - Math.abs(swipeOffset) * 0.00035)})`
                        : undefined,
                    opacity: isTransitioningOut ? 0 : swipeOffset !== 0 ? Math.max(0.55, 1 - Math.abs(swipeOffset) / 280) : 1,
                    transition: isDragging ? "none" : "transform 220ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms ease-out",
                }}
                className={`max-w-7xl 2xl:max-w-[1440px] mx-auto space-y-6 sm:space-y-8 md:pt-6 lg:pt-8 pb-0 sm:pb-6 ${enterAnimationClass}`}
            >
            {/* Two Column Layout on Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Main Kural Content */}
                <div className="lg:col-span-7 xl:col-span-7 2xl:col-span-7 space-y-8">
                    {mainCard}
                </div>

                {/* Right Column: Multiple Custom Notes */}
                <div className="lg:col-span-5 xl:col-span-5 2xl:col-span-5 space-y-4 lg:sticky lg:top-24">
                    <div className="glass-card p-6 sm:p-7 rounded-3xl border border-white/80 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-md space-y-5 shadow-sm">
                        <div className="flex items-center justify-between border-b border-gray-200/60 dark:border-white/10 pb-3.5">
                            <div className="flex items-center gap-2">
                                <span className="p-1.5 rounded-lg bg-[var(--theme-badge-bg)] text-[var(--theme-primary)]">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                </span>
                                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                    {t.note.title}
                                </h2>
                                {kuralNotes.length > 0 && (
                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[var(--theme-badge-bg)] text-[var(--theme-badge-text)] border border-[var(--theme-badge-border)] font-mono">
                                        {kuralNotes.length}
                                    </span>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={openAddNoteModal}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-[var(--theme-badge-bg)] border border-[var(--theme-badge-border)] text-[var(--theme-badge-text)] hover:scale-[1.02] active:scale-95 transition-all shadow-sm cursor-pointer"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span>{t.note.addNote}</span>
                            </button>
                        </div>

                        {kuralNotes.length > 0 ? (
                            <div className="space-y-3">
                                {kuralNotes.map((note) => (
                                    <div
                                        key={note.id}
                                        className="p-4 rounded-2xl border border-[var(--theme-badge-border)] bg-[var(--theme-badge-bg)]/60 space-y-2.5 transition-all"
                                    >
                                        <p className="text-sm sm:text-base text-slate-800 dark:text-slate-100 leading-relaxed italic whitespace-pre-wrap font-serif">
                                            &ldquo;{note.text}&rdquo;
                                        </p>
                                        <div className="flex items-center justify-between pt-2 border-t border-[var(--theme-badge-border)]/50 text-xs">
                                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                                {new Date(note.updatedAt).toLocaleDateString(language === "ta" ? "ta-IN" : "en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric"
                                                })}
                                            </span>
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => note.id !== undefined && openEditNoteModal(note.id, note.text)}
                                                    aria-label={t.note.editNote}
                                                    title={t.note.editNote}
                                                    className="p-1.5 rounded-lg text-[var(--theme-badge-text)] hover:bg-[var(--theme-badge-bg)] transition-colors cursor-pointer"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => note.id !== undefined && deleteNoteById(note.id)}
                                                    aria-label={t.note.deleteNote}
                                                    title={t.note.deleteNote}
                                                    className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-5 rounded-2xl border border-dashed border-gray-300 dark:border-white/15 bg-white/40 dark:bg-slate-900/30 space-y-3 text-left">
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                    {t.note.empty}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Note Modal Dialog */}
            <NoteModal
                isOpen={isNoteModalOpen}
                onClose={() => {
                    setIsNoteModalOpen(false);
                    setEditingNote(null);
                }}
                kuralNumber={kuralNumber}
                adhigaram={kural.adhigaram}
                line1={kural.line1_ta}
                line2={kural.line2_ta}
                noteId={editingNote?.id}
                initialText={editingNote?.text}
            />

            {/* Floating Vertically-Centered Side Navigation Buttons (Desktop/Tablet) */}
            {kural.number > 1 && (
                <Link
                    href={`/kural/${kuralNumber - 1}`}
                    aria-label={`${t.browse.previous} (${kuralNumber - 1})`}
                    title={`${t.browse.previous} #${kuralNumber - 1}`}
                    className="group hidden md:flex fixed left-4 sm:left-8 lg:left-12 xl:left-16 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full items-center justify-center border border-gray-200/80 dark:border-white/15 bg-white/80 dark:bg-slate-900/75 hover:bg-white dark:hover:bg-slate-900 hover:border-[var(--theme-badge-border)] backdrop-blur-md shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 text-gray-700 dark:text-gray-200 hover:text-[var(--theme-primary)]"
                >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
            )}

            {kural.number < 1330 && (
                <Link
                    href={`/kural/${kuralNumber + 1}`}
                    aria-label={`${t.browse.next} (${kuralNumber + 1})`}
                    title={`${t.browse.next} #${kuralNumber + 1}`}
                    className="group hidden md:flex fixed right-4 sm:right-8 lg:right-12 xl:right-16 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full items-center justify-center border border-gray-200/80 dark:border-white/15 bg-white/80 dark:bg-slate-900/75 hover:bg-white dark:hover:bg-slate-900 hover:border-[var(--theme-badge-border)] backdrop-blur-md shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 text-gray-700 dark:text-gray-200 hover:text-[var(--theme-primary)]"
                >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            )}
        </div>
        </>
    );
}
