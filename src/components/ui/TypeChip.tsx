const TYPE_COLORS: Record<string, string> = {
  Fullstack: 'bg-ink/5 text-ink border-ink/20',
  Systems: 'bg-plum/5 text-plum border-plum/25',
  Backend: 'bg-moss/5 text-moss border-moss/25',
  Frontend: 'bg-iris/5 text-iris border-iris/25',
  'AI/ML': 'bg-coral/5 text-coral border-coral/25',
  Tools: 'bg-ochre/5 text-ochre border-ochre/30',
  Algorithms: 'bg-iris-soft/10 text-iris-soft border-iris-soft/35',
  Game: 'bg-brick/8 text-brick border-brick/30',
  DevOps: 'bg-moss/5 text-moss border-moss/25',
}

/** Category pill for a project. Shared so the featured cards and the carousel
 *  cards can't drift apart. */
export default function TypeChip({ type, className = '' }: { type: string; className?: string }) {
  return (
    <span
      className={`rounded-md border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest ${
        TYPE_COLORS[type] ?? TYPE_COLORS.Frontend
      } ${className}`}
    >
      {type}
    </span>
  )
}
