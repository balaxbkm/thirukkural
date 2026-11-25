"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const TOTAL_KOLAMS = 11;

interface PageTitleKolamProps {
  kolamNumber?: number;
  sizeClass?: string;
}

/**
 * Masked traditional Tamil Kolam PNG accent rendered subtly behind page titles
 * and the top hero badge, picking a random design on every refresh/navigation.
 */
export default function PageTitleKolam({
  kolamNumber,
  sizeClass = "w-16 h-16 sm:w-24 sm:h-24",
}: PageTitleKolamProps) {
  const pathname = usePathname() || "/";
  const [randomIndex, setRandomIndex] = useState<number | null>(null);

  useEffect(() => {
    if (kolamNumber !== undefined) return;
    const frameId = requestAnimationFrame(() => {
      setRandomIndex((prev) => {
        let next = Math.floor(Math.random() * TOTAL_KOLAMS) + 1;
        if (TOTAL_KOLAMS > 1 && prev === next) {
          next = (next % TOTAL_KOLAMS) + 1;
        }
        return next;
      });
    });
    return () => cancelAnimationFrame(frameId);
  }, [kolamNumber, pathname]);

  const activeIndex = kolamNumber ?? randomIndex;
  if (activeIndex === null) return null;

  const src = `/kolams/kolam-${activeIndex}.png`;

  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${sizeClass} z-0 opacity-[0.12] dark:opacity-[0.16] animate-in fade-in duration-500 transition-colors`}
      style={{
        WebkitMaskImage: `url(${src})`,
        WebkitMaskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskImage: `url(${src})`,
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
        backgroundColor: "var(--theme-primary)",
      }}
    />
  );
}
