// Non-translatable, structural data. Translatable text (bio, stat labels,
// project descriptions/periods) lives in messages/{fr,en}.json, keyed by the
// `key`/`id` fields below.

export const PERSONAL = {
  name: 'Thibaut Bonefont',
  email: 'thibaut.bonefont@gmail.com',
  github: 'https://github.com/Thigaab',
  linkedin: 'https://www.linkedin.com/in/thibaut-bonefont-aa7822268/',
}

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

// `id` maps to messages `projects.items.<id>.{description,long,period}`. `cover`
// overrides the default cover art at `public/projects/<id>.svg`. `group` promotes
// a project out of the carousel into one of the two featured grids (headings in
// messages `projects.groups.<group>`). Array order is display order.
// `origin` only surfaces when a project has neither a repo nor a live site:
// it picks which "code unavailable" note the modal shows.
export const PROJECTS = [
  { id: 'meet-to-the-pit', title: 'Meet To The Pit', tech: ['Java', 'Spring Boot', 'PostgreSQL', 'React Native', 'WebSocket', 'Docker'], type: 'Fullstack', github: null, website: null, cover: '/projects/meet-to-the-pit.webp', award: false, group: 'product', origin: 'personal', shots: ['/projects/meet-to-the-pit/01.webp', '/projects/meet-to-the-pit/02.webp', '/projects/meet-to-the-pit/03.webp', '/projects/meet-to-the-pit/04.webp', '/projects/meet-to-the-pit/05.webp', '/projects/meet-to-the-pit/06.webp'] },
  { id: 'ecoticket', title: 'EcoTicket', tech: ['Python', 'FastAPI', 'Gemini', 'React', 'PostgreSQL', 'Kubernetes'], type: 'AI/ML', github: null, website: 'https://ecoticket.thibaut-bonefont.com', cover: null, award: true, group: 'product', origin: 'personal', shots: ['/projects/ecoticket/01.webp', '/projects/ecoticket/02.webp', '/projects/ecoticket/03.webp', '/projects/ecoticket/04.webp', '/projects/ecoticket/05.webp', '/projects/ecoticket/06.webp'] },
  { id: 'dunes-demis', title: 'Dunes & Demis', tech: ['Next.js', 'React', 'TypeScript', 'Tailwind'], type: 'Frontend', github: 'https://github.com/Thigaab/Dunes-Demis', website: 'https://dunes-demis.vercel.app', cover: '/projects/dunes-demis.webp', award: false, group: 'product', origin: 'personal', shots: [] },
  { id: 'infra', title: 'Cluster k3s', tech: ['k3s', 'Traefik', 'cert-manager', 'Prometheus', 'Grafana', 'Helm'], type: 'DevOps', github: 'https://github.com/Thigaab/Infra', website: null, cover: null, award: false, group: 'systems', origin: 'personal', shots: [] },
  { id: 'homelab', title: 'Homelab Media Stack', tech: ['TrueNAS SCALE', 'Docker Compose', 'ZFS', 'Jellyfin', 'Gluetun', 'Cloudflare Tunnel'], type: 'DevOps', github: null, website: null, cover: null, award: false, group: 'systems', origin: 'personal', shots: [] },
  { id: 'tiger-compiler', title: 'Tiger Compiler', tech: ['C++', 'LLVM', 'Flex', 'Bison'], type: 'Systems', github: null, website: null, cover: null, award: false, group: 'systems', origin: 'school', shots: [] },
  { id: 'prospectmap', title: 'ProspectMap', tech: ['Python', 'Scraping', 'Docker'], type: 'Tools', github: 'https://github.com/Thigaab/ProspectMap', website: null, cover: null, award: false, group: null, origin: 'personal', shots: ['/projects/prospectmap/01.webp'] },
  { id: 'devils-never-lie', title: "Devil's Never Lie", tech: ['Unity 6', 'C#', 'UniRx', 'DOTween', 'NavMesh 2D'], type: 'Game', github: null, website: 'https://roxocro.itch.io/devilsneverlie', cover: null, award: false, group: null, origin: 'school', shots: ['/projects/devils-never-lie/01.webp', '/projects/devils-never-lie/02.webp', '/projects/devils-never-lie/03.webp', '/projects/devils-never-lie/04.webp'] },
  { id: 'bittorrent', title: 'BitTorrent Client', tech: ['C', 'epoll', 'OpenSSL', 'libcurl', 'Meson'], type: 'Systems', github: null, website: null, cover: null, award: false, group: null, origin: 'school', shots: [] },
  { id: 'malloc', title: 'Malloc', tech: ['C', 'mmap', 'pthreads', 'Makefile'], type: 'Systems', github: null, website: null, cover: null, award: false, group: null, origin: 'school', shots: [] },
  { id: 'myfind', title: 'MyFind', tech: ['C', 'POSIX', 'AST', 'fork'], type: 'Systems', github: null, website: null, cover: null, award: false, group: null, origin: 'school', shots: [] },
  { id: 'ero1', title: 'Winter Optimization', tech: ['Python', 'NetworkX', 'OSMnx', 'OpenStreetMap'], type: 'Algorithms', github: null, website: null, cover: null, award: false, group: null, origin: 'school', shots: [] },
  { id: 'jws-epibazaar', title: 'JWS Epibazaar', tech: ['Java', 'Hibernate', 'Kafka', 'PostgreSQL', 'Docker'], type: 'Backend', github: null, website: null, cover: null, award: false, group: null, origin: 'school', shots: [] },
  { id: '42sh', title: '42SH · Shell POSIX', tech: ['C', 'POSIX', 'AST'], type: 'Systems', github: null, website: null, cover: null, award: false, group: null, origin: 'school', shots: [] },
  { id: 'ocr-sudoku', title: 'OCR Sudoku Solver', tech: ['C', 'Neural Network', 'OCR'], type: 'AI/ML', github: 'https://github.com/touikss/SudokuSolver', website: null, cover: '/projects/ocr-sudoku.webp', award: false, group: null, origin: 'school', shots: [] },
]

export type Project = (typeof PROJECTS)[number]

// The three figures in the About section. `projects` counts the list below so
// it can't drift; the other two are set by hand.
export const STATS = [
  { key: 'experience', value: 5, suffix: '' },
  { key: 'projects', value: PROJECTS.length, suffix: '+' },
  { key: 'languages', value: 10, suffix: '+' },
]
