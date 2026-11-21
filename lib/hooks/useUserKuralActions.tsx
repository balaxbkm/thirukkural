"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from "react";
import { db, Favorite, Bookmark, KuralNote, requestPersistentStorage } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";

export interface FavoriteItem extends Favorite {}
export interface BookmarkItem extends Bookmark {}
export interface NoteItem extends KuralNote {}

interface KuralActionsContextType {
    // Favorites (Separately Managed)
    favorites: number[];
    favoriteItems: FavoriteItem[];
    toggleFavorite: (kuralNumber: number) => Promise<void>;
    isFavorite: (kuralNumber: number) => boolean;
    clearAllFavorites: () => Promise<void>;

    // Backward compatibility aliases
    bookmarkedKurals: number[];
    bookmarks: BookmarkItem[];
    toggleBookmark: (kuralNumber: number, note?: string) => Promise<void>;
    isBookmarked: (kuralNumber: number) => boolean;
    clearAllBookmarks: () => Promise<void>;

    // Notes (Separately Managed Kuripugal)
    notedKurals: number[];
    notesList: NoteItem[];
    notes: Record<number, string>;
    getNote: (kuralNumber: number) => string;
    getNoteItem: (kuralNumber: number) => NoteItem | undefined;
    hasNote: (kuralNumber: number) => boolean;
    saveNote: (kuralNumber: number, text: string) => Promise<void>;
    deleteNote: (kuralNumber: number) => Promise<void>;

    // History (Recently Viewed)
    recentKuralNumbers: number[];
    clearHistory: () => Promise<void>;
    recordView: (kuralNumber: number) => Promise<void>;
    isReady: boolean;
}

const KuralActionsContext = createContext<KuralActionsContextType | undefined>(undefined);

export function UserKuralActionsProvider({ children }: { children: ReactNode }) {
    const [isMounted, setIsMounted] = useState(false);

    // Live reactive query for Favorites from IndexedDB
    const liveFavorites = useLiveQuery(
        () => db.favorites.orderBy("createdAt").reverse().toArray(),
        [],
        []
    );

    // Live reactive query for Notes from IndexedDB (ordered newest first)
    const liveNotes = useLiveQuery(
        () => db.notes.orderBy("updatedAt").reverse().toArray(),
        [],
        []
    );

    // Live reactive query for Reading History from IndexedDB (ordered newest first)
    const liveHistory = useLiveQuery(
        () => db.history.orderBy("viewedAt").reverse().toArray(),
        [],
        []
    );

    const recentKuralNumbers = useMemo(() => {
        if (!liveHistory) return [];
        const seen = new Set<number>();
        const list: number[] = [];
        for (const item of liveHistory) {
            if (!seen.has(item.kuralNumber)) {
                seen.add(item.kuralNumber);
                list.push(item.kuralNumber);
            }
        }
        return list;
    }, [liveHistory]);

    // One-time initialization & auto-migration from legacy bookmarks & localStorage
    useEffect(() => {
        setIsMounted(true);
        requestPersistentStorage();

        const migrateLegacyStorage = async () => {
            try {
                if (typeof window === "undefined") return;

                const favCount = await db.favorites.count();
                if (favCount === 0) {
                    // 1. Check if db.bookmarks has entries
                    const existingBookmarks = await db.bookmarks.toArray();
                    if (existingBookmarks.length > 0) {
                        const favItems: Favorite[] = existingBookmarks.map((b) => ({
                            kuralNumber: b.kuralNumber,
                            createdAt: b.createdAt
                        }));
                        await db.favorites.bulkPut(favItems);
                    } else {
                        // 2. Check localStorage
                        const legacyData = localStorage.getItem("thirukkural_bookmarks");
                        if (legacyData) {
                            const parsed = JSON.parse(legacyData);
                            if (Array.isArray(parsed) && parsed.length > 0) {
                                const now = Date.now();
                                const favItems: Favorite[] = parsed.map((num: number, idx: number) => ({
                                    kuralNumber: Number(num),
                                    createdAt: now - (parsed.length - idx) * 1000,
                                }));
                                await db.favorites.bulkPut(favItems);
                            }
                        }
                    }
                }
            } catch (err) {
                console.error("Dexie: Error migrating favorites:", err);
            }
        };

        migrateLegacyStorage();
    }, []);

    // Favorites
    const favoriteItems = liveFavorites || [];
    const favorites = useMemo(() => favoriteItems.map((f) => f.kuralNumber), [favoriteItems]);

    const toggleFavorite = useCallback(async (kuralNumber: number) => {
        try {
            const existing = await db.favorites.get(kuralNumber);
            if (existing) {
                await db.favorites.delete(kuralNumber);
                // Also remove from legacy bookmarks table if present
                await db.bookmarks.delete(kuralNumber).catch(() => {});
            } else {
                const now = Date.now();
                await db.favorites.put({
                    kuralNumber,
                    createdAt: now
                });
                await db.bookmarks.put({
                    kuralNumber,
                    createdAt: now
                }).catch(() => {});
            }
        } catch (err) {
            console.error("Dexie: Error toggling favorite:", err);
        }
    }, []);

    const isFavorite = useCallback(
        (kuralNumber: number) => favorites.includes(kuralNumber),
        [favorites]
    );

    const clearAllFavorites = useCallback(async () => {
        try {
            await db.favorites.clear();
            await db.bookmarks.clear().catch(() => {});
        } catch (err) {
            console.error("Dexie: Error clearing favorites:", err);
        }
    }, []);

    // Notes
    const notesList = useMemo(() => liveNotes || [], [liveNotes]);

    const notesMap = useMemo(() => {
        const map: Record<number, string> = {};
        for (const n of notesList) {
            if (n.text && n.text.trim().length > 0) {
                map[n.kuralNumber] = n.text;
            }
        }
        return map;
    }, [notesList]);

    const notedKurals = useMemo(() => {
        return notesList
            .filter((n) => n.text && n.text.trim().length > 0)
            .map((n) => n.kuralNumber);
    }, [notesList]);

    const getNote = useCallback(
        (num: number) => notesMap[num] || "",
        [notesMap]
    );

    const getNoteItem = useCallback(
        (num: number) => notesList.find((n) => n.kuralNumber === num),
        [notesList]
    );

    const hasNote = useCallback(
        (num: number) => Boolean(notesMap[num] && notesMap[num].trim().length > 0),
        [notesMap]
    );

    const saveNote = useCallback(async (kuralNumber: number, text: string) => {
        const trimmed = text.trim();
        try {
            if (!trimmed) {
                await db.notes.delete(kuralNumber);
            } else {
                await db.notes.put({
                    kuralNumber,
                    text: trimmed,
                    updatedAt: Date.now()
                });
            }
        } catch (err) {
            console.error("Dexie: Error saving note:", err);
        }
    }, []);

    const deleteNote = useCallback(async (kuralNumber: number) => {
        try {
            await db.notes.delete(kuralNumber);
        } catch (err) {
            console.error("Dexie: Error deleting note:", err);
        }
    }, []);

    const clearHistory = useCallback(async () => {
        try {
            await db.history.clear();
        } catch (err) {
            console.error("Dexie: Error clearing history:", err);
        }
    }, []);

    const recordView = useCallback(async (kuralNumber: number) => {
        try {
            await db.history.where("kuralNumber").equals(kuralNumber).delete();
            await db.history.add({
                kuralNumber,
                viewedAt: Date.now()
            });
        } catch (err) {
            console.error("Dexie: Error recording view history:", err);
        }
    }, []);

    return (
        <KuralActionsContext.Provider
            value={{
                // Favorites
                favorites,
                favoriteItems,
                toggleFavorite,
                isFavorite,
                clearAllFavorites,

                // Backward compatibility aliases
                bookmarkedKurals: favorites,
                bookmarks: favoriteItems as unknown as BookmarkItem[],
                toggleBookmark: toggleFavorite,
                isBookmarked: isFavorite,
                clearAllBookmarks: clearAllFavorites,

                // Notes
                notedKurals,
                notesList,
                notes: notesMap,
                getNote,
                getNoteItem,
                hasNote,
                saveNote,
                deleteNote,

                // History
                recentKuralNumbers,
                clearHistory,
                recordView,

                isReady: isMounted
            }}
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
