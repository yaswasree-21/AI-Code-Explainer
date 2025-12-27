
import React, { useState } from 'react';
import Header from './components/Header';
import LanguageSelector from './components/LanguageSelector';
import CodeArea from './components/CodeArea';
import ExplanationDisplay from './components/ExplanationDisplay';
import { ProgrammingLanguage, CodeExplanation } from './types';
import { getCodeExplanation } from './services/geminiService';

const EXAMPLES = {
  [ProgrammingLanguage.PYTHON]: "for i in range(5):\n    print(f'Hello {i}')",
  [ProgrammingLanguage.JAVASCRIPT]: "const items = [1, 2, 3];\nconst double = items.map(n => n * 2);\nconsole.log(double);",
  [ProgrammingLanguage.TYPESCRIPT]: "interface User {\n  name: string;\n  id: number;\n}\n\nconst greet = (user: User) => `Hi, ${user.name}`;",
  [ProgrammingLanguage.HTML]: "<div class='container'>\n  <h1>Welcome</h1>\n  <p>Learn to code today!</p>\n</div>",
};

const App: React.FC = () => {
  const [language, setLanguage] = useState<ProgrammingLanguage>(ProgrammingLanguage.PYTHON);
  const [code, setCode] = useState<string>("");
  const [explanation, setExplanation] = useState<CodeExplanation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExplain = async () => {
    if (!code.trim()) {
      setError("Paste or type some code first!");
      return;
    }

    setIsLoading(true);
    setError(null);
    setExplanation(null);

    try {
      const result = await getCodeExplanation(code, language);
      setExplanation(result);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadExample = () => {
    const example = EXAMPLES[language as keyof typeof EXAMPLES] || "// No example for this language yet.";
    setCode(example);
  };

  const handleClear = () => {
    setCode("");
    setExplanation(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-6 sm:p-8 border border-slate-100 transition-all">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div className="flex-grow max-w-md">
              <LanguageSelector selected={language} onChange={setLanguage} />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={handleClear}
                className="px-4 py-2 text-slate-500 hover:text-slate-700 font-medium transition-colors"
              >
                Clear
              </button>
              <button
                onClick={loadExample}
                className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-100 transition-colors"
              >
                Try Example
              </button>
              <button
                onClick={handleExplain}
                disabled={isLoading}
                className={`flex-grow md:flex-none py-2 px-8 rounded-lg font-bold text-white transition-all shadow-lg ${
                  isLoading 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-indigo-200 hover:shadow-indigo-300'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </span>
                ) : "Explain Code"}
              </button>
            </div>
          </div>

          <CodeArea 
            code={code} 
            onChange={setCode} 
            placeholder={`// Write or paste some ${language} code here...`}
          />

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center animate-in fade-in zoom-in duration-300">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
        </div>

        {explanation && <ExplanationDisplay explanation={explanation} />}

        {!explanation && !isLoading && !error && (
            <div className="mt-16 text-center text-slate-400 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="inline-block p-6 bg-indigo-50 rounded-full mb-6">
                    <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Ready to unlock your code?</h2>
                <p className="max-w-md mx-auto mt-3 text-slate-500 text-lg">Paste a snippet above and let AI transform it into a simple lesson. Perfect for students and curious builders.</p>
            </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 p-4 text-center text-sm text-slate-500 z-10">
          Built for Learners • AI Code Explainer &copy; 2024
      </footer>
    </div>
  );
};

export default App;
