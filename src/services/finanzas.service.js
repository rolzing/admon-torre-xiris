// ============================================================
//  services/finanzas.service.js — FINANZAS DEL FONDO COMÚN
//  ============================================================
//  Expone el saldo del fondo, los gastos e ingresos del mes y las
//  unidades morosas. Modo demo: usa mockData. Modo producción:
//  lee de Appwrite Database (colecciones 'gastos' y 'pagos').
//  Cada función tiene UNA responsabilidad.
// ============================================================

import { APPWRITE_CONFIGURED, callFunction } from '../config/appwrite'
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
  const res = await callFunction('get_fondo')
  return res.fondo
}

/** Lista de gastos (egresos). */
export async function getGastosMes() {
  if (!APPWRITE_CONFIGURED) return getGastosMock()
  const res = await callFunction('listar_gastos')
  return res.gastos
}

/** Lista de pagos (cuotas recibidas). */
export async function getPagosMes() {
  if (!APPWRITE_CONFIGURED) return getPagosMock()
  const res = await callFunction('listar_pagos')
  return res.pagos
}

/** Lista de unidades con adeudo: { numero, adeudo }. */
export async function getUnidadesMorosas() {
  if (!APPWRITE_CONFIGURED) return getMorosasMock()
  const res = await callFunction('listar_unidades_estado')
  return res.unidades
    .map((u) => ({ numero: u.numero, adeudo: u.adeudo }))
    .filter((u) => u.adeudo > 0)
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
  // Operación administrativa: delegada a la Appwrite Function (servidor).
  const res = await callFunction('crear_gasto', {
    concepto, categoria, monto: Number(monto), fecha, facturaId,
  })
  return { id: res.id, concepto, categoria, monto: Number(monto), fecha, facturaId }
}
