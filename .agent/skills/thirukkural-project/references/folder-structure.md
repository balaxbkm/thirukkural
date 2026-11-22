# Folder Structure & File Manifest: Thirukkural Web Application

This document details the exact repository organization, file roles, exports, and relationships across the entire codebase.

---

## 1. Directory Tree Overview

```text
thirukkural/
├── .agent/
│   └── skills/
│       └── thirukkural-project/          # Antigravity Project Skill
│           ├── SKILL.md                  # Main Skill Instruction Manual
│           └── references/               # Detailed Reference Documents
├── app/                                  # Next.js 16 App Router
│   ├── actions/                          # Server Actions
│   │   └── generate-kural-explanation.ts # Gemini API Server Action
│   ├── about/
│   │   └── page.tsx                      # Cultural & Historical Encyclopedia
│   ├── bookmarks/
│   │   └── page.tsx                      # Alias route -> /favorites
│   ├── browse/
│   │   └── page.tsx                      # Filterable Kural Catalog (Paal/Iyal/Adhigaram)
│   ├── favorites/
│   │   └── page.tsx                      # Saved Kurals Page (IndexedDB)
│   ├── history/
│   │   └── page.tsx                      # Recently Viewed Kurals Page
│   ├── kural/
│   │   └── [number]/
│   │       └── page.tsx                  # Dynamic Kural Detail Page (1..1330)
│   ├── kuripugal/
│   │   └── page.tsx                      # User Custom Notes Page
│   ├── recent/
│   │   └── page.tsx                      # Alias route -> /history
│   ├── globals.css                       # Tailwind v4 & Glassmorphism Theme CSS
│   ├── icon.tsx                          # Dynamic Server-Rendered Favicon/OG
│   ├── layout.tsx                        # Root Layout & Global Context Providers
│   └── page.tsx                          # Landing / Home Page
├── components/                           # Reusable React UI Components
│   ├── CustomSelect.tsx                  # Searchable Glassmorphic Select Dropdown
│   ├── Footer.tsx                        # 4-Column Responsive Footer with Chapter Links
│   ├── Header.tsx                        # Floating Blur Header, Navigation & Logo
│   ├── KuralCard.tsx                     # Couplet Card with Actions & Micro-interactions
│   ├── KuralPageActions.tsx              # Action bar on Kural Detail Page (Fav/Note/Copy/Share)
│   ├── NoteModal.tsx                     # Portal Modal Dialog for Writing/Editing Notes
│   ├── SearchBar.tsx                     # Header & Hero Search Component with Dropdown
│   ├── ThemeProvider.tsx                 # Next-themes wrapper
│   └── ThemeSelector.tsx                 # 6-Palette Theme & Dark/Light Switcher
├── data/
│   └── thirukkural.json                  # Complete 1,330 Kural JSON Database (2.65 MB)
├── lib/
│   ├── context/
│   │   ├── LanguageContext.tsx           # Bilingual i18n Context (Tamil / English)
│   │   └── ThemeColorContext.tsx         # 6 Color Themes Context & LocalStorage Sync
│   ├── hooks/
│   │   └── useUserKuralActions.tsx       # Core Dexie Hook (Favorites, Notes, History)
│   ├── i18n/
│   │   └── translations.ts               # Translation Strings (en / ta)
│   ├── utils/
│   │   └── bamini.ts                     # Unicode-to-Bamini ASCII Font Converter
│   ├── about-data.ts                     # Comprehensive Historical & Cultural Content
│   ├── adhigaram-titles.ts               # Chapter English Titles & Transliterations
│   ├── db.ts                             # Dexie.js Database Class & Schema Migrations
│   └── kural-data.ts                     # Server-Side Node.js File Reader for JSON
├── public/                               # Static Web Assets
│   ├── fonts/
│   │   └── BAMINI-Tamil25.ttf            # Custom Legacy Bamini Typewriter Font
│   ├── file.svg                          # Default icon asset
│   ├── gemini-icon.png                   # Gemini AI sparkle icon
│   ├── globe.svg                         # Globe SVG icon
│   ├── logo.png                          # Logo graphic
│   ├── next.svg                          # Next.js logo
│   ├── valluvar-logo.jpg                 # Square portrait of Thiruvalluvar
│   ├── valluvar-logo-v2.jpg              # High-res circular portrait asset
│   ├── vercel.svg                        # Vercel deployment badge
│   └── window.svg                        # Window SVG icon
├── scripts/                              # Data Processing Scripts
│   ├── models.json                       # Gemini model testing output
│   ├── output.txt                        # Intermediate data export log
│   └── update-data.js                    # Node.js ETL script to compile thirukkural.json
├── types/
│   └── thirukkural.ts                    # TypeScript Interface for Kural Object
├── .env.local                            # Local Environment Variables (GEMINI_API_KEY)
├── .gitignore                            # Git Exclusion Rules
├── eslint.config.mjs                     # ESLint Flat Config
├── next.config.ts                        # Next.js 16 Configuration
├── package.json                          # NPM Dependencies & Scripts
├── postcss.config.mjs                    # PostCSS Config (@tailwindcss/postcss)
├── README.md                             # Repository Readme
└── tsconfig.json                         # TypeScript Compiler Configuration
```

---

## 2. File Manifest & Detailed Responsibilities

### Root Configuration Files

| File | Purpose | Exports / Config |
| :--- | :--- | :--- |
| `package.json` | Project metadata, scripts (`dev`, `build`, `start`, `lint`), and dependencies (`next: 16.0.8`, `react: 19.2.1`, `tailwindcss: ^4`, `@google/generative-ai`, `dexie`, `dexie-react-hooks`, `next-themes`). | JSON config |
| `tsconfig.json` | TypeScript configuration enabling strict mode, JSX preserve for Next.js, and path alias `@/*` -> `./*`. | JSON config |
| `next.config.ts` | Next.js configuration module (`NextConfig`). Currently default configuration. | `export default nextConfig` |
| `postcss.config.mjs` | Configures PostCSS plugins, specifically `@tailwindcss/postcss`. | `export default { plugins: { "@tailwindcss/postcss": {} } }` |
| `eslint.config.mjs` | Configures ESLint using the new flat config format with `eslint-config-next`. | Flat ESLint config |
| `.env.local` | Stores local secrets including `GEMINI_API_KEY` for Google Generative AI integration. Never commit secrets to VCS. | Key-value environment variables |

---

### Application Routes (`app/`)

| File | Route Path | Type | Responsibility & Implementation |
| :--- | :--- | :--- | :--- |
| `app/layout.tsx` | `/` (Global) | Server Component | Root HTML shell. Injects font CSS variables (`--font-outfit`, `--font-mukta`), runs anti-flash theme script in `<head>`, wraps application in `LanguageProvider`, `UserKuralActionsProvider`, `ThemeColorProvider`, `ThemeProvider`, mounts `<Header />` and `<Footer />`. |
| `app/page.tsx` | `/` | Client Component | Home / Landing view. Features daily seeded Kural (8-hour bucket), BAMINI font hero display, action buttons (favorite, note, refresh), large `SearchBar`, top 3 recently viewed Kurals, and 6 randomized featured Kurals. |
| `app/kural/[number]/page.tsx` | `/kural/:number` | Client Component | Dynamic Kural detail page for numbers `1` to `1330`. Displays lines in Tamil, English transliteration, Mu. Va, Solomon Pappaiah, and Kalaignar explanations, English meaning, Gemini AI analysis generator, responsive 2-column layout when user notes exist, and prev/next navigation. |
| `app/browse/page.tsx` | `/browse` | Client Component (Suspense) | Filter and search catalog with URL parameter sync (`?paal=...&iyal=...&adhigaram=...&page=...`). Cascading selectors, search-in-dropdown for 133 Adhigarams, 12 items/page pagination with smart ellipsis. |
| `app/favorites/page.tsx` | `/favorites` | Client Component | User saved favorites list, pulling live reactive items from Dexie IndexedDB via `useUserKuralActions`. Displays count badge and empty state CTA. |
| `app/bookmarks/page.tsx` | `/bookmarks` | Client Component | Backward-compatible alias forwarding directly to `FavoritesPage`. |
| `app/kuripugal/page.tsx` | `/kuripugal` | Client Component | User custom reflections and notes list ("Kuripugal"). Displays Kural card with highlighted note block, edit and delete buttons, and count badge. |
| `app/history/page.tsx` | `/history` | Client Component | Reading history showing all viewed Kurals in reverse chronological order. Allows clearing history with one click. |
| `app/recent/page.tsx` | `/recent` | Client Component | Backward-compatible alias forwarding directly to `HistoryPage`. |
| `app/about/page.tsx` | `/about` | Client Component | Comprehensive cultural guide covering Saint Thiruvalluvar, historical timeline, Muppaal structure (Aram, Porul, Inbam), commentators, and global tributes. |
| `app/icon.tsx` | `/favicon.ico` | Server Edge Route | Dynamically generates circular icon with Thiruvalluvar portrait image (`public/valluvar-logo-v2.jpg`) and fallback gradient using Next.js `ImageResponse`. |
| `app/globals.css` | Global CSS | Stylesheet | Tailwind CSS v4 import (`@import "tailwindcss";`), BAMINI `@font-face` declaration, 6 dual-mode color theme CSS variables, glassmorphic design utility classes (`.glass`, `.glass-card`, `.glass-btn`), and custom scrollbars. |
| `app/actions/generate-kural-explanation.ts` | Server Action | Server Function | Next.js Server Action (`use server`) connecting to Google Gemini Generative AI with resilient multi-model fallback list. Returns bilingual JSON response. |

---

### Reusable UI Components (`components/`)

| Component | Responsibility & Interactions | Props / State |
| :--- | :--- | :--- |
| `Header.tsx` | Sticky floating glassmorphism header with logo rendered via BAMINI font graphemes, desktop and mobile drawer navigation with live badge counts (Favorites, Notes), language switcher, and `ThemeSelector`. | Active route tracking, mobile menu toggle, badge count queries. |
| `Footer.tsx` | Rich 4-column footer showing brand summary and 3 Paal chapter lists (5 deterministic random chapters per Paal seeded hourly), copyright, and external links. | `adhigaramData?: Record<string, string[]>` |
| `KuralCard.tsx` | Responsive couplet card displaying Kural number, chapter, Tamil lines, English meaning, and custom note preview. Action bar includes Favorite (Heart), Content Copy, Web Share, and link to full page. | `kural: Kural`, local toast notifications. |
| `KuralPageActions.tsx` | Top-right action toolbar on Kural detail page with buttons for Note modal, Favorite, Copy, and Web Share. | `kural: Kural`, `onOpenNote?: () => void`. |
| `NoteModal.tsx` | Portal modal (`createPortal` to `document.body`) allowing user to write, edit, and delete personal reflections for a Kural. Displays couplet preview and character counter. | `isOpen`, `onClose`, `kuralNumber`, `adhigaram`, `line1`, `line2`. |
| `SearchBar.tsx` | Fast client-side search bar with instant autocomplete. Large variant includes searchable Adhigaram filter dropdown. Searches numbers, Tamil text, transliteration, and English meanings. | `variant?: "header" \| "large"`. |
| `CustomSelect.tsx` | Accessible glassmorphic select dropdown supporting option search, keyboard navigation, and auto-scroll to selected option. | `label`, `options`, `value`, `onChange`, `placeholder`, `icon`, `enableSearch`. |
| `ThemeSelector.tsx` | Multi-palette color theme picker and Dark/Light toggle. Supports both `dropdown` (header icon) and `inline` (mobile menu) layouts. | `variant?: "dropdown" \| "inline"`, `onSelect?: () => void`. |
| `ThemeProvider.tsx` | Minimal client wrapper around `next-themes` `ThemeProvider`. | Passes props to `NextThemesProvider`. |

---

### Core Libraries & Utilities (`lib/`)

| File | Module Name | Key Exports | Description |
| :--- | :--- | :--- | :--- |
| `lib/db.ts` | Dexie DB | `ThirukkuralDatabase`, `db`, `requestPersistentStorage`, interfaces (`Favorite`, `Bookmark`, `KuralNote`, `ReadingHistory`, `AppSetting`) | IndexedDB schema, store definitions, version migrations, and storage persistence helper. |
| `lib/hooks/useUserKuralActions.tsx` | User Actions Hook | `UserKuralActionsProvider`, `useUserKuralActions` | Core reactive state hook for Favorites, Notes, and History using Dexie `useLiveQuery`. |
| `lib/context/LanguageContext.tsx` | i18n Context | `LanguageProvider`, `useLanguage` | Manages active language (`ta` \| `en`), persists to `localStorage`, returns dictionary `t`. |
| `lib/context/ThemeColorContext.tsx` | Theme Context | `ThemeColorProvider`, `useThemeColor`, `COLOR_THEMES`, `ColorThemeOption` | Manages 6 color palettes, sets `data-theme` attribute on `<html>`, persists to `localStorage`. |
| `lib/i18n/translations.ts` | Translations | `translations`, `Language` | Complete English and Tamil bilingual strings dictionary for all pages, navigation, actions, and messages. |
| `lib/utils/bamini.ts` | Bamini Font Utility | `unicodeToBamini`, `unicodeToBaminiSyllables` | Converts Tamil Unicode characters to Bamini typewriter font ASCII encoding with grapheme cluster preservation. |
| `lib/about-data.ts` | About Content | `aboutData` | In-depth bilingual historical data: Thiruvalluvar biography, 10 commentators, 3 Paals, 133 chapters, and international quotes. |
| `lib/adhigaram-titles.ts` | Chapter Titles | `adhigaramTitles`, `adhigaramTransliterations` | Translation dictionary mapping all 133 Tamil Adhigaram names to English titles and transliterations. |
| `lib/kural-data.ts` | Server Data Reader | `getKuralData()`, `getPaalAdhigarams()`, `Kural` | Node.js file system reader (`fs.readFile`) used by server layout and static routines. |

---

### Data & Scripts

| Path | Format | Role |
| :--- | :--- | :--- |
| `data/thirukkural.json` | JSON Array (1,330 items) | The master database containing all 1,330 Kurals with Tamil couplets, Mu. Va, Solomon Pappaiah, and Kalaignar commentaries, transliterations, and English translations. |
| `scripts/update-data.js` | CommonJS Script | ETL utility to fetch raw Thirukkural data from GitHub and compile the unified `thirukkural.json` structure. |
| `types/thirukkural.ts` | TypeScript Definitions | Single source of truth for the `Kural` interface. |
