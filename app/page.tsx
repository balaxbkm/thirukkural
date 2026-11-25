"use client";

import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { useLanguage } from "@/lib/context/LanguageContext";
import { useUserKuralActions } from "@/lib/hooks/useUserKuralActions";
import { useState, useEffect, useMemo } from "react";
import KuralCard from "@/components/KuralCard";
import NoteModal from "@/components/NoteModal";
import PageTitleKolam from "@/components/PageTitleKolam";
import SectionHeader from "@/components/SectionHeader";
import { Kural } from "@/types/thirukkural";

export default function Home() {
  const { t } = useLanguage();
  const { isFavorite, toggleFavorite, hasNote, recentKuralNumbers, isReady } = useUserKuralActions();
  const [favoriteToast, setFavoriteToast] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [randomKurals, setRandomKurals] = useState<Kural[]>([]);
  const [dailyKural, setDailyKural] = useState<Kural | null>(null);
  const [allKurals, setAllKurals] = useState<Kural[]>([]);
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await import("@/data/thirukkural.json");
        const all = data.default as Kural[];
        setAllKurals(all);

        // Random selection for grid - Ensure 6 unique Kurals
        const random: Kural[] = [];
        const selectedIndices = new Set<number>();
        while (selectedIndices.size < 6 && all.length >= 6) {
          const randomIndex = Math.floor(Math.random() * all.length);
          if (!selectedIndices.has(randomIndex)) {
            selectedIndices.add(randomIndex);
            random.push(all[randomIndex]);
          }
        }
        setRandomKurals(random);

        // Check if user previously changed the hero kural using the reload button
        let savedKural: Kural | null = null;
        try {
          const savedHeroNum = localStorage.getItem("thirukkural_hero_kural");
          if (savedHeroNum) {
            const num = parseInt(savedHeroNum, 10);
            const found = all.find((k) => k.number === num);
            if (found) {
              savedKural = found;
            }
          }
        } catch (e) {
          console.error("Failed to read hero kural from localStorage:", e);
        }

        if (savedKural) {
          setDailyKural(savedKural);
        } else {
          // Fallback: Seeded Kural Logic (8-hour interval)
          const now = Date.now();
          const intervalMs = 8 * 60 * 60 * 1000;
          const timeBucket = Math.floor(now / intervalMs);

          // Use bucket as seed for randomness
          const seedStr = timeBucket.toString();
          let hash = 0;
          for (let i = 0; i < seedStr.length; i++) {
            hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
            hash |= 0;
          }
          const positiveHash = Math.abs(hash);
          const index = positiveHash % all.length;
          setDailyKural(all[index]);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  const handleRefresh = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (allKurals.length === 0 || isRotating) return;
    setIsRotating(true);
    setTimeout(() => {
      let nextIndex: number;
      do {
        nextIndex = Math.floor(Math.random() * allKurals.length);
      } while (allKurals.length > 1 && dailyKural && allKurals[nextIndex].number === dailyKural.number);

      const nextKural = allKurals[nextIndex];
      setDailyKural(nextKural);
      try {
        localStorage.setItem("thirukkural_hero_kural", nextKural.number.toString());
      } catch (err) {
        console.error("Failed to save hero kural to localStorage:", err);
      }
      setIsRotating(false);
    }, 450);
  };

  const handleFavorite = (num: number) => {
    toggleFavorite(num);
    if (!isFavorite(num)) {
      setFavoriteToast(true);
      setTimeout(() => setFavoriteToast(false), 2000);
    }
  };

  const isDailyFav = dailyKural ? isFavorite(dailyKural.number) : false;
  const hasDailyNote = dailyKural ? hasNote(dailyKural.number) : false;

  const recentKurals = useMemo(() => {
    if (!allKurals.length || !recentKuralNumbers.length) return [];
    const map = new Map<number, Kural>();
    for (const k of allKurals) {
      map.set(k.number, k);
    }
    return recentKuralNumbers
      .slice(0, 3)
      .map((num) => map.get(num))
      .filter((k): k is Kural => Boolean(k));
  }, [allKurals, recentKuralNumbers]);

  return (
    <div className="flex flex-col gap-5 sm:gap-12 md:gap-16 pt-3 sm:pt-4 md:pt-8 pb-4">
      {/* Hero Section */}
      <section className="relative flex flex-col items-start sm:items-center justify-center text-left sm:text-center gap-2.5 sm:gap-8 pt-4 sm:pt-6 pb-6 sm:pb-12 md:py-16">
        {/* Chapter Badge of the Current Kural (Desktop only: placed above the Kural) */}
        <div className="hidden sm:inline-flex relative items-center justify-center">
          <PageTitleKolam sizeClass="w-14 h-14 md:w-16 md:h-16" />
          {dailyKural ? (
            <Link
              key={`desktop-badge-${dailyKural.number}`}
              href={`/browse?paal=${encodeURIComponent(dailyKural.paal)}&iyal=${encodeURIComponent(dailyKural.iyal)}&adhigaram=${encodeURIComponent(dailyKural.adhigaram)}`}
              className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--theme-badge-bg)] border border-[var(--theme-badge-border)] text-[var(--theme-badge-text)] font-semibold text-xs tracking-wider backdrop-blur-md shadow-sm hover:scale-105 transition-all duration-300 hover:border-[var(--theme-primary)] animate-in fade-in zoom-in duration-500"
              title={dailyKural.adhigaram}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-dot)] animate-ping" />
              {dailyKural.adhigaram}
            </Link>
          ) : (
            <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--theme-badge-bg)] border border-[var(--theme-badge-border)] text-[var(--theme-badge-text)] font-semibold text-xs tracking-wider backdrop-blur-md shadow-sm animate-in fade-in zoom-in duration-500">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-dot)] animate-ping" />
              {t.home.subtitle}
            </div>
          )}
        </div>

        {/* Today's Kural (Daily Kural) - Positioned ABOVE the Search Bar */}
        {dailyKural && (
          <div className="w-full max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col items-start sm:items-center gap-3 sm:gap-4 text-left sm:text-center px-1 sm:px-4 relative max-w-full">
              <Link
                href={`/kural/${dailyKural.number}`}
                className="flex items-center justify-start sm:justify-center gap-2 sm:gap-6 relative z-10 transition-transform hover:scale-[1.01] duration-300 ease-out cursor-pointer w-full max-w-5xl px-0"
              >
                <div
                  key={dailyKural.number}
                  className="relative space-y-0 text-left sm:text-center animate-in fade-in duration-300 w-full sm:w-auto"
                >
                  {/* Big faded double quote behind the kural */}
                  <span
                    className="block absolute top-[52%] sm:top-[58%] -translate-y-1/2 -left-3 sm:-left-12 lg:-left-24 xl:-left-28 font-serif text-[140px] sm:text-[180px] lg:text-[230px] leading-none text-[var(--theme-quote)] opacity-20 sm:opacity-25 dark:opacity-20 pointer-events-none select-none -z-10 transition-all"
                    aria-hidden="true"
                  >
                    &ldquo;
                  </span>

                  <p
                    className="relative z-10 font-oi text-[12px] sm:text-[15px] md:text-[20px] lg:text-[25px] xl:text-[29px] leading-[1.6] py-1 sm:py-1.5 bg-gradient-to-r from-[var(--theme-hero-from)] via-[var(--theme-hero-via)] to-[var(--theme-hero-to)] bg-clip-text text-transparent drop-shadow-sm whitespace-nowrap text-left sm:text-center"
                    aria-label={dailyKural.line1_ta}
                  >
                    {dailyKural.line1_ta}
                  </p>
                  <p
                    className="relative z-10 font-oi text-[12px] sm:text-[15px] md:text-[20px] lg:text-[25px] xl:text-[29px] leading-[1.6] py-1 sm:py-1.5 bg-gradient-to-r from-[var(--theme-hero-from)] via-[var(--theme-hero-via)] to-[var(--theme-hero-to)] bg-clip-text text-transparent drop-shadow-sm whitespace-nowrap text-left sm:text-center"
                    aria-label={dailyKural.line2_ta}
                  >
                    {dailyKural.line2_ta}
                  </p>

                  {/* Big faded closing double quote behind the end of the kural (desktop only) */}
                  <span
                    className="hidden lg:block absolute top-[60%] -translate-y-1/2 lg:-right-24 xl:-right-28 font-serif lg:text-[230px] leading-none text-[var(--theme-quote)] opacity-25 dark:opacity-20 pointer-events-none select-none -z-10 transition-all"
                    aria-hidden="true"
                  >
                    &rdquo;
                  </span>
                </div>
              </Link>

              {/* Action Bar: Single row with equal height on mobile, full controls on desktop */}
              <div className="relative z-10 flex flex-nowrap items-center justify-start sm:justify-center gap-1.5 sm:gap-4 mt-1 sm:mt-1 w-full px-3 sm:px-0">
                {/* Favorite (Like) Button - First Position */}
                <button
                  onClick={() => handleFavorite(dailyKural.number)}
                  className={`group h-8 w-8 sm:h-10 sm:w-10 rounded-full backdrop-blur-md border shadow-sm hover:shadow-md hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center shrink-0 cursor-pointer ${isDailyFav
                    ? 'bg-rose-500/15 border-rose-400/40 text-rose-500'
                    : 'bg-white/70 dark:bg-slate-900/50 border-white/80 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-rose-300 dark:hover:border-rose-500/40 hover:text-rose-500'
                  }`}
                  aria-label={isDailyFav ? t.kural.favorited : t.kural.favorite}
                  title={isDailyFav ? t.kural.favorited : t.kural.favorite}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={isDailyFav ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`w-3.5 h-3.5 sm:w-5 sm:h-5 transition-colors duration-300 ${isDailyFav ? "text-rose-500" : "group-hover:text-rose-500"}`}
                  >
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>

                {/* Chapter Badge (Mobile only: integrated into this single row) */}
                <Link
                  key={`mobile-badge-${dailyKural.number}`}
                  href={`/browse?paal=${encodeURIComponent(dailyKural.paal)}&iyal=${encodeURIComponent(dailyKural.iyal)}&adhigaram=${encodeURIComponent(dailyKural.adhigaram)}`}
                  className="sm:hidden h-8 px-3 rounded-full inline-flex items-center justify-center bg-[var(--theme-badge-bg)] border border-[var(--theme-badge-border)] text-[var(--theme-badge-text)] font-semibold text-[11px] tracking-wide backdrop-blur-md shadow-sm active:scale-95 transition-all shrink-0"
                  title={dailyKural.adhigaram}
                >
                  {dailyKural.adhigaram}
                </Link>

                {/* Badge Link (Kural Number) */}
                <Link href={`/kural/${dailyKural.number}`} className="group cursor-pointer hover:scale-105 transition-all duration-300 shrink-0">
                  <div className="h-8 sm:h-10 px-3 sm:px-5 rounded-full flex items-center gap-1.5 sm:gap-2 bg-white/70 dark:bg-slate-900/50 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-sm hover:shadow-md hover:border-[var(--theme-primary)] transition-all">
                    <span className="text-[11px] sm:text-base font-bold text-slate-700 dark:text-slate-300 pr-1.5 sm:pr-3 mr-0.5 sm:mr-1 border-r border-slate-300 dark:border-white/10">
                      {t.kural?.number || "குறள்"}
                    </span>
                    <span className="text-[11px] sm:text-base font-black bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] bg-clip-text text-transparent font-mono">
                      {dailyKural.number}
                    </span>
                  </div>
                </Link>

                {/* Note Button */}
                <button
                  onClick={() => setIsNoteOpen(true)}
                  className={`flex group relative h-8 w-8 sm:h-10 sm:w-10 rounded-full backdrop-blur-md border shadow-sm hover:shadow-md hover:scale-110 active:scale-95 transition-all duration-300 items-center justify-center shrink-0 cursor-pointer ${hasDailyNote
                    ? 'bg-amber-100/80 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700/60'
                    : 'bg-white/70 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-white/80 dark:border-white/10 hover:border-amber-300 dark:hover:border-amber-500/40 hover:text-amber-500'
                  }`}
                  aria-label={hasDailyNote ? t.note.editNote : t.note.addNote}
                  title={hasDailyNote ? t.note.editNote : t.note.addNote}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill={hasDailyNote ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  {hasDailyNote && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  )}
                </button>

                {/* Refresh Button */}
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isRotating}
                  className="group h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/70 dark:bg-slate-900/50 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-sm hover:shadow-md hover:scale-110 active:scale-95 transition-all duration-300 hover:border-[var(--theme-primary)] cursor-pointer disabled:opacity-50 flex items-center justify-center shrink-0"
                  aria-label={t.home.randomBtn || "New Random Kural"}
                  title={t.home.randomBtn || "New Random Kural"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className={`w-3.5 h-3.5 sm:w-5 sm:h-5 text-slate-500 dark:text-slate-400 group-hover:text-[var(--theme-primary)] transition-transform duration-500 ease-in-out ${isRotating ? "rotate-180" : "rotate-0"}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                </button>
              </div>

              {/* Toast Notification */}
              {favoriteToast && (
                <div className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 bg-rose-600/95 text-white text-xs sm:text-sm font-bold py-2 px-5 rounded-full backdrop-blur-xl border border-rose-400/30 animate-in fade-in slide-in-from-top-2 zoom-in duration-300 z-50 flex items-center gap-2 shadow-xl">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  {t.kural.favorited}
                </div>
              )}

              {/* Note Modal for Daily Kural */}
              <NoteModal
                isOpen={isNoteOpen}
                onClose={() => setIsNoteOpen(false)}
                kuralNumber={dailyKural.number}
                adhigaram={dailyKural.adhigaram}
                line1={dailyKural.line1_ta}
                line2={dailyKural.line2_ta}
              />
            </div>
          </div>
        )}

        {/* Search Bar - Positioned BELOW Today's Kural */}
        <div className="w-full max-w-5xl mx-auto relative z-20 mt-2">
          <SearchBar variant="large" />
        </div>
      </section>

      {/* Recently Viewed Kurals - Only shown when history exists */}
      {isReady && recentKurals.length > 0 && (
        <section className="space-y-3 sm:space-y-6 mb-5 sm:mb-0 animate-in fade-in slide-in-from-bottom-3 duration-500">
          <SectionHeader
            className="px-2 pt-2.5 sm:pt-0"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            }
            title={t.home.recentTitle}
            subtitle={t.home.recentSubtitle}
            rightSlot={
              <Link
                href="/history"
                className="text-xs sm:text-sm font-semibold text-[var(--theme-primary)] hover:text-[var(--theme-primary-hover)] transition-colors flex items-center gap-1 group whitespace-nowrap"
              >
                {t.home.viewAll} <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {recentKurals.map((kural) => (
              <KuralCard key={`recent-${kural.number}`} kural={kural} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Kurals */}
      <section className="space-y-3 sm:space-y-6">
        <SectionHeader
          className="px-2 pt-2.5 sm:pt-0"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          }
          title={t.home.featured}
          subtitle={t.home.featuredSubtitle}
          rightSlot={
            <Link
              href="/browse"
              className="text-xs sm:text-sm font-semibold text-[var(--theme-primary)] hover:text-[var(--theme-primary-hover)] transition-colors flex items-center gap-1 group whitespace-nowrap"
            >
              {t.home.viewAll} <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {randomKurals.length > 0 ? (
            randomKurals.map((kural) => (
              <KuralCard key={kural.number} kural={kural} />
            ))
          ) : (
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 rounded-2xl glass-card animate-pulse bg-white/30 dark:bg-slate-800/30" />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
