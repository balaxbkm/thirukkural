# Development Workflows & Runbooks: Thirukkural Web Application

This document provides step-by-step procedures for extending, modifying, testing, and deploying the Thirukkural web explorer application.

---

## 1. Setup & Environment Configuration

### Prerequisites
- **Node.js**: `v20.x` or higher recommended.
- **NPM**: `v10.x` or compatible package manager (`pnpm`, `yarn`, `bun`).

### Local Development Setup
1. Clone the repository and navigate into the root directory:
   ```bash
   cd c:\Users\BALA\Works\Antigravity\thirukkural
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env.local`:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 2. Common Development Workflows

### Workflow 1: Adding a New Page / Route

1. **Create the Route Directory**:
   Inside `app/`, create a new folder matching the desired path (e.g., `app/quotes/`).
2. **Implement `page.tsx`**:
   Follow the standard structure with `"use client";` (if interactive), context consumers, and glassmorphic layout wrappers:
   ```tsx
   "use client";

   import { useLanguage } from "@/lib/context/LanguageContext";

   export default function QuotesPage() {
       const { t } = useLanguage();

       return (
           <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500 pb-16">
               <div className="text-center space-y-4 pt-2">
                   <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--theme-badge-bg)] border border-[var(--theme-badge-border)] text-[var(--theme-badge-text)] font-semibold text-xs tracking-wider uppercase backdrop-blur-md shadow-sm">
                       Quotes
                   </div>
                   <h1 className="text-3xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[var(--theme-hero-from)] via-[var(--theme-hero-via)] to-[var(--theme-hero-to)]">
                       Tributes & Reflections
                   </h1>
               </div>

               <div className="glass-card p-6 sm:p-8">
                   {/* Content */}
               </div>
           </div>
       );
   }
   ```
3. **Register in Navigation (`components/Header.tsx`)**:
   Add the new route to the `navLinks` array in `components/Header.tsx` along with an icon and translation key.
4. **Add Translation Keys (`lib/i18n/translations.ts`)**:
   Add corresponding English and Tamil strings under `translations.en.nav` and `translations.ta.nav`.

---

### Workflow 2: Creating a New Component

1. Create the component file in `components/<ComponentName>.tsx`.
2. Follow the project's styling and typing conventions:
   - Use Tailwind CSS v4 utility classes.
   - Use theme variables (`[var(--theme-primary)]`, etc.) for dynamic coloring.
   - Use `.glass-card`, `.glass-btn`, or `.glass-input` for glassmorphic styling.
3. Test responsiveness across mobile, tablet, and desktop breakpoints.

---

### Workflow 3: Modifying or Adding Kural Data

1. **Update `data/thirukkural.json`**:
   Ensure all 1,330 couplets adhere strictly to the `Kural` interface in `types/thirukkural.ts`.
2. **If Fetching from Upstream**:
   Use `scripts/update-data.js` to re-pull and transform fresh data:
   ```bash
   node scripts/update-data.js
   ```
3. **Verify Data Integrity**:
   - Check that numbers range continuously from 1 to 1330.
   - Verify that all three commentaries (`mv`, `sp`, `mk`) and translations are populated.

---

### Workflow 4: Adding a New Color Theme Palette

1. **Register the Theme in `lib/context/ThemeColorContext.tsx`**:
   - Add the new theme id to `ColorTheme` union type:
     ```typescript
     export type ColorTheme = "indigo" | "emerald" | "amber" | "rose" | "monochrome" | "amethyst" | "sapphire";
     ```
   - Add the theme metadata object to `COLOR_THEMES`:
     ```typescript
     {
         id: "sapphire",
         nameEn: "Ocean Sapphire",
         nameTa: "நீலமணி",
         descriptionEn: "Deep Sea & Clarity",
         descriptionTa: "ஆழ்கடல் நீலம் & அமைதி",
         primary: "#2563eb",
         secondary: "#38bdf8",
         previewGradient: "from-blue-600 to-sky-400"
     }
     ```
2. **Define Theme CSS Variables in `app/globals.css`**:
   Add both Light Mode (`:root[data-theme="sapphire"]`) and Dark Mode (`.dark[data-theme="sapphire"]`) blocks with all 16 variables (`--background`, `--foreground`, `--gradient-1`, `--theme-primary`, etc.).

---

### Workflow 5: Enhancing AI Explanation Capabilities

1. **Server Action (`app/actions/generate-kural-explanation.ts`)**:
   - Update prompt guidelines or schemas in `prompt`.
   - To add a new Gemini model, append it to `modelsToTry` in prioritized order.
   - Ensure the returned object conforms to `AIExplanationResponse`.
2. **UI Presentation (`app/kural/[number]/page.tsx`)**:
   - Update the card rendering block under `aiExplanation && (...)`.
   - Maintain the ambient glow orbit backgrounds and digital watermark styles.

---

### Workflow 6: Implementing Full PWA Support (Roadmap)

To convert the web application into an installable PWA:
1. **Create Web Manifest (`public/manifest.webmanifest`)**:
   ```json
   {
     "name": "Thirukkural - Timeless Wisdom",
     "short_name": "Thirukkural",
     "description": "Explore the timeless wisdom of Thirukkural with a modern glassmorphism design.",
     "start_url": "/",
     "display": "standalone",
     "background_color": "#fffbeb",
     "theme_color": "#d97706",
     "icons": [
       {
         "src": "/valluvar-logo-v2.jpg",
         "sizes": "512x512",
         "type": "image/jpeg"
       }
     ]
   }
   ```
2. **Link Manifest in `app/layout.tsx`**:
   Add `<link rel="manifest" href="/manifest.webmanifest" />` inside `<head>`.
3. **Register Service Worker**:
   Add a client registration script in `app/layout.tsx` or a dedicated hook to cache static assets and `data/thirukkural.json` for complete offline reading.

---

## 3. Verification & Build Commands

Always run these commands before submitting changes:

### Linting & Code Quality
```bash
npm run lint
```
Verifies ESLint rules and Next.js specific conventions.

### Type Checking & Production Build
```bash
npm run build
```
Executes TypeScript type checking (`tsc`) and compiles optimized production bundles for all routes.

### Production Run
```bash
npm run start
```
Starts the production server on port 3000 to verify runtime behavior, SSR performance, and hydration.
