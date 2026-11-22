"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ColorTheme = "indigo" | "emerald" | "amber" | "rose" | "monochrome" | "amethyst";

export interface ColorThemeOption {
    id: ColorTheme;
    nameEn: string;
    nameTa: string;
    descriptionEn: string;
    descriptionTa: string;
    primary: string;
    secondary: string;
    previewGradient: string;
}

export const COLOR_THEMES: ColorThemeOption[] = [
    {
        id: "amber",
        nameEn: "Golden Sandal",
        nameTa: "தங்கம்",
        descriptionEn: "Heritage & Sun",
        descriptionTa: "பாரம்பரிய பொன் & சந்தனம்",
        primary: "#f59e0b",
        secondary: "#f97316",
        previewGradient: "from-amber-500 to-orange-400"
    },
    {
        id: "indigo",
        nameEn: "Indigo",
        nameTa: "நீலம்",
        descriptionEn: "Celestial & Modern",
        descriptionTa: "வான நீலம் & மென்மை",
        primary: "#6366f1",
        secondary: "#06b6d4",
        previewGradient: "from-indigo-500 to-cyan-400"
    },
    {
        id: "emerald",
        nameEn: "Emerald",
        nameTa: "மரகதம்",
        descriptionEn: "Nature & Serene",
        descriptionTa: "பசுமை & அமைதி",
        primary: "#10b981",
        secondary: "#14b8a6",
        previewGradient: "from-emerald-500 to-teal-400"
    },
    {
        id: "rose",
        nameEn: "Ruby Lotus",
        nameTa: "செந்தாமரை",
        descriptionEn: "Divine & Vibrant",
        descriptionTa: "செந்தாமரை & வசந்தம்",
        primary: "#f43f5e",
        secondary: "#ec4899",
        previewGradient: "from-rose-500 to-pink-400"
    },
    {
        id: "monochrome",
        nameEn: "Black & White",
        nameTa: "கருப்பு & வெள்ளை",
        descriptionEn: "Classic & Minimal",
        descriptionTa: "மரபுவழி கருப்பு & வெள்ளை",
        primary: "#09090b",
        secondary: "#ffffff",
        previewGradient: "from-black via-zinc-600 to-zinc-100"
    },
    {
        id: "amethyst",
        nameEn: "Royal Amethyst",
        nameTa: "அரக்கு",
        descriptionEn: "Majestic & Imperial",
        descriptionTa: "அரண்மனை ஊதா & கம்பீரம்",
        primary: "#9333ea",
        secondary: "#c026d3",
        previewGradient: "from-purple-500 to-fuchsia-500"
    }
];

interface ThemeColorContextType {
    colorTheme: ColorTheme;
    setColorTheme: (theme: ColorTheme) => void;
    availableThemes: ColorThemeOption[];
}

const ThemeColorContext = createContext<ThemeColorContextType | undefined>(undefined);

export function ThemeColorProvider({ children }: { children: ReactNode }) {
    const [colorTheme, setColorThemeState] = useState<ColorTheme>("amber");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        try {
            const saved = localStorage.getItem("thirukkural_color_theme");
            if (saved === "sapphire") {
                setColorThemeState("monochrome");
                document.documentElement.setAttribute("data-theme", "monochrome");
                localStorage.setItem("thirukkural_color_theme", "monochrome");
            } else if (saved && COLOR_THEMES.some((t) => t.id === saved)) {
                setColorThemeState(saved as ColorTheme);
                document.documentElement.setAttribute("data-theme", saved);
            } else {
                document.documentElement.setAttribute("data-theme", "amber");
            }
        } catch (e) {
            console.error("ThemeColor: Failed to read theme from localStorage", e);
        }
    }, []);

    const setColorTheme = (theme: ColorTheme) => {
        setColorThemeState(theme);
        try {
            localStorage.setItem("thirukkural_color_theme", theme);
            document.documentElement.setAttribute("data-theme", theme);
        } catch (e) {
            console.error("ThemeColor: Failed to save theme to localStorage", e);
        }
    };

    return (
        <ThemeColorContext.Provider
            value={{
                colorTheme,
                setColorTheme,
                availableThemes: COLOR_THEMES
            }}
        >
            {children}
        </ThemeColorContext.Provider>
    );
}

export function useThemeColor() {
    const context = useContext(ThemeColorContext);
    if (!context) {
        throw new Error("useThemeColor must be used within a ThemeColorProvider");
    }
    return context;
}
