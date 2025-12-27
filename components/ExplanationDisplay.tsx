
import React, { useState } from 'react';
import { CodeExplanation } from '../types';

interface ExplanationDisplayProps {
  explanation: CodeExplanation;
}

const Section: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="explanation-card bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm mb-6 hover:shadow-md transition-all duration-300">
    <div className="flex items-center gap-3 mb-5">
      {icon && <div className="text-indigo-600">{icon}</div>}
      <h3 className="text-xl font-bold text-slate-800">{title}</h3>
    </div>
    <div className="text-slate-600 leading-relaxed">
      {children}
    </div>
  </div>
);

const ExplanationDisplay: React.FC<ExplanationDisplayProps> = ({ explanation }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `
Purpose: ${explanation.purpose}
Complexity: ${explanation.complexity}
Logic: ${explanation.lineByLine.join('\n')}
Input/Output: ${explanation.inputOutput}
    `.trim();
    
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-12 animate-in fade-in slide-in-from-bottom-10 duration-500 pb-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">The Breakdown</h2>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all font-medium text-sm"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
              Copy Explanation
            </>
          )}
        </button>
      </div>

      <Section 
        title="1. The Big Picture" 
        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
      >
        <p className="text-xl font-medium text-slate-700 leading-snug">{explanation.purpose}</p>
      </Section>

      <Section 
        title="2. Logic Flow"
        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>}
      >
        <ul className="space-y-4">
          {explanation.lineByLine.map((point, index) => (
            <li key={index} className="flex items-start group">
              <span className="flex-shrink-0 w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold mr-4 mt-0.5 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                {index + 1}
              </span>
              <span className="text-lg text-slate-600">{point}</span>
            </li>
          ))}
        </ul>
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Section 
          title="3. Speed & Efficiency"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
        >
          <div className="bg-indigo-50/50 p-5 rounded-xl border border-indigo-100">
            <p className="font-semibold text-indigo-900 italic">"{explanation.complexity}"</p>
          </div>
        </Section>

        <Section 
          title="4. Input → Output"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>}
        >
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <p className="font-medium text-slate-700">{explanation.inputOutput}</p>
          </div>
        </Section>
      </div>

      <Section 
        title="5. Level Up Tips"
        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
      >
        <ul className="space-y-3">
          {explanation.improvements.map((tip, index) => (
            <li key={index} className="flex items-center text-emerald-800 bg-emerald-50/50 px-4 py-3 rounded-lg border border-emerald-100/50">
              <svg className="w-5 h-5 mr-3 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{tip}</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
};

export default ExplanationDisplay;
