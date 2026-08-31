// Módulo Finanzas (transparencia): responde las preguntas
// 1, 2, 3, 4 y 5 del requisito funcional.

import { Link } from 'react-router-dom'
import Card from '../components/Card'
import StatCard from '../components/StatCard'
import Table from '../components/Table'
import Badge from '../components/Badge'
import PageHeader from '../components/PageHeader'
import { useFinanzas } from '../hooks/useFinanzas'
import { formatMoney, formatFecha } from '../utils/format'
import { IconoDolar, IconoGrafica, IconoEdificio } from '../components/Icons'

const categoriaTone = (c) => {
  const map = {
    Mantenimiento: 'navy',
    Seguridad: 'warning',
    Limpieza: 'accent',
    Servicios: 'info',
  }
  return map[c] || 'neutral'
}

export default function Finanzas() {
  const { saldo, ingresos, egresos, fondo, morosas, gastos, pagos } = useFinanzas()

  const gastoColumns = [
    { key: 'categoria', label: 'Categoría', render: (c) => <Badge tone={categoriaTone(c)}>{c}</Badge> },
    { key: 'concepto', label: 'Concepto' },
    { key: 'fecha', label: 'Fecha', render: (f) => <span className="text-slate-500">{formatFecha(f)}</span> },
    { key: 'monto', label: 'Monto', align: 'right', render: (m) => <span className="font-semibold">{formatMoney(m)}</span> },
  ]

  const pagoColumns = [
    { key: 'unidad', label: 'Unidad', render: (u) => <span className="font-semibold">U-{u}</span> },
    { key: 'concepto', label: 'Concepto' },
    { key: 'fecha', label: 'Fecha', render: (f) => <span className="text-slate-500">{formatFecha(f)}</span> },
    { key: 'monto', label: 'Monto', align: 'right', render: (m) => <span className="font-semibold text-accent-600">{formatMoney(m)}</span> },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Finanzas"
        description="Transparencia total: en qué se gasta y cómo se mantiene el fondo común."
      />

      {/* Métricas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Saldo total del fondo"
          value={formatMoney(saldo)}
          sub="Disponible hoy"
          icon={<IconoDolar />}
          variant="accent"
        />
        <StatCard
          label="Ingresos del mes"
          value={formatMoney(ingresos)}
          sub={fondo.mesActual}
          icon={<IconoGrafica />}
        />
        <StatCard
          label="Egresos del mes"
          value={formatMoney(egresos)}
          sub={fondo.mesActual}
          icon={<IconoEdificio />}
          variant="danger"
        />
      </div>

      {/* Morosidad */}
      {morosas.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/50">
          <h3 className="mb-2 font-bold text-navy-900">
            Unidades con adeudo pendiente
          </h3>
          <div className="flex flex-wrap gap-2">
            {morosas.map((m) => (
              <Badge key={m.numero} tone="danger">
                Unidad {m.numero} · {formatMoney(m.adeudo)}
              </Badge>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Solo se muestra número de unidad y monto; no se exponen otros datos sensibles.
          </p>
        </Card>
      )}

      {/* Egresos del mes */}
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold text-navy-900">Gastos del mes ({gastos.length})</h3>
          <span className="text-sm font-semibold text-red-600">{formatMoney(egresos)}</span>
        </div>
        <Table columns={gastoColumns} rows={gastos} />
      </Card>

      {/* Ingresos del mes */}
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold text-navy-900">Cuotas recibidas ({pagos.length})</h3>
          <span className="text-sm font-semibold text-accent-600">{formatMoney(ingresos)}</span>
        </div>
        <Table columns={pagoColumns} rows={pagos} />
        <p className="mt-3">
          <Link to="/estado-de-cuenta" className="text-sm font-semibold text-accent-600 hover:underline">
            Ver mi estado de cuenta →
          </Link>
        </p>
      </Card>
    </div>
  )
}
