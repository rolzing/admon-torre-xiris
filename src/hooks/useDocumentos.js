// ============================================================
//  hooks/useDocumentos.js — REPOSITORIO DOCUMENTAL
//  ============================================================
//  Carga (async) los documentos y la asamblea reciente desde
//  services/documentos.service.js (Appwrite o mock).
// ============================================================

import { useEffect, useState } from 'react'
import { listDocumentos, getAsambleaReciente } from '../services/documentos.service'

export function useDocumentos() {
  const [documentos, setDocumentos] = useState([])
  const [asamblea, setAsamblea] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    ;(async () => {
      const [docs, asm] = await Promise.all([listDocumentos(), getAsambleaReciente()])
      if (!active) return
      setDocumentos(docs)
      setAsamblea(asm)
      setLoading(false)
    })()
    return () => {
      active = false
    }
  }, [])

  return { documentos, asamblea, loading }
}
