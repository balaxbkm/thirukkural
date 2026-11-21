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
}

export default function NoteModal({
    isOpen,
    onClose,
    kuralNumber,
    adhigaram,
    line1,
    line2
}: NoteModalProps) {
    const { getNote, saveNote, deleteNote, hasNote } = useUserKuralActions();
    const { t } = useLanguage();

    const [mounted, setMounted] = useState(false);
    const [text, setText] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [savedNotice, setSavedNotice] = useState(false);

    const exists = hasNote(kuralNumber);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setText(getNote(kuralNumber));
            setSavedNotice(false);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen, kuralNumber, getNote]);

    if (!isOpen || !mounted) return null;

    const handleSave = async () => {
        setIsSaving(true);
        await saveNote(kuralNumber, text);
        setIsSaving(false);
        setSavedNotice(true);
        setTimeout(() => {
            setSavedNotice(false);
            onClose();
        }, 800);
    };

    const handleDelete = async () => {
        await deleteNote(kuralNumber);
        setText("");
        onClose();
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-lg glass-card border border-white/80 dark:border-white/10 p-6 sm:p-7 shadow-2xl rounded-3xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/10 pb-4">
                    <div className="flex items-center gap-2.5">
                        <span className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 text-lg flex items-center justify-center">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5Z" />
                            </svg>
                        </span>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span>{t.note.title}</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-cyan-300 font-semibold border border-indigo-500/20">
                                    {t.kural.number} {kuralNumber}
                                </span>
                            </h3>
                            {adhigaram && (
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {adhigaram}
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
                        aria-label="Close"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Couplet Preview */}
                {line1 && line2 && (
                    <div className="p-3.5 rounded-2xl bg-white/50 dark:bg-slate-900/40 border border-white/60 dark:border-white/5 space-y-0.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                        <p>{line1}</p>
                        <p>{line2}</p>
                    </div>
                )}

                {/* Note Editor */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex justify-between">
                        <span>{t.note.notes}</span>
                        <span className="font-mono text-[11px] text-slate-400">
                            {text.length} {t.note.characterCount}
                        </span>
                    </label>

                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={t.note.placeholder}
                        rows={5}
                        className="w-full p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/15 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-sm leading-relaxed transition-all resize-none shadow-inner"
                        autoFocus
                    />
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between gap-3 pt-1">
                    <div>
                        {exists && (
                            <button
                                onClick={handleDelete}
                                className="px-3.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors border border-transparent hover:border-rose-200 dark:hover:border-rose-900/40"
                            >
                                {t.note.deleteNote}
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors"
                        >
                            {t.note.close}
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
                        >
                            {savedNotice ? (
                                <>
                                    <span>✓</span>
                                    <span>{t.note.saved}</span>
                                </>
                            ) : isSaving ? (
                                <span>{t.note.saving}</span>
                            ) : (
                                <span>{t.note.saveNote}</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
