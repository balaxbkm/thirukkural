# Data Models & Schemas Reference: Thirukkural Web Application

This document provides complete technical specifications for all TypeScript interfaces, JSON structures, database schemas, and metadata models across the application.

---

## 1. Core Kural Data Schema

Defined in `types/thirukkural.ts` and loaded from `data/thirukkural.json` (1,330 entries):

```typescript
export interface Kural {
    /** Couplet sequence number: 1 to 1330 */
    number: number;

    /** Major Section: "அறத்துப்பால்" (Virtue), "பொருட்பால்" (Wealth), "காமத்துப்பால்" (Love) */
    paal: string;

    /** Chapter Group / Sub-section (e.g., "பாயிரவியல்", "இல்லறவியல்", "அரசியல்") */
    iyal: string;

    /** Chapter title (e.g., "கடவுள் வாழ்த்து", "வான்சிறப்பு") - 133 unique values */
    adhigaram: string;

    /** First line in Tamil (traditionally 4 feet / சீர்) */
    line1_ta: string;

    /** Second line in Tamil (traditionally 3 feet / சீர்) */
    line2_ta: string;

    /** Standard Tamil meaning (commonly Mu. Varadarajan's prose) */
    meaning_ta: string;

    /** Romanized English transliteration of the two Tamil lines */
    transliteration_en: string;

    /** Classical English translation/explanation */
    meaning_en: string;

    /** Commentary by Dr. Mu. Varadarajan (மு. வரதராசன்) */
    mv: string;

    /** Commentary by Prof. Solomon Pappaiah (சாலமன் பாப்பையா) */
    sp: string;

    /** Commentary by Kalaignar M. Karunanidhi (கலைஞர் மு. கருணாநிதி) */
    mk: string;

    /** Optional thematic tag labels for categorization */
    tags?: string[];
}
```

### JSON Data Sample (`data/thirukkural.json`)

```json
{
  "number": 1,
  "paal": "அறத்துப்பால்",
  "iyal": "பாயிரவியல்",
  "adhigaram": "கடவுள் வாழ்த்து",
  "line1_ta": "அகர முதல எழுத்தெல்லாம் ஆதி",
  "line2_ta": "பகவன் முதற்றே உலகு.",
  "meaning_ta": "எழுத்துக்கள் எல்லாம் அகரத்தை அடிப்படையாக கொண்டிருக்கின்றன. அதுபோல உலகம் கடவுளை அடிப்படையாக கொண்டிருக்கிறது.",
  "transliteration_en": "Agara Mudhala Ezhuththellaam Aadhi Pakavan Mudhatre Ulaku",
  "meaning_en": "As the letter A is the first of all letters, so the eternal God is first in the world",
  "mv": "எழுத்துக்கள் எல்லாம் அகரத்தை அடிப்படையாக கொண்டிருக்கின்றன. அதுபோல உலகம் கடவுளை அடிப்படையாக கொண்டிருக்கிறது.",
  "sp": "எழுத்துக்கள் எல்லாம் அகரத்தில் தொடங்குகின்றன; (அது போல) உலகம் கடவுளில் தொடங்குகிறது.",
  "mk": "அகரம் எழுத்துக்களுக்கு முதன்மை; ஆதிபகவன், உலகில் வாழும் உயிர்களுக்கு முதன்மை"
}
```

---

## 2. IndexedDB Client Database Schema (`lib/db.ts`)

The database is built on Dexie.js and named **`ThirukkuralDB`**.

```typescript
export interface Favorite {
    kuralNumber: number; // Primary Key
    createdAt: number;   // Epoch timestamp (ms)
}

export interface Bookmark {
    kuralNumber: number; // Primary Key
    createdAt: number;   // Epoch timestamp (ms)
    note?: string;
    tags?: string[];
}

export interface KuralNote {
    kuralNumber: number; // Primary Key
    text: string;        // User's custom reflection text
    updatedAt: number;   // Epoch timestamp (ms)
}

export interface ReadingHistory {
    id?: number;         // Auto-incremented Primary Key (++id)
    kuralNumber: number; // Kural number viewed
    viewedAt: number;    // Epoch timestamp (ms)
}

export interface AppSetting {
    key: string;         // Primary Key
    value: unknown;
    updatedAt: number;   // Epoch timestamp (ms)
}
```

### Database Evolution & Store Definitions

```typescript
export class ThirukkuralDatabase extends Dexie {
    favorites!: EntityTable<Favorite, 'kuralNumber'>;
    bookmarks!: EntityTable<Bookmark, 'kuralNumber'>;
    notes!: EntityTable<KuralNote, 'kuralNumber'>;
    history!: EntityTable<ReadingHistory, 'id'>;
    settings!: EntityTable<AppSetting, 'key'>;

    constructor() {
        super('ThirukkuralDB');

        // Version 1: Initial schema
        this.version(1).stores({
            bookmarks: 'kuralNumber, createdAt',
            history: '++id, kuralNumber, viewedAt',
            settings: 'key'
        });

        // Version 2: Added dedicated custom notes table
        this.version(2).stores({
            notes: 'kuralNumber, updatedAt'
        });

        // Version 3: Added dedicated favorites table
        this.version(3).stores({
            favorites: 'kuralNumber, createdAt'
        });
    }
}
```

---

## 3. AI Explanation Response Schema (`app/actions/generate-kural-explanation.ts`)

```typescript
export interface AIExplanationContent {
    /** Brief contextual backdrop of the couplet without mentioning Paal/Adhigaram */
    context: string;

    /** Concise core philosophical insight */
    insight: string;

    /** Array of exactly 2 actionable, modern-day applications */
    modern: string[];
}

export interface AIExplanationResponse {
    /** English explanation block */
    en: AIExplanationContent;

    /** Tamil explanation block */
    ta: AIExplanationContent;
}
```

---

## 4. Chapter Metadata Schema (`lib/adhigaram-titles.ts`)

Provides English translations and Romanized transliterations for all 133 Tamil chapters:

```typescript
/** Maps Tamil chapter name to formal English title */
export const adhigaramTitles: Record<string, string> = {
    "கடவுள் வாழ்த்து": "The Praise of God",
    "வான்சிறப்பு": "The Excellence of Rain",
    "நீத்தார் பெருமை": "The Greatness of Ascetics",
    "அறன் வலியுறுத்தல்": "Assertion of the Strength of Virtue",
    // ... 133 entries total
};

/** Maps Tamil chapter name to Romanized transliteration */
export const adhigaramTransliterations: Record<string, string> = {
    "கடவுள் வாழ்த்து": "Kadavul Vaazhthu",
    "வான்சிறப்பு": "Vaan Sirappu",
    // ... 133 entries total
};
```

---

## 5. Theme Color Configuration Schema (`lib/context/ThemeColorContext.tsx`)

```typescript
export type ColorTheme = "indigo" | "emerald" | "amber" | "rose" | "monochrome" | "amethyst";

export interface ColorThemeOption {
    id: ColorTheme;
    nameEn: string;
    nameTa: string;
    descriptionEn: string;
    descriptionTa: string;
    primary: string;         // Hex code
    secondary: string;       // Hex code
    previewGradient: string; // Tailwind class string (e.g., "from-amber-500 to-orange-400")
}
```

---

## 6. Internationalization & Translation Schema (`lib/i18n/translations.ts`)

```typescript
export type Language = 'ta' | 'en';

export interface TranslationsShape {
    nav: {
        home: string;
        browse: string;
        favorites: string;
        kuripugal: string;
        bookmarks: string;
        about: string;
        search: string;
        kurals: string;
    };
    home: {
        title: string;
        subtitle: string;
        description: string;
        browseBtn: string;
        randomBtn: string;
        bookmarksBtn: string;
        featured: string;
        viewAll: string;
        dailyKural: string;
        recentTitle: string;
        recentSubtitle: string;
        clearRecent: string;
    };
    theme: {
        title: string;
        subtitle: string;
        mode: string;
        light: string;
        dark: string;
        system: string;
        selectTheme: string;
    };
    browse: {
        title: string;
        subtitle: string;
        paal: string;
        iyal: string;
        adhigaram: string;
        allPaal: string;
        allIyal: string;
        allAdhigaram: string;
        clearFilters: string;
        showing: string;
        results: string;
        noResults: string;
        previous: string;
        next: string;
        page: string;
        of: string;
    };
    favorites: {
        title: string;
        emptyTitle: string;
        emptyMsg: string;
        startBrowsing: string;
        savedCount: string;
    };
    history: {
        title: string;
        subtitle: string;
        emptyTitle: string;
        emptyMsg: string;
        startBrowsing: string;
        clearAll: string;
        viewedCount: string;
    };
    kuripugal: {
        title: string;
        subtitle: string;
        emptyTitle: string;
        emptyMsg: string;
        startBrowsing: string;
        savedCount: string;
        editNote: string;
        deleteNote: string;
        lastUpdated: string;
    };
    note: {
        title: string;
        notes: string;
        addNote: string;
        editNote: string;
        saveNote: string;
        saving: string;
        saved: string;
        deleteNote: string;
        deleted: string;
        placeholder: string;
        characterCount: string;
        close: string;
        lastUpdated: string;
        empty: string;
    };
    kural: {
        number: string;
        save: string;
        saved: string;
        favorite: string;
        favorited: string;
        share: string;
        meaning: string;
        explanation: string;
        tamil: string;
        english: string;
        englishMeaning: string;
        vilakam: string;
        mk: string;
        mv: string;
        sp: string;
        aiExplanation: string;
        askAI: string;
        analyzing: string;
        aiError: string;
    };
    about: {
        title: string;
        description: string;
        thiruvalluvar: string;
        thiruvalluvarDesc: string;
        structure: string;
        aram: string;
        aramDesc: string;
        porul: string;
        porulDesc: string;
        inbam: string;
        inbamDesc: string;
        chapters: string;
        appTitle: string;
        appDesc: string;
    };
    footer: {
        description: string;
        text: string;
        privacy: string;
        terms: string;
    };
}
```

---

## 7. About & Cultural Encyclopedia Schema (`lib/about-data.ts`)

Structured into bilingual content objects containing:
- `hero`: Title, subtitle, badge.
- `intro`: Stats array (`1330 Kurals`, `133 Chapters`, `3 Sections`, `2 Lines`), descriptive paragraphs.
- `author`: Biographical text, 6 classical epithets (e.g., `மாதானுபங்கி`, `செந்நாப்போதார்`, `நாயனார்`), historical monuments (Valluvar Kottam, 133ft Kanyakumari Statue).
- `structure`: Detailed analysis of Aram, Porul, and Inbam including chapter breakdown and color themes.
- `commentaries`: The 10 medieval commentators (Parimelazhagar, etc.) and 3 modern scholars.
- `translations`: Classical European translations (Rev. G.U. Pope, Veeramamunivar).
- `tributes`: Quotations from Mahatma Gandhi, Albert Schweitzer, and Leo Tolstoy.
