# Features & Functionality Reference: Thirukkural Web Application

This document provides an exhaustive, feature-by-feature inspection of the business logic, execution flows, component mapping, and implementation status across the application.

---

## 1. Feature Implementation Status Matrix

| Feature | Category | Status | Primary Files Involved |
| :--- | :--- | :--- | :--- |
| **Daily Seeded Kural (Hero Couplet)** | Exploration | **Implemented** | `app/page.tsx`, `lib/utils/bamini.ts` |
| **Hero Kural Refresh / Rotation** | Exploration | **Implemented** | `app/page.tsx` |
| **Comprehensive Couplet Search** | Search | **Implemented** | `components/SearchBar.tsx`, `data/thirukkural.json` |
| **Adhigaram Dropdown Filter Search** | Search | **Implemented** | `components/SearchBar.tsx`, `lib/adhigaram-titles.ts` |
| **Catalog Browsing (Paal/Iyal/Adhigaram)**| Navigation | **Implemented** | `app/browse/page.tsx`, `components/CustomSelect.tsx` |
| **URL-Synced Filter State** | Navigation | **Implemented** | `app/browse/page.tsx` |
| **Kural Detail Page (1..1330)** | Content | **Implemented** | `app/kural/[number]/page.tsx` |
| **Scholarly Commentaries (Mu.Va/SP/MK)** | Content | **Implemented** | `app/kural/[number]/page.tsx`, `data/thirukkural.json` |
| **English Transliteration & Meaning** | Content | **Implemented** | `app/kural/[number]/page.tsx`, `data/thirukkural.json` |
| **AI Explanation via Google Gemini** | AI / LLM | **Implemented** | `app/actions/generate-kural-explanation.ts`, `app/kural/[number]/page.tsx` |
| **Multi-Model Resilient Fallback** | AI / LLM | **Implemented** | `app/actions/generate-kural-explanation.ts` |
| **Favorites Management (IndexedDB)** | User Data | **Implemented** | `lib/db.ts`, `lib/hooks/useUserKuralActions.tsx`, `app/favorites/page.tsx` |
| **Personal Notes / Kuripugal Modal** | User Data | **Implemented** | `components/NoteModal.tsx`, `app/kuripugal/page.tsx` |
| **Dynamic 2-Column Note Layout** | Content / UI | **Implemented** | `app/kural/[number]/page.tsx` |
| **Reading History Auto-Tracking** | User Data | **Implemented** | `app/kural/[number]/page.tsx`, `app/history/page.tsx` |
| **Recently Viewed Kurals Strip** | Exploration | **Implemented** | `app/page.tsx`, `components/KuralCard.tsx` |
| **6-Palette Dual-Mode Theme Engine** | Theming | **Implemented** | `lib/context/ThemeColorContext.tsx`, `components/ThemeSelector.tsx`, `app/globals.css` |
| **Bilingual Localization (Tamil / English)**| i18n | **Implemented** | `lib/context/LanguageContext.tsx`, `lib/i18n/translations.ts` |
| **Copy Formatted Couplet to Clipboard** | Sharing | **Implemented** | `components/KuralCard.tsx`, `components/KuralPageActions.tsx` |
| **Native Web Share API Integration** | Sharing | **Implemented** | `components/KuralCard.tsx`, `components/KuralPageActions.tsx` |
| **Cultural Encyclopedia (About Page)** | Content | **Implemented** | `app/about/page.tsx`, `lib/about-data.ts` |
| **Bamini Typewriter Font Rendering** | Typography | **Implemented** | `lib/utils/bamini.ts`, `public/fonts/BAMINI-Tamil25.ttf` |
| **Dynamic Server-Generated Favicon** | Metadata | **Implemented** | `app/icon.tsx`, `public/valluvar-logo-v2.jpg` |
| **PWA Manifest & Offline Service Worker** | PWA | **Unimplemented** | Not yet created in `public/manifest.json` |

---

## 2. Deep Dive into Implemented Features

### Feature 1: Daily Seeded Kural (Hero Couplet)
- **Purpose**: Displays a prominent, featured Kural on the home page that stays consistent for 8 hours without requiring backend server state.
- **User Interaction**:
  - The couplet appears at the very top of the landing page in large Bamini typewriter font with giant quotation marks.
  - Hovering scales the text slightly.
  - Clicking navigates to the Kural detail page.
  - Clicking the chapter badge navigates to `/browse?paal=...&iyal=...&adhigaram=...`.
- **Logic & Algorithm**:
  1. Checks `localStorage.getItem("thirukkural_hero_kural")`. If user previously hand-picked a Kural via the refresh button, that selection is restored.
  2. If absent, computes an 8-hour deterministic hash:
     ```typescript
     const now = Date.now();
     const intervalMs = 8 * 60 * 60 * 1000;
     const timeBucket = Math.floor(now / intervalMs);
     const seedStr = timeBucket.toString();
     let hash = 0;
     for (let i = 0; i < seedStr.length; i++) {
       hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
       hash |= 0;
     }
     const index = Math.abs(hash) % allKurals.length;
     ```
  3. Formats lines using `unicodeToBamini()` and wraps in `<p aria-label={unicodeLine}>`.

---

### Feature 2: Hero Kural Rotation
- **Purpose**: Gives users immediate serendipitous discovery of any of the 1,330 couplets.
- **User Interaction**: Clicking the circular refresh button triggers a 180° rotation animation and swaps the Hero Kural.
- **Logic**:
  - Sets `isRotating = true` for 450ms.
  - Generates random index guaranteed to be different from the currently displayed Kural.
  - Saves the new selection to `localStorage('thirukkural_hero_kural')`.
  - Clears `isRotating` to re-enable interaction.

---

### Feature 3: Global Kural Search (`components/SearchBar.tsx`)
- **Purpose**: Real-time client-side search across the entire 1,330 Kural dataset.
- **Search Capabilities**:
  - By number: e.g. `1`, `42`, `1330`.
  - By Tamil text: Line 1, Line 2, and chapter names.
  - By English transliteration: e.g. `Agara Mudhala`, `Karka`.
  - By English meaning: e.g. `learning`, `love`, `virtue`, `rain`.
- **Large Variant Enhancements** (used on Home page):
  - Incorporates an integrated chapter dropdown selector on the left (`min-w-[280px]`).
  - Searchable list of all 133 Adhigarams with internal text search matching Tamil titles, English titles, or transliterations.
  - When an Adhigaram is chosen from the dropdown, search queries are scoped specifically to that chapter.

---

### Feature 4: Catalog Browsing & Filter Engine (`app/browse/page.tsx`)
- **Purpose**: Systematic navigation through the 3 Paals, chapter groups (Iyals), and 133 Adhigarams.
- **Logic & Cascading Dependencies**:
  - Selecting a **Paal** (`அறத்துப்பால்`, `பொருட்பால்`, `காமத்துப்பால்`) automatically filters available **Iyals** and **Adhigarams**.
  - Selecting an **Iyal** further narrows the available **Adhigarams**.
  - Clearing a parent filter automatically invalidates and clears child filter selections.
- **URL Synchronization**:
  - Filter state is reflected directly in search params: `?paal=...&iyal=...&adhigaram=...&page=...`.
  - Allows direct deep-linking, browser history navigation (back/forward), and bookmarking.
- **Pagination**:
  - Displays 12 Kurals per page (`ITEMS_PER_PAGE = 12`).
  - Implements smart ellipsis navigation (`1 ... 4 5 6 ... 111`).

---

### Feature 5: Kural Detail Page (`app/kural/[number]/page.tsx`)
- **Purpose**: The primary study screen for each couplet.
- **Contents Displayed**:
  1. Breadcrumbs: `Paal / Iyal / Adhigaram` (clickable links to `/browse`).
  2. Couplet text: Tamil Line 1 and Line 2 with high contrast.
  3. English Transliteration.
  4. Three Commentaries from renowned Tamil scholars:
     - **Dr. Mu. Varadarajan (மு. வரதராசன்)**: Clear, accessible, everyday prose.
     - **Prof. Solomon Pappaiah (சாலமன் பாப்பையா)**: Contemporary, practical, conversational.
     - **Kalaignar M. Karunanidhi (கலைஞர் மு. கருணாநிதி)**: Literary, poetic, modern social context.
  5. English Meaning: Standard poetic translation.
  6. AI Explanation card (Gemini).
  7. Sequential pagination buttons (`Previous Kural` / `Browse` / `Next Kural`).
- **Dynamic 2-Column Note Layout**:
  - If the user has saved a personal note for the Kural, the container widens from `max-w-5xl` to `max-w-7xl 2xl:max-w-[1440px]`.
  - Converts into a 12-column grid: 8 columns for main Kural content, 4 columns for a sticky desktop sidebar showing the user's personal reflection with an `Edit Note` button.
- **Automatic History Recording**:
  - Invokes `recordView(kuralNumber)` on mount to append to `ThirukkuralDB.history`.

---

### Feature 6: AI Explanation via Google Gemini (`app/actions/generate-kural-explanation.ts`)
- **Purpose**: Delivers modern contextualization, core philosophical insights, and actionable everyday steps for any Kural.
- **Execution Flow**:
  1. Triggered on demand when user clicks "Ask AI for detailed explanation" (prevents unnecessary API consumption).
  2. Calls Next.js Server Action `generateKuralExplanation(number, line1, line2, meaning_en)`.
  3. Executes multi-model fallback across 11 Gemini model variants.
  4. Prompt directs model to produce strict JSON with `en` and `ta` nodes containing:
     - `context`: Background situation without repeating chapter names.
     - `insight`: Deep philosophical core meaning.
     - `modern`: Exactly 2 actionable steps for modern life.
  5. Strips markdown backticks, normalizes arrays, and returns structured data.
  6. Renders high-impact ambient cards with glow orbits, typography watermarks (`WISDOM`, `INSIGHT`), and a reset button.

---

### Feature 7: Favorites & Notes Separation (IndexedDB)
- **Favorites (❤️)**:
  - Quick toggle button with immediate heart color change and animated toast notification.
  - Stored in `ThirukkuralDB.favorites` (`kuralNumber`, `createdAt`).
  - Badge counter in Header updates live via `useLiveQuery`.
  - Dedicated `/favorites` page with empty state CTA.
- **Notes / Kuripugal (📝)**:
  - Dedicated note-taking modal (`components/NoteModal.tsx`) with character counter, couplet preview, and auto-focus textarea.
  - Stored in `ThirukkuralDB.notes` (`kuralNumber`, `text`, `updatedAt`).
  - Header badge counter for noted Kurals.
  - Dedicated `/kuripugal` page with note editing and one-click deletion.

---

### Feature 8: Reading History
- **Purpose**: Preserves a trail of recently studied couplets.
- **Execution Flow**:
  - Every visit to `/kural/:number` runs `recordView(kuralNumber)`.
  - Deduplicates: deletes any prior entry for the same `kuralNumber` before inserting a new entry with current timestamp (`viewedAt: Date.now()`).
  - Home page displays top 3 recent items.
  - Dedicated `/history` page displays full list with "Clear all" button.

---

### Feature 9: Multi-Palette Theme Engine (`components/ThemeSelector.tsx`)
- **6 Classical Palettes**: Amber, Indigo, Emerald, Rose, Monochrome, Amethyst.
- **Dual Display Modes**: Light / Dark (plus system fallback via `next-themes`).
- **Variants**:
  - `dropdown`: Compact header trigger displaying sun/moon glyph and selected palette dot.
  - `inline`: Expanded grid displayed inside the mobile hamburger drawer.

---

### Feature 10: Copy & Web Share Functionality
- **Formatted Copy**:
  Constructs a beautifully formatted multi-line text block:
  ```text
  திருக்குறள் <number>
  அதிகாரம்: <adhigaram>

  <line1_ta>
  <line2_ta>

  விளக்கம்:
  <mv>

  English Explanation:
  <meaning_en>
  ```
- **Web Share API**:
  Attempts `navigator.share({ title, text, url })` on supported mobile devices; falls back gracefully to clipboard URL copy with a toast.

---

## 3. Unimplemented / Future Roadmap Items

The following items are NOT yet implemented in the codebase:
1. **PWA (Progressive Web App)**:
   - No `manifest.json` or `manifest.webmanifest`.
   - No Service Worker (`sw.js`) for full offline asset caching.
2. **Audio Recitation**:
   - Audio narration of Kural lines or commentaries is not yet built.
3. **User Authentication / Cloud Sync**:
   - All user data resides strictly on the client inside IndexedDB (`ThirukkuralDB`); there is no cloud database or user login.
