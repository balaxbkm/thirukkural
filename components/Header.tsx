"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/lib/context/LanguageContext";
import { useUserKuralActions } from "@/lib/hooks/useUserKuralActions";
import { unicodeToBamini, unicodeToBaminiSyllables } from "@/lib/utils/bamini";
import ThemeSelector from "@/components/ThemeSelector";

export default function Header() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { t } = useLanguage();
    const { favorites, notedKurals } = useUserKuralActions();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close mobile menu on route change and restore scroll
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobileMenuOpen]);

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

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 ${isMobileMenuOpen ? 'z-[9995]' : 'z-40'} bg-transparent backdrop-blur-xl border-b-0 sm:border-b border-black/5 dark:border-white/10 transition-all duration-300 pt-[env(safe-area-inset-top,0px)]`}>
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14 sm:h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
                            <div className="relative w-8 h-8 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full ring-2 ring-[var(--theme-badge-border)] shadow-md group-hover:scale-105 group-hover:ring-[var(--theme-primary)] transition-all duration-300 shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="/valluvar-logo-v2.jpg"
                                    alt="Thiruvalluvar Logo"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>
                            <span
                                className="hidden sm:inline-flex items-center gap-[1px] font-bamini text-[28px] sm:text-[32px] tracking-normal leading-none text-slate-900 dark:text-white pr-3 overflow-visible"
                                aria-label="திருக்குறள்"
                            >
                                {unicodeToBaminiSyllables('திருக்குறள்').map((syl, i, arr) => (
                                    <span
                                        key={i}
                                        className={`inline-block ${i === arr.length - 1 ? 'pr-2' : ''}`}
                                    >
                                        {syl}
                                    </span>
                                ))}
                            </span>
                            <span
                                className="sm:hidden inline-flex items-center gap-[0.5px] font-bamini text-[23px] tracking-normal leading-none text-slate-900 dark:text-white pr-1 overflow-visible"
                                aria-label="திருக்குறள்"
                            >
                                {unicodeToBaminiSyllables('திருக்குறள்').map((syl, i, arr) => (
                                    <span
                                        key={i}
                                        className={`inline-block ${i === arr.length - 1 ? 'pr-1' : ''}`}
                                    >
                                        {syl}
                                    </span>
                                ))}
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
                                                        ? "bg-[var(--theme-badge-bg)] text-[var(--theme-primary)] border border-[var(--theme-badge-border)] shadow-sm"
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
                                                    ? "bg-[var(--theme-badge-bg)] text-[var(--theme-primary)] border border-[var(--theme-badge-border)] shadow-sm"
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
                                {/* Combined Theme & Mode Selector */}
                                <ThemeSelector variant="dropdown" />
                            </div>
                        </div>

                        {/* Mobile Menu Action Icons & Hamburger */}
                        <div className="flex md:hidden gap-1.5 items-center shrink-0">
                            {/* Combined Theme & Mode Selector */}
                            <ThemeSelector variant="dropdown" />

                            {/* Hamburger Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="w-8 h-8 flex items-center justify-center rounded-full text-slate-700 dark:text-slate-200 bg-white/70 dark:bg-white/10 border border-white/80 dark:border-white/15 backdrop-blur-md hover:bg-white/90 dark:hover:bg-white/20 transition-all active:scale-95 shrink-0 cursor-pointer"
                                aria-label="Toggle menu"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            </header>

            {/* Mobile Left-Side Full-Length Drawer Menu & Backdrop (Portaled to document.body) */}
            {mounted && isMobileMenuOpen && createPortal(
                <div className="md:hidden">
                    {/* Backdrop Overlay covering whole page */}
                    <div
                        className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-[9990] animate-in fade-in duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-hidden="true"
                    />

                    {/* Left-Side Full-Height Drawer */}
                    <aside className="fixed inset-y-0 left-0 top-0 bottom-0 w-64 xs:w-72 max-w-[82vw] h-screen h-[100dvh] overflow-y-auto overscroll-contain bg-[var(--background)] border-r border-black/10 dark:border-white/10 px-4 pt-[max(env(safe-area-inset-top,0px),1rem)] pb-[max(env(safe-area-inset-bottom,0px),1rem)] flex flex-col shadow-2xl animate-in slide-in-from-left duration-300 z-[9999]">
                        {/* Drawer Header with Logo & Close Button */}
                        <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-black/5 dark:border-white/10 shrink-0">
                            <div className="flex items-center gap-2.5">
                                <div className="relative w-7 h-7 rounded-full ring-2 ring-[var(--theme-badge-border)] overflow-hidden shadow-sm shrink-0">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src="/valluvar-logo-v2.jpg"
                                        alt="Thiruvalluvar Logo"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span
                                    className="inline-flex items-center gap-[0.5px] font-bamini text-[20px] tracking-normal leading-none text-slate-900 dark:text-white overflow-visible"
                                    aria-label="திருக்குறள்"
                                >
                                    {unicodeToBaminiSyllables('திருக்குறள்').map((syl, i, arr) => (
                                        <span
                                            key={i}
                                            className={`inline-block ${i === arr.length - 1 ? 'pr-1' : ''}`}
                                        >
                                            {syl}
                                        </span>
                                    ))}
                                </span>
                            </div>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-black/5 dark:bg-white/10 transition-colors active:scale-95 cursor-pointer shrink-0"
                                aria-label="Close menu"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Navigation Links with reduced label size */}
                        <nav className="flex flex-col gap-1 overflow-y-auto overscroll-contain flex-1 py-1">
                            {navLinks.map((link) => {
                                const badgeCount = link.badgeCount || 0;
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center justify-between text-[13.5px] px-3 py-2.5 rounded-xl transition-all ${
                                            isActive
                                                ? "bg-[var(--theme-badge-bg)] text-[var(--theme-primary)] border border-[var(--theme-badge-border)] shadow-xs font-semibold"
                                                : "text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 font-medium"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <span className={isActive ? "text-[var(--theme-primary)]" : "text-slate-500 dark:text-slate-400"}>
                                                {link.icon}
                                            </span>
                                            <span>{link.name}</span>
                                        </div>
                                        {badgeCount > 0 && (
                                            <span className={`flex h-4 min-w-4 px-1.5 items-center justify-center rounded-full bg-gradient-to-r ${link.badgeColor || 'from-indigo-500 to-violet-500'} text-[10px] font-bold text-white shadow-xs`}>
                                                {badgeCount}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Drawer Bottom Footer */}
                        <div className="pt-3 mt-auto border-t border-black/5 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1 shrink-0">
                            <span>திருக்குறள் &bull; 1330</span>
                            <span className="text-[10px] uppercase font-mono tracking-wider opacity-70">v2.0</span>
                        </div>
                    </aside>
                </div>,
                document.body
            )}
        </>
    );
}
