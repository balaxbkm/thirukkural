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
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 flex items-center justify-between
                    ${isOpen
                        ? 'border-blue-500 ring-2 ring-blue-500/20 bg-white dark:bg-slate-900 shadow-lg'
                        : 'border-gray-200 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900'
                    }
                `}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    {icon && (
                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isOpen ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-gray-400'
                            }`}>
                            {icon}
                        </div>
                    )}
                    <div className="min-w-0">
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-0.5">
                            {label}
                        </span>
                        <span className={`block font-medium truncate ${value ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                            {currentLabel || placeholder}
                        </span>
                    </div>
                </div>

                <svg
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-500' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 bg-blue-50/50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-800/30">
                        <h3 className="font-bold text-blue-600 dark:text-blue-400 mb-1">
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
                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-blue-600 dark:hover:text-blue-400'
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
