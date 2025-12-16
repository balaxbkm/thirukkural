"use client";

import { useState, useMemo } from "react";
import KuralCard from "@/components/KuralCard";
import CustomSelect from "@/components/CustomSelect";
import kuralsData from "@/data/thirukkural.json";
import { Kural } from "@/types/thirukkural";
import { useLanguage } from "@/lib/context/LanguageContext";
const ITEMS_PER_PAGE = 12;

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

    // URL State
    const selectedPaal = searchParams.get("paal") || "";
    const selectedIyal = searchParams.get("iyal") || "";
    const selectedAdhigaram = searchParams.get("adhigaram") || "";
    const currentPage = Number(searchParams.get("page")) || 1;

    const kurals = kuralsData as Kural[];

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

        router.push(`${pathname}?${params.toString()}`);
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
        const unique = Array.from(new Set(filtered.map((k) => k.adhigaram)));

        return unique.map(adh => ({
            value: adh,
            label: adh,
            searchKey: (adhigaramTitles[adh] || "") + " " + (adhigaramTransliterations[adh] || "")
        }));
    }, [kurals, selectedPaal, selectedIyal]);

    // Filter Logic
    const filteredKurals = useMemo(() => {
        return kurals.filter((k) => {
            if (selectedPaal && k.paal !== selectedPaal) return false;
            if (selectedIyal && k.iyal !== selectedIyal) return false;
            if (selectedAdhigaram && k.adhigaram !== selectedAdhigaram) return false;
            return true;
        });
    }, [kurals, selectedPaal, selectedIyal, selectedAdhigaram]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredKurals.length / ITEMS_PER_PAGE);
    const currentKurals = filteredKurals.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const resetFilters = () => {
        router.push(pathname);
    };

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                    {t.browse.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    {t.browse.subtitle}
                </p>
            </div>

            {/* Filters */}
            <div className="glass-card p-4 sm:p-6 space-y-4 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        onChange={(val) => updateFilters({ iyal: val, adhigaram: null })}
                        placeholder={t.browse.allIyal}
                        icon={
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        }
                    />

                    <CustomSelect
                        label={t.browse.adhigaram}
                        value={selectedAdhigaram}
                        options={adhigarams}
                        onChange={(val) => updateFilters({ adhigaram: val })}
                        placeholder={t.browse.allAdhigaram}
                        icon={
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        }
                        enableSearch={true}
                    />
                </div>

                <div className="flex justify-end mt-1.5">
                    <button
                        onClick={resetFilters}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        {t.browse.clearFilters}
                    </button>
                </div>
            </div>

            {/* Results Info */}
            <div className="text-gray-500 dark:text-gray-400 text-sm">
                {t.browse.showing} <span className="font-semibold text-gray-900 dark:text-white">{filteredKurals.length}</span> {t.browse.results}
            </div>

            {/* Grid */}
            {filteredKurals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentKurals.map((kural) => (
                        <KuralCard key={kural.number} kural={kural} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-gray-500">
                    <p className="text-xl">{t.browse.noResults}</p>
                    <button onClick={resetFilters} className="mt-4 text-blue-500 hover:underline">
                        {t.browse.clearFilters}
                    </button>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center flex-wrap items-center gap-2 pt-8 border-t border-gray-200 dark:border-white/10 mt-8">
                    <button
                        onClick={() => updateFilters({ page: String(Math.max(1, currentPage - 1)) })}
                        disabled={currentPage === 1}
                        className="glass-btn px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-sm"
                    >
                        {t.browse.previous}
                    </button>

                    {(() => {
                        const range = [];
                        const delta = 2; // Number of pages to show on each side of current page

                        for (let i = 1; i <= totalPages; i++) {
                            if (
                                i === 1 || // First Page
                                i === totalPages || // Last Page
                                (i >= currentPage - delta && i <= currentPage + delta) // Range around current page
                            ) {
                                range.push(i);
                            }
                        }

                        // Add ellipses
                        const rangeWithDots: (number | string)[] = [];
                        let l: number | null = null;

                        for (const i of range) {
                            if (l) {
                                if (i - l === 2) {
                                    rangeWithDots.push(l + 1);
                                } else if (i - l !== 1) {
                                    rangeWithDots.push("...");
                                }
                            }
                            rangeWithDots.push(i);
                            l = i;
                        }

                        return rangeWithDots.map((page, index) => (
                            <button
                                key={index}
                                onClick={() => typeof page === 'number' ? updateFilters({ page: String(page) }) : null}
                                disabled={typeof page !== 'number'}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${page === currentPage
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                                    : typeof page === 'number'
                                        ? "glass-btn text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                                        : "cursor-default text-gray-400"
                                    }`}
                            >
                                {page}
                            </button>
                        ));
                    })()}

                    <button
                        onClick={() => updateFilters({ page: String(Math.min(totalPages, currentPage + 1)) })}
                        disabled={currentPage === totalPages}
                        className="glass-btn px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-sm"
                    >
                        {t.browse.next}
                    </button>
                </div>
            )}
        </div>
    );
}
