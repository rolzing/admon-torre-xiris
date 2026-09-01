// Etiquetas de estado / categoría con colores semánticos.

const palettes = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30',
  warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30',
  danger: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/30',
  info: 'bg-accent-50 text-accent-700 border-accent-200 dark:bg-accent-500/15 dark:text-accent-300 dark:border-accent-500/30',
  neutral: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700/60 dark:text-slate-300 dark:border-slate-600',
  navy: 'bg-navy-50 text-navy-700 border-navy-200 dark:bg-navy-800/70 dark:text-navy-200 dark:border-navy-700',
}

export default function Badge({ tone = 'neutral', children, className = '' }) {
  const cls = palettes[tone] || palettes.neutral
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        cls
      } ${className}`}
    >
      {children}
    </span>
  )
}
