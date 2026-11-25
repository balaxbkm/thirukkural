"use client";

import { useState, useMemo, useEffect } from "react";
import KuralCard from "@/components/KuralCard";
import CustomSelect from "@/components/CustomSelect";
import PageTitle from "@/components/PageTitle";
import kuralsData from "@/data/thirukkural.json";
import { Kural } from "@/types/thirukkural";
import { useLanguage } from "@/lib/context/LanguageContext";
const DEFAULT_ITEMS_PER_PAGE = 12;
const DESKTOP_PER_PAGE_OPTIONS = [12, 24, 48, 96];

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Suspense, useCallback } from "react";
import { adhigaramTitles, adhigaramTransliterations } from "@/lib/adhigaram-titles";

export default function BrowsePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BrowseContent />
        </Suspense>
    );
}

function BrowseContent() {
    const { t } = useLanguage();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const kurals = kuralsData as Kural[];

    // URL State
    const urlPaal = searchParams.get("paal") || "";
    const urlIyal = searchParams.get("iyal") || "";
    const urlAdhigaram = searchParams.get("adhigaram") || "";

    const [adhigaramPaalHint, adhigaramName] = urlAdhigaram.includes("::")
        ? urlAdhigaram.split("::", 2)
        : ["", urlAdhigaram];

    const matchedAdhigaramKural = useMemo(
        () => {
            if (!adhigaramName) return undefined;
            const paalFilter = urlPaal || adhigaramPaalHint;
            return kurals.find(
                (k) => k.adhigaram === adhigaramName && (!paalFilter || k.paal === paalFilter)
            );
        },
        [kurals, adhigaramName, urlPaal, adhigaramPaalHint]
    );

    const matchedIyalKural = useMemo(
        () => (urlIyal ? kurals.find((k) => k.iyal === urlIyal) : undefined),
        [kurals, urlIyal]
    );

    const selectedPaal = urlPaal || adhigaramPaalHint || matchedAdhigaramKural?.paal || matchedIyalKural?.paal || "";
    const selectedIyal = urlIyal || matchedAdhigaramKural?.iyal || "";
    const selectedAdhigaram = adhigaramName;
    const urlQuery = searchParams.get("q") || "";
    const urlPerPage = Number(searchParams.get("perPage"));
    const desktopPerPage = DESKTOP_PER_PAGE_OPTIONS.includes(urlPerPage) ? urlPerPage : DEFAULT_ITEMS_PER_PAGE;
    const currentPage = Number(searchParams.get("page")) || 1;

    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const media = window.matchMedia("(min-width: 768px)");
        const update = () => setIsDesktop(media.matches);
        update();
        media.addEventListener("change", update);
        return () => media.removeEventListener("change", update);
    }, []);

    const itemsPerPage = isDesktop ? desktopPerPage : DEFAULT_ITEMS_PER_PAGE;

    const [searchQuery, setSearchQuery] = useState(urlQuery);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [jumpPageInput, setJumpPageInput] = useState(String(currentPage));

    useEffect(() => {
        setSearchQuery(urlQuery);
    }, [urlQuery]);

    const activeFilterCount = [selectedPaal, selectedIyal, selectedAdhigaram].filter(Boolean).length;
    const hasActiveFilters = Boolean(searchQuery.trim() || activeFilterCount > 0);

    // Helper to update URL
    const updateFilters = useCallback((updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === "") {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });

        // Always reset page on filter change if not explicitly updating page
        if (!updates.hasOwnProperty("page")) {
            params.delete("page");
        }

        const keepScroll = updates.hasOwnProperty("page") || updates.hasOwnProperty("perPage");
        router.push(`${pathname}?${params.toString()}`, { scroll: !keepScroll });
    }, [pathname, router, searchParams]);

    // Derived Lists (Dependent Options)
    const paals = useMemo(() => Array.from(new Set(kurals.map((k) => k.paal))), [kurals]);

    const iyals = useMemo(() => {
        let filtered = kurals;
        if (selectedPaal) filtered = filtered.filter(k => k.paal === selectedPaal);
        return Array.from(new Set(filtered.map((k) => k.iyal)));
    }, [kurals, selectedPaal]);

    const adhigarams = useMemo(() => {
        let filtered = kurals;
        if (selectedPaal) filtered = filtered.filter(k => k.paal === selectedPaal);
        if (selectedIyal) filtered = filtered.filter(k => k.iyal === selectedIyal);

        const seen = new Map<string, { paal: string; iyal: string; adhigaram: string }>();
        for (const k of filtered) {
            const key = `${k.paal}::${k.iyal}::${k.adhigaram}`;
            if (!seen.has(key)) {
                seen.set(key, { paal: k.paal, iyal: k.iyal, adhigaram: k.adhigaram });
            }
        }

        const nameCounts = new Map<string, number>();
        for (const item of seen.values()) {
            nameCounts.set(item.adhigaram, (nameCounts.get(item.adhigaram) || 0) + 1);
        }

        return Array.from(seen.values()).map((item) => {
            const isDuplicateName = (nameCounts.get(item.adhigaram) || 0) > 1;
            return {
                value: isDuplicateName ? `${item.paal}::${item.adhigaram}` : item.adhigaram,
                label: isDuplicateName ? `${item.adhigaram} (${item.iyal})` : item.adhigaram,
                searchKey: (adhigaramTitles[item.adhigaram] || "") + " " + (adhigaramTransliterations[item.adhigaram] || "") + " " + item.iyal
            };
        });
    }, [kurals, selectedPaal, selectedIyal]);

    const adhigaramSelectValue = useMemo(() => {
        if (!selectedAdhigaram) return "";
        const composite = `${selectedPaal}::${selectedAdhigaram}`;
        if (adhigarams.some((a) => a.value === composite)) return composite;
        return selectedAdhigaram;
    }, [adhigarams, selectedAdhigaram, selectedPaal]);

    // Filter Logic
    const filteredKurals = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return kurals.filter((k) => {
            if (selectedPaal && k.paal !== selectedPaal) return false;
            if (selectedIyal && k.iyal !== selectedIyal) return false;
            if (selectedAdhigaram && k.adhigaram !== selectedAdhigaram) return false;
            if (q) {
                const adhEn = adhigaramTitles[k.adhigaram] || "";
                const adhTranslit = adhigaramTransliterations[k.adhigaram] || "";
                const matches =
                    k.number.toString() === q ||
                    k.number.toString().includes(q) ||
                    k.line1_ta.toLowerCase().includes(q) ||
                    k.line2_ta.toLowerCase().includes(q) ||
                    k.meaning_ta.toLowerCase().includes(q) ||
                    k.meaning_en.toLowerCase().includes(q) ||
                    k.transliteration_en.toLowerCase().includes(q) ||
                    k.adhigaram.toLowerCase().includes(q) ||
                    adhEn.toLowerCase().includes(q) ||
                    adhTranslit.toLowerCase().includes(q);
                if (!matches) return false;
            }
            return true;
        });
    }, [kurals, selectedPaal, selectedIyal, selectedAdhigaram, searchQuery]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredKurals.length / itemsPerPage);
    const safeCurrentPage = Math.min(currentPage, Math.max(1, totalPages));
    const currentKurals = filteredKurals.slice(
        (safeCurrentPage - 1) * itemsPerPage,
        safeCurrentPage * itemsPerPage
    );

    useEffect(() => {
        setJumpPageInput(String(safeCurrentPage));
    }, [safeCurrentPage]);

    const goToPage = useCallback((targetPage: number) => {
        const clamped = Math.max(1, Math.min(totalPages || 1, targetPage));
        if (clamped === safeCurrentPage && currentPage === clamped) return;
        updateFilters({ page: String(clamped) });
    }, [currentPage, safeCurrentPage, totalPages, updateFilters]);

    useEffect(() => {
        if (totalPages <= 1) return;
        const onKeyDown = (e: KeyboardEvent) => {
            const tag = (e.target as HTMLElement)?.tagName;
            if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
            if (e.key === "ArrowLeft" && safeCurrentPage > 1) {
                goToPage(safeCurrentPage - 1);
            } else if (e.key === "ArrowRight" && safeCurrentPage < totalPages) {
                goToPage(safeCurrentPage + 1);
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [safeCurrentPage, totalPages, goToPage]);

    const handleJumpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const parsed = parseInt(jumpPageInput, 10);
        if (!Number.isNaN(parsed)) {
            goToPage(parsed);
        } else {
            setJumpPageInput(String(safeCurrentPage));
        }
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        const params = new URLSearchParams(searchParams.toString());
        if (value.trim()) {
            params.set("q", value);
        } else {
            params.delete("q");
        }
        params.delete("page");
        const qs = params.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    };

    const resetFilters = () => {
        setSearchQuery("");
        router.push(pathname);
    };

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="text-center space-y-3 sm:space-y-4 pt-2">
                <PageTitle title={t.browse.title} />
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto px-2">
                    {t.browse.subtitle}
                </p>
            </div>

            {/* Filters */}
            <div className="glass-card p-3 sm:p-5 space-y-3 relative z-20">
                {/* Search & Action Row */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex-1 min-w-0 flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 h-11 sm:h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 focus-within:border-[var(--theme-primary)] focus-within:ring-2 focus-within:ring-[var(--theme-primary)]/20 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all duration-200">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--theme-primary)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            id="browse-search-input"
                            type="text"
                            aria-label={t.browse.searchLabel}
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            placeholder={t.browse.searchPlaceholder}
                            className="w-full min-w-0 bg-transparent text-sm sm:text-base font-medium text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => handleSearchChange("")}
                                aria-label="Clear search"
                                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Mobile Filters Toggle Button (inline with search) */}
                    <button
                        type="button"
                        onClick={() => setIsFiltersOpen((prev) => !prev)}
                        aria-expanded={isFiltersOpen}
                        aria-label={t.browse.filters}
                        className={`md:hidden inline-flex items-center gap-1.5 h-11 px-3 rounded-xl border text-xs sm:text-sm font-medium transition-all shrink-0 ${
                            isFiltersOpen || activeFilterCount > 0
                                ? "border-[var(--theme-primary)] bg-[var(--theme-badge-bg)] text-[var(--theme-primary)]"
                                : "border-gray-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-slate-900"
                        }`}
                    >
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        <span className="hidden xs:inline">{t.browse.filters}</span>
                        {activeFilterCount > 0 && (
                            <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--theme-primary)] text-white text-[10px] font-bold">
                                {activeFilterCount}
                            </span>
                        )}
                        <svg
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${isFiltersOpen ? "rotate-180" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Desktop Reset Button */}
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="hidden md:inline-flex items-center gap-1.5 h-12 px-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 hover:border-[var(--theme-badge-border)] text-sm font-medium text-[var(--theme-primary)] transition-all shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>{t.browse.clearFilters}</span>
                        </button>
                    )}
                </div>

                <div className={`${isFiltersOpen ? "grid pt-3 border-t border-gray-200/60 dark:border-white/10" : "hidden md:grid"} grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4`}>
                    <CustomSelect
                        label={t.browse.paal}
                        value={selectedPaal}
                        options={paals}
                        onChange={(val) => updateFilters({ paal: val, iyal: null, adhigaram: null })}
                        placeholder={t.browse.allPaal}
                        icon={
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        }
                    />

                    <CustomSelect
                        label={t.browse.iyal}
                        value={selectedIyal}
                        options={iyals}
                        onChange={(val) => updateFilters({ paal: selectedPaal || null, iyal: val, adhigaram: null })}
                        placeholder={t.browse.allIyal}
                        icon={
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        }
                    />

                    <CustomSelect
                        label={t.browse.adhigaram}
                        value={adhigaramSelectValue}
                        options={adhigarams}
                        onChange={(val) => {
                            if (val.includes("::")) {
                                const [p, adh] = val.split("::", 2);
                                const match = kurals.find((k) => k.paal === p && k.adhigaram === adh);
                                updateFilters({ paal: p, iyal: match?.iyal || null, adhigaram: val });
                            } else {
                                updateFilters({ adhigaram: val });
                            }
                        }}
                        placeholder={t.browse.allAdhigaram}
                        icon={
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        }
                        enableSearch={true}
                    />
                </div>
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between gap-2 text-gray-500 dark:text-gray-400 text-sm">
                <div>
                    {t.browse.showing} <span className="font-semibold text-gray-900 dark:text-white">{filteredKurals.length}</span> {t.browse.results}
                </div>

                {/* Desktop Per-Page Selector */}
                <div className="hidden md:flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {t.nav.kurals || "Kurals"} / {t.browse.page}:
                    </span>
                    <div className="inline-flex items-center p-1 rounded-xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md">
                        {DESKTOP_PER_PAGE_OPTIONS.map((count) => {
                            const isActive = desktopPerPage === count;
                            return (
                                <button
                                    key={count}
                                    type="button"
                                    onClick={() => updateFilters({ perPage: count === DEFAULT_ITEMS_PER_PAGE ? null : String(count) })}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                                        isActive
                                            ? "bg-[var(--theme-primary)] text-white shadow-sm"
                                            : "text-gray-600 dark:text-gray-300 hover:text-[var(--theme-primary)] hover:bg-white/70 dark:hover:bg-white/10"
                                    }`}
                                >
                                    {count}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={resetFilters}
                        className="md:hidden inline-flex items-center gap-1 text-xs font-medium text-[var(--theme-primary)] hover:underline shrink-0"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>{t.browse.clearFilters}</span>
                    </button>
                )}
            </div>

            {/* Grid */}
            {filteredKurals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {currentKurals.map((kural) => (
                        <KuralCard key={kural.number} kural={kural} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-gray-500">
                    <p className="text-xl">{t.browse.noResults}</p>
                    <button onClick={resetFilters} className="mt-4 text-[var(--theme-primary)] hover:underline">
                        {t.browse.clearFilters}
                    </button>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2 sm:pt-4 mt-4 sm:mt-6">
                    <div className="glass-card min-h-[48px] sm:h-[52px] px-2.5 py-1.5 sm:px-3.5 rounded-2xl flex flex-wrap justify-center items-center gap-1 sm:gap-1.5 border border-white/80 dark:border-white/10 shadow-sm">
                        <button
                            type="button"
                            onClick={() => goToPage(safeCurrentPage - 1)}
                            disabled={safeCurrentPage === 1}
                            aria-label={t.browse.previous}
                            className="group px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1 text-gray-700 dark:text-gray-200 hover:bg-white/70 dark:hover:bg-white/10 hover:text-[var(--theme-primary)] disabled:opacity-40 disabled:pointer-events-none active:scale-95 transition-all cursor-pointer"
                        >
                            <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="hidden xs:inline">{t.browse.previous}</span>
                        </button>

                        {(() => {
                            const range = [];
                            const delta = 1;

                            for (let i = 1; i <= totalPages; i++) {
                                if (
                                    i === 1 ||
                                    i === totalPages ||
                                    (i >= safeCurrentPage - delta && i <= safeCurrentPage + delta)
                                ) {
                                    range.push(i);
                                }
                            }

                            const rangeWithDots: { type: "page" | "dots"; value: number; key: string }[] = [];
                            let l: number | null = null;

                            for (const i of range) {
                                if (l) {
                                    if (i - l === 2) {
                                        rangeWithDots.push({ type: "page", value: l + 1, key: `p-${l + 1}` });
                                    } else if (i - l !== 1) {
                                        const jumpTarget = i > safeCurrentPage ? Math.min(totalPages, safeCurrentPage + 5) : Math.max(1, safeCurrentPage - 5);
                                        rangeWithDots.push({ type: "dots", value: jumpTarget, key: `dots-${l}-${i}` });
                                    }
                                }
                                rangeWithDots.push({ type: "page", value: i, key: `p-${i}` });
                                l = i;
                            }

                            return rangeWithDots.map((item) =>
                                item.type === "dots" ? (
                                    <button
                                        key={item.key}
                                        type="button"
                                        onClick={() => goToPage(item.value)}
                                        title={`${t.browse.page} ${item.value}`}
                                        className="px-2 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-gray-400 hover:text-[var(--theme-primary)] hover:bg-white/60 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                                    >
                                        •••
                                    </button>
                                ) : (
                                    <button
                                        key={item.key}
                                        type="button"
                                        onClick={() => goToPage(item.value)}
                                        aria-current={item.value === safeCurrentPage ? "page" : undefined}
                                        className={`min-w-[34px] sm:min-w-[38px] px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold font-mono transition-all cursor-pointer active:scale-95 ${
                                            item.value === safeCurrentPage
                                                ? "bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white shadow-md shadow-[var(--theme-glow)] scale-105"
                                                : "text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-white/10 hover:text-[var(--theme-primary)]"
                                        }`}
                                    >
                                        {item.value}
                                    </button>
                                )
                            );
                        })()}

                        <button
                            type="button"
                            onClick={() => goToPage(safeCurrentPage + 1)}
                            disabled={safeCurrentPage === totalPages}
                            aria-label={t.browse.next}
                            className="group px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1 text-gray-700 dark:text-gray-200 hover:bg-white/70 dark:hover:bg-white/10 hover:text-[var(--theme-primary)] disabled:opacity-40 disabled:pointer-events-none active:scale-95 transition-all cursor-pointer"
                        >
                            <span className="hidden xs:inline">{t.browse.next}</span>
                            <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Quick Jump to Page */}
                    <form
                        onSubmit={handleJumpSubmit}
                        className="glass-card min-h-[48px] sm:h-[52px] px-3 py-1.5 rounded-2xl border border-white/80 dark:border-white/10 flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 shadow-sm"
                    >
                        <span>{t.browse.page}</span>
                        <input
                            type="number"
                            min={1}
                            max={totalPages}
                            value={jumpPageInput}
                            onChange={(e) => setJumpPageInput(e.target.value)}
                            aria-label={t.browse.page}
                            className="w-14 h-9 px-2 rounded-xl border border-gray-200 dark:border-white/15 bg-white/70 dark:bg-slate-900/60 text-center font-mono font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[var(--theme-primary)]"
                        />
                        <span className="font-mono">/ {totalPages}</span>
                        <button
                            type="submit"
                            className="h-9 px-3.5 rounded-xl bg-[var(--theme-badge-bg)] border border-[var(--theme-badge-border)] text-[var(--theme-badge-text)] font-semibold hover:scale-105 active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center"
                        >
                            Go
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
