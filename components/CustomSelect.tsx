"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface CustomSelectProps {
    label: string;
    options: (string | SelectOption)[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    icon?: React.ReactNode;
    enableSearch?: boolean;
}

export interface SelectOption {
    value: string;
    label: string;
    searchKey?: string;
}

export default function CustomSelect({
    label,
    options,
    value,
    onChange,
    placeholder = "Select...",
    icon,
    enableSearch = false
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const selectedOptionRef = useRef<HTMLButtonElement>(null);

    // Normalize options to SelectOption[]
    const normalizedOptions: SelectOption[] = options.map(opt =>
        typeof opt === 'string' ? { value: opt, label: opt, searchKey: opt } : opt
    );

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus search input when opened
    useEffect(() => {
        if (isOpen && enableSearch && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        }
        if (!isOpen) {
            setSearchTerm("");
        }
    }, [isOpen, enableSearch]);

    useIsomorphicLayoutEffect(() => {
        if (isOpen && selectedOptionRef.current && listRef.current) {
            const itemHeight = selectedOptionRef.current.offsetHeight;
            listRef.current.scrollTop = selectedOptionRef.current.offsetTop - (itemHeight * 3);
        }
    }, [isOpen]);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchTerm("");
    };

    const filteredOptions = normalizedOptions.filter(option => {
        const searchAgainst = (option.label + " " + (option.searchKey || "")).toLowerCase();
        return searchAgainst.includes(searchTerm.toLowerCase());
    });

    // Find label for current value
    const currentLabel = normalizedOptions.find(o => o.value === value)?.label || value;

    return (
        <div className="relative w-full" ref={containerRef}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full text-left px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border transition-all duration-200 flex items-center justify-between min-h-[50px]
                    ${isOpen
                        ? 'border-[var(--theme-primary)] ring-2 ring-[var(--theme-primary)]/20 bg-white dark:bg-slate-900 shadow-lg'
                        : 'border-gray-200 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900'
                    }
                `}
            >
                <div className="flex items-center gap-2.5 sm:gap-3 overflow-hidden min-w-0">
                    {icon && (
                        <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-colors ${isOpen ? 'bg-[var(--theme-badge-bg)] text-[var(--theme-primary)]' : 'bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-gray-400'
                            }`}>
                            {icon}
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <span className="text-[10px] sm:text-xs font-semibold text-[var(--theme-primary)] uppercase tracking-wider block leading-tight">
                            {label}
                        </span>
                        <span className={`block font-medium truncate text-sm sm:text-base ${value ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                            {currentLabel || placeholder}
                        </span>
                    </div>
                </div>

                <svg
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 shrink-0 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[var(--theme-primary)]' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-[var(--theme-badge-border)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 bg-[var(--theme-badge-bg)] border-b border-[var(--theme-badge-border)]">
                        <h3 className="font-bold text-[var(--theme-primary)] mb-1">
                            {label}
                        </h3>
                        {enableSearch && (
                            <input
                                ref={searchInputRef}
                                type="text"
                                className="w-full mt-2 px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-0"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        )}
                    </div>

                    <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/10" ref={listRef}>
                        {/* Option to clear */}
                        {!searchTerm && (
                            <button
                                onClick={() => handleSelect("")}
                                className="w-full text-left px-4 py-3 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-50 dark:border-white/5"
                            >
                                Select All
                            </button>
                        )}

                        {filteredOptions.map((option) => (
                            <button
                                key={option.value}
                                ref={value === option.value ? selectedOptionRef : null}
                                onClick={() => handleSelect(option.value)}
                                className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors border-b border-gray-50 dark:border-white/5 last:border-0
                                    ${value === option.value
                                        ? 'bg-[var(--theme-badge-bg)] text-[var(--theme-primary)] font-semibold'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[var(--theme-primary)]'
                                    }
                                `}
                            >
                                {option.label}
                            </button>
                        ))}

                        {filteredOptions.length === 0 && (
                            <div className="px-4 py-8 text-center text-sm text-gray-400">
                                No options found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
