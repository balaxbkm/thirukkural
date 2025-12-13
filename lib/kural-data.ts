import { promises as fs } from 'fs';
import path from 'path';

export interface Kural {
    number: number;
    paal: string;
    iyal: string;
    adhigaram: string;
    line1_ta: string;
    line2_ta: string;
    meaning_ta: string;
    transliteration_en: string;
    meaning_en: string;
    mv: string;
    sp: string;
    mk: string;
}

export async function getKuralData(): Promise<Kural[]> {
    const filePath = path.join(process.cwd(), 'data/thirukkural.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
}

export async function getPaalAdhigarams() {
    const kurals = await getKuralData();
    const map: Record<string, Set<string>> = {};

    kurals.forEach(k => {
        if (!map[k.paal]) {
            map[k.paal] = new Set();
        }
        map[k.paal].add(k.adhigaram);
    });

    // Convert Sets to Arrays
    const result: Record<string, string[]> = {};
    for (const key in map) {
        result[key] = Array.from(map[key]);
    }

    return result;
}
