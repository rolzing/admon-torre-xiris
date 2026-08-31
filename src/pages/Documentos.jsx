// Repositorio Documental (módulo 7).
// Respuestas: 7 (reglamento), 8 (acuerdos de la última asamblea),
// 10 (dónde están actas y documentos).

import Card from '../components/Card'
import Badge from '../components/Badge'
import Button from '../components/Button'
import PageHeader from '../components/PageHeader'
import { getDocumentos, getAcuerdoReciente } from '../services/mockData'
import { formatFecha } from '../utils/format'
import { IconoDocumento, IconoDescarga, IconoAviso } from '../components/Icons'

const tipoTone = (t) => {
  const map = {
    Reglamento: 'navy',
    'Acta de Asamblea': 'accent',
    'Estado Financiero': 'warning',
  }
  return map[t] || 'neutral'
}

export default function Documentos() {
  const documentos = getDocumentos()
  const asamblea = getAcuerdoReciente()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documentos"
        description="Reglamento, actas de asamblea y estados financieros, organizados y descargables."
      />

      {/* Última asamblea destacada */}
      {asamblea && (
        <Card className="border-accent-200 bg-gradient-to-br from-white to-accent-50/40">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-600 text-white text-lg">
              <IconoAviso />
            </span>
            <Badge tone="accent">Asamblea reciente</Badge>
          </div>
          <h3 className="text-lg font-bold text-navy-900">{asamblea.titulo}</h3>
          <p className="text-sm text-slate-500">{formatFecha(asamblea.fecha)}</p>

          {asamblea.resumenAcuerdos && (
            <div className="mt-3">
              <p className="text-sm font-semibold text-navy-800 mb-2">Acuerdos principales:</p>
              <ul className="space-y-1.5">
                {asamblea.resumenAcuerdos.map((acuerdo, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                    {acuerdo}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => abrirDocumento(asamblea.url)}
          >
            <IconoDescarga /> Ver acta completa
          </Button>
        </Card>
      )}

      {/* Lista de documentos */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Repositorio
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {documentos.map((d) => (
            <Card key={d.id} hover>
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-600 text-xl">
                  <IconoDocumento />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <Badge tone={tipoTone(d.tipo)}>{d.tipo}</Badge>
                    <span className="text-xs text-slate-400">{formatFecha(d.fecha)}</span>
                  </div>
                  <h3 className="mt-1.5 font-bold text-navy-900">{d.titulo}</h3>
                  {d.descripcion && <p className="mt-1 text-sm text-slate-500">{d.descripcion}</p>}
                  <Button
                    variant="secondary"
                    className="mt-3 px-3 py-1.5 text-xs"
                    onClick={() => abrirDocumento(d.url)}
                  >
                    <IconoDescarga /> Ver / descargar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

function abrirDocumento(url) {
  // Placeholder de descarga. En producción apunta a archivos reales
  // en Firebase Storage (getDownloadURL) o a PDFs servidos por Vercel.
  alert(`Descarga (demo): ${url}\n\nEn producción este archivo vendría de Firebase Storage.`)
}
