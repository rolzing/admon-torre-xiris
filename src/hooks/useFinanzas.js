// ============================================================
//  hooks/useFinanzas.js — DATOS DE FINANZAS
//  ============================================================
//  Carga (async) el saldo del fondo, gastos, ingresos y morosidad
//  desde services/finanzas.service.js (Appwrite o mock).
// ============================================================

import { useEffect, useState } from 'react'
import {
  getFondoComun,
  getGastosMes,
  getPagosMes,
  getUnidadesMorosas,
  calcularTotales,
} from '../services/finanzas.service'

export function useFinanzas() {
  const [data, setData] = useState({
    fondo: {},
    gastos: [],
    pagos: [],
    morosas: [],
    ingresos: 0,
    egresos: 0,
    saldo: 0,
    saldoOperativo: 0,
    loading: true,
  })

  useEffect(() => {
    let active = true
    ;(async () => {
      const [fondo, gastos, pagos, morosas, totales] = await Promise.all([
        getFondoComun(),
        getGastosMes(),
        getPagosMes(),
        getUnidadesMorosas(),
        calcularTotales(),
      ])
      if (!active) return
      setData({
        fondo,
        gastos,
        pagos,
        morosas,
        ingresos: totales.ingresos,
        egresos: totales.egresos,
        saldo: totales.saldo,
        saldoOperativo: totales.saldoOperativo,
        loading: false,
      })
    })()
    return () => {
      active = false
    }
  }, [])

  return data
}
