// ============================================================
//  services/documentos.service.js — REPOSITORIO DOCUMENTAL
//  ============================================================
//  Expone los documentos (reglamento, actas, estados financieros) y
//  la asamblea reciente. Modo demo: usa mockData. Modo producción:
//  lee de Appwrite Database (colección 'documentos'); los archivos
//  viven en Appwrite Storage (ver storage.service.js).
//  Cada función tiene UNA responsabilidad.
// ============================================================

import { APPWRITE_CONFIG, APPWRITE_CONFIGURED, callFunction } from '../config/appwrite'
import {
  getDocumentos as getDocumentosMock,
  getAcuerdoReciente as getAsambleaMock,
} from './mockData'

/** Lista de documentos del repositorio. */
export async function listDocumentos() {
  if (!APPWRITE_CONFIGURED) return getDocumentosMock()
  const res = await callFunction('listar_documentos')
  return res.documentos
}

/** Devuelve la asamblea más reciente, con resumen de acuerdos. */
export async function getAsambleaReciente() {
  if (!APPWRITE_CONFIGURED) return getAsambleaMock()
  const res = await callFunction('get_asamblea_reciente')
  return res.asamblea
}

/**
 * Registra un documento (metadatos en Database + archivo en Storage).
 * `mes` se usa cuando el documento es un Estado de Cuenta de un mes.
 * En el demo solo devuelve un registro simulado.
 */
export async function crearDocumento({ titulo, tipo, fecha, descripcion, fileId, mes = null }) {
  if (!APPWRITE_CONFIGURED) {
    return { id: `d-${Date.now()}`, titulo, tipo, fecha, descripcion, mes, url: `/docs/${fileId}` }
  }
  // Operación administrativa: delegada a la Appwrite Function (servidor).
  const res = await callFunction('crear_documento', { titulo, tipo, fecha, descripcion, fileId, mes })
  return { id: res.id, titulo, tipo, fecha, descripcion, mes, url: `/docs/${fileId}` }
}

export { APPWRITE_CONFIG }
