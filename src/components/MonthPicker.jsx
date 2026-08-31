// ============================================================
//  components/MonthPicker.jsx — SELECTOR DE MES Y AÑO
//  ============================================================
//  Selector de mes/año en dos selects independientes. El valor
//  interno es 'YYYY-MM' (compatible con <input type="month">),
//  pero al usar selects nativos el año navega de forma fiable en
//  todos los navegadores (el type="month" nativo a veces falla).
//
//  Cada select guarda su propia selección localmente, así puedes
//  elegir mes y año en cualquier orden y la selección se mantiene
//  visible. Solo cuando AMBOS están definidos se emite 'YYYY-MM'.
// ============================================================

import { useState } from 'react'

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

// Rango de años disponibles: desde el año pasado hasta el siguiente.
function aniosDisponibles() {
  const actual = new Date().getFullYear()
  const lista = []
  for (let anio = actual - 1; anio <= actual + 1; anio++) lista.push(anio)
  return lista
}

function parsearValor(value) {
  // 'YYYY-MM' → { anio, mes (0-11) }
  if (!value || !/^\d{4}-\d{2}$/.test(value)) return { anio: null, mes: null }
  const [anio, mes] = value.split('-').map(Number)
  return { anio, mes: mes - 1 }
}

export default function MonthPicker({ value, onChange, className = '' }) {
  // Estado local parcial: distinguimos "sin elegir" (null) de "no aplica".
  const inicial = parsearValor(value)
  const [localMes, setLocalMes] = useState(inicial.mes)
  const [localAnio, setLocalAnio] = useState(inicial.anio)

  // Sincronizar estado local si el valor controlado cambia por fuera.
  const [ultimoValue, setUltimoValue] = useState(value)
  if (value !== ultimoValue) {
    setUltimoValue(value)
    const nuevo = parsearValor(value)
    setLocalMes(nuevo.mes)
    setLocalAnio(nuevo.anio)
  }

  const emitir = (nuevoMes, nuevoAnio) => {
    if (nuevoMes == null || nuevoAnio == null) {
      onChange('')
      return
    }
    const mm = String(nuevoMes + 1).padStart(2, '0')
    onChange(`${nuevoAnio}-${mm}`)
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      <select
        value={localMes ?? ''}
        onChange={(e) => {
          const mes = e.target.value === '' ? null : Number(e.target.value)
          setLocalMes(mes)
          emitir(mes, localAnio)
        }}
        className={selectCls}
      >
        <option value="">Mes</option>
        {MESES.map((m, i) => (
          <option key={m} value={i}>
            {m}
          </option>
        ))}
      </select>
      <select
        value={localAnio ?? ''}
        onChange={(e) => {
          const anio = e.target.value === '' ? null : Number(e.target.value)
          setLocalAnio(anio)
          emitir(localMes, anio)
        }}
        className={selectCls}
      >
        <option value="">Año</option>
        {aniosDisponibles().map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
    </div>
  )
}

const selectCls =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-200'
