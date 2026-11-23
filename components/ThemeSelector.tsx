"use client";

import React, { useState, useRef, useEffect } from "react";
import { useThemeColor, ColorTheme, COLOR_THEMES } from "@/lib/context/ThemeColorContext";
import { useLanguage } from "@/lib/context/LanguageContext";
import { useTheme } from "next-themes";

interface ThemeSelectorProps {
    variant?: "dropdown" | "inline";
    onSelect?: () => void;
}

export default function ThemeSelector({ variant = "dropdown", onSelect }: ThemeSelectorProps) {
    const { colorTheme, setColorTheme } = useThemeColor();
    const { language, t } = useLanguage();
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close on click outside
    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    const activeTheme = COLOR_THEMES.find((t) => t.id === colorTheme) || COLOR_THEMES[0];

    const handleThemePick = (themeId: ColorTheme) => {
        setColorTheme(themeId);
        // Keep the drawer open so the user can freely explore different themes
    };

    if (variant === "inline") {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="p-1 rounded-lg bg-[var(--theme-badge-bg)] text-[var(--theme-primary)]">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        </span>
                        <span>{t.theme?.title || "Theme & Mode"}</span>
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[var(--theme-badge-bg)] text-[var(--theme-badge-text)] border border-[var(--theme-badge-border)]">
                        {language === "ta" ? activeTheme.nameTa : activeTheme.nameEn}
                    </span>
                </div>

                {/* Light / Dark Mode Toggle */}
                <div className="p-1 rounded-xl bg-[var(--theme-badge-bg)] flex items-center gap-1 border border-[var(--theme-badge-border)]">
                    <button
                        type="button"
                        onClick={() => setTheme("light")}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            mounted && theme === "light"
                                ? "bg-white text-slate-900 shadow-sm font-bold"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                    >
                        <span>☀️</span>
                        <span>{t.theme?.light || "Light"}</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setTheme("dark")}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            mounted && theme === "dark"
                                ? "bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white shadow-md shadow-[var(--theme-glow)] font-bold"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                    >
                        <span>🌙</span>
                        <span>{t.theme?.dark || "Dark"}</span>
                    </button>
                </div>

                {/* 6 Theme Grid */}
                <div className="grid grid-cols-2 gap-2">
                    {COLOR_THEMES.map((item) => {
                        const isSelected = item.id === colorTheme;
                        const name = language === "ta" ? item.nameTa : item.nameEn;
                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => handleThemePick(item.id)}
                                className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                                    isSelected
                                        ? "bg-[var(--theme-badge-bg)] border-[var(--theme-primary)] shadow-sm ring-1 ring-[var(--theme-primary)]"
                                        : "bg-white/40 dark:bg-white/[0.04] border-black/5 dark:border-white/10 hover:bg-white/70 dark:hover:bg-white/[0.08]"
                                }`}
                            >
                                <span
                                    className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm ring-1 ring-black/10 dark:ring-white/20"
                                    style={{
                                        background: `linear-gradient(135deg, ${item.primary}, ${item.secondary})`
                                    }}
                                />
                                <span className={`text-xs font-semibold truncate ${isSelected ? "text-[var(--theme-primary)] font-bold" : "text-slate-800 dark:text-slate-200"}`}>
                                    {name}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="relative" ref={containerRef}>
            {/* Combined Trigger Button: Moon Icon with Selected Theme Indicator */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full backdrop-blur-md border transition-all duration-300 shadow-sm active:scale-95 cursor-pointer shrink-0 ${
                    isOpen
                        ? "bg-white/95 dark:bg-slate-800/90 border-[var(--theme-primary)] ring-2 ring-[var(--theme-primary)]/20 shadow-md"
                        : "bg-white/70 dark:bg-white/10 border-white/80 dark:border-white/15 hover:bg-white/95 dark:hover:bg-white/20 hover:border-[var(--theme-badge-border)]"
                }`}
                aria-label={t.theme?.title || "Theme"}
                title={t.theme?.title || "Theme"}
            >
                {/* Moon / Sun Icon styled with selected color theme */}
                {mounted && theme === "dark" ? (
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--theme-primary)] transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                ) : (
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--theme-primary)] transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                )}

                {/* Selected Color Theme Dot Indicator */}
                <span
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-white dark:border-slate-900 shadow-sm"
                    style={{
                        background: `linear-gradient(135deg, ${activeTheme.primary}, ${activeTheme.secondary})`
                    }}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    style={{ background: 'var(--theme-footer-bg)' }}
                    className="absolute right-0 mt-2 sm:mt-3 w-[295px] xs:w-[320px] sm:w-[380px] max-w-[calc(100vw-1.5rem)] p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c0a09] border-2 border-[var(--theme-badge-border)] shadow-2xl shadow-black/20 dark:shadow-black/70 z-50 animate-in fade-in zoom-in-95 duration-200 space-y-3.5 sm:space-y-4 overflow-hidden"
                >
                    {/* Ambient Glow Orbits inside drawer */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-36 h-36 bg-[var(--theme-glow)] rounded-full blur-3xl pointer-events-none opacity-60" />
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-36 h-36 bg-[var(--theme-glow)] rounded-full blur-3xl pointer-events-none opacity-40" />

                    {/* Header */}
                    <div className="relative z-10 flex items-center justify-between pb-3 border-b border-[var(--theme-badge-border)]">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="p-1 rounded-lg bg-[var(--theme-badge-bg)] text-[var(--theme-primary)] flex items-center justify-center">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                </span>
                                <span>{t.theme?.title || "Theme & Display"}</span>
                            </h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                {t.theme?.subtitle || "Choose display mode & color theme"}
                            </p>
                        </div>
                    </div>

                    {/* Mode Quick Toggle (Light / Dark) */}
                    <div className="relative z-10 p-1 rounded-2xl bg-[var(--theme-badge-bg)] flex items-center gap-1 border border-[var(--theme-badge-border)]">
                        <button
                            type="button"
                            onClick={() => setTheme("light")}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                mounted && theme === "light"
                                    ? "bg-white text-slate-900 shadow-sm font-bold"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                        >
                            <span>☀️</span>
                            <span>{t.theme?.light || "Light"}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setTheme("dark")}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                mounted && theme === "dark"
                                    ? "bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white shadow-md shadow-[var(--theme-glow)] font-bold"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                        >
                            <span>🌙</span>
                            <span>{t.theme?.dark || "Dark"}</span>
                        </button>
                    </div>

                    {/* 6 Color Themes Grid */}
                    <div className="relative z-10 space-y-1.5">
                        <div className="flex items-center justify-between px-1">
                            <span className="text-[10px] font-bold tracking-wider uppercase text-[var(--theme-primary)]">
                                {t.theme?.selectTheme || "Palettes (6 Colors)"}
                            </span>
                            <span className="text-[10px] font-semibold text-[var(--theme-badge-text)]">
                                {language === 'ta' ? activeTheme.nameTa : activeTheme.nameEn}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                            {COLOR_THEMES.map((item) => {
                                const isSelected = item.id === colorTheme;
                                const name = language === "ta" ? item.nameTa : item.nameEn;
                                const desc = language === "ta" ? item.descriptionTa : item.descriptionEn;
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => handleThemePick(item.id)}
                                        className={`group relative flex items-center gap-2.5 p-2 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                                            isSelected
                                                ? "bg-[var(--theme-badge-bg)] border-[var(--theme-primary)] shadow-md shadow-[var(--theme-glow)] ring-2 ring-[var(--theme-primary)]/30"
                                                : "bg-white/50 dark:bg-white/[0.04] border-black/5 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/[0.08] hover:border-[var(--theme-badge-border)] hover:scale-[1.01]"
                                        }`}
                                    >
                                        <span
                                            className="w-4 h-4 rounded-full flex-shrink-0 shadow-md ring-2 ring-white/80 dark:ring-white/20 transition-transform group-hover:scale-110"
                                            style={{
                                                background: `linear-gradient(135deg, ${item.primary}, ${item.secondary})`
                                            }}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className={`text-xs font-bold truncate ${isSelected ? "text-[var(--theme-primary)]" : "text-slate-900 dark:text-white"}`}>
                                                {name}
                                            </p>
                                            <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 leading-normal">
                                                {desc}
                                            </p>
                                        </div>
                                        {isSelected && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-primary)] ring-2 ring-white dark:ring-slate-900 shadow-sm shrink-0" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
