"use client";

import { useUserKuralActions } from "@/lib/hooks/useUserKuralActions";
import kuralsData from "@/data/thirukkural.json";
import { useLanguage } from "@/lib/context/LanguageContext";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { Kural } from "@/types/thirukkural";
import NoteModal from "@/components/NoteModal";
import PageTitle from "@/components/PageTitle";
import KuralCountPill from "@/components/KuralCountPill";

export default function KuripugalPage() {
    const { notedKurals, getNotesForKural, isFavorite, toggleFavorite, deleteNoteById } = useUserKuralActions();
    const { t } = useLanguage();
    const kurals = kuralsData as Kural[];

    const [mounted, setMounted] = useState(false);
    const [selectedKural, setSelectedKural] = useState<Kural | null>(null);
    const [editingNote, setEditingNote] = useState<{ id: number; text: string } | null>(null);
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const notedItems = useMemo(() => {
        const kuralMap = new Map(kurals.map((k) => [k.number, k]));
        return notedKurals
            .map((num) => kuralMap.get(num))
            .filter((k): k is Kural => Boolean(k));
    }, [notedKurals, kurals]);

    if (!mounted) return null;

    const handleEditNote = (kural: Kural, id: number, text: string) => {
        setSelectedKural(kural);
        setEditingNote({ id, text });
        setIsNoteModalOpen(true);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500 pb-16">
            {/* Header */}
            <div className="text-center space-y-3 sm:space-y-4 pt-2">
                <PageTitle title={t.kuripugal.title} />

                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto px-2">
                    {t.kuripugal.subtitle}
                </p>
            </div>

            {/* Content List */}
            {notedItems.length > 0 ? (
                <div className="space-y-4">
                    <KuralCountPill count={notedItems.length} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {notedItems.map((kural) => {
                        const kuralNotes = getNotesForKural(kural.number);
                        const isFav = isFavorite(kural.number);

                        return (
                            <div
                                key={kural.number}
                                className="glass-card p-4 sm:p-7 rounded-2xl sm:rounded-3xl border border-white/80 dark:border-white/10 flex flex-col justify-between space-y-4 sm:space-y-5 hover:border-[var(--theme-badge-border)] transition-all duration-300 shadow-sm hover:shadow-xl relative overflow-hidden group"
                            >
                                {/* Digital Watermark */}
                                <div className="absolute top-2 right-4 text-7xl font-serif font-black text-[var(--theme-primary)] opacity-5 pointer-events-none select-none group-hover:scale-105 group-hover:opacity-10 transition-all">
                                    {kural.number}
                                </div>

                                <div className="space-y-4 relative z-10">
                                    {/* Card Header */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--theme-badge-bg)] text-[var(--theme-badge-text)] border border-[var(--theme-badge-border)] font-mono">
                                                {t.kural.number} {kural.number}
                                            </span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                {kural.adhigaram}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => toggleFavorite(kural.number)}
                                            className={`p-2 rounded-full transition-all border ${
                                                isFav
                                                    ? "text-rose-500 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/40 shadow-sm"
                                                    : "text-slate-400 bg-white/70 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:text-rose-500"
                                            }`}
                                            title={isFav ? t.kural.favorited : t.kural.favorite}
                                        >
                                            <svg className="w-4 h-4" fill={isFav ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Couplet */}
                                    <Link href={`/kural/${kural.number}`} className="block space-y-1 group/link">
                                        <p className="font-bold text-base sm:text-lg leading-snug text-slate-900 dark:text-slate-100 group-hover/link:text-[var(--theme-primary)] transition-colors">
                                            {kural.line1_ta}
                                        </p>
                                        <p className="font-bold text-base sm:text-lg leading-snug text-slate-900 dark:text-slate-100 group-hover/link:text-[var(--theme-primary)] transition-colors">
                                            {kural.line2_ta}
                                        </p>
                                    </Link>

                                    {/* User Custom Notes Block */}
                                    <div className="space-y-2.5">
                                        {kuralNotes.map((note) => (
                                            <div key={note.id} className="p-4 rounded-2xl bg-[var(--theme-badge-bg)] border border-[var(--theme-badge-border)] space-y-2 backdrop-blur-md">
                                                <div className="flex items-center justify-between text-xs font-bold text-[var(--theme-badge-text)] uppercase tracking-wider">
                                                    <span className="flex items-center gap-1.5">
                                                        <svg className="w-3.5 h-3.5 text-[var(--theme-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                                        </svg>
                                                        {t.note.title}
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => note.id !== undefined && handleEditNote(kural, note.id, note.text)}
                                                            aria-label={t.note.editNote}
                                                            title={t.note.editNote}
                                                            className="p-1.5 rounded-lg text-[var(--theme-badge-text)] hover:bg-white/40 dark:hover:bg-white/10 transition-colors cursor-pointer"
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

                                                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed italic whitespace-pre-wrap">
                                                    "{note.text}"
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Card Footer Link */}
                                <div className="pt-2 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between text-xs">
                                    <span className="text-slate-500 dark:text-slate-400 italic line-clamp-1 max-w-[70%]">
                                        {kural.meaning_en}
                                    </span>

                                    <Link
                                        href={`/kural/${kural.number}`}
                                        className="font-bold text-[var(--theme-primary)] hover:underline flex items-center gap-1 shrink-0"
                                    >
                                        <span>முழு குறள்</span>
                                        <span>→</span>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-white/40 dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-300 dark:border-white/10 p-8 backdrop-blur-md max-w-xl mx-auto">
                    <div className="w-20 h-20 bg-[var(--theme-badge-bg)] rounded-full flex items-center justify-center text-4xl border border-[var(--theme-badge-border)]">
                        📝
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            {t.kuripugal.emptyTitle}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            {t.kuripugal.emptyMsg}
                        </p>
                    </div>
                    <Link
                        href="/browse"
                        className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] hover:opacity-90 text-white font-semibold text-sm shadow-lg shadow-[var(--theme-glow)] transition-all active:scale-95"
                    >
                        {t.kuripugal.startBrowsing}
                    </Link>
                </div>
            )}

            {/* Note Modal */}
            {selectedKural && (
                <NoteModal
                    isOpen={isNoteModalOpen}
                    onClose={() => {
                        setIsNoteModalOpen(false);
                        setSelectedKural(null);
                        setEditingNote(null);
                    }}
                    kuralNumber={selectedKural.number}
                    adhigaram={selectedKural.adhigaram}
                    line1={selectedKural.line1_ta}
                    line2={selectedKural.line2_ta}
                    noteId={editingNote?.id}
                    initialText={editingNote?.text}
                />
            )}
        </div>
    );
}
