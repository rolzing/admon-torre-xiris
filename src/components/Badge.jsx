// Etiquetas de estado / categoría con colores semánticos.

const palettes = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-accent-50 text-accent-700 border-accent-200',
  neutral: 'bg-slate-100 text-slate-600 border-slate-200',
  navy: 'bg-navy-50 text-navy-700 border-navy-200',
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
