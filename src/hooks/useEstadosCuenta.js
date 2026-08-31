// ============================================================
//  hooks/useEstadosCuenta.js
//  ============================================================
//  Expone el estado de cuenta de la unidad del usuario logueado,
//  así como la lista de unidades morosas (vista general).
//  En producción, estas lecturas provendrían de Firestore.
// ============================================================

import { useMemo } from 'react'
import { getEstadoCuentaPorUnidad, getUnidadesMorosas } from '../services/mockData'

export function useEstadoCuenta(unidadId) {
  return useMemo(() => getEstadoCuentaPorUnidad(unidadId), [unidadId])
}

export function useUnidadesMorosas() {
  return useMemo(() => getUnidadesMorosas(), [])
}
