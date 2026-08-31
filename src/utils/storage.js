// ============================================================
//  utils/storage.js — CLAVES DE ALMACENAMIENTO LOCAL
//  ============================================================
//  Centraliza las claves de localStorage para el demo (modo mock),
//  donde la sesión se persiste en el navegador. En modo Appwrite la
//  sesión la gestiona Appwrite; estas claves solo se usan para el
//  fallback demo.
// ============================================================

export const USER_SESSION_KEY = 'condominio.session'

export function readStored(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function writeStored(key, value) {
  if (value === null || value === undefined) {
    localStorage.removeItem(key)
  } else {
    localStorage.setItem(key, JSON.stringify(value))
  }
}
