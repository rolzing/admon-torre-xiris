// Muro de Avisos (módulo 6): comunicados oficiales del más reciente
// al más antiguo. Responde la pregunta 9.

import Card from '../components/Card'
import Badge from '../components/Badge'
import PageHeader from '../components/PageHeader'
import { getAvisos } from '../services/mockData'
import { formatFechaLarga } from '../utils/format'
import { IconoAviso } from '../components/Icons'

export default function Avisos() {
  const avisos = getAvisos()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Muro de avisos"
        description="Comunicados oficiales de la administración, del más reciente al más antiguo."
      />

      <div className="space-y-4">
        {avisos.map((a) => (
          <Card key={a.id} className={a.importante ? 'border-amber-200 bg-amber-50/40' : ''} hover>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    a.importante ? 'bg-red-50 text-red-600' : 'bg-navy-50 text-navy-600'
                  }`}
                >
                  <IconoAviso />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-navy-900">{a.titulo}</h3>
                    {a.importante && <Badge tone="danger">Importante</Badge>}
                  </div>
                  <p className="text-xs text-slate-400">{formatFechaLarga(a.fecha)}</p>
                  <p className="mt-2 text-slate-600">{a.contenido}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
