// ============================================================
//  services/finanzas.service.js — FINANZAS DEL FONDO COMÚN
//  ============================================================
//  Expone el saldo del fondo, los gastos e ingresos del mes y las
//  unidades morosas. Modo demo: usa mockData. Modo producción:
//  lee de Appwrite Database (colecciones 'gastos' y 'pagos').
//  Cada función tiene UNA responsabilidad.
// ============================================================

import { databases } from '../config/appwrite'
import { APPWRITE_CONFIGURED } from '../config/appwrite'
import {
  getFondoComun as getFondoMock,
  getGastosMes as getGastosMock,
  getPagosMes as getPagosMock,
  getUnidadesMorosas as getMorosasMock,
  calcularTotales as calcularTotalesMock,
} from './mockData'

/** Datos generales del fondo común (saldo, cuenta, mes). */
export async function getFondoComun() {
  if (!APPWRITE_CONFIGURED) return getFondoMock()
  // TODO(producción):
  //   const doc = await databases.getDocument(databaseId, collectionFondo, DOC_ID)
  //   return { saldoTotal: doc.saldo, cuentaBancaria: doc.cuenta, mesActual: doc.mes }
  return getFondoMock()
}

/** Lista de gastos (egresos) del mes. */
export async function getGastosMes() {
  if (!APPWRITE_CONFIGURED) return getGastosMock()
  // const res = await databases.listDocuments(DB, COLLECTION_GASTOS, [Query.equal('mes', MES)])
  // return res.documents.map(mapper)
  return getGastosMock()
}

/** Lista de pagos (cuotas recibidas) del mes. */
export async function getPagosMes() {
  if (!APPWRITE_CONFIGURED) return getPagosMock()
  return getPagosMock()
}

/** Lista de unidades con adeudo: { numero, adeudo }. */
export async function getUnidadesMorosas() {
  if (!APPWRITE_CONFIGURED) return getMorosasMock()
  return getMorosasMock()
}

/** Totales calculados: ingresos, egresos, saldo, saldoOperativo. */
export async function calcularTotales() {
  if (!APPWRITE_CONFIGURED) return calcularTotalesMock()
  const [gastos, pagos, fondo] = await Promise.all([
    getGastosMes(),
    getPagosMes(),
    getFondoComun(),
  ])
  const ingresos = pagos.reduce((s, p) => s + p.monto, 0)
  const egresos = gastos.reduce((s, g) => s + g.monto, 0)
  return {
    ingresos,
    egresos,
    saldo: fondo.saldoTotal,
    saldoOperativo: fondo.saldoTotal + ingresos - egresos,
  }
}

/** Registra un gasto (panel admin). */
export async function crearGasto({ concepto, categoria, monto, fecha, facturaId = null }) {
  if (!APPWRITE_CONFIGURED) {
    return { id: `g-${Date.now()}`, concepto, categoria, monto: Number(monto), fecha, facturaId }
  }
  // const res = await databases.createDocument(databaseId, collectionGastos, ID.unique(), {
  //   concepto, categoria, monto: Number(monto), fecha, facturaId,
  // })
  return { id: `g-${Date.now()}`, concepto, categoria, monto: Number(monto), fecha, facturaId }
}
