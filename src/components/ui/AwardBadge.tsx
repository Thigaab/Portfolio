/**
 * Distinction badge for a project (a hackathon win, a prize). Ochre so it
 * reads as an award without going back to the gold the site dropped.
 */
export default function AwardBadge({
  label,
  className = '',
}: {
  label: string
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border border-ochre/35 bg-ochre/10 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-ochre ${className}`}
    >
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
        <path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" />
        <path d="M12 14v4M8.5 21h7" />
      </svg>
      {label}
    </span>
  )
}
