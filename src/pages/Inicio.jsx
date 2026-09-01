// Página de inicio (pública, default). Muestra ÚNICAMENTE datos no
// confidenciales: saldo del fondo con cuenta enmascarada, deudores,
// asamblea reciente, documentos y avisos. Accesible sin iniciar sesión.
// Mobile-first: contenido en tarjetas apiladas, flujo de una columna.

import { Link } from 'react-router-dom'
import Card from '../components/Card'
import StatCard from '../components/StatCard'
import Badge from '../components/Badge'
import Button from '../components/Button'
import VersionLabel from '../components/VersionLabel'
import { TORRE } from '../config/torre'
import { useFinanzas } from '../hooks/useFinanzas'
import { useAvisos } from '../hooks/useAvisos'
import { useDocumentos } from '../hooks/useDocumentos'
import { formatMoney, formatFechaLarga } from '../utils/format'
import {
  IconoDolar,
  IconoEdificio,
  IconoAviso,
  IconoDocumento,
  IconoChevron,
  IconoCalendario,
  IconoUsuario,
} from '../components/Icons'

// Enmascara la cuenta: muestra solo los últimos 4 dígitos (ej. ***1233).
function cuentaEnmascarada(cuenta = '') {
  const ultimos4 = cuenta.slice(-4)
  return `***${ultimos4}`
}

export default function Inicio() {
  const { fondo, ingresos, egresos, morosas } = useFinanzas()
  const { avisos: todosLosAvisos } = useAvisos()
  const { documentos: todosLosDocs, asamblea } = useDocumentos()

  const documentos = (todosLosDocs || []).slice(0, 4)
  const avisos = (todosLosAvisos || []).slice(0, 3)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8 space-y-6 pb-8">
      {/* Hero */}
      <section className="rounded-2xl bg-navy-800 p-6 text-white shadow-card">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-600 text-xl">
            <IconoEdificio />
          </div>
          <div>
            <h1 className="text-lg font-extrabold leading-tight">{TORRE.nombre}</h1>
            <p className="text-xs text-slate-300">{TORRE.direccion}</p>
          </div>
        </div>
        <p className="text-sm text-slate-200">
          Portal transparente de nuestra comunidad. Aquí encuentras la información general
          de la torre, sin necesidad de buscar en chats.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/login">
            <Button className="px-4 py-2 text-sm">Iniciar sesión</Button>
          </Link>
        </div>
      </section>

      {/* Saldo del fondo (público) */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Fondo común
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Dinero en la cuenta + cuenta bancaria enmascarada = un mismo dato */}
          <Card className="col-span-2" hover>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
                  Dinero en la cuenta
                </p>
                <p className="text-3xl font-extrabold leading-tight text-accent-600 dark:text-accent-400">
                  {formatMoney(fondo?.saldoTotal)}
                </p>
                <p className="mt-1 font-mono text-sm font-semibold text-navy-800 dark:text-navy-200">
                  En cuenta {cuentaEnmascarada(fondo?.cuentaBancaria)}
                </p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-600 text-2xl dark:bg-navy-800 dark:text-navy-200">
                <IconoDolar />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              La cuenta se muestra enmascarada (solo últimos 4 dígitos) por transparencia; los
              dígitos completos los ve la administración.
            </p>
          </Card>
          <StatCard
            label="Ingresos (mes)"
            value={formatMoney(ingresos)}
            sub={fondo?.mesActual}
            icon={<IconoDolar />}
          />
          <StatCard
            label="Gastos (mes)"
            value={formatMoney(egresos)}
            sub={fondo?.mesActual}
            variant="danger"
            icon={<IconoDolar />}
          />
        </div>
      </section>

      {/* Deudores */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Unidades deudoras
        </h2>
        {morosas.length > 0 ? (
          <Card className="border-amber-200 bg-amber-50/40 dark:border-amber-500/30 dark:bg-amber-500/10">
            <ul className="divide-y divide-amber-100 dark:divide-amber-500/20">
              {morosas.map((m) => (
                <li key={m.numero} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="font-medium text-navy-800 dark:text-slate-100">Unidad {m.numero}</span>
                  <Badge tone="danger">{formatMoney(m.adeudo)}</Badge>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Por transparencia solo se muestra el número de unidad y el monto, sin datos
              sensibles adicionales.
            </p>
          </Card>
        ) : (
          <Card className="text-center text-sm text-slate-500 dark:text-slate-400">
            Todas las unidades están al corriente 🎉
          </Card>
        )}
      </section>

      {/* Última asamblea */}
      {asamblea && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Última asamblea
            </h2>
            <Link to="/documentos" className="inline-flex items-center gap-1 text-sm font-semibold text-accent-600 hover:underline">
              Todas <IconoChevron />
            </Link>
          </div>
          <Card className="border-accent-200 bg-gradient-to-br from-white to-accent-50/40 dark:border-accent-500/30 dark:from-navy-900 dark:to-navy-800">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-600 text-white">
                <IconoCalendario />
              </span>
              <Badge tone="accent">Asamblea reciente</Badge>
            </div>
            <h3 className="font-bold text-navy-900 dark:text-white">{asamblea.titulo}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{formatFechaLarga(asamblea.fecha)}</p>
            {asamblea.resumenAcuerdos && (
              <ul className="mt-3 space-y-1.5">
                {asamblea.resumenAcuerdos.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                    {a}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>
      )}

      {/* Documentos */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Documentos
          </h2>
          <Link to="/documentos" className="inline-flex items-center gap-1 text-sm font-semibold text-accent-600 hover:underline">
            Ver todo <IconoChevron />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {documentos.map((d) => (
            <Card key={d.id} hover className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-600 text-lg dark:bg-navy-800 dark:text-navy-200">
                  <IconoDocumento />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-400 dark:text-slate-500">{d.tipo}</p>
                  <p className="font-semibold text-navy-900 leading-snug dark:text-slate-100">{d.titulo}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{formatFechaLarga(d.fecha)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Avisos */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Últimos avisos
          </h2>
          <Link to="/avisos" className="inline-flex items-center gap-1 text-sm font-semibold text-accent-600 hover:underline">
            Ver todo <IconoChevron />
          </Link>
        </div>
        <div className="space-y-3">
          {avisos.map((a) => (
            <Card key={a.id} hover className="p-4">
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base ${a.importante ? 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400' : 'bg-navy-50 text-navy-600 dark:bg-navy-800 dark:text-navy-200'}`}>
                  <IconoAviso />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-navy-900 leading-snug dark:text-slate-100">{a.titulo}</p>
                    {a.importante && <Badge tone="danger">Importante</Badge>}
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{formatFechaLarga(a.fecha)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Acceso a área privada */}
      <section className="rounded-2xl bg-navy-800 p-6 text-white text-center shadow-card">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-2xl">
          <IconoUsuario />
        </div>
        <h3 className="text-lg font-bold">¿Eres residente?</h3>
        <p className="mt-1 text-sm text-slate-200">
          Inicia sesión para ver tu estado de cuenta, pagos y documentos confidenciales de tu
          unidad.
        </p>
        <Link to="/login" className="mt-4 inline-block">
          <Button>Entrar a mi cuenta</Button>
        </Link>
      </section>

      <div className="pt-2 text-center">
        <VersionLabel />
      </div>
      </div>
    </div>
  )
}
