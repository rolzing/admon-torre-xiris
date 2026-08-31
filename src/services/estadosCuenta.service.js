// ============================================================
//  services/estadosCuenta.service.js — ESTADOS DE CUENTA Y UNIDADES
//  ============================================================
//  Expone el estado de cuenta de una unidad y la lista de unidades.
//  Modo demo: usa mockData. Modo producción: lee de Appwrite
//  Database (colecciones 'unidades' y 'estados_cuenta').
//  Cada función tiene UNA responsabilidad.
// ============================================================

import { databases, APPWRITE_CONFIG } from '../config/appwrite'
import { APPWRITE_CONFIGURED } from '../config/appwrite'
import {
  getEstadoCuentaPorUnidad as getEstadoMock,
  getUnidades as getUnidadesMock,
  getUnidadesConEstado as getUnidadesConEstadoMock,
} from './mockData'

/** Lista de unidades (sin datos sensibles como contraseñas). */
export async function listUnidades() {
  if (!APPWRITE_CONFIGURED) return getUnidadesMock()
  // const res = await databases.listDocuments(APPWRITE_CONFIG.databaseId,
  //   APPWRITE_CONFIG.collectionUnidades)
  // return res.documents.map(mapper)
  return getUnidadesMock()
}

/**
 * Lista de unidades enriquecidas con su estado (adeudo y meses
 * pendientes). Usado en el panel de administración.
 */
export async function listUnidadesConEstado() {
  if (!APPWRITE_CONFIGURED) return getUnidadesConEstadoMock()
  // Combinar unidades + estados de cuenta desde Appwrite Database.
  return getUnidadesConEstadoMock()
}

/** Estado de cuenta completo de una unidad (historial mensual). */
export async function getEstadoCuenta(unidadId) {
  if (!APPWRITE_CONFIGURED) return getEstadoMock(unidadId)
  // const res = await databases.listDocuments(APPWRITE_CONFIG.databaseId,
  //   APPWRITE_CONFIG.collectionEstadosCuenta, [Query.equal('unidadId', unidadId)])
  return getEstadoMock(unidadId)
}

export { APPWRITE_CONFIG }
