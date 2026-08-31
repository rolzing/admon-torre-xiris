// ============================================================
//  services/buscar.service.js — BÚSQUEDA POR PALABRA CLAVE
//  ============================================================
//  Busca en avisos, documentos y conceptos de gasto. Compone los
//  datos de los demás servicios (Appwrite o mock).
// ============================================================

import { listAvisos } from './avisos.service'
import { listDocumentos } from './documentos.service'
import { getGastosMes } from './finanzas.service'

/**
 * Busca `query` en avisos, documentos y gastos.
 * Devuelve { avisos, documentos, gastos }.
 */
export async function buscar(query) {
  const q = query.trim().toLowerCase()
  if (!q) return { avisos: [], documentos: [], gastos: [] }

  const [avisos, documentos, gastos] = await Promise.all([
    listAvisos(),
    listDocumentos(),
    getGastosMes(),
  ])

  return {
    avisos: avisos.filter(
      (a) => a.titulo.toLowerCase().includes(q) || a.contenido.toLowerCase().includes(q)
    ),
    documentos: documentos.filter(
      (d) => d.titulo.toLowerCase().includes(q) || (d.descripcion || '').toLowerCase().includes(q)
    ),
    gastos: gastos.filter(
      (g) => g.concepto.toLowerCase().includes(q) || g.categoria.toLowerCase().includes(q)
    ),
  }
}
