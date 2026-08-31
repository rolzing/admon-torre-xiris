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
// ============================================================

import { Client, Account, Databases, Storage } from 'appwrite'

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
}

// ¿Hay un proyecto Appwrite real configurado?
export const APPWRITE_CONFIGURED = Boolean(
  APPWRITE_CONFIG.endpoint && APPWRITE_CONFIG.projectId
)

let client = null
let account = null
let databases = null
let storage = null

if (APPWRITE_CONFIGURED) {
  client = new Client().setEndpoint(APPWRITE_CONFIG.endpoint).setProject(APPWRITE_CONFIG.projectId)
  account = new Account(client)
  databases = new Databases(client)
  storage = new Storage(client)
}

export { APPWRITE_CONFIG, client, account, databases, storage }
