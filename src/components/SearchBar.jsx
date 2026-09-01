// Barra de búsqueda por palabra clave (módulo 8).
// Busca en avisos, documentos y conceptos de gasto.

import { useState } from 'react'
import { IconoBuscar } from './Icons'

export default function SearchBar({ onSearch, placeholder = 'Buscar avisos, documentos, gastos…' }) {
  const [value, setValue] = useState('')

  const handleChange = (e) => {
    const v = e.target.value
    setValue(v)
    onSearch(v)
  }

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
        <IconoBuscar />
      </span>
      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm shadow-sm outline-none transition focus:border-accent-400 focus:ring-2 focus:ring-accent-200 dark:border-slate-700 dark:bg-navy-800 dark:text-slate-100 dark:placeholder:text-slate-500"
      />
    </div>
  )
}
