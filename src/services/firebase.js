// ============================================================
//  services/firebase.js — CONFIGURACIÓN E INICIALIZACIÓN
//  ============================================================
//  Este archivo inicializa Firebase SOLO si las variables de
//  entorno están presentes. Si faltan (como en el demo local),
//  la app funciona en "modo mock" usando mockData.js.
//
//  En producción, el código real de las operaciones (leer
//  finanzas, avisos, documentos, estados de cuenta, autenticar)
//  viviría en archivos como:
//    - services/firebaseState.js
//    - services/firebaseAvisos.js
//    - services/firebaseDocs.js
//    - services/firebaseAuth.js
//  En este demo esos servicios no existen porque usamos mock;
//  la estructura queda lista para sustituirlos.
// ============================================================

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
}

// ¿Está configurado un proyecto Firebase real?
export const FIREBASE_CONFIGURED = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

let app = null
let auth = null
let db = null
let storage = null

if (FIREBASE_CONFIGURED) {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
}

export { app, auth, db, storage }

/**
 * Permite saber, desde cualquier parte de la app, si estamos
 * en modo demo (mock) o con Firebase real.
 */
export function usoFirebaseReal() {
  return FIREBASE_CONFIGURED
}
