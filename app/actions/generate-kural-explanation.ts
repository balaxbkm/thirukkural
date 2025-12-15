"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyDWYOxO2asw_asvJDUUlwwDtgUG5fQIeQY"; // In production, use process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
    try {
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
          "modern": ["Actionable step 1", "Actionable step 2", "Actionable step 3", "Actionable step 4"]
        },
        "ta": {
          "context": "Brief context in Tamil about the situation. DO NOT mention the Paal or Adhigaram names.",
          "insight": "Concise insight in Tamil.",
          "modern": ["Actionable step 1 in Tamil", "Actionable step 2 in Tamil", "Actionable step 3 in Tamil", "Actionable step 4 in Tamil"]
        }
      }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks and any stray asterisks
        const cleanedText = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .replace(/\*\*/g, "") // Remove bold markers
            .replace(/\*/g, "")   // Remove bullet points/italics markers
            .trim();

        try {
            const jsonResponse = JSON.parse(cleanedText);

            // Robustness: Ensure 'modern' is always an array
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
            console.error("Failed to parse AI response:", parseError);
            console.error("Raw text:", text);
            return null;
        }
    } catch (error) {
        console.error("Error generating explanation:", error);
        return null;
    }
}
