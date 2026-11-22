---
name: thirukkural-project
description: >-
  Complete technical knowledge, architectural guide, and development runbook for the Thirukkural web application.
  Use whenever developing, refactoring, debugging, designing, testing, or adding features to this Next.js 16,
  React 19, Tailwind CSS v4, Dexie IndexedDB, and Google Gemini AI powered Thirukkural exploration platform.
---

# Thirukkural Project Skill

This skill equips Antigravity AI agents with complete, authoritative technical knowledge of the **Thirukkural Web Application**. When working in this codebase, act as an expert original author who understands every design decision, component boundary, database schema, typography rule, and feature flow.

---

## 1. Project Identity & Architecture Overview

The **Thirukkural Web Explorer** is a high-performance, culturally authentic, and beautifully crafted web application dedicated to the 1,330 couplets of Saint Thiruvalluvar.

- **Framework**: Next.js 16.0.8 (App Router) + React 19.2.1 + TypeScript 5
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`) with custom glassmorphism utilities and 6 dual-mode color palettes
- **Client Database**: Dexie.js 4.4.7 (`dexie-react-hooks`) backing offline-capable Favorites, Notes (Kuripugal), and Reading History in IndexedDB
- **AI Engine**: Google Gemini Generative AI (`@google/generative-ai`) via Next.js Server Action (`generateKuralExplanation`) with multi-model resilient fallback
- **State Management**: Reactive Dexie `useLiveQuery` + React Contexts (`LanguageContext`, `ThemeColorContext`) + URL search params for catalog browsing
- **Typography**: Google Fonts (`Mukta_Malar`, `Outfit`) + local legacy typewriter font (`BAMINI-Tamil25.ttf`) with a custom Tamil Unicode-to-Bamini ASCII converter

For deep technical diagrams and data flows, see [Project Architecture](./references/project-architecture.md).

---

## 2. Repository Navigation & File Manifest

```text
thirukkural/
├── .agent/skills/thirukkural-project/   # This Agent Skill & Supporting References
├── app/                                # Next.js 16 App Router
│   ├── actions/                        # Server Actions (generate-kural-explanation.ts)
│   ├── about/                          # Cultural & Historical Encyclopedia
│   ├── browse/                         # Filterable Catalog (Paal, Iyal, Adhigaram)
│   ├── favorites/                      # User Bookmarked Kurals (IndexedDB)
│   ├── history/                        # Reading History Page
│   ├── kural/[number]/                 # Dynamic Couplet Detail Page (1..1330)
│   ├── kuripugal/                      # User Personal Notes Page
│   ├── bookmarks/ & recent/            # Backward-compatible redirect aliases
│   ├── globals.css                     # Tailwind v4, Glassmorphic tokens, 6 Themes
│   ├── icon.tsx                        # Dynamic Server-Rendered Favicon
│   ├── layout.tsx                      # Root Shell, Context Providers & Anti-Flash Script
│   └── page.tsx                        # Home / Landing Page
├── components/                         # Header, Footer, KuralCard, SearchBar, CustomSelect,
│                                       # NoteModal, ThemeSelector, ThemeProvider
├── data/thirukkural.json               # Master JSON database of all 1,330 Kurals
├── lib/                                # Dexie DB, hooks, i18n, contexts, Bamini utils
├── public/                             # Static assets, logos, and BAMINI-Tamil25.ttf font
├── scripts/                            # Data scraping & update utilities
└── types/thirukkural.ts                # TypeScript interfaces (Kural)
```

For a comprehensive explanation of every file in the codebase, consult [Folder Structure & File Manifest](./references/folder-structure.md).

---

## 3. Design System & Aesthetic Principles

### The 6 Classical Dual-Mode Palettes
Each palette is configured with matching Light and Dark modes via CSS variables in `app/globals.css`:
1. **Amber** (`amber` - Default): "Golden Sandal" / "தங்கம்" (`#f59e0b` / `#d97706`) - Classical heritage, sandalwood, ancient parchment.
2. **Indigo** (`indigo`): "Indigo" / "நீலம்" (`#4f46e5` / `#818cf8`) - Celestial, modern clarity.
3. **Emerald** (`emerald`): "Emerald" / "மரகதம்" (`#059669` / `#34d399`) - Nature, serene harmony.
4. **Rose** (`rose`): "Ruby Lotus" / "செந்தாமரை" (`#e11d48` / `#fb7185`) - Bloom, passion, poetic warmth.
5. **Monochrome** (`monochrome`): "Black & White" / "கருப்பு & வெள்ளை" (`#18181b` / `#f4f4f5`) - Minimalist editorial.
6. **Amethyst** (`amethyst`): "Royal Amethyst" / "அரக்கு" (`#9333ea` / `#c084fc`) - Imperial court majesty.

### Glassmorphism Utility Tokens
- **`.glass-card`**: Translucent frosted card with rounded corners, subtle border highlight, ambient glow shadow, and slight hover lift (`hover:scale-[1.01]`).
- **`.glass-btn`**: Interactive button with blur, hover highlight, and active scale press (`active:scale-95`).
- **`.glass-input`**: Frosted text input and textarea with custom focus ring.

### Tamil Typography & Bamini Font Engine
- **Standard Tamil**: Rendered via `Mukta_Malar` Google Font with native Unicode.
- **Decorative Hero Couplets & Logo**: Rendered in `font-bamini` (`/fonts/BAMINI-Tamil25.ttf`).
- **Encoding Rule**: Because Bamini is an ASCII typewriter font, text passed to it MUST be converted using `unicodeToBamini(text)` or `unicodeToBaminiSyllables(text)`.
- **Accessibility Invariant**: Every Bamini-styled element MUST include `aria-label={unicodeText}` to ensure full accessibility for screen readers and search crawlers.

For complete token definitions and conversion algorithms, see [Design System Reference](./references/design-system.md).

---

## 4. Feature Reference & Domain Logic

1. **Daily Seeded Kural**:
   - Computes an 8-hour deterministic hash bucket over `Date.now()` to select a consistent Kural for all visitors without needing backend storage.
   - Allows users to hand-pick and rotate a new Kural, saving it in `localStorage('thirukkural_hero_kural')`.
2. **Catalog Browsing (`/browse`)**:
   - Cascading filter dropdowns: Paal (3) -> Iyal (chapter groups) -> Adhigaram (133 chapters).
   - Filter state is synchronized with URL search params (`?paal=...&iyal=...&page=...`).
   - 12 couplets per page with smart ellipsis pagination.
3. **Kural Detail Page (`/kural/[number]`)**:
   - Displays Tamil lines, English transliteration, English meaning, and 3 commentaries:
     - **Mu. Varadarajan (`mv`)**: Accessible everyday prose.
     - **Solomon Pappaiah (`sp`)**: Conversational contemporary insight.
     - **Kalaignar Karunanidhi (`mk`)**: Poetic literary commentary.
   - Dynamic 2-column layout: Expands to a sticky split screen when personal user notes exist.
   - Automatically logs reading history on mount.
4. **AI Explanation Engine (`generateKuralExplanation`)**:
   - Next.js Server Action (`use server`) connecting to Google Gemini.
   - Resilient multi-model fallback cascade starting from `gemini-2.5-flash` down to `gemini-pro`.
   - Returns bilingual JSON with `context`, `insight`, and exactly 2 actionable `modern` steps.
5. **Favorites & Notes Separation (IndexedDB)**:
   - **Favorites**: Stored in `db.favorites` (`kuralNumber`, `createdAt`). Heart icon toggle.
   - **Notes (Kuripugal)**: Stored in `db.notes` (`kuralNumber`, `text`, `updatedAt`). Modal editor with character counter.
   - Both update header badge counts in real time via Dexie's `useLiveQuery`.
6. **Reading History (`/history`)**:
   - Deduplicated chronologically sorted log of visited Kurals in `db.history`.
   - Quick preview of top 3 recent Kurals on home page; full clearing supported.

For complete feature implementation details and edge cases, see [Features & Functionality Reference](./references/features-and-functionality.md).

---

## 5. Strict Development Rules for AI Agents

When modifying this repository, follow these non-negotiable rules:

1. **Do Not Break Glassmorphism Styling**:
   Use `[var(--theme-primary)]`, `[var(--theme-badge-bg)]`, and `.glass-card` classes. Never hardcode one-off static hex codes (like `#d97706` or `bg-amber-500`) for themed UI elements.
2. **Preserve Next.js 16 Async Routing**:
   Always treat dynamic route `params` as a Promise and unwrap using React 19's `use(params)`:
   ```tsx
   export default function Page({ params }: { params: Promise<{ number: string }> }) {
       const { number } = use(params);
   }
   ```
3. **Wrap `useSearchParams()` in `<Suspense>`**:
   Any component calling `useSearchParams()` must be inside a `<Suspense>` boundary to prevent Next.js build and hydration failures.
4. **Preserve Tamil Encoding & Unicode Accuracy**:
   Never alter or truncate Thirukkural verses or commentaries. Never delete `aria-label` from Bamini-encoded elements.
5. **Use Centralized Storage Methods**:
   Never query or mutate Dexie tables directly in ad-hoc page files. Always invoke methods from `useUserKuralActions()` (`toggleFavorite`, `saveNote`, `deleteNote`, `recordView`).
6. **Avoid Unnecessary NPM Packages**:
   Do not install external UI component libraries, icon packs, or CSS frameworks. Use existing Tailwind v4 utilities and inline SVG icons.

For complete coding guidelines and import rules, consult [Coding Conventions](./references/coding-conventions.md).

---

## 6. Common Development Workflows & Runbooks

- **Adding a Page**: Create `app/<route>/page.tsx`, wrap interactive state with `"use client";`, add navigation link in `components/Header.tsx`, and add bilingual strings in `lib/i18n/translations.ts`.
- **Creating a Component**: Build in `components/<Name>.tsx` using TypeScript interfaces and glassmorphic styling tokens.
- **Adding a Color Theme**: Register metadata in `lib/context/ThemeColorContext.tsx` and define Light/Dark CSS variables in `app/globals.css`.
- **Updating Kural Data**: Update `data/thirukkural.json` matching `types/thirukkural.ts`, or run `node scripts/update-data.js`.
- **Verification Commands**:
  - `npm run lint`: Verify ESLint and Next.js rules.
  - `npm run build`: Type-check with `tsc` and test production bundling.
  - `npm run dev`: Launch local development server on `localhost:3000`.

For detailed step-by-step walkthroughs, see [Development Workflows](./references/development-workflows.md).

---

## 7. Supporting Reference Documents

- [Project Architecture & Integrations](./references/project-architecture.md)
- [Folder Structure & Complete File Manifest](./references/folder-structure.md)
- [Design System, Palettes & Typography](./references/design-system.md)
- [Features & Business Logic Analysis](./references/features-and-functionality.md)
- [Data Models & TypeScript Schemas](./references/data-models.md)
- [Coding Conventions & Agent Rules](./references/coding-conventions.md)
- [Development Workflows & Build Runbooks](./references/development-workflows.md)
