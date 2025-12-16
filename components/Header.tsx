"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchBar from "./SearchBar";
import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/context/LanguageContext";
import { useTheme } from "next-themes";
import { useUserKuralActions } from "@/lib/hooks/useUserKuralActions";

export default function Header() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { t, language } = useLanguage();
    const { bookmarkedKurals } = useUserKuralActions();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [showShareToast, setShowShareToast] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const navLinks = [
        {
            name: "Browse", href: "/browse", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                </svg>
            )
        },
        {
            name: "Bookmarks", href: "/bookmarks", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                </svg>
            )
        },

    ];



    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-10 h-10 group-hover:scale-110 transition-transform duration-300">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/logo.png"
                                alt="Logo"
                                className="w-full h-full object-contain drop-shadow-md rounded-full"
                            />
                        </div>
                        <span className="hidden sm:block text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 tracking-tight">
                            {language === 'ta' ? 'திருக்குறள்' : 'Thirukkural'}
                        </span>
                        <span className="sm:hidden text-lg font-bold text-gray-900 dark:text-white">
                            {language === 'ta' ? 'குறள்' : 'Kural'}
                        </span>
                    </Link>



                    {/* Desktop Nav */}
                    <div className="hidden md:flex gap-4 items-center">
                        <nav className="flex gap-1 items-center">
                            {navLinks.map((link) => {
                                const count = bookmarkedKurals.length;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`relative p-2.5 rounded-full transition-all duration-300 group ${pathname === link.href
                                            ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                            : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"
                                            }`}
                                        aria-label={link.name}
                                    >
                                        {link.icon}
                                        {count > 0 && (
                                            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900 group-hover:scale-110 transition-transform">
                                                {count > 9 ? '9+' : count}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                            <button
                                onClick={() => {
                                    const url = window.location.href;
                                    if (navigator.share) {
                                        navigator.share({
                                            title: 'Thirukkural',
                                            text: 'Check out this amazing Thirukkural explorer!',
                                            url: url,
                                        }).catch(console.error);
                                    } else {
                                        navigator.clipboard.writeText(url);
                                        setShowShareToast(true);
                                        setTimeout(() => setShowShareToast(false), 2000);
                                    }
                                }}
                                className="p-2.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-blue-600 dark:hover:text-blue-400 transition-all active:scale-95 shadow-none relative group"
                                aria-label="Share"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                    <circle cx="18" cy="5" r="3" />
                                    <circle cx="6" cy="12" r="3" />
                                    <circle cx="18" cy="19" r="3" />
                                    <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
                                    <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
                                </svg>

                                {showShareToast && (
                                    <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap z-50 animate-in fade-in slide-in-from-top-1">
                                        Copied!
                                    </span>
                                )}
                            </button>
                        </nav>

                        {/* Divider */}
                        <div className="h-6 w-px bg-gray-200 dark:bg-white/10 mx-1" />

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="p-2.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-amber-400 hover:bg-gray-200 dark:hover:bg-white/20 hover:text-amber-500 transition-all active:scale-95 shadow-sm"
                                aria-label="Toggle Theme"
                            >
                                {mounted && theme === 'dark' ? (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden gap-4 items-center">
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                            aria-label="Toggle Theme"
                        >
                            {mounted && theme === 'dark' ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>

                        <button
                            className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-b border-white/20 px-4 py-6 flex flex-col gap-6 shadow-xl animate-in slide-in-from-top-2">
                    <div className="w-full">
                        <SearchBar variant="header" />
                    </div>
                    <nav className="flex flex-col gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`text-lg font-medium px-4 py-3 rounded-xl transition-colors ${pathname === link.href
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/10"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}
