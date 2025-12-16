"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

import fs from 'fs';
import path from 'path';

function getApiKey() {
    let key = process.env.GEMINI_API_KEY;
    if (key) return key;

    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        // Console log visible in terminal
        console.log(`[DEBUG] Looking for .env.local at: ${envPath}`);

        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf8');
            console.log(`[DEBUG] File found. Length: ${content.length}`);
            const match = content.match(/GEMINI_API_KEY=(.*)/);
            if (match && match[1]) {
                key = match[1].trim();
                console.log(`[DEBUG] Key extracted: ${key.substring(0, 5)}...`);
            } else {
                console.log(`[DEBUG] No GEMINI_API_KEY extraction match found.`);
            }
        } else {
            console.log(`[DEBUG] File NOT found at ${envPath}`);
        }
    } catch (e) {
        console.error("[DEBUG] Error reading .env.local", e);
    }


    return key || "";
}

const API_KEY = getApiKey();
// console.log("Debug: API Key present:", !!API_KEY); // Keep debug if needed, but removing for clean log

const genAI = new GoogleGenerativeAI(API_KEY);

// const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
// Temporarily reverting to 1.5-flash if 2.5 is causing issues, but 2.5 worked in script.
// model: "gemini-1.5-flash"
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export interface ChatMessage {
    role: "user" | "model";
    content: string;
}

export async function chatWithValluvar(history: ChatMessage[], userMessage: string, language: 'en' | 'ta' = 'en'): Promise<string> {
    try {
        const systemPrompt = `
You are the ancient Tamil poet and philosopher Thiruvalluvar, living in the year 2025.
Your task is to provide advice to users on their modern problems using the wisdom from your Thirukkural.

Current User Language: ${language === 'ta' ? 'TAMIL' : 'ENGLISH'}

Guidelines:
1. **Persona**: Maintain a wise, calm, and poetic tone.
2. **Language**:
   - IF User Language is TAMIL: Respond ONLY in Tamil (formal but understandable). You can use English for technical terms if absolutely needed, but prefer Tamil.
   - IF User Language is ENGLISH: Respond in English, but you may quote the Kural in Tamil (transliterated or script) followed by meaning.
3. **Content**:
    - Listen to the user's problem.
    - Quote a relevant Kural if applicable.
    - EXPLAIN how that Kural applies to the *specific* modern situation.
    - Give practical, actionable advice.
4. **Tone**: Benevolent, philosophical, yet grounded and practical.
5. **Context**: You understand 2025 technology, society, and struggles.
6. **Formatting**: use plain text only. Do not use markdown (no bold, italics, or code blocks).

Respond to the user's latest input in the requested language.
`;

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemPrompt }],
                },
                {
                    role: "model",
                    parts: [{ text: "Greetings. I am Valluvar. How may I guide you through the complexities of this modern age?" }],
                },
                ...history.map(msg => ({
                    role: msg.role,
                    parts: [{ text: msg.content }],
                })),
            ],
        });

        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        let text = response.text();

        // Clean up markdown if any slips through
        text = text
            .replace(/\*\*/g, "") // Remove bold
            .replace(/\*/g, "")   // Remove italics
            .replace(/```/g, "")  // Remove code blocks
            .replace(/^#+\s/gm, ""); // Remove headers

        return text.trim();
    } catch (error: any) {
        console.error("Error in chatWithValluvar:", error);
        // Debugging: Return actual error to UI to see what's wrong
        return `Error: ${error.message || error.toString()}. Key starting with ${API_KEY ? API_KEY.substring(0, 4) : 'None'}`;
    }
}
