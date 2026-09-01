// ============================================================
//  services/avisos.service.js — MURO DE AVISOS
//  ============================================================
//  Expone los comunicados oficiales. Modo demo: usa mockData.
//  Modo producción: lee de Appwrite Database (colección 'avisos').
//  Cada función tiene UNA responsabilidad.
// ============================================================

import { APPWRITE_CONFIG, APPWRITE_CONFIGURED, callFunction } from '../config/appwrite'
import { getAvisos as getAvisosMock } from './mockData'

/** Lista de avisos, del más reciente al más antiguo. */
export async function listAvisos() {
  if (!APPWRITE_CONFIGURED) return getAvisosMock()
  // En producción toda la lectura pasa por la Appwrite Function (el SDK
  // del navegador no accede a TablesDB). La function posee la API key.
  const res = await callFunction('listar_avisos')
  return res.avisos
}

/** Publica un nuevo aviso (panel admin). */
export async function crearAviso({ titulo, contenido, fecha, importante, imagenes = [] }) {
  if (!APPWRITE_CONFIGURED) {
    return { id: `a-${Date.now()}`, titulo, contenido, fecha, importante: Boolean(importante), imagenes }
  }
  // Operación administrativa: se delega a la Appwrite Function (servidor),
  // que posee la API key con permisos de escritura. El frontend no la ve.
  const res = await callFunction('crear_aviso', { titulo, contenido, fecha, importante, imagenes })
  return { id: res.id, titulo, contenido, fecha, importante: Boolean(importante), imagenes }
}

export { APPWRITE_CONFIG }
