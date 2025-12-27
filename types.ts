
export enum ProgrammingLanguage {
  PYTHON = 'Python',
  JAVA = 'Java',
  JAVASCRIPT = 'JavaScript',
  CPP = 'C++',
  C = 'C',
  HTML = 'HTML',
  CSS = 'CSS',
  TYPESCRIPT = 'TypeScript',
  RUBY = 'Ruby',
  GO = 'Go',
  RUST = 'Rust'
}

export interface ExplanationSection {
  title: string;
  points: string[];
}

export interface CodeExplanation {
  purpose: string;
  lineByLine: string[];
  complexity: string;
  inputOutput: string;
  improvements: string[];
}
