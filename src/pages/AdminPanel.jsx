// Panel de Administrador (módulo 9). Visible solo con rol admin.
// Formularios para: avisos, documentos, gastos y estados de cuenta.
// En este demo los cambios se mantienen en memoria del componente;
// en producción se escribirían en Firestore (poblada desde Google Sheets).

import { useState } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import Badge from '../components/Badge'
import Table from '../components/Table'
import PageHeader from '../components/PageHeader'
import {
  getAvisos,
  getGastosMes,
  getUnidades,
  getEstadoCuentaPorUnidad,
  TORRE,
} from '../services/mockData'
import { formatMoney } from '../utils/format'

const AVISO_VACIO = { titulo: '', fecha: new Date().toISOString().slice(0, 10), importante: false, contenido: '' }
const GASTO_VACIO = { concepto: '', categoria: 'Mantenimiento', monto: '', fecha: new Date().toISOString().slice(0, 10) }

export default function AdminPanel() {
  const [aviso, setAviso] = useState(AVISO_VACIO)
  const [gasto, setGasto] = useState(GASTO_VACIO)
  const [avisoMsg, setAvisoMsg] = useState('')
  const [gastoMsg, setGastoMsg] = useState('')
  const [docMsg, setDocMsg] = useState('')
  const unidades = getUnidades()

  const avisos = getAvisos()
  const gastos = getGastosMes()

  const handleAviso = (e) => {
    e.preventDefault()
    setAvisoMsg(`¡Aviso publicado! (demo): «${aviso.titulo}»`)
    setAviso(AVISO_VACIO)
  }

  const handleGasto = (e) => {
    e.preventDefault()
    setGastoMsg(`¡Gasto registrado! (demo): «${gasto.concepto}» por ${formatMoney(Number(gasto.monto))}`)
    setGasto(GASTO_VACIO)
  }

  const handleDoc = (e) => {
    e.preventDefault()
    setDocMsg('Documento subido (demo). En producción iría a Firebase Storage.')
  }

  const cambiarPago = (unidadId, periodo) => {
    // Demo: solo muestra un mensaje; no muta datos reales.
    alert(`(Demo) Se marcaría como pagado el periodo ${periodo} de la unidad ${unidadId}. En producción se escribirá en Firestore / Sheets.`)
  }

  const unidadesMorosas = unidades
    .map((u) => {
      const est = getEstadoCuentaPorUnidad(u.id)
      const adeudo = (est?.historial || []).reduce((s, h) => s + h.adeudo, 0)
      return { ...u, adeudo }
    })
    .filter((u) => u.adeudo > 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Panel de administración"
        description="Gestiona avisos, documentos, gastos y estados de cuenta."
      />

      <NoticeSheets />

      {/* Avisos */}
      <Card>
        <h3 className="mb-3 font-bold text-navy-900">Publicar nuevo aviso</h3>
        <form onSubmit={handleAviso} className="space-y-3">
          <Field label="Título">
            <input
              className={inputCls}
              value={aviso.titulo}
              onChange={(e) => setAviso({ ...aviso, titulo: e.target.value })}
              placeholder="Título del comunicado"
              required
            />
          </Field>
          <Field label="Contenido">
            <textarea
              className={inputCls}
              rows={3}
              value={aviso.contenido}
              onChange={(e) => setAviso({ ...aviso, contenido: e.target.value })}
              placeholder="Redacta el comunicado…"
              required
            />
          </Field>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={aviso.importante}
              onChange={(e) => setAviso({ ...aviso, importante: e.target.checked })}
            />
            Marcar como importante
          </label>
          <Button type="submit">Publicar aviso</Button>
          {avisoMsg && <p className="text-sm text-accent-600">{avisoMsg}</p>}
        </form>
      </Card>

      {/* Documentos */}
      <Card>
        <h3 className="mb-3 font-bold text-navy-900">Subir documento</h3>
        <form onSubmit={handleDoc} className="space-y-3">
          <Field label="Tipo de documento">
            <select className={inputCls}>
              <option>Acta de Asamblea</option>
              <option>Reglamento</option>
              <option>Estado Financiero</option>
              <option>Otro</option>
            </select>
          </Field>
          <Field label="Título">
            <input className={inputCls} placeholder="Nombre del documento" required />
          </Field>
          <Field label="Archivo">
            <input type="file" className={inputCls} />
          </Field>
          <Button type="submit">Subir documento</Button>
          {docMsg && <p className="text-sm text-accent-600">{docMsg}</p>}
          <p className="text-xs text-slate-400">
            Demo sin carga real de archivos. En producción se usa Firebase Storage.
          </p>
        </form>
      </Card>

      {/* Gastos */}
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold text-navy-900">Registrar gasto del mes</h3>
          <span className="text-xs text-slate-400">{gastos.length} registrados</span>
        </div>
        <form onSubmit={handleGasto} className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Concepto">
            <input
              className={inputCls}
              value={gasto.concepto}
              onChange={(e) => setGasto({ ...gasto, concepto: e.target.value })}
              placeholder="Ej. Plomería"
              required
            />
          </Field>
          <Field label="Categoría">
            <select
              className={inputCls}
              value={gasto.categoria}
              onChange={(e) => setGasto({ ...gasto, categoria: e.target.value })}
            >
              <option>Mantenimiento</option>
              <option>Seguridad</option>
              <option>Limpieza</option>
              <option>Servicios</option>
            </select>
          </Field>
          <Field label="Monto (MXN)">
            <input
              type="number"
              min="0"
              className={inputCls}
              value={gasto.monto}
              onChange={(e) => setGasto({ ...gasto, monto: e.target.value })}
              placeholder="0"
              required
            />
          </Field>
          <Field label="Fecha">
            <input
              type="date"
              className={inputCls}
              value={gasto.fecha}
              onChange={(e) => setGasto({ ...gasto, fecha: e.target.value })}
            />
          </Field>
          <div className="sm:col-span-2 lg:col-span-4">
            <Button type="submit">Registrar gasto</Button>
            {gastoMsg && <p className="mt-2 text-sm text-accent-600">{gastoMsg}</p>}
          </div>
        </form>
        <Table
          columns={[
            { key: 'concepto', label: 'Concepto' },
            { key: 'categoria', label: 'Categoría' },
            { key: 'monto', label: 'Monto', align: 'right', render: (m) => <span className="font-semibold">{formatMoney(m)}</span> },
            { key: 'fecha', label: 'Fecha' },
          ]}
          rows={gastos.slice(0, 6)}
        />
      </Card>

      {/* Estados de cuenta */}
      <Card>
        <h3 className="mb-3 font-bold text-navy-900">Estados de cuenta por unidad</h3>
        <div className="space-y-3">
          {unidades.map((u) => {
            const est = getEstadoCuentaPorUnidad(u.id)
            const pend = (est?.historial || []).filter((h) => !h.pagado)
            return (
              <div key={u.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                <div>
                  <p className="font-semibold text-navy-800">Unidad {u.numero} · {u.propietario}</p>
                  <p className="text-xs text-slate-500">
                    {pend.length > 0
                      ? `Pendientes: ${pend.map((p) => p.mes).join(', ')}`
                      : 'Al corriente'}
                  </p>
                </div>
                {pend.length > 0 ? (
                  <Button
                    variant="secondary"
                    className="px-3 py-1.5 text-xs"
                    onClick={() => cambiarPago(u.numero, pend[0].periodo)}
                  >
                    Marcar pago (demo)
                  </Button>
                ) : (
                  <Badge tone="success">Pagado</Badge>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {/* Morosos resumen */}
      {unidadesMorosas.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/40">
          <h3 className="mb-2 font-bold text-navy-900">Unidades con adeudo</h3>
          <div className="flex flex-wrap gap-2">
            {unidadesMorosas.map((u) => (
              <Badge key={u.id} tone="danger">
                U-{u.numero}: {formatMoney(u.adeudo)}
              </Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

function NoticeSheets() {
  return (
    <Card className="border-dashed border-2 border-slate-200 bg-slate-50">
      <p className="text-sm text-slate-600">
        <span className="font-semibold text-navy-800">Nota:</span> En este demo los datos son de
        ejemplo. En producción, esta información se alimentaría automáticamente desde{' '}
        <span className="font-semibold">Google Sheets</span> mediante una sincronización hacia
        Firebase ({TORRE.administrador} mantendría la hoja de cálculo y el portal reflejaría los
        cambios).
      </p>
    </Card>
  )
}

const inputCls =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-200'

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-600">{label}</span>
      {children}
    </label>
  )
}
