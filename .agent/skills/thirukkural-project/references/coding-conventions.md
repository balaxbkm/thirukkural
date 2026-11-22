# Coding Conventions & Development Rules: Thirukkural Web Application

This document defines the architectural rules, coding standards, naming conventions, and best practices that all developers and AI agents must strictly follow when working on this codebase.

---

## 1. Architectural Guardrails for AI Agents

1. **Preserve Existing Architecture**:
   - Maintain the Next.js 16 App Router structure.
   - Do not switch to the legacy Pages Router.
   - Respect the separation between Server Components/Actions and Client Components.
2. **Reuse Existing Components & Utilities**:
   - Always reuse existing components (`KuralCard`, `CustomSelect`, `NoteModal`, `SearchBar`, `ThemeSelector`).
   - Do not invent duplicate select dropdowns, search inputs, or card implementations.
   - Reuse existing contexts (`LanguageContext`, `ThemeColorContext`, `useUserKuralActions`).
3. **No Arbitrary Dependencies**:
   - Do not install heavy component libraries (e.g., shadcn, MUI, Ant Design, Chakra UI).
   - Do not install duplicate icons libraries; the project uses inline SVG icons matching the Lucide/Heroicons aesthetic.
   - Always verify if functionality can be implemented using native React 19, Next.js 16, or Tailwind v4.
4. **Preserve Tamil Content Accuracy**:
   - Never alter, abbreviate, or autocorrect Thirukkural text, commentaries, or transliterations.
   - Always preserve Unicode Tamil characters in source files using UTF-8 encoding.
   - Never remove or compromise `aria-label` on elements rendered with legacy fonts like Bamini.
5. **Maintain Glassmorphism Design Consistency**:
   - Any new card or panel must use `.glass-card` or `.glass`.
   - Any new interactive button must follow `.glass-btn` styling or the gradient primary button standard.
   - Adhere strictly to the 6-palette color system using CSS variables (`var(--theme-primary)`, etc.). Never hardcode static brand colors like `bg-amber-500` for primary actions.

---

## 2. Component Guidelines & Next.js 16 Conventions

### Directive Declarations
- Explicitly declare `"use client";` at the top of any component utilizing React hooks (`useState`, `useEffect`, `useMemo`, `useCallback`), browser APIs (`localStorage`, `navigator`), or Dexie queries (`useLiveQuery`).
- Explicitly declare `"use server";` at the top of Server Action files (e.g. `app/actions/*.ts`).

### Next.js 16 Dynamic Route Parameters
In Next.js 15+, dynamic route `params` and `searchParams` are Promises. Always unwrap them using React 19's `use()` hook or an async function:
```tsx
// ✅ Correct in this codebase:
import { use } from "react";

export default function KuralPage({ params }: { params: Promise<{ number: string }> }) {
    const { number } = use(params);
    // ...
}

// ❌ Incorrect (will fail or cause runtime warnings):
export default function KuralPage({ params }: { params: { number: string } }) {
    const number = params.number;
}
```

### Suspense for Search Parameters
Any client component accessing `useSearchParams()` must be wrapped in a `<Suspense>` boundary to prevent SSR hydration errors:
```tsx
export default function BrowsePage() {
    return (
        <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
            <BrowseContent />
        </Suspense>
    );
}
```

---

## 3. Naming Conventions

| Category | Convention | Examples |
| :--- | :--- | :--- |
| **Components** | PascalCase | `KuralCard.tsx`, `CustomSelect.tsx`, `NoteModal.tsx` |
| **Component Files** | PascalCase matching component name | `components/Header.tsx`, `components/SearchBar.tsx` |
| **Custom Hooks** | camelCase prefixed with `use` | `useUserKuralActions.tsx`, `useLanguage.tsx`, `useThemeColor.tsx` |
| **Context Providers** | PascalCase suffixed with `Provider` | `LanguageProvider`, `ThemeColorProvider`, `UserKuralActionsProvider` |
| **Context Files** | PascalCase | `lib/context/LanguageContext.tsx`, `lib/context/ThemeColorContext.tsx` |
| **Server Actions** | kebab-case or camelCase function in kebab-case file | `app/actions/generate-kural-explanation.ts` |
| **App Router Folders** | lowercase kebab-case / route brackets | `app/kural/[number]/`, `app/about/`, `app/kuripugal/` |
| **Utility Functions** | camelCase | `unicodeToBamini()`, `unicodeToBaminiSyllables()`, `getKuralData()` |
| **TypeScript Types & Interfaces** | PascalCase | `Kural`, `Favorite`, `BookmarkItem`, `ColorThemeOption` |
| **Constants** | UPPER_SNAKE_CASE | `COLOR_THEMES`, `ITEMS_PER_PAGE` |

---

## 4. Import Organization Order

Imports must follow this standardized sequence with blank line separation between groups:

```typescript
// 1. React & Next.js Core
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

// 2. Third-Party Libraries
import { useLiveQuery } from "dexie-react-hooks";
import { useTheme } from "next-themes";

// 3. App Contexts & Custom Hooks
import { useLanguage } from "@/lib/context/LanguageContext";
import { useThemeColor } from "@/lib/context/ThemeColorContext";
import { useUserKuralActions } from "@/lib/hooks/useUserKuralActions";

// 4. Components
import KuralCard from "@/components/KuralCard";
import CustomSelect from "@/components/CustomSelect";
import NoteModal from "@/components/NoteModal";

// 5. Data & Utilities
import { Kural } from "@/types/thirukkural";
import { db } from "@/lib/db";
import { unicodeToBamini } from "@/lib/utils/bamini";
import kuralsData from "@/data/thirukkural.json";
```

---

## 5. Styling Rules with Tailwind CSS v4 & Theme Variables

1. **Use Theme CSS Variables for Dynamic Colors**:
   Always reference the theme variables instead of static color values for branded elements:
   ```tsx
   // ✅ Correct:
   className="text-[var(--theme-primary)] bg-[var(--theme-badge-bg)] border-[var(--theme-badge-border)] shadow-[var(--theme-glow)]"

   // ❌ Incorrect:
   className="text-amber-600 bg-amber-100 border-amber-300"
   ```
2. **Glassmorphism Utility Classes**:
   - Container surfaces: `.glass-card`
   - Inputs and textareas: `.glass-input`
   - Pill and secondary action buttons: `.glass-btn`
3. **Focus State Policy**:
   All inputs and buttons have browser outline ring resets configured globally in `app/globals.css`. Do not add heavy conflicting browser outlines. Use subtle ring accents (`focus:ring-2 focus:ring-[var(--theme-primary)]/40`).
4. **Pointer Cursor**:
   Interactive elements (`a`, `button`, `[role="button"]`) enforce `cursor: pointer;`. Ensure custom clickable containers include `cursor-pointer`.

---

## 6. Tamil Typography & Bamini Font Rules

1. **Standard Text**:
   Render all standard Tamil text (commentaries, body, card couplets) using the default system/Mukta Malar font without font conversion:
   ```tsx
   <p className="font-bold text-lg text-gray-800 dark:text-gray-100">
       {kural.line1_ta}
   </p>
   ```
2. **Decorative Bamini Display**:
   When using `font-bamini` (for Hero couplet or branding logo):
   - Always run the input string through `unicodeToBamini(text)`.
   - Always set `aria-label={text}` with the unmodified Unicode Tamil string.
   - For segmented words with gaps, use `unicodeToBaminiSyllables(text)`.
   ```tsx
   <p
       className="font-bamini text-3xl bg-gradient-to-r from-[var(--theme-hero-from)] to-[var(--theme-hero-to)] bg-clip-text text-transparent"
       aria-label={kural.line1_ta}
   >
       {unicodeToBamini(kural.line1_ta)}
   </p>
   ```

---

## 7. State Management & Storage Rules

| State Type | Preferred Mechanism | Example Use Case |
| :--- | :--- | :--- |
| **Persistent User Content** | Dexie.js (IndexedDB) via `useUserKuralActions` | Favorites, Custom Notes (Kuripugal), Reading History |
| **Page Navigation & Filter State** | Next.js URL Search Params (`useSearchParams`) | Active Paal, Iyal, Adhigaram, and Page on `/browse` |
| **Global UI Settings** | React Context (`useState` + `localStorage` sync) | Active language (`LanguageContext`), Active color theme (`ThemeColorContext`) |
| **Local Dialog/Widget State** | React `useState` | Modal open/close, copy toast visibility, search query |

### Dexie Data Mutation Rule
Never manipulate Dexie tables directly inside components. Always call the centralized methods exposed by `useUserKuralActions()`:
- `toggleFavorite(num)`
- `saveNote(num, text)`
- `deleteNote(num)`
- `recordView(num)`
- `clearHistory()`
- `clearAllFavorites()`

---

## 8. Error Handling & Safe Hydration

1. **Browser API Guard**:
   Always verify `typeof window !== 'undefined'` before accessing `window`, `document`, `localStorage`, or `navigator`.
2. **Mounted Guard Pattern**:
   For components that depend on `localStorage` or `IndexedDB` data during render, use a `mounted` boolean to prevent hydration mismatch:
   ```tsx
   const [mounted, setMounted] = useState(false);
   useEffect(() => {
       setMounted(true);
   }, []);

   if (!mounted) return null; // or render a skeleton
   ```
3. **Safe JSON Parsing**:
   When parsing localStorage or API responses, always wrap in a `try...catch` block with safe fallback values.
