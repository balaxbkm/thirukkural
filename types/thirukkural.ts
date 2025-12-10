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
    mk: string; // Karunanidhi
    mv: string; // Mu. Varadarajan
    sp: string; // Solomon Pappaiah
    tags?: string[];
}
