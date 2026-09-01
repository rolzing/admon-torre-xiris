// ============================================================
//  config/appwrite.js — INICIALIZACIÓN DEL CLIENTE APPWRITE
//  ============================================================
//  Crea el cliente de Appwrite a partir de variables de entorno.
//  Si no hay proyecto configurado, la app corre en modo mock
//  (ver src/services/mockData.js) sin necesidad de credenciales.
//
//  En producción define estas variables en el entorno (Vercel):
//    VITE_APPWRITE_ENDPOINT   → https://cloud.appwrite.io/v1
//    VITE_APPWRITE_PROJECT_ID → ID de tu proyecto Appwrite
//    VITE_APPWRITE_DATABASE_ID
//    VITE_APPWRITE_COLLECTION_UNIDADES
//    VITE_APPWRITE_COLLECTION_AVISOS
//    VITE_APPWRITE_COLLECTION_DOCUMENTOS
//    VITE_APPWRITE_COLLECTION_GASTOS
//    VITE_APPWRITE_COLLECTION_PAGOS
//    VITE_APPWRITE_STORAGE_BUCKET_ID
//
//  Operaciones de ESCRITURA que requieren privilegios administrativos
//  y TODAS las lecturas de datos se ejecutan mediante la Appwrite
//  Function (del lado del servidor, donde vive la API key), porque el
//  navegador no accede a TablesDB de Appwrite v2 directamente. Solo
//  queda el Account (auth) para el inicio de sesión del navegador.
//    VITE_APPWRITE_FUNCTION_URL → URL de la function desplegada
// ============================================================

import { Client, Account } from 'appwrite'

const env = import.meta.env

const APPWRITE_CONFIG = {
  endpoint: env.VITE_APPWRITE_ENDPOINT || '',
  projectId: env.VITE_APPWRITE_PROJECT_ID || '',
  databaseId: env.VITE_APPWRITE_DATABASE_ID || '',
  collectionUnidades: env.VITE_APPWRITE_COLLECTION_UNIDADES || '',
  collectionAvisos: env.VITE_APPWRITE_COLLECTION_AVISOS || '',
  collectionDocumentos: env.VITE_APPWRITE_COLLECTION_DOCUMENTOS || '',
  collectionGastos: env.VITE_APPWRITE_COLLECTION_GASTOS || '',
  collectionPagos: env.VITE_APPWRITE_COLLECTION_PAGOS || '',
  storageBucketId: env.VITE_APPWRITE_STORAGE_BUCKET_ID || '',
  functionUrl: env.VITE_APPWRITE_FUNCTION_URL || '',
}

// ¿Hay un proyecto Appwrite real configurado?
export const APPWRITE_CONFIGURED = Boolean(
  APPWRITE_CONFIG.endpoint && APPWRITE_CONFIG.projectId
)

let client = null
let account = null

if (APPWRITE_CONFIGURED) {
  client = new Client().setEndpoint(APPWRITE_CONFIG.endpoint).setProject(APPWRITE_CONFIG.projectId)
  account = new Account(client)
}

export { APPWRITE_CONFIG, client, account }

/**
 * Ejecuta la Appwrite Function de administración (servidor), que es
 * quien posee la API key con permisos de escritura. El frontend nunca
 * maneja la key.
 *
 * @param {string} accion  Nombre de la operación (crear_aviso, etc.)
 * @param {object} datos   Payload con los datos de la operación
 * @returns {Promise<object>} Respuesta JSON { ok, ... } de la function
 */
export async function callFunction(accion, datos = {}) {
  if (!APPWRITE_CONFIGURED || !APPWRITE_CONFIG.functionUrl) {
    throw new Error('Appwrite Function no configurada (falta VITE_APPWRITE_FUNCTION_URL).')
  }
  const res = await fetch(APPWRITE_CONFIG.functionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': APPWRITE_CONFIG.projectId,
    },
    body: JSON.stringify({ accion, ...datos }),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || json.ok === false) {
    throw new Error(json.msg || `Error en la función (${res.status})`)
  }
  return json
}

/**
 * Ejecuta la Appwrite Function de administración enviando un ARCHIVO
 * como multipart/form-data (para subir imágenes, facturas, etc.).
 * El archivo viaja en el campo "archivo"; del lado del servidor
 * Appwrite lo expone en req.files.archivo.
 *
 * @param {File|Blob} file      Archivo a subir
 * @returns {Promise<{fileId:string, ok:boolean}>}
 */
export async function callFunctionMultipart(file) {
  if (!APPWRITE_CONFIGURED || !APPWRITE_CONFIG.functionUrl) {
    throw new Error('Appwrite Function no configurada (falta VITE_APPWRITE_FUNCTION_URL).')
  }
  const form = new FormData()
  form.append('archivo', file)
  const res = await fetch(APPWRITE_CONFIG.functionUrl, {
    method: 'POST',
    headers: {
      // Sin Content-Type manual: el navegador añade el boundary correcto.
      'X-Appwrite-Project': APPWRITE_CONFIG.projectId,
    },
    body: form,
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || json.ok === false) {
    throw new Error(json.msg || `Error al subir archivo (${res.status})`)
  }
  return json
}
