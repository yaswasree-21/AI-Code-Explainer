
import { GoogleGenAI, Type } from "@google/genai";
import { ProgrammingLanguage } from "../types";

export const getCodeExplanation = async (code: string, language: ProgrammingLanguage) => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure it is configured in your environment.");
  }

  // Initialize fresh to ensure the latest key is used
  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `You are an expert AI Code Explainer for a beginner-friendly educational platform.
Your mission is to demystify code by breaking it down into simple, high-impact logical chunks.

FORMAT YOUR RESPONSE AS VALID JSON:
{
  "purpose": "A beginner-friendly summary of the code's goal (1-2 sentences).",
  "lineByLine": ["Step 1: Simple explanation of the first logical block.", "Step 2: Explanation of the next part...", "..."],
  "complexity": "Plain-English explanation of how 'fast' or 'heavy' this code is (Time/Space complexity) with a relatable analogy.",
  "inputOutput": "Describe what data goes in and what result comes out.",
  "improvements": ["One simple way to make this cleaner.", "One common pitfall to avoid."]
}

GUIDELINES:
- Target Audience: Absolute beginners (High school level).
- Tone: Encouraging, clear, and professional.
- Avoid Jargon: If you use a technical term (like 'iteration'), explain it simply.
- Context: This is ${language} code. Use language-specific terminology (e.g., 'Dictionaries' for Python, 'Objects' for JS).`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Explain this ${language} code for a student:\n\n${code}`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            purpose: { type: Type.STRING },
            lineByLine: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            complexity: { type: Type.STRING },
            inputOutput: { type: Type.STRING },
            improvements: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
          },
          required: ["purpose", "lineByLine", "complexity", "inputOutput", "improvements"]
        }
      },
    });

    // Access .text property directly per latest guidelines
    const text = response.text;
    if (!text) throw new Error("The AI didn't return a response. Try simplifying the code.");
    
    return JSON.parse(text);
  } catch (error: any) {
    console.error("Gemini Explainer Error:", error);
    if (error.message?.includes("429")) {
      throw new Error("Too many requests! Please wait a moment before trying again.");
    }
    throw new Error(error.message || "Something went wrong while analyzing the code.");
  }
};
