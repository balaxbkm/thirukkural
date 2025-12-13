"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface KuralActionsContextType {
    bookmarkedKurals: number[];
    toggleBookmark: (kuralNumber: number) => void;
    isBookmarked: (kuralNumber: number) => boolean;
}

const KuralActionsContext = createContext<KuralActionsContextType | undefined>(undefined);

export function UserKuralActionsProvider({ children }: { children: ReactNode }) {
    const [bookmarkedKurals, setBookmarkedKurals] = useState<number[]>([]);

    useEffect(() => {
        const loadFromStorage = () => {
            try {
                const storedBookmarks = localStorage.getItem("thirukkural_bookmarks");
                if (storedBookmarks) {
                    const parsed = JSON.parse(storedBookmarks);
                    setBookmarkedKurals([...new Set(parsed as number[])]);
                }
            } catch (e) {
                console.error("Failed to load user data from localStorage", e);
            }
        };

        loadFromStorage();

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "thirukkural_bookmarks") {
                loadFromStorage();
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);



    const toggleBookmark = (kuralNumber: number) => {
        setBookmarkedKurals((prev) => {
            const currentSet = new Set(prev);
            if (currentSet.has(kuralNumber)) {
                currentSet.delete(kuralNumber);
            } else {
                currentSet.add(kuralNumber);
            }
            const newBookmarks = Array.from(currentSet);
            localStorage.setItem("thirukkural_bookmarks", JSON.stringify(newBookmarks));
            return newBookmarks;
        });
    };


    const isBookmarked = (kuralNumber: number) => bookmarkedKurals.includes(kuralNumber);

    return (
        <KuralActionsContext.Provider
            value={{ bookmarkedKurals, toggleBookmark, isBookmarked }}
        >
            {children}
        </KuralActionsContext.Provider>
    );
}

export function useUserKuralActions() {
    const context = useContext(KuralActionsContext);
    if (context === undefined) {
        throw new Error("useUserKuralActions must be used within a UserKuralActionsProvider");
    }
    return context;
}
