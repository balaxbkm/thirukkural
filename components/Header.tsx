"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/context/LanguageContext";
import { useTheme } from "next-themes";
import { useUserKuralActions } from "@/lib/hooks/useUserKuralActions";

export default function Header() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { t, language, setLanguage } = useLanguage();
    const { favorites, notedKurals } = useUserKuralActions();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const navLinks = [
        {
            name: t.nav.home || "Home",
            href: "/",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
            )
        },
        {
            name: t.nav.browse || "Browse",
            href: "/browse",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                </svg>
            )
        },
        {
            name: t.nav.favorites || "Favorites",
            href: "/favorites",
            badgeCount: favorites.length,
            badgeColor: "from-rose-500 to-pink-500",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
            )
        },
        {
            name: t.nav.kuripugal || "Notes",
            href: "/kuripugal",
            badgeCount: notedKurals.length,
            badgeColor: "from-amber-500 to-orange-500",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5Z" />
                </svg>
            )
        },
        {
            name: t.nav.about || "About",
            href: "/about",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
            )
        },
    ];

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ta' : 'en');
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-white/60 dark:bg-slate-950/60 backdrop-blur-2xl border-b border-white/60 dark:border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)] transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-10 h-10 rounded-full ring-2 ring-white/80 dark:ring-white/20 shadow-md group-hover:scale-110 group-hover:ring-indigo-400 dark:group-hover:ring-indigo-400 transition-all duration-300">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/valluvar-logo-v2.jpg"
                                alt="Thiruvalluvar Logo"
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                        <span className="hidden sm:block text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-indigo-200 dark:to-cyan-200 tracking-tight">
                            {language === 'ta' ? 'திருக்குறள்' : 'Thirukkural'}
                        </span>
                        <span className="sm:hidden text-lg font-bold text-slate-900 dark:text-white">
                            {language === 'ta' ? 'திருக்குறள்' : 'Thirukkural'}
                        </span>
                    </Link>

                    {/* Desktop Navigation Menus */}
                    <div className="hidden md:flex gap-3 items-center">
                        <nav className="flex gap-1.5 items-center">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                const isAbout = link.href === '/about';
                                const badgeCount = link.badgeCount || 0;

                                if (isAbout) {
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            aria-label={link.name}
                                            title={link.name}
                                            className={`relative flex items-center justify-center p-2.5 rounded-full transition-all duration-300 backdrop-blur-md active:scale-95 ${
                                                isActive
                                                    ? "bg-indigo-500/15 dark:bg-indigo-400/20 text-indigo-600 dark:text-cyan-300 border border-indigo-400/30 dark:border-indigo-400/40 shadow-sm"
                                                    : "text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white border border-transparent hover:border-white/50 dark:hover:border-white/10"
                                            }`}
                                        >
                                            {link.icon}
                                        </Link>
                                    );
                                }

                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`relative flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-300 backdrop-blur-md ${
                                            isActive
                                                ? "bg-indigo-500/15 dark:bg-indigo-400/20 text-indigo-600 dark:text-cyan-300 border border-indigo-400/30 dark:border-indigo-400/40 shadow-sm"
                                                : "text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white border border-transparent hover:border-white/50 dark:hover:border-white/10"
                                        }`}
                                    >
                                        {link.icon}
                                        <span>{link.name}</span>
                                        {badgeCount > 0 && (
                                            <span className={`flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-gradient-to-r ${link.badgeColor || 'from-indigo-500 to-violet-500'} text-[10px] font-bold text-white shadow-sm ring-1 ring-white dark:ring-slate-900`}>
                                                {badgeCount > 9 ? '9+' : badgeCount}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Divider */}
                        <div className="h-6 w-px bg-slate-300/60 dark:bg-white/10 mx-1" />

                        {/* Action Tools */}
                        <div className="flex items-center gap-2">
                            {/* Theme Toggle */}
                            <button
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/70 dark:bg-white/10 border border-white/80 dark:border-white/15 text-slate-600 dark:text-amber-300 hover:bg-white/95 dark:hover:bg-white/20 hover:text-amber-500 dark:hover:text-amber-200 transition-all active:scale-95 shadow-sm backdrop-blur-md"
                                aria-label="Toggle Theme"
                                title="Toggle Theme"
                            >
                                {mounted && theme === 'dark' ? (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                )}
                            </button>

                            {/* Language Switcher (Moved to Last) */}
                            <button
                                onClick={toggleLanguage}
                                className="h-9 px-3.5 rounded-full bg-white/70 dark:bg-white/10 border border-white/80 dark:border-white/15 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-cyan-300 hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all active:scale-95 shadow-sm backdrop-blur-md flex items-center justify-center gap-1.5"
                                aria-label="Toggle Language"
                                title="Toggle Language"
                            >
                                <span className="text-xs">🌐</span>
                                <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Action Icons & Hamburger */}
                    <div className="flex md:hidden gap-2 items-center">
                        {/* Theme Toggle */}
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-700 dark:text-amber-300 bg-white/70 dark:bg-white/10 border border-white/80 dark:border-white/15 backdrop-blur-md transition-colors"
                            aria-label="Toggle Theme"
                        >
                            {mounted && theme === 'dark' ? (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>

                        {/* Language Switcher (Moved to Last) */}
                        <button
                            onClick={toggleLanguage}
                            className="h-8 px-2.5 flex items-center justify-center rounded-full bg-white/70 dark:bg-white/10 border border-white/80 dark:border-white/15 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors backdrop-blur-md"
                            aria-label="Toggle Language"
                        >
                            {language === 'en' ? 'தமிழ்' : 'Eng'}
                        </button>

                        {/* Hamburger Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-700 dark:text-slate-200 bg-white/70 dark:bg-white/10 border border-white/80 dark:border-white/15 backdrop-blur-md hover:bg-white/90 dark:hover:bg-white/20 transition-all active:scale-95"
                            aria-label="Toggle menu"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

            {/* Mobile Drawer Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-20 left-0 right-0 bg-white/90 dark:bg-slate-950/95 backdrop-blur-2xl border-b border-white/80 dark:border-white/10 px-5 py-6 flex flex-col gap-3 shadow-2xl animate-in slide-in-from-top-2 z-50">
                    <nav className="flex flex-col gap-2">
                        {navLinks.map((link) => {
                            const badgeCount = link.badgeCount || 0;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center justify-between text-base font-semibold px-4 py-3 rounded-2xl transition-all ${
                                        isActive
                                            ? "bg-indigo-500/15 dark:bg-indigo-400/20 text-indigo-600 dark:text-cyan-300 border border-indigo-400/30 dark:border-indigo-400/40"
                                            : "text-slate-700 dark:text-slate-200 hover:bg-white/70 dark:hover:bg-white/10"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {link.icon}
                                        <span>{link.name}</span>
                                    </div>
                                    {badgeCount > 0 && (
                                        <span className={`flex h-5 min-w-5 px-1.5 items-center justify-center rounded-full bg-gradient-to-r ${link.badgeColor || 'from-indigo-500 to-violet-500'} text-xs font-bold text-white shadow-sm`}>
                                            {badgeCount}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            )}
        </header>
    );
}
