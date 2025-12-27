
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-20 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 leading-tight">AI Code Explainer</h1>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Learn to code simply</p>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center space-x-4">
            <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase">Beta Prototype</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
