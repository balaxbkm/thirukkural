"use client";

import { ReactNode } from "react";

interface SectionHeaderProps {
  icon: ReactNode;
  title: string;
  titleBadge?: ReactNode;
  subtitle?: string;
  rightSlot?: ReactNode;
  alignRight?: "title" | "subtitle";
  wrapRight?: boolean;
  className?: string;
}

/**
 * Unified section header matching the Home page's icon-badge + title + muted subtitle pattern.
 * `alignRight` controls whether `rightSlot` aligns with the subtitle row (default) or the title row.
 */
export default function SectionHeader({
  icon,
  title,
  titleBadge,
  subtitle,
  rightSlot,
  alignRight = "subtitle",
  wrapRight = false,
  className = "",
}: SectionHeaderProps) {
  const rowWrapClass = wrapRight ? "flex-wrap" : "flex-nowrap";
  const titleBlock = (
    <div className="flex items-center gap-2 min-w-0 flex-wrap">
      <span className="p-1.5 rounded-lg bg-[var(--theme-badge-bg)] text-[var(--theme-primary)] shrink-0">
        {icon}
      </span>
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
        {title}
      </h2>
      {titleBadge}
    </div>
  );

  const showRightOnTitleRow = Boolean(rightSlot) && (!subtitle || alignRight === "title");
  const showRightOnSubtitleRow = Boolean(rightSlot) && Boolean(subtitle) && alignRight === "subtitle";

  return (
    <div className={className}>
      {showRightOnTitleRow ? (
        <div className={`flex items-center justify-between gap-2 sm:gap-3 ${rowWrapClass}`}>
          {titleBlock}
          <div className="shrink-0">{rightSlot}</div>
        </div>
      ) : (
        titleBlock
      )}

      {subtitle && (
        <div
          className={`flex items-center justify-between gap-2 sm:gap-4 mt-1 ${rowWrapClass}`}
        >
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 min-w-0">
            {subtitle}
          </p>
          {showRightOnSubtitleRow && <div className="shrink-0">{rightSlot}</div>}
        </div>
      )}
    </div>
  );
}
