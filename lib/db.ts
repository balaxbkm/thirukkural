import Dexie, { type EntityTable } from 'dexie';

export interface Favorite {
    kuralNumber: number;
    createdAt: number;
}

export interface Bookmark {
    kuralNumber: number;
    createdAt: number;
    note?: string;
    tags?: string[];
}

export interface KuralNote {
    kuralNumber: number;
    text: string;
    updatedAt: number;
}

export interface KuralNoteEntry {
    id?: number;
    kuralNumber: number;
    text: string;
    createdAt: number;
    updatedAt: number;
}

export interface ReadingHistory {
    id?: number;
    kuralNumber: number;
    viewedAt: number;
}

export interface AppSetting {
    key: string;
    value: unknown;
    updatedAt: number;
}

export class ThirukkuralDatabase extends Dexie {
    favorites!: EntityTable<Favorite, 'kuralNumber'>;
    bookmarks!: EntityTable<Bookmark, 'kuralNumber'>;
    notes!: EntityTable<KuralNote, 'kuralNumber'>;
    kuralNotes!: EntityTable<KuralNoteEntry, 'id'>;
    history!: EntityTable<ReadingHistory, 'id'>;
    settings!: EntityTable<AppSetting, 'key'>;

    constructor() {
        super('ThirukkuralDB');
        this.version(1).stores({
            bookmarks: 'kuralNumber, createdAt',
            history: '++id, kuralNumber, viewedAt',
            settings: 'key'
        });
        this.version(2).stores({
            notes: 'kuralNumber, updatedAt'
        });
        this.version(3).stores({
            favorites: 'kuralNumber, createdAt'
        });
        this.version(4).stores({
            kuralNotes: '++id, kuralNumber, updatedAt'
        });
    }
}

export const db = new ThirukkuralDatabase();

/**
 * Requests the browser to mark storage as persistent (prevents automated eviction).
 */
export async function requestPersistentStorage(): Promise<boolean> {
    if (typeof window !== 'undefined' && navigator.storage && navigator.storage.persist) {
        return await navigator.storage.persist();
    }
    return false;
}
