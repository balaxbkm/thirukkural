"use client";

import PageTitleKolam from "@/components/PageTitleKolam";

function TitleEndcap({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 56 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`w-6 sm:w-10 md:w-12 shrink-0 opacity-80 dark:opacity-85 ${flip ? "-scale-x-100" : ""}`}
    >
      <defs>
        <linearGradient
          id={flip ? "title-rule-r" : "title-rule-l"}
          x1="0%"
          y1="50%"
          x2="100%"
          y2="50%"
        >
          <stop offset="0%" stopColor="var(--theme-primary)" stopOpacity="0" />
          <stop offset="65%" stopColor="var(--theme-secondary)" stopOpacity="0.65" />
          <stop offset="100%" stopColor="var(--theme-primary)" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <line
        x1="2"
        y1="8"
        x2="34"
        y2="8"
        stroke={`url(#${flip ? "title-rule-r" : "title-rule-l"})`}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="39" cy="8" r="1.6" fill="var(--theme-secondary)" />
      <path
        d="M 44 8 L 49 3.5 L 54 8 L 49 12.5 Z"
        fill="var(--theme-primary)"
        fillOpacity="0.22"
        stroke="var(--theme-primary)"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <circle cx="49" cy="8" r="1.2" fill="var(--theme-primary)" />
    </svg>
  );
}

interface PageTitleProps {
  title: string;
  sizeClassName?: string;
}

/**
 * Centered page heading with a randomized behind-title kolam watermark
 * and fixed symmetrical ornamental flourishes at the start and end.
 */
export default function PageTitle({
  title,
  sizeClassName = "text-2xl xs:text-3xl sm:text-5xl",
}: PageTitleProps) {
  return (
    <div className="relative flex items-center justify-center gap-2.5 sm:gap-4 px-2">
      <PageTitleKolam />
      <span className="relative z-10 inline-flex items-center">
        <TitleEndcap />
      </span>
      <h1
        className={`relative z-10 ${sizeClassName} font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[var(--theme-hero-from)] via-[var(--theme-hero-via)] to-[var(--theme-hero-to)] tracking-tight pb-1 sm:pb-2 leading-normal`}
      >
        {title}
      </h1>
      <span className="relative z-10 inline-flex items-center">
        <TitleEndcap flip />
      </span>
    </div>
  );
}
