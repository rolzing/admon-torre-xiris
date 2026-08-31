// Buscador simple (módulo 8): encuentra por palabra clave dentro de
// avisos, documentos y conceptos de gasto.

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import SearchBar from '../components/SearchBar'
import PageHeader from '../components/PageHeader'
import { buscar } from '../services/buscar.service'
import { formatMoney, formatFechaLarga } from '../utils/format'
import { IconoDocumento, IconoAviso, IconoDolar, IconoChevron } from '../components/Icons'

export default function Buscador() {
  const [query, setQuery] = useState('')
  const [resultados, setResultados] = useState({ avisos: [], documentos: [], gastos: [] })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    ;(async () => {
      const res = await buscar(query)
      if (!active) return
      setResultados(res)
      setLoading(false)
    })()
    return () => {
      active = false
    }
  }, [query])

  const { avisos, documentos, gastos } = resultados
  const total = avisos.length + documentos.length + gastos.length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Buscador"
        description="Encuentra rápido avisos, documentos y gastos por palabra clave."
      />

      <SearchBar onSearch={setQuery} />

      {query.trim() ? (
        <p className="text-sm text-slate-500">
          {total} resultado{total !== 1 && 's'} para «{query}»
        </p>
      ) : (
        <p className="text-sm text-slate-400">
          Escribe una palabra, por ejemplo «asamblea», «agua», «reglamento» o «mantenimiento».
        </p>
      )}

      {query.trim() && total === 0 && (
        <Card className="text-center text-sm text-slate-400 py-8">
          Sin coincidencias. Prueba con otra palabra clave.
        </Card>
      )}

      {avisos.length > 0 && (
        <ResultSection title="Avisos" icon={<IconoAviso />}>
          {avisos.map((a) => (
            <Link key={a.id} to="/avisos">
              <Row>
                <p className="font-medium text-navy-800">{a.titulo}</p>
                <p className="text-xs text-slate-400">{formatFechaLarga(a.fecha)}</p>
              </Row>
            </Link>
          ))}
        </ResultSection>
      )}

      {documentos.length > 0 && (
        <ResultSection title="Documentos" icon={<IconoDocumento />}>
          {documentos.map((d) => (
            <Link key={d.id} to="/documentos">
              <Row>
                <p className="font-medium text-navy-800">{d.titulo}</p>
                <p className="text-xs text-slate-400">{d.tipo}</p>
              </Row>
            </Link>
          ))}
        </ResultSection>
      )}

      {gastos.length > 0 && (
        <ResultSection title="Gastos" icon={<IconoDolar />}>
          {gastos.map((g) => (
            <Link key={g.id} to="/finanzas">
              <Row>
                <div>
                  <p className="font-medium text-navy-800">{g.concepto}</p>
                  <p className="text-xs text-slate-400">{g.categoria}</p>
                </div>
                <span className="font-semibold text-red-600">{formatMoney(g.monto)}</span>
              </Row>
            </Link>
          ))}
        </ResultSection>
      )}
    </div>
  )
}

function ResultSection({ title, icon, children }) {
  return (
    <div>
      <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
        <span className="text-lg">{icon}</span>
        {title}
      </h2>
      <Card padding={false}>
        <div className="divide-y divide-slate-100">{children}</div>
      </Card>
    </div>
  )
}

function Row({ children }) {
  return (
    <div className="group flex cursor-pointer items-center justify-between gap-3 px-5 py-3 transition hover:bg-slate-50">
      {children}
      <IconoChevron className="h-4 w-4 shrink-0 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-accent-500" />
    </div>
  )
}
