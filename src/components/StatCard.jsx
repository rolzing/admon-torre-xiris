// Tarjeta de métrica (dashboard financiero) que destaca una cifra
// clave en grande, con etiqueta, subtexto opcional e icono.

import Card from './Card'
import { formatMoney } from '../utils/format'

export default function StatCard({
  label,
  value,
  sub,
  icon,
  variant = 'default',
  className = '',
}) {
  const accents = {
    default: 'text-navy-900 dark:text-white',
    accent: 'text-accent-600 dark:text-accent-400',
    danger: 'text-red-600 dark:text-red-400',
    muted: 'text-slate-500 dark:text-slate-400',
  }

  const valueColor = accents[variant] || accents.default

  return (
    <Card className={className} hover>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
            {label}
          </p>
          <p className={`text-3xl font-extrabold leading-tight ${valueColor}`}>{value}</p>
          {sub && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">{sub}</p>}
        </div>
        {icon && (
          <div className="shrink-0 flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-navy-600 text-xl dark:bg-navy-800 dark:text-navy-200">
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}
