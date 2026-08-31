// Estados de Cuenta (personal): historial del inquilino logueado
// con filtro y descarga de recibo (respuestas 6 y 11).

import { useMemo, useState } from 'react'
import Card from '../components/Card'
import Table from '../components/Table'
import Badge from '../components/Badge'
import Button from '../components/Button'
import PageHeader from '../components/PageHeader'
import { useAuth } from '../hooks/useAuth'
import { useEstadoCuenta } from '../hooks/useEstadosCuenta'
import { formatMoney, formatFecha } from '../utils/format'
import { IconoRecibo, IconoDescarga } from '../components/Icons'

export default function EstadosCuenta() {
  const { usuario } = useAuth()
  const estado = useEstadoCuenta(usuario?.id)
  const [filtro, setFiltro] = useState('')

  const historial = estado?.historial || []
  const periodos = useMemo(() => [...new Set(historial.map((h) => h.periodo.slice(0, 4)))], [historial])

  const filtrados = filtro ? historial.filter((h) => h.periodo.startsWith(filtro)) : historial

  const totalAdeudo = historial.reduce((s, h) => s + h.adeudo, 0)

  const columns = [
    { key: 'mes', label: 'Mes/Periodo', render: (m, row) => (
        <div>
          <p className="font-medium text-navy-800">{m}</p>
          <p className="text-xs text-slate-400">{row.periodo}</p>
        </div>
      ) },
    { key: 'cuota', label: 'Cuota', align: 'right', render: (c) => <span>{formatMoney(c)}</span> },
    {
      key: 'pagado',
      label: 'Estatus',
      render: (pagado) =>
        pagado ? <Badge tone="success">Pagado</Badge> : <Badge tone="danger">Pendiente</Badge>,
    },
    { key: 'fechaPago', label: 'Fecha de pago', render: (f) => (f ? <span className="text-slate-600">{formatFecha(f)}</span> : <span className="text-slate-300">—</span>) },
    {
      key: 'recibo',
      label: 'Recibo',
      align: 'center',
      render: (r) =>
        r ? (
          <Button
            variant="secondary"
            onClick={() => descargarRecibo(estado, r)}
            className="px-3 py-1.5 text-xs"
          >
            <IconoDescarga /> Descargar
          </Button>
        ) : (
          <span className="text-slate-300">—</span>
        ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mi estado de cuenta"
        description={`Unidad ${usuario?.numero} · ${usuario?.propietario}`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
            Adeudo actual
          </p>
          <p className={`text-3xl font-extrabold ${totalAdeudo > 0 ? 'text-red-600' : 'text-accent-600'}`}>
            {formatMoney(totalAdeudo)}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
            Próximo vencimiento
          </p>
          <p className="text-3xl font-extrabold text-navy-900">5 de cada mes</p>
          <p className="text-sm text-slate-500 mt-1">Cuota mensual de {formatMoney(1850)}</p>
        </Card>
        <Card className="flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 text-accent-600 text-xl">
              <IconoRecibo />
            </div>
            <p className="text-sm text-slate-500">
              Los recibos se descargan desde cada fila pagada.
            </p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-bold text-navy-900">Historial de pagos</h3>
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent-400"
          >
            <option value="">Todos los años</option>
            {periodos.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <Table columns={columns} rows={filtrados} emptyText="Sin registros para este periodo." />
      </Card>
    </div>
  )
}

// Descarga de recibo (simulado): genera un PDF descriptivo local
// y lo descarga. En producción apunta a Firebase Storage.
function descargarRecibo(estado, nombreArchivo) {
  const mes = estado.historial.find((h) => h.recibo === nombreArchivo)
  const contenido = `
RECIBO DE PAGO DE CUOTA — ${mes?.mes || ''}
Torre Residencial Mirador
Unidad: ${estado.numero}
Propietario: ${estado.propietario}
Concepto: Cuota mensual
Monto: ${formatMoney(mes?.cuota || 0)}
Fecha de pago: ${mes?.fechaPago || ''}

*Documento de demostración. En producción se genera un PDF real o
se descarga desde Firebase Storage. La integración de Google Sheets
poblaria este recibo con datos reales.*
  `.trim()

  const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = nombreArchivo.replace('.pdf', '.txt') + '.txt'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
