// ============================================================
//  services/auth.service.js — AUTENTICACIÓN Y SESIÓN
//  ============================================================
//  Única puerta de entrada para login, logout y lectura de sesión.
//  - Modo demo: usa mockData (UNIDADES con email/password/rol).
//  - Modo producción: usa Appwrite Account (email/password).
//  Cada función tiene UNA responsabilidad.
//
//  En Appwrite el rol se guarda como atributo del usuario (prefs o
//  un campo 'rol'). En este demo el rol se deriva de mockData.
// ============================================================

import { account, callFunction } from '../config/appwrite'
import { APPWRITE_CONFIGURED } from '../config/appwrite'
import { USER_SESSION_KEY } from '../utils/storage'
import { loginDemo } from './mockData'

/**
 * Convierte un usuario de Appwrite (Account.get/updateSession) a la
 * forma que consume la UI: { id, email, rol, numero, propietario }.
 * En producción el rol y la unidad se leerían de la base de datos
 * o de los prefs del usuario.
 */
function mapAppwriteUser(appwriteUser, roleDefaults) {
  return {
    id: appwriteUser.$id,
    email: appwriteUser.email,
    name: appwriteUser.name || '',
    rol: roleDefaults?.rol || 'inquilino',
    numero: roleDefaults?.numero || null,
    propietario: roleDefaults?.propietario || appwriteUser.name || appwriteUser.email,
  }
}

/**
 * Inicia sesión con email y contraseña. Devuelve el usuario autenticado.
 */
export async function signIn(email, password) {
  if (!APPWRITE_CONFIGURED) {
    const result = loginDemo(email, password)
    if (!result) {
      throw new Error('Credenciales incorrectas. Revisa tu email y contraseña.')
    }
    return result.usuario
  }

  // Appwrite: crear sesión por email/password y leer el usuario.
  await account.createEmailPasswordSession(email, password)
  const appwriteUser = await account.get()
  // En producción: leer rol/unidad desde la DB con el ID del usuario.
  const roleDefaults = await fetchUserRole(appwriteUser.$id)
  return mapAppwriteUser(appwriteUser, roleDefaults)
}

/**
 * Lee la sesión activa (por ejemplo al recargar la app).
 * Devuelve null si no hay sesión.
 */
export async function getSession() {
  if (!APPWRITE_CONFIGURED) {
    try {
      const raw = localStorage.getItem(USER_SESSION_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }

  try {
    const appwriteUser = await account.get()
    const roleDefaults = await fetchUserRole(appwriteUser.$id)
    return mapAppwriteUser(appwriteUser, roleDefaults)
  } catch {
    return null
  }
}

/**
 * Cierra la sesión actual.
 */
export async function signOut() {
  if (APPWRITE_CONFIGURED) {
    try {
      await account.deleteSession('current')
    } catch {
      // ignorar: si ya no hay sesión, no es un error
    }
  }
  // En modo demo se limpia la sesión local en el hook/UI.
}

/**
 * Lee rol/número de unidad de un usuario de Appwrite desde la tabla
 * 'usuarios' (via la function de administración). Devuelve null si el
 * usuario no tiene registro (p.ej. aún no se le asignó rol).
 */
export async function fetchUserRole(userId) {
  if (!APPWRITE_CONFIGURED) return null
  try {
    const { usuario } = await callFunction('get_usuario_rol', { userId })
    return usuario
  } catch {
    return null
  }
}
