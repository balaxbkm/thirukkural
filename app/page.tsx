"use client";

import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { useLanguage } from "@/lib/context/LanguageContext";
import { useUserKuralActions } from "@/lib/hooks/useUserKuralActions";
import { useState, useEffect } from "react";
import KuralCard from "@/components/KuralCard";

// Since this is a client component for translations, 
// we'll fetch random kurals here or assume they are passed.
// For now, let's just make it a client component since useLanguage requires it.
// To keep SEO, we might want to pass initial props, but for this demo purely dynamic is fine.

export default function Home() {
  const { t } = useLanguage();
  const { isLiked, toggleLike } = useUserKuralActions();
  const [randomKurals, setRandomKurals] = useState<any[]>([]);
  const [dailyKural, setDailyKural] = useState<any>(null);
  const [allKurals, setAllKurals] = useState<any[]>([]);
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await import("@/data/thirukkural.json");
        const all = data.default;
        setAllKurals(all);

        // Random selection for grid
        const random = [];
        for (let i = 0; i < 6; i++) {
          random.push(all[Math.floor(Math.random() * all.length)]);
        }
        setRandomKurals(random);

        // Daily Kural Logic (Seeded by date)
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        let hash = 0;
        for (let i = 0; i < dateStr.length; i++) {
          hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
          hash |= 0;
        }
        const positiveHash = Math.abs(hash);
        const dailyIndex = positiveHash % all.length;
        setDailyKural(all[dailyIndex]);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  const handleRefresh = () => {
    if (allKurals.length === 0) return;
    setIsRotating(true);
    // Brief delay for animation feel
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * allKurals.length);
      setDailyKural(allKurals[randomIndex]);
      setIsRotating(false);
    }, 500);
  };

  return (
    <div className="flex flex-col gap-16 py-10">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center gap-8 py-16 md:py-24">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100/50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-200 font-medium text-sm mb-4 animate-in fade-in zoom-in duration-500">
            {t.home.subtitle}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 dark:from-blue-100 dark:via-white dark:to-blue-100 pb-2 leading-tight drop-shadow-sm">
            {t.home.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-blue-100/90 max-w-2xl mx-auto leading-relaxed">
            {t.home.description}
          </p>
        </div>

        <div className="w-full max-w-5xl mx-auto relative z-10">
          <SearchBar variant="large" />
        </div>

        {dailyKural && (
          <div className="w-full max-w-6xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">


            <div className="flex flex-col items-center gap-4 text-center px-4 mt-6 relative">
              <div className="flex items-start justify-center gap-4 relative z-10 transition-transform hover:scale-[1.02] duration-500 ease-out cursor-default">
                <span className="font-serif text-8xl text-violet-400/40 dark:text-violet-500/40 -mt-4 select-none">
                  &ldquo;
                </span>
                <div className="space-y-0 text-center">
                  <p className="font-oi text-[22px] leading-[1.3] bg-gradient-to-r from-violet-900 via-fuchsia-800 to-pink-700 dark:from-violet-300 dark:via-fuchsia-300 dark:to-pink-200 bg-clip-text text-transparent drop-shadow-sm py-1">
                    {dailyKural.line1_ta}
                  </p>
                  <p className="font-oi text-[22px] leading-[1.3] bg-gradient-to-r from-violet-900 via-fuchsia-800 to-pink-700 dark:from-violet-300 dark:via-fuchsia-300 dark:to-pink-200 bg-clip-text text-transparent drop-shadow-sm py-1">
                    {dailyKural.line2_ta}
                  </p>
                </div>
                <span className="font-serif text-8xl text-violet-400/40 dark:text-violet-500/40 mt-auto select-none">
                  &rdquo;
                </span>
              </div>

              {/* Action Buttons & Badge Container */}
              <div className="relative z-10 flex items-center justify-center gap-6 mt-0">

                {/* Like Button */}
                <button
                  onClick={() => toggleLike(dailyKural.number)}
                  className="group p-3 rounded-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/50 dark:border-white/10 shadow-sm hover:shadow-md hover:scale-110 active:scale-95 transition-all duration-300 hover:border-red-200 dark:hover:border-red-900/50"
                  aria-label="Like Kural"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={isLiked(dailyKural.number) ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`w-5 h-5 transition-colors duration-300 ${isLiked(dailyKural.number)
                      ? "text-red-500"
                      : "text-gray-500 dark:text-gray-400 group-hover:text-red-500"
                      }`}
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </button>

                {/* Badge Link */}
                <Link href={`/kural/${dailyKural.number}`} className="group cursor-pointer hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/50 dark:border-white/10 shadow-sm hover:shadow-md hover:border-violet-200 dark:hover:border-violet-800 transition-all">
                    <span className="text-base font-bold text-violet-600/80 dark:text-violet-300/80 pr-3 mr-1 border-r border-gray-300 dark:border-gray-700">
                      {t.kural?.number || "Kural"}
                    </span>
                    <span className="text-base font-black bg-gradient-to-br from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent font-mono">
                      {dailyKural.number}
                    </span>
                  </div>
                </Link>

                {/* Refresh Button */}
                <button
                  onClick={handleRefresh}
                  className="group p-3 rounded-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/50 dark:border-white/10 shadow-sm hover:shadow-md hover:scale-110 active:scale-95 transition-all duration-300 hover:border-blue-200 dark:hover:border-blue-900/50"
                  aria-label="New Random Kural"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className={`w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-all duration-700 ${isRotating ? "animate-spin" : ""}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                </button>
              </div>

              {/* Optional: Add a subtle link wrapper if they want to click through, but clean for now */}
            </div>
          </div>
        )}
      </section>

      {/* Featured Kurals */}
      <section className="space-y-8">
        <div className="flex justify-between items-end px-2">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t.home.featured}</h2>
            <div className="h-1 w-20 bg-blue-500 rounded-full mt-2"></div>
          </div>
          <Link href="/browse" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
            {t.home.viewAll} →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {randomKurals.length > 0 ? (
            randomKurals.map((kural) => (
              <KuralCard key={kural.number} kural={kural} />
            ))
          ) : (
            // Skeletons
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 rounded-2xl glass-card animate-pulse bg-gray-200 dark:bg-gray-800/50"></div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
