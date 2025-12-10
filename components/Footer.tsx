"use client";

import { useLanguage } from "@/lib/context/LanguageContext";

export default function Footer() {
    const { t } = useLanguage();
    return (
        <footer className="w-full py-8 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-white/10 mt-auto">
            <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 px-4">
                <span>{t.footer.text}</span>
                <span className="hidden md:inline">•</span>
                <span className="hover:text-blue-500 cursor-pointer transition-colors">{t.footer.privacy}</span>
                <span>•</span>
                <span className="hover:text-blue-500 cursor-pointer transition-colors">{t.footer.terms}</span>
                <span>•</span>
                <a href="/about" className="hover:text-blue-500 cursor-pointer transition-colors">{t.nav.about}</a>
            </div>
        </footer>
    );
}
