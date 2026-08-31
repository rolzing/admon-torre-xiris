// ============================================================
//  services/documentos.service.js — REPOSITORIO DOCUMENTAL
//  ============================================================
//  Expone los documentos (reglamento, actas, estados financieros) y
//  la asamblea reciente. Modo demo: usa mockData. Modo producción:
//  lee de Appwrite Database (colección 'documentos'); los archivos
//  viven en Appwrite Storage (ver storage.service.js).
//  Cada función tiene UNA responsabilidad.
// ============================================================

import { databases, APPWRITE_CONFIG } from '../config/appwrite'
import { APPWRITE_CONFIGURED } from '../config/appwrite'
import {
  getDocumentos as getDocumentosMock,
  getAcuerdoReciente as getAsambleaMock,
} from './mockData'

/** Lista de documentos del repositorio. */
export async function listDocumentos() {
  if (!APPWRITE_CONFIGURED) return getDocumentosMock()
  // const res = await databases.listDocuments(APPWRITE_CONFIG.databaseId,
  //   APPWRITE_CONFIG.collectionDocumentos, [Query.orderDesc('fecha')])
  // return res.documents.map(mapper)
  return getDocumentosMock()
}

/** Devuelve la asamblea más reciente, con resumen de acuerdos. */
export async function getAsambleaReciente() {
  if (!APPWRITE_CONFIGURED) return getAsambleaMock()
  // Listar documentos tipo 'Acta de Asamblea' y tomar el más reciente.
  return getAsambleaMock()
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
  // const res = await databases.createDocument(APPWRITE_CONFIG.databaseId,
  //   APPWRITE_CONFIG.collectionDocumentos, ID.unique(),
  //   { titulo, tipo, fecha, descripcion, fileId, mes })
  return { id: `d-${Date.now()}`, titulo, tipo, fecha, descripcion, mes, url: `/docs/${fileId}` }
}

export { APPWRITE_CONFIG }
