// ============================================================
//  hooks/useEstadosCuenta.js — ESTADO DE CUENTA DE LA UNIDAD
//  ============================================================
//  Carga (async) el estado de cuenta de una unidad desde
//  services/estadosCuenta.service.js (Appwrite o mock).
// ============================================================

import { useEffect, useState } from 'react'
import { getEstadoCuenta, listUnidadesConEstado } from '../services/estadosCuenta.service'

export function useEstadoCuenta(unidadId) {
  const [estado, setEstado] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    ;(async () => {
      if (!unidadId) {
        if (active) setLoading(false)
        return
      }
      const res = await getEstadoCuenta(unidadId)
      if (!active) return
      setEstado(res)
      setLoading(false)
    })()
    return () => {
      active = false
    }
  }, [unidadId])

  return { estado, loading }
}

export function useUnidades() {
  const [unidades, setUnidades] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    ;(async () => {
      const res = await listUnidadesConEstado()
      if (!active) return
      setUnidades(res)
      setLoading(false)
    })()
    return () => {
      active = false
    }
  }, [])

  return { unidades, loading }
}
