/**
 * Utility to convert Tamil Unicode strings to Bamini font ASCII encoding.
 * Allows legacy typewriter fonts like BAMINI-Tamil25.ttf to correctly render modern Tamil Unicode text.
 */
export function unicodeToBamini(text: string): string {
  if (!text) return '';

  let s = text.normalize('NFC');

  // Corrections for any legacy or corrupted codepoints
  s = s.replace(/\u0BA7/g, '\u0BBF'); // ி
  s = s.replace(/\u0BA6/g, '\u0BC6'); // ெ

  // Grantha & Special ligatures
  s = s.replace(/ஸ்ரீ/g, '_');
  s = s.replace(/க்ஷ/g, '&');

  // Uyirmei U and UU vowel combinations with distinct single keys in Bamini
  const uMap: [string, string][] = [
    // Long UU (ூ)
    ['கூ', '$'], ['சூ', '#'], ['டூ', '^'], ['மூ', '%'],
    ['தூ', 'J}'], ['நூ', 'E}'], ['பூ', 'G}'], ['யூ', 'A}'],
    ['ரூ', 'U}'], ['லூ', 'Y}'], ['வூ', 'Th'], ['ழூ', 'O}'],
    ['ளூ', 'S}'], ['றூ', 'W}'], ['னூ', 'D}'], ['ணூ', 'Z}'],
    ['ஞூ', '*'], ['ஙூ', 'Q}'],
    // Short U (ு)
    ['கு', 'F'], ['சு', 'R'], ['டு', 'L'], ['து', 'J'],
    ['நு', 'E'], ['பு', 'G'], ['மு', 'K'], ['யு', 'A'],
    ['ரு', 'U'], ['லு', 'Y'], ['வு', 'T'], ['ழு', 'O'],
    ['ளு', 'S'], ['று', 'W'], ['னு', 'D'], ['ணு', 'Z'],
    ['ஞு', 'Q+'], ['ஙு', 'Q'],
    // Special I / II ligatures with distinct single keys in Bamini
    ['டி', 'b'], ['டீ', 'B']
  ];

  for (const [k, v] of uMap) {
    s = s.replaceAll(k, v);
  }

  // Two-part compound vowels (direct to Bamini ASCII keys):
  // ொ (0BCA) or ெ + ா -> n + consonant + h
  s = s.replace(/([\u0B95-\u0BB9])(?:\u0BCA|\u0BC6\u0BBE)/g, (_m, c) => 'n' + c + 'h');
  // ோ (0BCB) or ே + ா -> N + consonant + h
  s = s.replace(/([\u0B95-\u0BB9])(?:\u0BCB|\u0BC7\u0BBE)/g, (_m, c) => 'N' + c + 'h');
  // ௌ (0BCC) or ெ + ள -> n + consonant + s
  s = s.replace(/([\u0B95-\u0BB9])(?:\u0BCC|\u0BC6[\u0BB3\u0BD7])/g, (_m, c) => 'n' + c + 's');

  // Left-side vowel signs:
  // ெ (0BC6) -> n + consonant
  s = s.replace(/([\u0B95-\u0BB9])\u0BC6/g, (_m, c) => 'n' + c);
  // ே (0BC7) -> N + consonant
  s = s.replace(/([\u0B95-\u0BB9])\u0BC7/g, (_m, c) => 'N' + c);
  // ை (0BC8) -> i + consonant
  s = s.replace(/([\u0B95-\u0BB9])\u0BC8/g, (_m, c) => 'i' + c);

  // Fallback for any remaining generic U or UU signs
  s = s.replace(/\u0BC2/g, '}'); // ூ
  s = s.replace(/\u0BC1/g, '+'); // ு

  // Vowel diacritic signs
  s = s.replace(/\u0BBE/g, 'h'); // ா
  s = s.replace(/\u0BBF/g, 'p'); // ி
  s = s.replace(/\u0BC0/g, 'P'); // ீ
  s = s.replace(/\u0BCD/g, ';'); // ் (pulli)

  // Consonants (mapped to standard Bamini typewriter layout)
  const cMap: Record<string, string> = {
    'க': 'f', 'ங': 'q', 'ச': 'r', 'ஞ': 'Q', 'ட': 'l',
    'ண': 'z', 'த': 'j', 'ந': 'e', 'ப': 'g', 'ம': 'k',
    'ய': 'a', 'ர': 'u', 'ல': 'y', 'வ': 't', 'ழ': 'o',
    'ள': 's', 'ற': 'w', 'ன': 'd', 'ஜ': '[', 'ஷ': '\\',
    'ஸ': ']', 'ஹ': '^'
  };
  for (const [k, v] of Object.entries(cMap)) {
    s = s.replaceAll(k, v);
  }

  // Independent Vowels
  const vMap: Record<string, string> = {
    'அ': 'm', 'ஆ': 'M', 'இ': ',', 'ஈ': '<', 'உ': 'c',
    'ஊ': 'C', 'எ': 'v', 'ஏ': 'V', 'ஐ': 'I', 'ஒ': 'x',
    'ஓ': 'X', 'ஔ': 'xs', 'ஃ': '/'
  };
  for (const [k, v] of Object.entries(vMap)) {
    s = s.replaceAll(k, v);
  }

  return s;
}

/**
 * Splits Tamil text into syllables (grapheme clusters) and converts each into its
 * Bamini font ASCII equivalent. This allows layout spacing (e.g. gap) between full letters
 * without detaching intra-syllable vowel signs or pulli dots.
 */
export function unicodeToBaminiSyllables(text: string): string[] {
  if (!text) return [];
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('ta', { granularity: 'grapheme' });
    return Array.from(segmenter.segment(text), s => unicodeToBamini(s.segment));
  }
  return [unicodeToBamini(text)];
}
