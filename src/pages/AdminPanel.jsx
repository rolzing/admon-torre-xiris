// Panel de Administrador (módulo 9). Visible solo con rol admin.
// Formularios para: avisos, documentos, gastos y estados de cuenta.
// En este demo las escrituras se mantienen en memoria (mock); en
// producción registrarían en Appwrite Database + Storage.

import { useState } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import Badge from '../components/Badge'
import Table from '../components/Table'
import PageHeader from '../components/PageHeader'
import MonthPicker from '../components/MonthPicker'
import { TORRE } from '../config/torre'
import { useAvisos } from '../hooks/useAvisos'
import { useFinanzas } from '../hooks/useFinanzas'
import { useUnidades } from '../hooks/useEstadosCuenta'
import { crearAviso } from '../services/avisos.service'
import { crearGasto } from '../services/finanzas.service'
import { crearDocumento } from '../services/documentos.service'
import { subirArchivo } from '../services/storage.service'
import { formatMoney } from '../utils/format'

const AVISO_VACIO = { titulo: '', fecha: new Date().toISOString().slice(0, 10), importante: false, contenido: '', imagenes: [] }
const GASTO_VACIO = { concepto: '', categoria: 'Mantenimiento', monto: '', fecha: new Date().toISOString().slice(0, 10), factura: null }
const DOC_VACIO = { tipo: 'Acta de Asamblea', titulo: '', mes: '', archivo: null }

export default function AdminPanel() {
  const { avisos } = useAvisos()
  const { gastos } = useFinanzas()
  const { unidades } = useUnidades()

  const [aviso, setAviso] = useState(AVISO_VACIO)
  const [gasto, setGasto] = useState(GASTO_VACIO)
  const [doc, setDoc] = useState(DOC_VACIO)
  const [avisoMsg, setAvisoMsg] = useState('')
  const [gastoMsg, setGastoMsg] = useState('')
  const [docMsg, setDocMsg] = useState('')

  const unidadesMorosas = (unidades || []).filter((u) => (u.adeudo || 0) > 0)

  const agregarImagenAviso = (file) => {
    setAviso((prev) => {
      if (prev.imagenes.length >= 2) return prev
      const preview = URL.createObjectURL(file)
      return { ...prev, imagenes: [...prev.imagenes, { file, preview }] }
    })
  }

  const quitarImagenAviso = (idx) => {
    setAviso((prev) => {
      const imagenes = prev.imagenes.filter((_, i) => i !== idx)
      return { ...prev, imagenes }
    })
  }

  const handleAviso = async (e) => {
    e.preventDefault()
    const fileIds = []
    for (const img of aviso.imagenes) {
      const uploaded = await subirArchivo(img.file, img.file.name, img.file.type)
      fileIds.push(uploaded.fileId)
    }
    await crearAviso({ ...aviso, imagenes: fileIds })
    aviso.imagenes.forEach((img) => URL.revokeObjectURL(img.preview))
    setAvisoMsg(`¡Aviso publicado! (demo): «${aviso.titulo}»`)
    setAviso(AVISO_VACIO)
  }

  const handleGasto = async (e) => {
    e.preventDefault()
    let facturaId = null
    if (gasto.factura) {
      const uploaded = await subirArchivo(gasto.factura, gasto.factura.name, gasto.factura.type)
      facturaId = uploaded.fileId
    }
    await crearGasto({ ...gasto, monto: Number(gasto.monto), facturaId })
    setGastoMsg(`¡Gasto registrado! (demo): «${gasto.concepto}» por ${formatMoney(Number(gasto.monto))}`)
    setGasto(GASTO_VACIO)
  }

  const handleDoc = async (e) => {
    e.preventDefault()
    const base = {
      titulo: doc.titulo,
      tipo: doc.tipo,
      mes: doc.mes || null,
      fecha: new Date().toISOString().slice(0, 10),
    }
    if (doc.archivo) {
      const uploaded = await subirArchivo(doc.archivo, doc.archivo.name, doc.archivo.type)
      await crearDocumento({ ...base, fileId: uploaded.fileId })
    } else {
      await crearDocumento({ ...base })
    }
    setDocMsg('Documento subido (demo). En producción se guardará en Appwrite Storage + Database.')
    setDoc(DOC_VACIO)
  }

  const cambiarPago = (unidadId, periodo) => {
    alert(`(Demo) Se marcaría como pagado el periodo ${periodo} de la unidad ${unidadId}. En producción se escribirá en Appwrite.`)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Panel de administración"
        description="Gestiona avisos, documentos, gastos y estados de cuenta."
      />

      <NoticeBackend />

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

          <div>
            <span className="mb-1 block text-sm font-medium text-slate-600">
              Imágenes (máximo 2)
            </span>
            <div className="flex flex-wrap items-center gap-3">
              {aviso.imagenes.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={img.preview}
                    alt={`aviso-${i + 1}`}
                    className="h-20 w-20 rounded-xl border border-slate-200 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => quitarImagenAviso(i)}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs text-white shadow"
                    title="Quitar imagen"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {aviso.imagenes.length < 2 && (
                <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-slate-400 hover:border-accent-400 hover:text-accent-500">
                  <span className="text-xl">+</span>
                  <span className="text-[10px]">Foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) agregarImagenAviso(file)
                      e.target.value = ''
                    }}
                  />
                </label>
              )}
            </div>
            {aviso.imagenes.length >= 2 && (
              <p className="mt-1 text-xs text-slate-400">Máximo 2 fotos.</p>
            )}
          </div>

          <Button type="submit">Publicar aviso</Button>
          {avisoMsg && <p className="text-sm text-accent-600">{avisoMsg}</p>}
        </form>
      </Card>

      {/* Documentos */}
      <Card>
        <h3 className="mb-3 font-bold text-navy-900">Subir documento</h3>
        <form onSubmit={handleDoc} className="space-y-3">
          <Field label="Tipo de documento">
            <select
              className={inputCls}
              value={doc.tipo}
              onChange={(e) => setDoc({ ...doc, tipo: e.target.value })}
            >
              <option>Acta de Asamblea</option>
              <option>Reglamento</option>
              <option>Estado Financiero</option>
              <option>Estado de Cuenta</option>
              <option>Otro</option>
            </select>
          </Field>

          {doc.tipo === 'Estado de Cuenta' && (
            <Field label="Mes del estado de cuenta">
              <MonthPicker value={doc.mes} onChange={(mes) => setDoc({ ...doc, mes })} />
            </Field>
          )}

          <Field label="Título">
            <input
              className={inputCls}
              value={doc.titulo}
              onChange={(e) => setDoc({ ...doc, titulo: e.target.value })}
              placeholder={
                doc.tipo === 'Estado de Cuenta' ? 'Ej. Estado de cuenta · Agosto 2026' : 'Nombre del documento'
              }
            />
          </Field>
          <Field label="Archivo">
            <input type="file" className={inputCls} onChange={(e) => setDoc({ ...doc, archivo: e.target.files?.[0] || null })} />
          </Field>
          <Button type="submit">Subir documento</Button>
          {docMsg && <p className="text-sm text-accent-600">{docMsg}</p>}
          <p className="text-xs text-slate-400">
            Demo sin carga real de archivos. En producción se usa Appwrite Storage.
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
            <span className="mb-1 block text-sm font-medium text-slate-600">
              Factura (archivo)
            </span>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-white px-3 py-3 text-sm text-slate-500 hover:border-accent-400 hover:text-accent-600">
              <span className="text-lg">📎</span>
              {gasto.factura ? (
                <span className="font-medium text-navy-800">{gasto.factura.name}</span>
              ) : (
                <span>Adjuntar factura (PDF o imagen)</span>
              )}
              <input
                type="file"
                accept=".pdf,image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  setGasto((prev) => ({ ...prev, factura: file }))
                }}
              />
            </label>
            {gasto.factura && (
              <button
                type="button"
                onClick={() => setGasto((prev) => ({ ...prev, factura: null }))}
                className="mt-1 text-xs text-red-600 hover:underline"
              >
                Quitar factura
              </button>
            )}
          </div>
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
          {(unidades || []).map((u) => {
            const pend = (u.pendientes || []).filter(Boolean)
            return (
              <div key={u.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                <div>
                  <p className="font-semibold text-navy-800">Unidad {u.numero} · {u.propietario}</p>
                  <p className="text-xs text-slate-500">
                    {pend.length > 0
                      ? `Pendientes: ${pend.join(', ')}`
                      : 'Al corriente'}
                  </p>
                </div>
                {pend.length > 0 ? (
                  <Button
                    variant="secondary"
                    className="px-3 py-1.5 text-xs"
                    onClick={() => cambiarPago(u.numero, pend[0])}
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

function NoticeBackend() {
  return (
    <Card className="border-dashed border-2 border-slate-200 bg-slate-50">
      <p className="text-sm text-slate-600">
        <span className="font-semibold text-navy-800">Nota:</span> En este demo los datos son de
        ejemplo. En producción, esta información se almacenaría en <span className="font-semibold">Appwrite</span>:
        la base de datos (Database) para avisos, gastos y documentos, y Storage para los archivos.
        El panel de {TORRE.administrador} reflejaría los cambios al guardar.
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
