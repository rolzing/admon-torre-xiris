// ============================================================
//  services/storage.service.js — ARCHIVOS (APPWRITE STORAGE)
//  ============================================================
//  Gestiona subida, descarga y URL de archivos: facturas, recibos,
//  actas, reglamento, imágenes. Modo demo: devuelve placeholders.
//  Modo producción: usa Appwrite Storage (getPreviewURL, etc).
//  Cada función tiene UNA responsabilidad.
// ============================================================

import { storage, APPWRITE_CONFIG } from '../config/appwrite'
import { APPWRITE_CONFIGURED } from '../config/appwrite'

/**
 * Sube un archivo al bucket de Appwrite. Devuelve el fileId.
 * En demo solo simula la operación.
 */
export async function subirArchivo(file, name, mimeType) {
  if (!APPWRITE_CONFIGURED) {
    return { fileId: `demo-${Date.now()}`, name: file?.name || name }
  }
  // const res = await storage.createFile(APPWRITE_CONFIG.storageBucketId,
  //   ID.unique(), file)
  return { fileId: res.$id, name: file?.name || name }
}

/**
 * Devuelve la URL de vista previa de un archivo (para <img> o <a>).
 */
export function getArchivoUrl(fileId) {
  if (!APPWRITE_CONFIGURED) return `/docs/${fileId}`
  if (!fileId) return null
  // return storage.getFilePreview(APPWRITE_CONFIG.storageBucketId, fileId)
  return `/docs/${fileId}`
}

/**
 * Descarga el archivo completo (URL directa). Los recibos/documentos
 * apuntarían aquí en producción.
 */
export function getArchivoDownloadUrl(fileId) {
  if (!APPWRITE_CONFIGURED) return `/docs/${fileId}`
  if (!fileId) return null
  // return storage.getFileDownload(APPWRITE_CONFIG.storageBucketId, fileId)
  return `/docs/${fileId}`
}

export { APPWRITE_CONFIG }
