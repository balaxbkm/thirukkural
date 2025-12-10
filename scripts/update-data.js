
const fs = require('fs');
const path = require('path');
const https = require('https');

const KURAL_URL = 'https://raw.githubusercontent.com/tk120404/thirukkural/master/thirukkural.json';
const DETAIL_URL = 'https://raw.githubusercontent.com/tk120404/thirukkural/master/detail.json';
const OUTPUT_FILE = path.join(__dirname, '../data/thirukkural.json');

const fetchJson = (url) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
};

const main = async () => {
    try {
        console.log('Fetching data...');
        const [kuralDataRaw, detailData] = await Promise.all([
            fetchJson(KURAL_URL),
            fetchJson(DETAIL_URL)
        ]);

        const kuralList = kuralDataRaw.kural;
        const processedKurals = [];

        // Helper to find metadata for a number
        const getMetadata = (num) => {
            for (const section of detailData[0].section.detail) { // Aram, Porul, Inbam
                for (const chapterGroup of section.chapterGroup.detail) { // Iyal
                    for (const chapter of chapterGroup.chapters.detail) { // Adhigaram
                        if (num >= chapter.start && num <= chapter.end) {
                            return {
                                paal: section.name,
                                iyal: chapterGroup.name,
                                adhigaram: chapter.name,
                                // We could also get translations if needed, e.g. section.translation
                            };
                        }
                    }
                }
            }
            return { paal: '', iyal: '', adhigaram: '' };
        };

        console.log('Processing kurals...');
        for (const k of kuralList) {
            const meta = getMetadata(k.Number);

            processedKurals.push({
                number: k.Number,
                paal: meta.paal,
                iyal: meta.iyal,
                adhigaram: meta.adhigaram,
                line1_ta: k.Line1,
                line2_ta: k.Line2,
                meaning_ta: k.mv, // Using Mu. Varadarajan as default simple explanation
                transliteration_en: `${k.transliteration1} ${k.transliteration2}`,
                meaning_en: k.explanation, // Using English explanation
                mv: k.mv,
                sp: k.sp,
                mk: k.mk,
                // translation: k.Translation
            });
        }

        // Sort just in case
        processedKurals.sort((a, b) => a.number - b.number);

        console.log(`Writing ${processedKurals.length} kurals to ${OUTPUT_FILE}...`);
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(processedKurals, null, 2));
        console.log('Done!');

    } catch (err) {
        console.error('Error:', err);
    }
};

main();
