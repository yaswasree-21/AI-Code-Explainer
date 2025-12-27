
import React from 'react';

interface CodeAreaProps {
  code: string;
  onChange: (code: string) => void;
  placeholder?: string;
}

const CodeArea: React.FC<CodeAreaProps> = ({ code, onChange, placeholder }) => {
  return (
    <div className="flex flex-col space-y-2 flex-grow">
      <label className="text-sm font-semibold text-slate-700">Paste your code here</label>
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "// Paste your code here..."}
        className="w-full h-64 p-4 font-mono text-sm bg-slate-900 text-slate-100 rounded-xl border-none focus:ring-4 focus:ring-indigo-500/30 transition-all resize-none shadow-inner"
        spellCheck={false}
      />
    </div>
  );
};

export default CodeArea;
