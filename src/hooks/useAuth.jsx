// ============================================================
//  hooks/useAuth.js — AUTENTICACIÓN
//  ============================================================
//  En modo DEMO usa login local contra mockData.js.
//  En producción se sustituye por Firebase Auth
//  (signInWithEmailAndPassword) y el rol se leería
//  de Firestore / custom claims.
// ============================================================

import { createContext, useContext, useEffect, useState } from 'react'
import { loginDemo } from '../services/mockData'
// import { auth, signInWithEmailAndPassword } from './authReal' // producción

const AuthContext = createContext(null)

const STORAGE_KEY = 'condominio.session'

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (usuario) localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario))
    else localStorage.removeItem(STORAGE_KEY)
  }, [usuario])

  const login = async (email, password) => {
    // DEMO: validar contra datos mock.
    const result = loginDemo(email, password)
    if (!result) {
      throw new Error('Credenciales incorrectas. Revisa tu email y contraseña.')
    }
    setUsuario(result.usuario)
    return result.usuario
  }

  const logout = async () => {
    setUsuario(null)
  }

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
