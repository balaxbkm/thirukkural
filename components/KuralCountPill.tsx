"use client";

import { useLanguage } from "@/lib/context/LanguageContext";

interface KuralCountPillProps {
  count: number;
  singularLabel?: string;
  pluralLabel?: string;
}

/**
 * Compact, right-aligned count pill displayed above Kural card grids,
 * handling singular ("1 குறள்" / "1 Kural") and plural ("N குறள்கள்" / "N Kurals").
 */
export default function KuralCountPill({
  count,
  singularLabel,
  pluralLabel,
}: KuralCountPillProps) {
  const { t } = useLanguage();
  const label = count === 1
    ? (singularLabel ?? t.kural.number)
    : (pluralLabel ?? t.nav.kurals);

  return (
    <div className="flex items-center justify-end px-1">
      <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--theme-badge-bg)] border border-[var(--theme-badge-border)] text-[var(--theme-badge-text)] text-xs font-semibold backdrop-blur-md shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-dot)]" />
        <span className="font-mono font-bold">{count}</span>
        <span>{label}</span>
      </span>
    </div>
  );
}
