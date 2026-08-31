// ============================================================
//  hooks/useAuth.jsx — ESTADO DE AUTENTICACIÓN (React Context)
//  ============================================================
//  Expone { usuario, esAdmin, login, logout }.
//  La lógica real (Appwrite o mock) vive en services/auth.service.js;
//  este hook solo gestiona el estado en React y la persistencia local.
// ============================================================

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { signIn, signOut } from '../services/auth.service'
import { USER_SESSION_KEY, readStored, writeStored } from '../utils/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => readStored(USER_SESSION_KEY))

  // Persistir sesión local (solo relevante en modo demo; en Appwrite
  // la sesión la maneja el propio SDK con su cookie/session).
  useEffect(() => {
    writeStored(USER_SESSION_KEY, usuario)
  }, [usuario])

  const login = useCallback(async (email, password) => {
    const user = await signIn(email, password)
    setUsuario(user)
    return user
  }, [])

  const logout = useCallback(async () => {
    await signOut()
    setUsuario(null)
  }, [])

  const esAdmin = usuario?.rol === 'admin'

  return (
    <AuthContext.Provider value={{ usuario, login, logout, esAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
