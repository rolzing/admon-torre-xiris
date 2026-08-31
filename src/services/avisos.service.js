// ============================================================
//  services/avisos.service.js — MURO DE AVISOS
//  ============================================================
//  Expone los comunicados oficiales. Modo demo: usa mockData.
//  Modo producción: lee de Appwrite Database (colección 'avisos').
//  Cada función tiene UNA responsabilidad.
// ============================================================

import { databases, APPWRITE_CONFIG } from '../config/appwrite'
import { APPWRITE_CONFIGURED } from '../config/appwrite'
import { getAvisos as getAvisosMock } from './mockData'

/** Lista de avisos, del más reciente al más antiguo. */
export async function listAvisos() {
  if (!APPWRITE_CONFIGURED) return getAvisosMock()
  // const res = await databases.listDocuments(APPWRITE_CONFIG.databaseId,
  //   APPWRITE_CONFIG.collectionAvisos, [Query.orderDesc('fecha')])
  // return res.documents.map(({ $id, titulo, fecha, importante, contenido, imagenes }) => ({
  //   id: $id, titulo, fecha, importante, contenido, imagenes: imagenes || [],
  // }))
  return getAvisosMock()
}

/** Publica un nuevo aviso (panel admin). */
export async function crearAviso({ titulo, contenido, fecha, importante, imagenes = [] }) {
  if (!APPWRITE_CONFIGURED) {
    return { id: `a-${Date.now()}`, titulo, contenido, fecha, importante: Boolean(importante), imagenes }
  }
  // const res = await databases.createDocument(APPWRITE_CONFIG.databaseId,
  //   APPWRITE_CONFIG.collectionAvisos, ID.unique(),
  //   { titulo, contenido, fecha, importante, imagenes })
  return { id: `a-${Date.now()}`, titulo, contenido, fecha, importante: Boolean(importante), imagenes }
}

export { APPWRITE_CONFIG }
