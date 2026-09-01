// ============================================================
//  services/estadosCuenta.service.js — ESTADOS DE CUENTA Y UNIDADES
//  ============================================================
//  Expone el estado de cuenta de una unidad y la lista de unidades.
//  Modo demo: usa mockData. Modo producción: lee de Appwrite
//  Database (colecciones 'unidades' y 'estados_cuenta').
//  Cada función tiene UNA responsabilidad.
// ============================================================

import { APPWRITE_CONFIG, APPWRITE_CONFIGURED, callFunction } from '../config/appwrite'
import {
  getEstadoCuentaPorUnidad as getEstadoMock,
  getUnidades as getUnidadesMock,
  getUnidadesConEstado as getUnidadesConEstadoMock,
} from './mockData'

/** Lista de unidades (sin datos sensibles como contraseñas). */
export async function listUnidades() {
  if (!APPWRITE_CONFIGURED) return getUnidadesMock()
  const res = await callFunction('listar_unidades')
  return res.unidades
}

/**
 * Lista de unidades enriquecidas con su estado (adeudo y meses
 * pendientes). Usado en el panel de administración.
 */
export async function listUnidadesConEstado() {
  if (!APPWRITE_CONFIGURED) return getUnidadesConEstadoMock()
  const res = await callFunction('listar_unidades_estado')
  return res.unidades
}

/** Estado de cuenta completo de una unidad (historial mensual). */
export async function getEstadoCuenta(unidadId) {
  if (!APPWRITE_CONFIGURED) return getEstadoMock(unidadId)
  // En production unidadId es el número de unidad; la function
  // resuelve además los datos de la unidad y el historial.
  const res = await callFunction('get_estado_cuenta', { numero: unidadId })
  return res.estado
}

export { APPWRITE_CONFIG }
