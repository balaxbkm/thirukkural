"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useUserKuralActions } from "@/lib/hooks/useUserKuralActions";
import { useLanguage } from "@/lib/context/LanguageContext";

interface NoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    kuralNumber: number;
    adhigaram?: string;
    line1?: string;
    line2?: string;
    noteId?: number;
    initialText?: string;
}

export default function NoteModal({
    isOpen,
    onClose,
    kuralNumber,
    adhigaram,
    line1,
    line2,
    noteId,
    initialText = ""
}: NoteModalProps) {
    const { addNote, updateNoteById, deleteNoteById } = useUserKuralActions();
    const { t } = useLanguage();

    const [mounted, setMounted] = useState(false);
    const [text, setText] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [savedNotice, setSavedNotice] = useState(false);
    const [topOffset, setTopOffset] = useState<number>(0);

    const isEditing = noteId !== undefined;

    useEffect(() => {
        setMounted(true);
    }, []);

    // Sync visual viewport position on mobile so modal stays fixed at top even when keyboard opens
    useEffect(() => {
        if (!isOpen || typeof window === "undefined") return;

        const updatePosition = () => {
            if (window.visualViewport && window.innerWidth < 640) {
                setTopOffset(window.visualViewport.offsetTop || 0);
            } else {
                setTopOffset(0);
            }
        };

        if (window.visualViewport) {
            window.visualViewport.addEventListener("resize", updatePosition);
            window.visualViewport.addEventListener("scroll", updatePosition);
        }

        updatePosition();

        return () => {
            if (window.visualViewport) {
                window.visualViewport.removeEventListener("resize", updatePosition);
                window.visualViewport.removeEventListener("scroll", updatePosition);
            }
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setText(isEditing ? initialText : "");
            setSavedNotice(false);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen, isEditing, initialText]);

    if (!isOpen || !mounted) return null;

    const handleSave = async () => {
        if (!text.trim() && !isEditing) {
            onClose();
            return;
        }
        setIsSaving(true);
        if (isEditing && noteId !== undefined) {
            await updateNoteById(noteId, text);
        } else {
            await addNote(kuralNumber, text);
        }
        setIsSaving(false);
        setSavedNotice(true);
        setTimeout(() => {
            setSavedNotice(false);
            onClose();
        }, 800);
    };

    const handleDelete = async () => {
        if (isEditing && noteId !== undefined) {
            await deleteNoteById(noteId);
        }
        setText("");
        onClose();
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-2.5 pt-[max(env(safe-area-inset-top,0px),0.5rem)] sm:p-6 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
            style={topOffset > 0 ? { top: `${topOffset}px` } : undefined}
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-lg glass-card border border-white/80 dark:border-white/10 p-3.5 sm:p-7 shadow-2xl rounded-2xl sm:rounded-3xl space-y-2.5 sm:space-y-4 animate-in slide-in-from-top-3 sm:zoom-in-95 duration-200 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/10 pb-2.5 sm:pb-4">
                    <div className="flex items-center gap-2 sm:gap-2.5">
                        <span className="p-1 sm:p-2 rounded-lg sm:rounded-xl bg-[var(--theme-badge-bg)] text-[var(--theme-primary)] text-sm sm:text-lg flex items-center justify-center">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5Z" />
                            </svg>
                        </span>
                        <div>
                            <h3 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white">
                                {t.note.title}
                            </h3>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-1 sm:p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-white/10 transition-colors active:scale-95 cursor-pointer"
                        aria-label="Close"
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Couplet Preview */}
                {line1 && (
                    <div className="relative overflow-hidden p-2.5 sm:p-3 rounded-xl bg-white/50 dark:bg-slate-900/40 border border-white/60 dark:border-white/5 space-y-0.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                        <span
                            className="absolute top-1/2 -translate-y-1/2 right-3 text-4xl sm:text-5xl font-serif font-black leading-none text-gray-900 dark:text-white opacity-5 pointer-events-none select-none"
                            aria-hidden="true"
                        >
                            {kuralNumber}
                        </span>
                        {adhigaram && (
                            <p className="relative z-10 text-[11px] font-semibold text-[var(--theme-primary)] mb-1">
                                {adhigaram}
                            </p>
                        )}
                        <p className="relative z-10">{line1}</p>
                        {line2 && <p className="relative z-10">{line2}</p>}
                    </div>
                )}

                {/* Note Editor */}
                <div className="space-y-1.5 sm:space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex justify-between">
                        <span>{t.note.notes}</span>
                        <span className="font-mono text-[10px] sm:text-[11px] text-slate-400">
                            {text.length} {t.note.characterCount}
                        </span>
                    </div>

                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={t.note.placeholder}
                        rows={9}
                        className="w-full p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/15 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]/40 text-[11px] sm:text-xs leading-relaxed transition-all resize-none shadow-inner h-56 sm:h-72"
                        autoFocus
                    />
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between gap-2 pt-1 sm:pt-2">
                    <div>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors border border-transparent hover:border-rose-200 dark:hover:border-rose-900/40 active:scale-95 cursor-pointer"
                            >
                                {t.note.deleteNote}
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors active:scale-95 cursor-pointer"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>{t.note.cancel}</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white font-semibold text-xs shadow-md shadow-[var(--theme-glow)] hover:opacity-95 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                        >
                            {savedNotice ? (
                                <>
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>{t.note.saved}</span>
                                </>
                            ) : isSaving ? (
                                <span>{t.note.saving}</span>
                            ) : (
                                <>
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>{t.note.save}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
