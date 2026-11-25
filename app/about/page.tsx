"use client";

import { useLanguage } from "@/lib/context/LanguageContext";
import { aboutData } from "@/lib/about-data";
import PageTitle from "@/components/PageTitle";
import SectionHeader from "@/components/SectionHeader";
import PaalIcon from "@/components/PaalIcon";

export default function AboutPage() {
    const { language } = useLanguage();
    const data = aboutData[language] || aboutData.en;

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Header */}
            <div className="text-center space-y-3 sm:space-y-4 pt-4">
                <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-[var(--theme-badge-bg)] border border-[var(--theme-badge-border)] text-[var(--theme-badge-text)] font-semibold text-xs tracking-wider uppercase backdrop-blur-md shadow-sm whitespace-nowrap">
                    {data.hero.badge}
                </div>

                <PageTitle
                    title={data.hero.title}
                    sizeClassName="text-2xl xs:text-3xl sm:text-5xl md:text-6xl"
                />

                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto px-2">
                    {data.hero.subtitle}
                </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                {data.intro.stats.map((stat, idx) => (
                    <div
                        key={idx}
                        className="glass-card p-3.5 sm:p-6 text-center space-y-1 sm:space-y-1.5 border border-white/80 dark:border-white/10 hover:border-[var(--theme-badge-border)] transition-all duration-300"
                    >
                        <div className="text-2xl xs:text-3xl sm:text-4xl font-serif font-black bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] bg-clip-text text-transparent">
                            {stat.value}
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                            {stat.label}
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
                            {stat.hint}
                        </div>
                    </div>
                ))}
            </div>

            {/* Introduction & Significance */}
            <section className="glass-card p-4 sm:p-8 md:p-10 space-y-4 sm:space-y-5 border border-white/80 dark:border-white/10 shadow-[0_16px_40px_rgba(31,38,135,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <SectionHeader
                    className="border-b border-slate-200/60 dark:border-white/10 pb-4"
                    alignRight="title"
                    wrapRight
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                        </svg>
                    }
                    title={data.intro.title}
                    subtitle={data.intro.subtitle}
                />
                <div className="space-y-3 sm:space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-lg">
                    {data.intro.paragraphs.map((p, idx) => (
                        <p key={idx}>{p}</p>
                    ))}
                </div>
            </section>

            {/* Author Section: Saint Thiruvalluvar */}
            <section className="glass-card p-4 sm:p-8 md:p-10 space-y-5 sm:space-y-6 border border-white/80 dark:border-white/10 shadow-[0_16px_40px_rgba(31,38,135,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <SectionHeader
                    className="border-b border-slate-200/60 dark:border-white/10 pb-4"
                    alignRight="title"
                    wrapRight
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    }
                    title={data.author.name}
                    titleBadge={
                        <span className="sm:hidden text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[var(--theme-badge-bg)] text-[var(--theme-badge-text)] border border-[var(--theme-badge-border)] whitespace-nowrap shrink-0">
                            {language === 'ta' ? 'கி.மு 31' : '31 BCE'}
                        </span>
                    }
                    subtitle={data.author.subtitle}
                    rightSlot={
                        <span className="hidden sm:inline-flex text-xs font-semibold px-3 py-1 rounded-full bg-[var(--theme-badge-bg)] text-[var(--theme-badge-text)] border border-[var(--theme-badge-border)] whitespace-nowrap shrink-0">
                            {language === 'ta' ? 'கி.மு 31 • சங்க காலம்' : 'c. 31 BCE • Sangam Era'}
                        </span>
                    }
                />

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
                                <div className="font-bold text-sm text-[var(--theme-primary)]">
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
                                className="p-4 rounded-2xl bg-[var(--theme-badge-bg)] border border-[var(--theme-badge-border)] backdrop-blur-md space-y-2"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span className="font-bold text-slate-900 dark:text-white text-base">{mon.name}</span>
                                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/80 dark:bg-white/10 text-[var(--theme-badge-text)] whitespace-nowrap shrink-0">
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
                <SectionHeader
                    className="px-2"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <rect width="7" height="7" x="3" y="3" rx="1" />
                            <rect width="7" height="7" x="14" y="3" rx="1" />
                            <rect width="7" height="7" x="14" y="14" rx="1" />
                            <rect width="7" height="7" x="3" y="14" rx="1" />
                        </svg>
                    }
                    title={data.structure.title}
                    subtitle={data.structure.description}
                />

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
                                            <div className="flex items-center gap-2.5">
                                                <span className={`p-1.5 rounded-lg border shrink-0 ${colorClasses.badge}`} aria-hidden="true">
                                                    <PaalIcon paal={paal.title} className="w-4 h-4 sm:w-5 sm:h-5" />
                                                </span>
                                                <h3 className={`text-2xl font-black whitespace-nowrap ${colorClasses.text}`}>
                                                    {paal.title}
                                                </h3>
                                            </div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap mt-1">
                                                {paal.englishTitle}
                                            </div>
                                        </div>
                                        <div
                                            className={`text-base sm:text-lg font-serif font-black whitespace-nowrap shrink-0 ${colorClasses.text}`}
                                            title={`${paal.chapters} ${language === 'ta' ? 'அதிகாரங்கள்' : 'Chapters'}`}
                                            aria-label={`${paal.chapters} ${language === 'ta' ? 'அதிகாரங்கள்' : 'Chapters'}`}
                                        >
                                            {paal.chapters}
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
                                                    <div className="flex justify-between items-center gap-2 font-bold text-slate-900 dark:text-white">
                                                        <span>{iyal.name}</span>
                                                        <span className={`${colorClasses.text} whitespace-nowrap shrink-0`}>{iyal.count} {language === 'ta' ? (iyal.count === 1 ? 'அதிகாரம்' : 'அதிகாரங்கள்') : 'Ch'}</span>
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
                                            <span key={vIdx} className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${colorClasses.pill}`}>
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
                <SectionHeader
                    className="border-b border-slate-200/60 dark:border-white/10 pb-4"
                    alignRight="title"
                    wrapRight
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    }
                    title={data.marvels.title}
                    subtitle={data.marvels.subtitle}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.marvels.items.map((item, idx) => (
                        <div
                            key={idx}
                            className="p-5 rounded-2xl bg-white/45 dark:bg-slate-900/40 border border-white/70 dark:border-white/10 backdrop-blur-md space-y-2 hover:border-[var(--theme-badge-border)] transition-colors"
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
                <SectionHeader
                    className="border-b border-slate-200/60 dark:border-white/10 pb-4"
                    alignRight="title"
                    wrapRight
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                        </svg>
                    }
                    title={data.commentators.title}
                    subtitle={data.commentators.description}
                />

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
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--theme-badge-bg)] text-[var(--theme-badge-text)] border border-[var(--theme-badge-border)] whitespace-nowrap shrink-0">
                                    {c.badge}
                                </span>
                            </div>
                            <div className="text-xs text-[var(--theme-primary)] font-semibold">
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
            <section className="glass-card p-5 sm:p-8 space-y-5 border border-white/80 dark:border-white/10 shadow-[0_16px_40px_rgba(31,38,135,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <SectionHeader
                    className="border-b border-slate-200/60 dark:border-white/10 pb-3.5"
                    alignRight="title"
                    wrapRight
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                    }
                    title={data.app.title}
                    subtitle={data.app.tagline}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {data.app.features.map((feat, idx) => (
                        <div
                            key={idx}
                            className="p-4 rounded-2xl bg-white/45 dark:bg-slate-900/40 border border-white/70 dark:border-white/10 backdrop-blur-md space-y-1.5 hover:border-[var(--theme-badge-border)] transition-colors"
                        >
                            <div className="flex items-center gap-2.5">
                                <span className="text-xl">{feat.icon}</span>
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

            {/* Credits & Attributions */}
            <section className="glass-card p-6 sm:p-10 space-y-6 border border-white/80 dark:border-white/10 shadow-[0_16px_40px_rgba(31,38,135,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <SectionHeader
                    className="border-b border-slate-200/60 dark:border-white/10 pb-4"
                    alignRight="title"
                    wrapRight
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                    }
                    title={language === 'ta' ? 'நன்றி மற்றும் உரிமங்கள்' : 'Credits & Attributions'}
                    subtitle={language === 'ta'
                        ? 'இச்செயலியில் பயன்படுத்தப்பட்டுள்ள தரவுகள், படங்கள் மற்றும் எழுத்துருக்களுக்கான உரிம விவரங்கள்'
                        : 'Licensing and attribution details for datasets, icons, fonts, and media used in this app'}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div className="p-4 sm:p-5 rounded-2xl bg-white/45 dark:bg-slate-900/40 border border-white/70 dark:border-white/10 space-y-1.5">
                        <div className="font-bold text-slate-900 dark:text-white">
                            {language === 'ta' ? 'திருக்குறள் தரவுத்தொகுப்பு' : 'Thirukkural Dataset'}
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            {language === 'ta'
                                ? 'தரவுகள் tk120404/thirukkural களஞ்சியத்திலிருந்து Apache 2.0 உரிமத்தின் கீழ் பெறப்பட்டவை.'
                                : 'Sourced from the tk120404/thirukkural repository under the Apache License 2.0.'}
                        </p>
                        <a
                            href="https://github.com/tk120404/thirukkural"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-[var(--theme-primary)] hover:underline font-medium"
                        >
                            github.com/tk120404/thirukkural
                        </a>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-white/45 dark:bg-slate-900/40 border border-white/70 dark:border-white/10 space-y-1.5">
                        <div className="font-bold text-slate-900 dark:text-white">
                            {language === 'ta' ? 'கோலம் சின்னங்கள்' : 'Kolam Icons'}
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            {language === 'ta' ? (
                                <>
                                    பின்னணி மற்றும் தலைப்புக் கோல வடிவங்கள்{' '}
                                    <a href="https://www.flaticon.com/authors/amoghdesign" target="_blank" rel="noopener noreferrer" className="text-[var(--theme-primary)] hover:underline font-medium">amoghdesign</a>,{' '}
                                    <a href="https://www.flaticon.com/authors/magnific" target="_blank" rel="noopener noreferrer" className="text-[var(--theme-primary)] hover:underline font-medium">Magnific</a>, மற்றும்{' '}
                                    <a href="https://www.flaticon.com/authors/metami-septiana" target="_blank" rel="noopener noreferrer" className="text-[var(--theme-primary)] hover:underline font-medium">Metami septiana</a>{' '}
                                    ஆகியோரால் உருவாக்கப்பட்டு{' '}
                                    <a href="https://www.flaticon.com" target="_blank" rel="noopener noreferrer" className="text-[var(--theme-primary)] hover:underline font-medium">www.flaticon.com</a>{' '}
                                    தளத்திலிருந்து பெறப்பட்டவை.
                                </>
                            ) : (
                                <>
                                    Kolam icons made by{' '}
                                    <a href="https://www.flaticon.com/authors/amoghdesign" target="_blank" rel="noopener noreferrer" className="text-[var(--theme-primary)] hover:underline font-medium">amoghdesign</a>,{' '}
                                    <a href="https://www.flaticon.com/authors/magnific" target="_blank" rel="noopener noreferrer" className="text-[var(--theme-primary)] hover:underline font-medium">Magnific</a>, and{' '}
                                    <a href="https://www.flaticon.com/authors/metami-septiana" target="_blank" rel="noopener noreferrer" className="text-[var(--theme-primary)] hover:underline font-medium">Metami septiana</a>{' '}
                                    from{' '}
                                    <a href="https://www.flaticon.com" target="_blank" rel="noopener noreferrer" className="text-[var(--theme-primary)] hover:underline font-medium">www.flaticon.com</a>.
                                </>
                            )}
                        </p>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-white/45 dark:bg-slate-900/40 border border-white/70 dark:border-white/10 space-y-1.5">
                        <div className="font-bold text-slate-900 dark:text-white">
                            {language === 'ta' ? 'எழுத்துருக்கள்' : 'Typography'}
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            {language === 'ta'
                                ? 'தமிழ் மற்றும் ஆங்கில எழுத்துருக்களுக்கு Google Fonts (Oi, Mukta Malar மற்றும் Outfit) SIL Open Font License (OFL) உரிமத்தின் கீழ் பயன்படுத்தப்படுகின்றன.'
                                : 'Tamil and English typography uses Google Fonts (Oi, Mukta Malar, and Outfit) under the SIL Open Font License (OFL).'}
                        </p>
                        <a
                            href="https://fonts.google.com/specimen/Mukta+Malar"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-[var(--theme-primary)] hover:underline font-medium"
                        >
                            fonts.google.com
                        </a>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-white/45 dark:bg-slate-900/40 border border-white/70 dark:border-white/10 space-y-1.5">
                        <div className="font-bold text-slate-900 dark:text-white">
                            {language === 'ta' ? 'சின்னம் மற்றும் எளிய விளக்கங்கள்' : 'App Logo & Simple Explanations'}
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            {language === 'ta'
                                ? 'திருவள்ளுவர் சின்னம் மற்றும் குறள்களுக்கான ஒருங்கிணைந்த எளிய தமிழ் விளக்கங்கள் Google Gemini AI உதவியுடன் உருவாக்கப்பட்டவை.'
                                : 'Main Thiruvalluvar emblem and unified simple Tamil Kural explanations crafted with Google Gemini AI.'}
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
