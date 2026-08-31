// ============================================================
//  hooks/useAvisos.js — MURO DE AVISOS
//  ============================================================
//  Carga (async) los avisos desde services/avisos.service.js
//  (Appwrite o mock).
// ============================================================

import { useEffect, useState } from 'react'
import { listAvisos } from '../services/avisos.service'

export function useAvisos() {
  const [avisos, setAvisos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    ;(async () => {
      const res = await listAvisos()
      if (!active) return
      setAvisos(res)
      setLoading(false)
    })()
    return () => {
      active = false
    }
  }, [])

  return { avisos, loading }
}
