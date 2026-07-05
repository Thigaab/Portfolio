// Non-translatable, structural data. Translatable text (bio, stat labels,
// project descriptions/periods) lives in messages/{fr,en}.json, keyed by the
// `key`/`id` fields below.

export const PERSONAL = {
  name: 'Thibaut Bonefont',
  email: 'thibaut.bonefont@gmail.com',
  github: 'https://github.com/Thigaab',
  linkedin: 'https://www.linkedin.com/in/thibaut-bonefont-aa7822268/',
}

export const STATS = [
  { key: 'languages', value: 10, suffix: '+' },
  { key: 'projects', value: 10, suffix: '+' },
  { key: 'experience', value: 3, suffix: '' },
]

export const SKILLS = [
  {
    category: 'Frontend',
    items: ['React', 'Next.js', 'Angular', 'TypeScript', 'Tailwind CSS', 'Flutter'],
  },
  {
    category: 'Backend',
    items: ['Java', 'Spring', 'Hibernate', 'Kafka', 'REST API', 'Python'],
  },
  {
    category: 'DevOps',
    items: ['Docker', 'Nginx', 'Linux', 'Git', 'CI/CD', 'Firebase'],
  },
  {
    category: 'Databases',
    items: ['PostgreSQL', 'MySQL', 'MSSQL', 'Firebase'],
  },
  {
    category: 'Languages',
    items: ['C', 'C++', 'C#', 'Shell', 'JavaScript', 'TypeScript', 'Python', 'SQL', 'HTML', 'CSS', 'Bash'],
  },
]

// `id` maps to messages `projects.items.<id>.{description,period}`.
export const PROJECTS = [
  { id: 'tiger-compiler', title: 'Tiger Compiler', tech: ['C++', 'LLVM', 'Flex', 'Bison'], type: 'Systems', github: null },
  { id: 'jws-epibazaar', title: 'JWS Epibazaar', tech: ['Java', 'Hibernate', 'Kafka', 'PostgreSQL', 'Docker'], type: 'Backend', github: null },
  { id: '42sh', title: '42SH — Shell POSIX', tech: ['C', 'POSIX', 'AST'], type: 'Systems', github: null },
  { id: 'ocr-sudoku', title: 'OCR Sudoku Solver', tech: ['C', 'Neural Network', 'OCR'], type: 'AI/ML', github: 'https://github.com/touikss/SudokuSolver' },
  { id: 'prospectmap', title: 'ProspectMap', tech: ['Python', 'Scraping', 'Docker'], type: 'Tools', github: 'https://github.com/Thigaab/ProspectMap' },
  { id: 'dunes-demis', title: 'Dunes & Demis', tech: ['Next.js', 'React', 'TypeScript', 'Tailwind'], type: 'Frontend', github: 'https://github.com/Thigaab/Dunes-Demis' },
]
