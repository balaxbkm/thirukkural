"use client";

import { useLanguage } from "@/lib/context/LanguageContext";
import { useState, useEffect, useRef, useMemo, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Kural } from "@/types/thirukkural";
import kuralsData from "@/data/thirukkural.json";
import { adhigaramTitles, adhigaramTransliterations } from "@/lib/adhigaram-titles";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const POPULAR_ADHIGARAMS = [
    "கடவுள் வாழ்த்து",
    "அறன் வலியுறுத்தல்",
    "அன்புடைமை",
    "விருந்தோம்பல்",
    "இனியவை கூறல்",
    "செய்ந்நன்றி அறிதல்",
    "அடக்கமுடைமை",
    "ஒழுக்கமுடைமை",
];

interface SearchBarProps {
    variant?: "header" | "large";
}

const kurals = kuralsData as Kural[];

export default function SearchBar({ variant = "header" }: SearchBarProps) {
    const { t } = useLanguage();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Kural[]>([]);
    const [adhigaramResults, setAdhigaramResults] = useState<string[]>([]);
    const [selectedFilterAdhigaram, setSelectedFilterAdhigaram] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [adhigaramSearch, setAdhigaramSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const mainInputRef = useRef<HTMLInputElement>(null);
    const mobileSearchInputRef = useRef<HTMLInputElement>(null);
    const adhigaramSearchInputRef = useRef<HTMLInputElement>(null);
    const selectedAdhigaramRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Body scroll locking and auto-focus when mobile search opens
    useEffect(() => {
        if (isMobileSearchOpen) {
            document.body.style.overflow = "hidden";
            const timer = setTimeout(() => {
                mobileSearchInputRef.current?.focus();
            }, 60);
            return () => {
                clearTimeout(timer);
                document.body.style.overflow = "";
            };
        } else {
            document.body.style.overflow = "";
        }
    }, [isMobileSearchOpen]);

    // Handle Escape key to close mobile search
    useEffect(() => {
        if (!isMobileSearchOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsMobileSearchOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isMobileSearchOpen]);

    // Get all unique adhigarams for the dropdown
    const allAdhigarams = useMemo(() => Array.from(new Set(kurals.map(k => k.adhigaram))).sort(), []);

    const filteredDropdownAdhigarams = useMemo(() => {
        if (!adhigaramSearch) return allAdhigarams;
        const search = adhigaramSearch.toLowerCase();
        return allAdhigarams.filter(adh => {
            const keys = [
                adh,
                adhigaramTitles[adh] || "",
                adhigaramTransliterations[adh] || ""
            ].join(" ").toLowerCase();
            return keys.includes(search);
        });
    }, [allAdhigarams, adhigaramSearch]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isDropdownOpen && adhigaramSearchInputRef.current) {
            setTimeout(() => adhigaramSearchInputRef.current?.focus(), 100);
        }
        if (!isDropdownOpen) {
            setAdhigaramSearch("");
        }
    }, [isDropdownOpen]);

    useIsomorphicLayoutEffect(() => {
        if (isDropdownOpen && selectedAdhigaramRef.current && listRef.current) {
            const itemHeight = selectedAdhigaramRef.current.offsetHeight;
            listRef.current.scrollTop = selectedAdhigaramRef.current.offsetTop - (itemHeight * 2);
        }
    }, [isDropdownOpen]);

    useEffect(() => {
        if (query.trim().length >= 2 || (selectedFilterAdhigaram && query.trim().length > 0)) {
            const searchTerms = query.toLowerCase();

            // Search Adhigarams
            const uniqueAdhigarams = Array.from(new Set(kurals.map(k => k.adhigaram)));
            const matchedAdhigarams = uniqueAdhigarams.filter(a =>
                a.toLowerCase().includes(searchTerms)
            ).slice(0, 3);

            // Search Kurals
            let filtered = kurals;

            if (selectedFilterAdhigaram) {
                filtered = filtered.filter(k => k.adhigaram === selectedFilterAdhigaram);
            }

            filtered = filtered.filter(k =>
                k.number.toString().includes(searchTerms) ||
                k.line1_ta.includes(searchTerms) ||
                k.line2_ta.includes(searchTerms) ||
                k.transliteration_en.toLowerCase().includes(searchTerms) ||
                k.meaning_en.toLowerCase().includes(searchTerms) ||
                k.adhigaram.toLowerCase().includes(searchTerms)
            ).slice(0, 5);

            setAdhigaramResults(matchedAdhigarams);
            setResults(filtered);
            setIsOpen(true);
        } else {
            setAdhigaramResults([]);
            setResults([]);
            setIsOpen(false);
        }
    }, [query, selectedFilterAdhigaram]);

    const handleSelectKural = (number: number) => {
        setQuery("");
        setIsOpen(false);
        setIsMobileSearchOpen(false);
        router.push(`/kural/${number}`);
    };

    const handleSelectAdhigaram = (adhigaram: string) => {
        setQuery("");
        setIsOpen(false);
        setIsMobileSearchOpen(false);
        router.push(`/browse?adhigaram=${encodeURIComponent(adhigaram)}`);
    };

    const handleCloseMobileSearch = () => {
        setIsMobileSearchOpen(false);
        setIsOpen(false);
    };

    const handleHeroBarClick = () => {
        if (typeof window !== "undefined" && window.innerWidth < 640) {
            setIsMobileSearchOpen(true);
        }
    };

    return (
        <div ref={wrapperRef} className={`relative w-full ${variant === "large" ? "max-w-5xl" : "max-w-md"}`}>
            <div
                onClick={handleHeroBarClick}
                className={`relative flex items-center w-full transition-all duration-300 bg-white/50 dark:bg-slate-900/40 backdrop-blur-md border border-[var(--theme-badge-border)] focus-within:border-[var(--theme-primary)] focus-within:ring-2 focus-within:ring-[var(--theme-primary)]/20 ${variant === "large" ? "rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl dark:shadow-[var(--theme-glow)]" : "rounded-xl hover:bg-white/70 dark:hover:bg-white/10"}`}
            >

                {/* Custom Adhigaram Dropdown (Only for Large variant) */}
                {variant === "large" && (
                    <div className="hidden sm:block border-r border-gray-200 dark:border-white/10 relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full bg-transparent border-none text-slate-800 dark:text-slate-100 text-lg font-medium py-4 px-4 flex items-center gap-3 hover:bg-[var(--theme-badge-bg)] transition-colors focus:outline-none min-w-[280px] justify-between rounded-l-2xl"
                        >
                            <div className="flex items-center gap-2 overflow-hidden">
                                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors bg-[var(--theme-badge-bg)] text-[var(--theme-primary)] border border-[var(--theme-badge-border)]`}>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <span className="truncate max-w-[180px] text-left text-lg">
                                    {selectedFilterAdhigaram || "அதிகாரங்கள்"}
                                </span>
                            </div>
                            <svg
                                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 mt-2 w-full max-h-[400px] overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-xl border border-[var(--theme-badge-border)] shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 flex flex-col">
                                <div className="p-2 border-b border-gray-100 dark:border-white/5">
                                    <input
                                        ref={adhigaramSearchInputRef}
                                        type="text"
                                        placeholder="Search Adhigaram..."
                                        className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-slate-800 border-none focus:outline-none focus:ring-0 text-sm"
                                        value={adhigaramSearch}
                                        onChange={(e) => setAdhigaramSearch(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                                <div className="overflow-y-auto no-scrollbar flex-1" ref={listRef}>
                                    <div
                                        className={`px-4 py-3 cursor-pointer hover:bg-[var(--theme-badge-bg)] transition-colors text-sm text-left ${!selectedFilterAdhigaram ? "text-[var(--theme-primary)] font-semibold bg-[var(--theme-badge-bg)]" : "text-gray-700 dark:text-gray-200"}`}
                                        ref={!selectedFilterAdhigaram ? selectedAdhigaramRef : null}
                                        onClick={() => {
                                            setSelectedFilterAdhigaram("");
                                            setIsDropdownOpen(false);
                                        }}
                                    >
                                        அதிகாரங்கள்
                                    </div>
                                    {filteredDropdownAdhigarams.map(a => (
                                        <div
                                            key={a}
                                            className={`px-4 py-3 cursor-pointer hover:bg-[var(--theme-badge-bg)] transition-colors text-sm border-t border-gray-100 dark:border-white/5 text-left ${selectedFilterAdhigaram === a ? "text-[var(--theme-primary)] font-semibold bg-[var(--theme-badge-bg)]" : "text-gray-700 dark:text-gray-200"}`}
                                            ref={selectedFilterAdhigaram === a ? selectedAdhigaramRef : null}
                                            onClick={() => {
                                                setSelectedFilterAdhigaram(a);
                                                setIsDropdownOpen(false);
                                            }}
                                        >
                                            {a}
                                        </div>
                                    ))}
                                    {filteredDropdownAdhigarams.length === 0 && (
                                        <div className="px-4 py-8 text-center text-sm text-gray-400">
                                            No options found
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex-1 relative flex items-center">
                    <div className="absolute right-3 sm:right-4 pointer-events-none">
                        <div className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg flex items-center justify-center transition-colors bg-[var(--theme-badge-bg)] text-[var(--theme-primary)] border border-[var(--theme-badge-border)]`}>
                            <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                    <input
                        ref={mainInputRef}
                        type="text"
                        placeholder={t.nav.search}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => {
                            if (typeof window !== "undefined" && window.innerWidth < 640) {
                                setIsMobileSearchOpen(true);
                            } else {
                                if (query.length >= 2 || selectedFilterAdhigaram) setIsOpen(true);
                            }
                        }}
                        className={`w-full bg-transparent border-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:ring-0 transition-all ${variant === "large"
                            ? "py-2.5 sm:py-3.5 pl-3.5 sm:pl-6 pr-11 sm:pr-16 text-sm sm:text-lg"
                            : "py-2 sm:py-2.5 pl-3 sm:pl-4 pr-10 sm:pr-14 text-sm"
                            }`}
                    />
                </div>
            </div>

            {/* Desktop Autocomplete Dropdown (Hidden on mobile when full-screen search is used) */}
            <div className="hidden sm:block">
                {isOpen && (adhigaramResults.length > 0 || results.length > 0) && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-xl border border-[var(--theme-badge-border)] shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 text-left max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
                        <div className="p-2 space-y-2">
                            {adhigaramResults.length > 0 && (
                                <div className="mb-2">
                                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-1 uppercase tracking-wider">
                                        {t.browse.adhigaram || "Adhigaram"}
                                    </div>
                                    {adhigaramResults.map((adhigaram) => (
                                        <div
                                            key={adhigaram}
                                            onClick={() => handleSelectAdhigaram(adhigaram)}
                                            className="p-3 hover:bg-[var(--theme-badge-bg)] rounded-lg cursor-pointer transition-colors flex items-center gap-3 group"
                                        >
                                            <div className="p-2 rounded-full bg-[var(--theme-badge-bg)] text-[var(--theme-primary)] border border-[var(--theme-badge-border)]">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                            </div>
                                            <div className="font-medium text-gray-900 dark:text-white group-hover:text-[var(--theme-primary)]">
                                                {adhigaram}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {results.length > 0 && (
                                <div>
                                    {adhigaramResults.length > 0 && (
                                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-1 uppercase tracking-wider border-t border-gray-100 dark:border-white/5 pt-2 mt-2">
                                            {t.nav.kurals || "Kurals"}
                                        </div>
                                    )}
                                    {results.map((kural) => (
                                        <div
                                            key={kural.number}
                                            onClick={() => handleSelectKural(kural.number)}
                                            className="p-4 hover:bg-[var(--theme-badge-bg)] rounded-xl cursor-pointer transition-colors group flex gap-4 items-center border-b border-gray-100 dark:border-white/5 last:border-0"
                                        >
                                            <div className="flex-shrink-0 w-12 h-12 aspect-square flex items-center justify-center rounded-lg bg-gray-100 dark:bg-white/10 group-hover:bg-[var(--theme-badge-bg)] transition-colors">
                                                <span className="text-sm font-bold font-[family-name:var(--font-outfit)] text-gray-500 dark:text-gray-400 group-hover:text-[var(--theme-primary)]">
                                                    #{kural.number}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-gray-900 dark:text-gray-100 text-base group-hover:text-[var(--theme-primary)] truncate">
                                                    {kural.line1_ta}
                                                </p>
                                                <p className="font-bold text-gray-900 dark:text-gray-100 text-base group-hover:text-[var(--theme-primary)] truncate">
                                                    {kural.line2_ta}
                                                </p>
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-300 group-hover:text-[var(--theme-primary)] transition-colors ml-2 flex-shrink-0">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                            </svg>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Native Android Mobile Full-Screen Top Search Overlay */}
            {mounted && isMobileSearchOpen && createPortal(
                <div className="fixed inset-0 z-[9999] bg-[var(--background)] flex flex-col p-3 pt-[max(env(safe-area-inset-top,0px),0.75rem)] pb-[max(env(safe-area-inset-bottom,0px),1rem)] sm:hidden animate-in fade-in duration-200">
                    {/* Top search bar with Back Arrow, Input, Clear Button */}
                    <div className="flex items-center gap-2 w-full pt-1 pb-2.5 border-b border-[var(--theme-badge-border)] shrink-0">
                        <button
                            type="button"
                            onClick={handleCloseMobileSearch}
                            className="p-2 -ml-1 rounded-full text-gray-700 dark:text-gray-200 hover:bg-[var(--theme-badge-bg)] active:scale-95 transition-all shrink-0 cursor-pointer"
                            aria-label="Back"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>

                        <div className="flex-1 relative flex items-center bg-white/80 dark:bg-slate-900/60 rounded-xl border border-[var(--theme-badge-border)] focus-within:border-[var(--theme-primary)] focus-within:ring-2 focus-within:ring-[var(--theme-primary)]/20 px-3 py-2 transition-all shadow-sm">
                            <input
                                ref={mobileSearchInputRef}
                                type="text"
                                placeholder={t.nav.search}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full bg-transparent border-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:ring-0 text-base"
                                autoFocus
                            />
                            {query && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setQuery("");
                                        mobileSearchInputRef.current?.focus();
                                    }}
                                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 shrink-0 ml-1 cursor-pointer"
                                    aria-label="Clear"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                            <div className="ml-1.5 shrink-0 text-[var(--theme-primary)]">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Adhigaram Filter Chip if active */}
                    {selectedFilterAdhigaram && (
                        <div className="flex items-center gap-2 pt-2.5 pb-1 shrink-0">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--theme-badge-bg)] text-[var(--theme-primary)] border border-[var(--theme-badge-border)]">
                                <span>{selectedFilterAdhigaram}</span>
                                <button
                                    type="button"
                                    onClick={() => setSelectedFilterAdhigaram("")}
                                    className="hover:text-rose-500 font-bold ml-1 cursor-pointer"
                                >
                                    ✕
                                </button>
                            </span>
                        </div>
                    )}

                    {/* Results Container */}
                    <div className="flex-1 overflow-y-auto no-scrollbar pt-3 pb-8 space-y-3">
                        {adhigaramResults.length > 0 && (
                            <div>
                                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 px-1 py-1 uppercase tracking-wider">
                                    {t.browse.adhigaram || "Adhigaram"}
                                </div>
                                <div className="space-y-1.5 mt-1">
                                    {adhigaramResults.map((adhigaram) => (
                                        <div
                                            key={adhigaram}
                                            onClick={() => handleSelectAdhigaram(adhigaram)}
                                            className="p-3 bg-white/70 dark:bg-slate-900/50 hover:bg-[var(--theme-badge-bg)] rounded-xl border border-black/5 dark:border-white/5 cursor-pointer transition-colors flex items-center justify-between group active:scale-[0.99]"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <div className="p-1.5 rounded-lg bg-[var(--theme-badge-bg)] text-[var(--theme-primary)] border border-[var(--theme-badge-border)]">
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                    </svg>
                                                </div>
                                                <span className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-[var(--theme-primary)]">
                                                    {adhigaram}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-400 group-hover:text-[var(--theme-primary)]">→</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {results.length > 0 && (
                            <div>
                                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 px-1 py-1 uppercase tracking-wider">
                                    {t.nav.kurals || "Kurals"} ({results.length})
                                </div>
                                <div className="space-y-2 mt-1">
                                    {results.map((kural) => (
                                        <div
                                            key={kural.number}
                                            onClick={() => handleSelectKural(kural.number)}
                                            className="p-3 bg-white/70 dark:bg-slate-900/50 hover:bg-[var(--theme-badge-bg)] rounded-xl border border-black/5 dark:border-white/5 cursor-pointer transition-all active:scale-[0.99] flex gap-3 items-center group"
                                        >
                                            <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center bg-[var(--theme-badge-bg)] text-[var(--theme-primary)] border border-[var(--theme-badge-border)] font-bold text-xs font-mono">
                                                #{kural.number}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-xs text-gray-900 dark:text-gray-100 group-hover:text-[var(--theme-primary)] truncate">
                                                    {kural.line1_ta}
                                                </p>
                                                <p className="font-semibold text-xs text-gray-900 dark:text-gray-100 group-hover:text-[var(--theme-primary)] truncate">
                                                    {kural.line2_ta}
                                                </p>
                                                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                                    {kural.adhigaram}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {query.trim().length >= 2 && results.length === 0 && adhigaramResults.length === 0 && (
                            <div className="py-12 text-center text-sm text-gray-400">
                                <p className="font-medium text-gray-600 dark:text-gray-300">முடிவுகள் எதுவும் இல்லை</p>
                                <p className="text-xs text-gray-400 mt-1">வேறு சொல் அல்லது குறள் எண் தட்டச்சு செய்து பார்க்கவும்.</p>
                            </div>
                        )}

                        {query.trim().length < 2 && !selectedFilterAdhigaram && (
                            <div className="pt-2 space-y-3">
                                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 px-1 uppercase tracking-wider">
                                    பிரபலமான அதிகாரங்கள்
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {POPULAR_ADHIGARAMS.map((adh) => (
                                        <button
                                            key={adh}
                                            type="button"
                                            onClick={() => {
                                                setQuery(adh);
                                                mobileSearchInputRef.current?.focus();
                                            }}
                                            className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/70 dark:bg-white/5 border border-black/5 dark:border-white/10 hover:border-[var(--theme-primary)] text-slate-700 dark:text-slate-300 active:scale-95 transition-all cursor-pointer"
                                        >
                                            {adh}
                                        </button>
                                    ))}
                                </div>
                                <div className="text-xs text-gray-400 px-1 pt-2">
                                    குறள் எண் (1-1330), சொல் அல்லது அதிகாரப் பெயரைத் தட்டச்சு செய்யவும்.
                                </div>
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
