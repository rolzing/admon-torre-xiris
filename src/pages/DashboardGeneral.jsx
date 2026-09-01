// Dashboard general (visible para todos): métricas clave de la torre
// y accesos rápidos a los módulos.

import { Link } from 'react-router-dom'
import Card from '../components/Card'
import StatCard from '../components/StatCard'
import { useAuth } from '../hooks/useAuth'
import { useFinanzas } from '../hooks/useFinanzas'
import { useAvisos } from '../hooks/useAvisos'
import { useDocumentos } from '../hooks/useDocumentos'
import { formatMoney } from '../utils/format'
import { TORRE } from '../config/torre'
import {
  IconoDolar,
  IconoRecibo,
  IconoAviso,
  IconoDocumento,
  IconoGrafica,
  IconoEdificio,
  IconoChevron,
} from '../components/Icons'

export default function DashboardGeneral() {
  const { usuario, esAdmin } = useAuth()
  const { saldo, ingresos, egresos, fondo, morosas } = useFinanzas()
  const { avisos: avisosRecientes } = useAvisos()
  const { documentos } = useDocumentos()

  const quickLinks = [
    { to: '/finanzas', label: 'Finanzas', desc: 'Gastos, saldo y cuotas', icon: IconoDolar },
    { to: '/estado-de-cuenta', label: 'Mi estado de cuenta', desc: 'Pagos y recibo', icon: IconoRecibo },
    { to: '/avisos', label: 'Avisos', desc: 'Comunicados oficiales', icon: IconoAviso },
    { to: '/documentos', label: 'Documentos', desc: 'Reglamento y actas', icon: IconoDocumento },
    ...(esAdmin ? [{ to: '/admin', label: 'Panel Admin', desc: 'Gestionar contenido', icon: IconoGrafica }] : []),
  ]

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold text-navy-900 dark:text-white">
          Hola, {usuario?.propietario?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400">Unidad {usuario?.numero} · {TORRE.nombre}</p>
      </header>

      {/* Métricas clave de la torre */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          General de la torre
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Saldo del fondo común"
            value={formatMoney(saldo)}
            sub="Disponible para la torre"
            icon={<IconoDolar />}
            variant="accent"
          />
          <StatCard
            label="Gasto del mes"
            value={formatMoney(egresos)}
            sub={fondo.mesActual}
            icon={<IconoEdificio />}
            variant="danger"
          />
          <StatCard
            label="Ingresos del mes"
            value={formatMoney(ingresos)}
            sub="Cuotas recibidas"
            icon={<IconoGrafica />}
          />
          <StatCard
            label="Unidades morosas"
            value={morosas.length}
            sub="Con adeudo pendiente"
            icon={<IconoAviso />}
            variant={morosas.length ? 'danger' : 'muted'}
          />
        </div>
      </section>

      {/* Accesos rápidos */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Accesos rápidos
        </h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {quickLinks.map((q) => (
            <Link key={q.to} to={q.to} className="group block cursor-pointer">
              <Card className="h-full transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-300 hover:shadow-card-hover dark:hover:border-accent-500/50" hover>
                <div className="flex h-full flex-col gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-navy-600 text-xl transition-colors group-hover:bg-accent-50 group-hover:text-accent-600 dark:bg-navy-800 dark:text-navy-200 dark:group-hover:bg-accent-500/20 dark:group-hover:text-accent-300">
                    {q.icon()}
                  </div>
                  <div>
                    <p className="font-bold text-navy-900 dark:text-white">{q.label}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{q.desc}</p>
                  </div>
                  <div className="mt-auto flex items-center gap-1 pt-1 text-sm font-semibold text-accent-600">
                    Ver más
                    <IconoChevron className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Avisos recientes */}
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-bold text-navy-900 dark:text-white">Avisos recientes</h3>
            <Link to="/avisos" className="text-sm font-semibold text-accent-600 hover:underline">
              Ver todos
            </Link>
          </div>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {avisosRecientes.slice(0, 3).map((a) => (
              <li key={a.id} className="py-3">
                <div className="flex items-start gap-2">
                  {a.importante && (
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                  )}
                  <div>
                    <p className="font-medium text-navy-800 dark:text-slate-100">{a.titulo}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{a.fecha}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* Documentos recientes */}
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-bold text-navy-900 dark:text-white">Documentos</h3>
            <Link to="/documentos" className="text-sm font-semibold text-accent-600 hover:underline">
              Ver todos
            </Link>
          </div>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {documentos.slice(0, 4).map((d) => (
              <li key={d.id} className="py-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-600 dark:bg-accent-500/15 dark:text-accent-400">
                    <IconoDocumento />
                  </div>
                  <div>
                    <p className="font-medium text-navy-800 dark:text-slate-100">{d.titulo}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{d.tipo}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
