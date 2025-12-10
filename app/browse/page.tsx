"use client";

import { useState, useMemo } from "react";
import KuralCard from "@/components/KuralCard";
import kuralsData from "@/data/thirukkural.json";
import { Kural } from "@/types/thirukkural";
import { useLanguage } from "@/lib/context/LanguageContext";

const ITEMS_PER_PAGE = 12;

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Suspense, useCallback } from "react";

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
        return Array.from(new Set(filtered.map((k) => k.adhigaram)));
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
            <div className="glass-card p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                        value={selectedPaal}
                        onChange={(e) => updateFilters({ paal: e.target.value, iyal: null, adhigaram: null })}
                        className="glass-input w-full bg-light/50 dark:bg-slate-800/50 text-gray-900 dark:text-white"
                    >
                        <option value="">{t.browse.allPaal}</option>
                        {paals.map((p) => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>

                    <select
                        value={selectedIyal}
                        onChange={(e) => updateFilters({ iyal: e.target.value, adhigaram: null })}
                        className="glass-input w-full bg-light/50 dark:bg-slate-800/50 text-gray-900 dark:text-white"
                    >
                        <option value="">{t.browse.allIyal}</option>
                        {iyals.map((i) => (
                            <option key={i} value={i}>{i}</option>
                        ))}
                    </select>

                    <select
                        value={selectedAdhigaram}
                        onChange={(e) => updateFilters({ adhigaram: e.target.value })}
                        className="glass-input w-full bg-light/50 dark:bg-slate-800/50 text-gray-900 dark:text-white"
                    >
                        <option value="">{t.browse.allAdhigaram}</option>
                        {adhigarams.map((a) => (
                            <option key={a} value={a}>{a}</option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end">
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
