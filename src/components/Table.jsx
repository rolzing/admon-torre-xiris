// Tabla reutilizable, responsive (se convierte en tarjetas en móvil).
// columns: [{ key, label, align, render }]
// rows: array de objetos

export default function Table({ columns, rows = [], emptyText = 'Sin datos' }) {
  if (!rows.length) {
    return (
      <div className="py-10 text-center text-sm text-slate-400">{emptyText}</div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-100">
      {/* Vista escritorio */}
      <table className="hidden w-full text-left text-sm md:table">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className={`px-4 py-3 ${c.align === 'right' ? 'text-right' : ''} ${
                  c.align === 'center' ? 'text-center' : ''
                }`}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-slate-50/60">
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={`px-4 py-3 ${c.align === 'right' ? 'text-right' : ''} ${
                    c.align === 'center' ? 'text-center' : ''
                  }`}
                >
                  {c.render ? c.render(row[c.key], row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Vista móvil: tarjetas */}
      <div className="divide-y divide-slate-100 md:hidden">
        {rows.map((row, r) => (
          <div key={r} className="px-4 py-3 space-y-2 bg-white">
            {columns.map((c) => (
              <div key={c.key} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-xs font-semibold uppercase text-slate-400">{c.label}</span>
                <span className={c.align === 'right' ? 'font-semibold' : ''}>
                  {c.render ? c.render(row[c.key], row) : row[c.key]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
