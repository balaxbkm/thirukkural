"use client";

import { useLanguage } from "@/lib/context/LanguageContext";
import { useState, useEffect, useRef, useMemo, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { Kural } from "@/types/thirukkural";
import kuralsData from "@/data/thirukkural.json";
import { adhigaramTitles, adhigaramTransliterations } from "@/lib/adhigaram-titles";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

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
    const router = useRouter();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const adhigaramSearchInputRef = useRef<HTMLInputElement>(null);
    const selectedAdhigaramRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

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
        router.push(`/kural/${number}`);
    };

    const handleSelectAdhigaram = (adhigaram: string) => {
        setQuery("");
        setIsOpen(false);
        router.push(`/browse?adhigaram=${encodeURIComponent(adhigaram)}`);
    }

    return (
        <div ref={wrapperRef} className={`relative w-full ${variant === "large" ? "max-w-5xl" : "max-w-md"}`}>
            <div className={`relative flex items-center w-full transition-all duration-300 bg-white/10 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/20 ${isOpen ? "ring-2 ring-blue-500/50" : ""} ${variant === "large" ? "rounded-2xl shadow-lg hover:shadow-xl dark:shadow-blue-900/10" : "rounded-xl hover:bg-white/20 dark:hover:bg-white/10"}`}>

                {/* Custom Adhigaram Dropdown (Only for Large variant) */}
                {variant === "large" && (
                    <div className="hidden sm:block border-r border-gray-200 dark:border-white/10 relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full bg-transparent border-none text-gray-700 dark:text-blue-100 text-lg font-medium py-4 px-4 flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none min-w-[280px] justify-between rounded-l-2xl"
                        >
                            <div className="flex items-center gap-2 overflow-hidden">
                                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400`}>
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
                            <div className="absolute top-full left-0 mt-2 w-full max-h-[400px] overflow-hidden bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 flex flex-col">
                                <div className="p-2 border-b border-gray-100 dark:border-white/5">
                                    <input
                                        ref={adhigaramSearchInputRef}
                                        type="text"
                                        placeholder="Search Adhigaram..."
                                        className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                                        value={adhigaramSearch}
                                        onChange={(e) => setAdhigaramSearch(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                                <div className="overflow-y-auto no-scrollbar flex-1" ref={listRef}>
                                    <div
                                        className={`px-4 py-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-white/5 transition-colors text-sm text-left ${!selectedFilterAdhigaram ? "text-blue-600 font-semibold bg-blue-50/50 dark:bg-blue-900/20" : "text-gray-700 dark:text-gray-200"}`}
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
                                            className={`px-4 py-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-white/5 transition-colors text-sm border-t border-gray-100 dark:border-white/5 text-left ${selectedFilterAdhigaram === a ? "text-blue-600 font-semibold bg-blue-50/50 dark:bg-blue-900/20" : "text-gray-700 dark:text-gray-200"}`}
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
                    <div className="absolute right-4 pointer-events-none">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400`}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                    <input
                        type="text"
                        placeholder={t.nav.search}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => (query.length >= 2 || selectedFilterAdhigaram) && setIsOpen(true)}
                        className={`w-full bg-transparent border-none text-gray-900 dark:text-blue-50 placeholder-gray-500 dark:placeholder-blue-200/50 focus:ring-0 transition-all ${variant === "large"
                            ? "py-4 pl-6 pr-16 text-lg"
                            : "py-2.5 pl-4 pr-14 text-sm"
                            }`}
                    />
                </div>
            </div>

            {isOpen && (adhigaramResults.length > 0 || results.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 text-left max-h-[60vh] overflow-y-auto">
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
                                        className="p-3 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg cursor-pointer transition-colors flex items-center gap-3 group"
                                    >
                                        <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-800/30 text-purple-600 dark:text-purple-300">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </div>
                                        <div className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
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
                                        className="p-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl cursor-pointer transition-colors group flex gap-4 items-center border-b border-gray-100 dark:border-white/5 last:border-0"
                                    >
                                        <div className="flex-shrink-0 w-12 h-12 aspect-square flex items-center justify-center rounded-lg bg-gray-100 dark:bg-white/10 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                                            <span className="text-sm font-bold font-[family-name:var(--font-outfit)] text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-300">
                                                #{kural.number}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-900 dark:text-gray-100 text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                                                {kural.line1_ta}
                                            </p>
                                            <p className="font-bold text-gray-900 dark:text-gray-100 text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                                                {kural.line2_ta}
                                            </p>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors ml-2 flex-shrink-0">
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
    );
}
