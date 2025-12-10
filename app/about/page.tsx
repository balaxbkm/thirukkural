"use client";

import { useLanguage } from "@/lib/context/LanguageContext";

export default function AboutPage() {
    const { t } = useLanguage();

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                    {t.about.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                    {t.about.description}
                </p>
            </div>

            <div className="space-y-12">
                {/* Thiruvalluvar */}
                <section className="glass-card p-8 md:p-10 space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-white/10 pb-4">
                        {t.about.thiruvalluvar}
                    </h2>
                    <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
                        <p>{t.about.thiruvalluvarDesc}</p>
                    </div>
                </section>

                {/* Structure */}
                <section className="glass-card p-8 md:p-10 space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-white/10 pb-4">
                        {t.about.structure}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/20">
                            <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-2">{t.about.aram}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {t.about.aramDesc}
                            </p>
                            <div className="mt-4 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 inline-block px-2 py-1 rounded">
                                380 {t.kural.number}s
                            </div>
                        </div>

                        <div className="bg-purple-50/50 dark:bg-purple-900/10 p-6 rounded-2xl border border-purple-100 dark:border-purple-800/20">
                            <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-2">{t.about.porul}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {t.about.porulDesc}
                            </p>
                            <div className="mt-4 text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 inline-block px-2 py-1 rounded">
                                700 {t.kural.number}s
                            </div>
                        </div>

                        <div className="bg-pink-50/50 dark:bg-pink-900/10 p-6 rounded-2xl border border-pink-100 dark:border-pink-800/20">
                            <h3 className="text-xl font-bold text-pink-700 dark:text-pink-300 mb-2">{t.about.inbam}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {t.about.inbamDesc}
                            </p>
                            <div className="mt-4 text-xs font-semibold text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/30 inline-block px-2 py-1 rounded">
                                250 {t.kural.number}s
                            </div>
                        </div>
                    </div>
                </section>

                {/* About App */}
                <section className="glass-card p-8 md:p-10 space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-white/10 pb-4">
                        {t.about.appTitle}
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {t.about.appDesc}
                    </p>
                </section>
            </div>
        </div>
    );
}
