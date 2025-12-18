"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

export interface AIExplanationContent {
    context: string;
    insight: string;
    modern: string[];
}

export interface AIExplanationResponse {
    en: AIExplanationContent;
    ta: AIExplanationContent;
}

export async function generateKuralExplanation(
    kuralNumber: number,
    line1: string,
    line2: string,
    meaning: string
): Promise<AIExplanationResponse | null> {

    // Helper to log server-side only
    const log = (msg: string) => console.log(`[EXP_ACTION] ${msg}`);

    const getApiKey = () => {
        // 1. Try process.env first
        let key = process.env.GEMINI_API_KEY;
        if (key) return key;

        // 2. Try manual file reading
        try {
            const envPath = path.resolve(process.cwd(), '.env.local');
            if (fs.existsSync(envPath)) {
                let content = fs.readFileSync(envPath).toString('utf8');
                const buffer = fs.readFileSync(envPath);
                if (buffer.indexOf(0x00) !== -1) {
                    content = buffer.toString('utf16le');
                }

                const lines = content.split(/\r?\n/);
                for (const line of lines) {
                    const match = line.match(/^\s*(?:export\s+)?(GEMINI_API_KEY|NEXT_PUBLIC_GEMINI_API_KEY)\s*=\s*(.*)$/i);
                    if (match && match[2]) {
                        key = match[2].trim();
                        if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
                            key = key.slice(1, -1);
                        }
                        key = key.replace(/[^a-zA-Z0-9_\-]/g, '');
                        log(`[DEBUG_EXP] Key sanitized from file (length: ${key.length}, prefix: ${match[1].startsWith('NEXT') ? 'Yes' : 'No'})`);
                        break;
                    }
                }
            }
        } catch (e: any) {
            log("Error reading .env.local: " + e.message);
        }

        return key || "";
    };

    try {
        const API_KEY = getApiKey();
        if (!API_KEY) {
            log("API Key is missing!");
            return {
                en: {
                    context: "System Error: API Key not found.",
                    insight: "Please fail-safe check .env.local",
                    modern: []
                },
                ta: {
                    context: "கணினி பிழை: திறவுகோல் இல்லை.",
                    insight: "சரிபார்க்கவும்.",
                    modern: []
                }
            };
        }

        const genAI = new GoogleGenerativeAI(API_KEY);

        const modelsToTry = [
            "gemini-2.5-flash",
            "gemini-2.0-flash",
            "gemini-1.5-flash",
            "gemini-2.0-flash-exp",
            "gemini-1.5-flash-latest",
            "gemini-1.5-flash-001",
            "gemini-1.5-flash-002",
            "gemini-1.5-flash-8b",
            "gemini-1.5-pro",
            "gemini-1.5-pro-latest",
            "gemini-1.5-pro-001",
            "gemini-pro"
        ];
        let result = null;
        let errors: string[] = [];

        const prompt = `
      Analyze Thirukkural Number ${kuralNumber}:
      "${line1}
      ${line2}"
      Meaning: "${meaning}"

      Please provide a CONCISE explanation in both English and Tamil.
      IMPORTANT: Do NOT use markdown formatting, bold text, or asterisks (**). Output plain text only.

      Return the response ONLY as a JSON object with the following structure:
      {
        "en": {
          "context": "Brief context about the Kural's meaning/situation. DO NOT mention the Paal or Adhigaram names.",
          "insight": "Concise insight into the meaning.",
          "modern": ["Actionable step 1", "Actionable step 2"]
        },
        "ta": {
          "context": "Brief context in Tamil about the situation. DO NOT mention the Paal or Adhigaram names.",
          "insight": "Concise insight in Tamil.",
          "modern": ["Actionable step 1 in Tamil", "Actionable step 2 in Tamil"]
        }
      }
    `;

        for (const modelName of modelsToTry) {
            try {
                log(`Attempting with model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });
                result = await model.generateContent(prompt);
                break;
            } catch (e: any) {
                const errorMsg = `Failed with ${modelName}: ${e.message}`;
                log(errorMsg);
                errors.push(`${modelName}: ${e.message}`);
                continue;
            }
        }

        if (!result) {
            log("All models failed.");
            return {
                en: {
                    context: `System Error. Failures: ${errors.join(' | ')}`,
                    insight: "Please check API Key configuration.",
                    modern: []
                },
                ta: {
                    context: "கணினி பிழை.",
                    insight: `Errors: ${errors.join(' | ')}`,
                    modern: []
                }
            };
        }

        const response = await result.response;
        const text = response.text();

        const cleanedText = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .replace(/\*\*/g, "")
            .replace(/\*/g, "")
            .trim();

        try {
            const jsonResponse = JSON.parse(cleanedText);

            const normalizeModern = (content: any) => {
                if (Array.isArray(content)) return content;
                if (typeof content === 'string') return [content];
                return [];
            };

            if (jsonResponse.en) {
                jsonResponse.en.modern = normalizeModern(jsonResponse.en.modern);
            }
            if (jsonResponse.ta) {
                jsonResponse.ta.modern = normalizeModern(jsonResponse.ta.modern);
            }

            return jsonResponse as AIExplanationResponse;
        } catch (parseError) {
            log("Failed to parse AI response: " + parseError);
            return null;
        }
    } catch (error) {
        console.error("Error generating explanation:", error);
        return null;
    }
}
