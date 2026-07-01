export const PERSONAL = {
  name: 'Thibaut Bonefont',
  title: 'Fullstack Engineer',
  subtitle: 'DevOps · Finance',
  bio: "Étudiant ingénieur en dernière année à l'EPITA Paris. Je conçois des systèmes robustes, du code au déploiement — avec une appétence particulière pour le domaine de la finance.",
  email: 'thibaut.bonefont@gmail.com',
  github: 'https://github.com/Thigaab',
  linkedin: 'https://www.linkedin.com/in/thibaut-bonefont-aa7822268/',
}

export const STATS = [
  { value: 5, suffix: '+', label: 'Langages maîtrisés' },
  { value: 10, suffix: '+', label: 'Projets réalisés' },
  { value: 3, suffix: '', label: 'Années d\'expérience' },
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
    items: ['C', 'C++', 'C#', 'Dart', 'Shell'],
  },
]

export const PROJECTS = [
  {
    id: 'tiger-compiler',
    title: 'Tiger Compiler',
    description:
      "Compilateur complet pour le langage éducatif Tiger — analyse lexicale, syntaxique, sémantique et génération de code.",
    tech: ['C++', 'LLVM', 'Flex', 'Bison'],
    period: 'Fév – Mai 2026',
    type: 'Systems',
    github: null,
  },
  {
    id: 'jws-epibazaar',
    title: 'JWS Epibazaar',
    description:
      "Backend pour un jeu de gestion de ressources — 3 applications interconnectées avec architecture en couche, messaging Kafka et ORM Hibernate.",
    tech: ['Java', 'Hibernate', 'Kafka', 'PostgreSQL', 'Docker'],
    period: 'Fév 2025',
    type: 'Backend',
    github: null,
  },
  {
    id: '42sh',
    title: '42SH — Shell POSIX',
    description:
      "Shell POSIX complet avec parsing AST, exécution de commandes, redirections et pipes. Développé en équipe de 4 en un mois.",
    tech: ['C', 'POSIX', 'AST'],
    period: 'Jan 2024',
    type: 'Systems',
    github: 'https://github.com/Thigaab',
  },
  {
    id: 'ocr-sudoku',
    title: 'OCR Sudoku Solver',
    description:
      "Reconnaissance de grilles de sudoku via traitement d'image et réseau de neurones, suivi d'une résolution automatique.",
    tech: ['C', 'Neural Network', 'OCR'],
    period: 'Oct 2023',
    type: 'AI/ML',
    github: 'https://github.com/Thigaab',
  },
  {
    id: 'prospectmap',
    title: 'ProspectMap',
    description:
      "Outil de prospection automatisé identifiant des entreprises locales susceptibles d'avoir besoin d'un nouveau site web.",
    tech: ['Python', 'Scraping', 'Docker'],
    period: '2025',
    type: 'Tools',
    github: 'https://github.com/Thigaab/ProspectMap',
  },
  {
    id: 'dunes-demis',
    title: 'Dunes & Demis',
    description:
      "Site vitrine pour l'équipage Dunes & Demis au 4L Trophy 2027. Interface moderne et rapide.",
    tech: ['Next.js', 'React', 'TypeScript', 'Tailwind'],
    period: '2025',
    type: 'Frontend',
    github: 'https://github.com/Thigaab/Dunes-Demis',
  },
]
