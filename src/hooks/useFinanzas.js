// ============================================================
//  hooks/useFinanzas.js
//  ============================================================
//  Expone saldo del fondo, gastos e ingresos del mes, y las
//  unidades morosas. En producción provendría de Firestore.
// ============================================================

import { useMemo } from 'react'
import {
  getFondoComun,
  getGastosMes,
  getPagosMes,
  getUnidadesMorosas,
  calcularTotales,
} from '../services/mockData'

export function useFinanzas() {
  return useMemo(() => {
    const totales = calcularTotales()
    return {
      fondo: getFondoComun(),
      gastos: getGastosMes(),
      pagos: getPagosMes(),
      morosas: getUnidadesMorosas(),
      ...totales,
    }
  }, [])
}
