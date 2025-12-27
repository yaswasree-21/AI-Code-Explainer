
import React from 'react';
import { ProgrammingLanguage } from '../types';

interface LanguageSelectorProps {
  selected: ProgrammingLanguage;
  onChange: (lang: ProgrammingLanguage) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selected, onChange }) => {
  const languages = Object.values(ProgrammingLanguage);

  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor="language-select" className="text-sm font-semibold text-slate-700">
        Programming Language
      </label>
      <select
        id="language-select"
        value={selected}
        onChange={(e) => onChange(e.target.value as ProgrammingLanguage)}
        className="block w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-700 shadow-sm"
      >
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
