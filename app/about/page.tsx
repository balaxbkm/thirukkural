"use client";

import { useLanguage } from "@/lib/context/LanguageContext";
import { aboutData } from "@/lib/about-data";

export default function AboutPage() {
    const { language } = useLanguage();
    const data = aboutData[language] || aboutData.en;

    return (
        <div className="max-w-7xl 2xl:max-w-[1400px] mx-auto space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Header */}
            <div className="text-center space-y-4 pt-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-400/15 border border-indigo-500/20 dark:border-indigo-400/30 text-indigo-700 dark:text-cyan-300 font-semibold text-xs tracking-wider uppercase backdrop-blur-md shadow-sm">
                    {data.hero.badge}
                </div>

                <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-900 to-blue-900 dark:from-white dark:via-blue-100 dark:to-cyan-200 tracking-tight leading-tight">
                    {data.hero.title}
                </h1>

                <p className="text-slate-700 dark:text-slate-200 max-w-2xl mx-auto text-lg sm:text-xl font-medium tracking-wide">
                    {data.hero.subtitle}
                </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {data.intro.stats.map((stat, idx) => (
                    <div
                        key={idx}
                        className="glass-card p-5 sm:p-6 text-center space-y-1.5 border border-white/80 dark:border-white/10 hover:border-indigo-400/40 transition-all duration-300"
                    >
                        <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-300 bg-clip-text text-transparent font-mono">
                            {stat.value}
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                            {stat.label}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {stat.hint}
                        </div>
                    </div>
                ))}
            </div>

            {/* Introduction & Significance */}
            <section className="glass-card p-6 sm:p-10 space-y-5 border border-white/80 dark:border-white/10 shadow-[0_16px_40px_rgba(31,38,135,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-3 border-b border-slate-200/60 dark:border-white/10 pb-4">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                        {data.intro.title}
                    </h2>
                </div>
                <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-base sm:text-lg">
                    {data.intro.paragraphs.map((p, idx) => (
                        <p key={idx}>{p}</p>
                    ))}
                </div>
            </section>

            {/* Author Section: Saint Thiruvalluvar */}
            <section className="glass-card p-6 sm:p-10 space-y-6 border border-white/80 dark:border-white/10 shadow-[0_16px_40px_rgba(31,38,135,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/10 pb-4 flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                            {data.author.title} — {data.author.name}
                        </h2>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 dark:bg-indigo-400/20 text-indigo-700 dark:text-cyan-300 border border-indigo-500/20">
                        {language === 'ta' ? 'கிமு 31 • சங்க காலம்' : 'c. 31 BCE • Sangam Era'}
                    </span>
                </div>

                <div className="space-y-3 text-slate-700 dark:text-slate-300 leading-relaxed text-base sm:text-lg">
                    {data.author.description.map((p, idx) => (
                        <p key={idx}>{p}</p>
                    ))}
                </div>

                {/* Epithets Grid */}
                <div className="space-y-3 pt-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {language === 'ta' ? 'சிறப்புப் பெயர்கள்' : 'Honorific Epithets of the Sage'}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {data.author.epithets.map((item, idx) => (
                            <div
                                key={idx}
                                className="p-3.5 rounded-xl bg-white/50 dark:bg-slate-900/40 border border-white/70 dark:border-white/10 backdrop-blur-md space-y-1"
                            >
                                <div className="font-bold text-sm text-indigo-700 dark:text-cyan-300">
                                    {item.title}
                                </div>
                                <div className="text-xs text-slate-600 dark:text-slate-400">
                                    {item.meaning}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Iconic Monuments */}
                <div className="space-y-3 pt-3 border-t border-slate-200/60 dark:border-white/10">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {language === 'ta' ? 'வரலாற்று நினைவுச் சின்னங்கள்' : 'Monumental Tributes'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.author.monuments.map((mon, idx) => (
                            <div
                                key={idx}
                                className="p-4 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-800/30 backdrop-blur-md space-y-2"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-900 dark:text-white text-base">{mon.name}</span>
                                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/80 dark:bg-white/10 text-indigo-600 dark:text-cyan-300">
                                        📍 {mon.location}
                                    </span>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {mon.significance}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tripartite Structure (முப்பால்) */}
            <section className="space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {data.structure.title}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-sm sm:text-base">
                        {data.structure.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {data.structure.paals.map((paal, idx) => {
                        const isBlue = paal.color === 'blue';
                        const isPurple = paal.color === 'purple';

                        const colorClasses = isBlue
                            ? {
                                border: 'border-blue-200/60 dark:border-blue-800/40',
                                bg: 'bg-blue-50/40 dark:bg-blue-950/20',
                                text: 'text-blue-700 dark:text-cyan-300',
                                badge: 'bg-blue-100/70 dark:bg-blue-900/40 text-blue-700 dark:text-cyan-300 border-blue-200 dark:border-blue-800/50',
                                pill: 'bg-blue-500/10 text-blue-700 dark:text-cyan-300 border-blue-500/20'
                            }
                            : isPurple
                                ? {
                                    border: 'border-purple-200/60 dark:border-purple-800/40',
                                    bg: 'bg-purple-50/40 dark:bg-purple-950/20',
                                    text: 'text-purple-700 dark:text-purple-300',
                                    badge: 'bg-purple-100/70 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/50',
                                    pill: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20'
                                }
                                : {
                                    border: 'border-pink-200/60 dark:border-pink-800/40',
                                    bg: 'bg-pink-50/40 dark:bg-pink-950/20',
                                    text: 'text-pink-700 dark:text-pink-300',
                                    badge: 'bg-pink-100/70 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800/50',
                                    pill: 'bg-pink-500/10 text-pink-700 dark:text-pink-300 border-pink-500/20'
                                };

                        return (
                            <div
                                key={idx}
                                className={`glass-card p-6 sm:p-7 flex flex-col justify-between space-y-6 ${colorClasses.bg} ${colorClasses.border} backdrop-blur-xl transition-all duration-300 hover:-translate-y-1`}
                            >
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start gap-2">
                                        <div>
                                            <h3 className={`text-2xl font-black ${colorClasses.text}`}>
                                                {paal.title}
                                            </h3>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                {paal.englishTitle}
                                            </div>
                                        </div>
                                        <div className={`text-xs font-bold px-3 py-1 rounded-full border ${colorClasses.badge}`}>
                                            {paal.chapters} {language === 'ta' ? 'அதிகாரங்கள்' : 'Chapters'}
                                        </div>
                                    </div>

                                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                        {paal.description}
                                    </p>

                                    {/* Iyals List */}
                                    <div className="space-y-2 pt-2 border-t border-slate-200/50 dark:border-white/10">
                                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                            {language === 'ta' ? 'இயல்கள்' : 'Sub-sections (Iyals)'}
                                        </div>
                                        <div className="space-y-2">
                                            {paal.iyals.map((iyal, iIdx) => (
                                                <div key={iIdx} className="text-xs bg-white/60 dark:bg-slate-900/40 p-2.5 rounded-xl border border-white/60 dark:border-white/5 space-y-0.5">
                                                    <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                                                        <span>{iyal.name}</span>
                                                        <span className={colorClasses.text}>{iyal.count} {language === 'ta' ? 'அதிகாரம்' : 'Ch'}</span>
                                                    </div>
                                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                                                        {iyal.desc}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Core Values Pills */}
                                <div className="pt-2">
                                    <div className="flex flex-wrap gap-1.5">
                                        {paal.coreValues.map((val, vIdx) => (
                                            <span key={vIdx} className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${colorClasses.pill}`}>
                                                {val}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Linguistic & Mathematical Marvels */}
            <section className="glass-card p-6 sm:p-10 space-y-6 border border-white/80 dark:border-white/10 shadow-[0_16px_40px_rgba(31,38,135,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-3 border-b border-slate-200/60 dark:border-white/10 pb-4">
                    <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                        {data.marvels.title}
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.marvels.items.map((item, idx) => (
                        <div
                            key={idx}
                            className="p-5 rounded-2xl bg-white/45 dark:bg-slate-900/40 border border-white/70 dark:border-white/10 backdrop-blur-md space-y-2 hover:border-indigo-400/30 transition-colors"
                        >
                            <div className="flex items-center gap-2.5">
                                <span className="text-2xl">{item.icon}</span>
                                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                                    {item.title}
                                </h3>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Commentators Section */}
            <section className="glass-card p-6 sm:p-10 space-y-6 border border-white/80 dark:border-white/10 shadow-[0_16px_40px_rgba(31,38,135,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="space-y-1 border-b border-slate-200/60 dark:border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                            {data.commentators.title}
                        </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        {data.commentators.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.commentators.list.map((c, idx) => (
                        <div
                            key={idx}
                            className="p-4 sm:p-5 rounded-2xl bg-white/45 dark:bg-slate-900/40 border border-white/70 dark:border-white/10 backdrop-blur-md space-y-2"
                        >
                            <div className="flex justify-between items-center gap-2">
                                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                                    {c.name}
                                </h3>
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                                    {c.badge}
                                </span>
                            </div>
                            <div className="text-xs text-indigo-600 dark:text-cyan-300 font-semibold">
                                {c.era}
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                {c.style}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* About App Features */}
            <section className="glass-card p-6 sm:p-10 space-y-6 border border-white/80 dark:border-white/10 shadow-[0_16px_40px_rgba(31,38,135,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="space-y-1 border-b border-slate-200/60 dark:border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                            {data.app.title}
                        </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        {data.app.tagline}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.app.features.map((feat, idx) => (
                        <div
                            key={idx}
                            className="p-5 rounded-2xl bg-white/45 dark:bg-slate-900/40 border border-white/70 dark:border-white/10 backdrop-blur-md space-y-2 hover:border-indigo-400/30 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{feat.icon}</span>
                                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                                    {feat.title}
                                </h3>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                {feat.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
