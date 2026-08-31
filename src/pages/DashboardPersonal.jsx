// Dashboard personal del inquilino: mi saldo, próximo pago y
// últimos movimientos.

import { Link } from 'react-router-dom'
import Card from '../components/Card'
import StatCard from '../components/StatCard'
import { useAuth } from '../hooks/useAuth'
import { useEstadoCuenta } from '../hooks/useEstadosCuenta'
import { formatMoney, formatFecha } from '../utils/format'
import { IconoRecibo, IconoReloj } from '../components/Icons'

export default function DashboardPersonal() {
  const { usuario } = useAuth()
  const { estado } = useEstadoCuenta(usuario?.id)
  const historial = estado?.historial || []

  const totalAdeudo = historial.reduce((s, h) => s + h.adeudo, 0)
  const ultimosPagados = historial.filter((h) => h.pagado).slice(0, 3)
  const proximoPendiente = historial.find((h) => !h.pagado)

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold text-navy-900">Mi panel</h1>
        <p className="text-slate-500">
          Unidad {usuario?.numero} · {usuario?.propietario}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Mi adeudo actual"
          value={formatMoney(totalAdeudo)}
          sub={totalAdeudo > 0 ? 'Te recomendamos ponerte al corriente' : 'Estás al corriente'}
          variant={totalAdeudo > 0 ? 'danger' : 'accent'}
          icon={<IconoRecibo />}
        />
        <StatCard
          label="Próximo pago"
          value="5 de cada mes"
          sub={proximoPendiente ? proximoPendiente.mes : 'Sin pendientes'}
          icon={<IconoReloj />}
        />
        <Card className="flex flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
            Cuota mensual
          </p>
          <p className="text-3xl font-extrabold text-navy-900">{formatMoney(1850)}</p>
          <p className="text-sm text-slate-500 mt-1">Fondo de reserva: {formatMoney(500)} extra</p>
        </Card>
      </div>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold text-navy-900">Mis últimos movimientos</h3>
          <Link to="/estado-de-cuenta" className="text-sm font-semibold text-accent-600 hover:underline">
            Ver historial completo
          </Link>
        </div>
        <ul className="divide-y divide-slate-100">
          {ultimosPagados.map((m) => (
            <li key={m.periodo} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-navy-800">{m.mes}</p>
                <p className="text-xs text-slate-400">Pagado el {formatFecha(m.fechaPago)}</p>
              </div>
              <span className="font-semibold text-accent-600">{formatMoney(m.cuota)}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
