
import { GoogleGenAI, Type } from "@google/genai";

// Select elements
const languageSelect = document.getElementById('languageSelect') as HTMLSelectElement;
const codeInput = document.getElementById('codeInput') as HTMLTextAreaElement;
const explainBtn = document.getElementById('explainBtn') as HTMLButtonElement;
const errorMessage = document.getElementById('errorMessage') as HTMLDivElement;
const resultsArea = document.getElementById('resultsArea') as HTMLDivElement;
const emptyState = document.getElementById('emptyState') as HTMLDivElement;

const resPurpose = document.getElementById('resPurpose') as HTMLParagraphElement;
const resSteps = document.getElementById('resSteps') as HTMLDivElement;
const resComplexity = document.getElementById('resComplexity') as HTMLParagraphElement;
const resIO = document.getElementById('resIO') as HTMLParagraphElement;
const resImprovements = document.getElementById('resImprovements') as HTMLUListElement;

async function handleExplain() {
    const code = codeInput.value.trim();
    const language = languageSelect.value;

    if (!code) {
        showError('Please paste your code first!');
        return;
    }

    setLoading(true);
    hideError();
    resultsArea.classList.add('hidden');
    emptyState.classList.add('hidden');

    try {
        // Create instance right before use as per best practices
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
        
        const prompt = `Explain this ${language} code for a beginner student.
        
        Code:
        ${code}
        
        Ensure you follow these rules:
        - Use clear section headings.
        - Use numbered points for the line-by-line explanation.
        - Keep each point short and easy to read.
        - Write in simple words (avoid jargon).
        - Explain the time complexity using easy real-world examples (e.g., "like searching through a stack of papers").
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                systemInstruction: "You are an AI Code Explainer for a beginner-friendly educational website. You must provide a structured learning experience in JSON format. Use simple, friendly language suitable for a student.",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        purpose: { 
                            type: Type.STRING,
                            description: "Big Picture / Purpose: What the code does and why it is useful."
                        },
                        lineByLine: { 
                            type: Type.ARRAY, 
                            items: { type: Type.STRING },
                            description: "Line-by-Line Explanation: A list of numbered steps explaining the code logic."
                        },
                        complexity: { 
                            type: Type.STRING,
                            description: "Time Complexity: How fast it runs in very simple terms."
                        },
                        inputOutput: { 
                            type: Type.STRING,
                            description: "Input -> Output Logic: What goes in and what comes out."
                        },
                        improvements: { 
                            type: Type.ARRAY, 
                            items: { type: Type.STRING },
                            description: "Ideas for Improvement: 1-2 simple suggestions."
                        }
                    },
                    required: ["purpose", "lineByLine", "complexity", "inputOutput", "improvements"]
                }
            },
        });

        const text = response.text;
        if (!text) {
            throw new Error("Empty response from AI");
        }

        // Clean up response text in case of markdown wrapping
        let jsonStr = text.trim();
        if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.replace(/^```json/, '').replace(/```$/, '').trim();
        } else if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.replace(/^```/, '').replace(/```$/, '').trim();
        }

        const data = JSON.parse(jsonStr);
        renderResults(data);
    } catch (err: any) {
        console.error("AI Explanation Error:", err);
        let userFriendlyError = 'Oops! Something went wrong while connecting to AI.';
        
        if (err.message?.includes('API_KEY')) {
            userFriendlyError = 'API Key missing or invalid. Please check your Netlify environment variables.';
        } else if (err instanceof SyntaxError) {
            userFriendlyError = 'Failed to parse AI response. Please try again.';
        }

        showError(userFriendlyError);
        emptyState.classList.remove('hidden');
    } finally {
        setLoading(false);
    }
}

function renderResults(data: any) {
    resPurpose.textContent = data.purpose;
    
    // Line by line
    resSteps.innerHTML = '';
    data.lineByLine.forEach((step: string, index: number) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'flex items-start group animate-in fade-in slide-in-from-left-2 duration-300';
        stepDiv.style.animationDelay = `${index * 50}ms`;
        stepDiv.innerHTML = `
            <div class="flex-shrink-0 mt-0.5">
                <span class="step-number group-hover:bg-indigo-500 transition-colors">${index + 1}</span>
            </div>
            <p class="text-slate-600 font-medium leading-relaxed">${step}</p>
        `;
        resSteps.appendChild(stepDiv);
    });

    resComplexity.textContent = data.complexity;
    resIO.textContent = data.inputOutput;

    // Improvements
    resImprovements.innerHTML = '';
    data.improvements.forEach((tip: string) => {
        const li = document.createElement('li');
        li.className = 'flex items-start text-slate-600 font-medium bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 shadow-sm';
        li.innerHTML = `
            <span class="text-emerald-500 mr-3 text-xl leading-none">★</span>
            <span>${tip}</span>
        `;
        resImprovements.appendChild(li);
    });

    resultsArea.classList.remove('hidden');
    // Ensure the scroll happens after the element is no longer hidden
    setTimeout(() => {
        resultsArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
}

function setLoading(isLoading: boolean) {
    if (isLoading) {
        explainBtn.disabled = true;
        explainBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Lesson...
        `;
        explainBtn.className = "w-full mt-6 py-4 rounded-2xl bg-slate-400 text-white font-bold text-lg shadow-none cursor-not-allowed transition-all";
    } else {
        explainBtn.disabled = false;
        explainBtn.innerHTML = `
            <span>Explain My Code</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        `;
        explainBtn.className = "w-full mt-6 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-3";
    }
}

function showError(msg: string) {
    errorMessage.textContent = msg;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

explainBtn.addEventListener('click', handleExplain);
