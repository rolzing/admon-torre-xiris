// ============================================================
//  appwrite-function: administracion
//  ============================================================
//  Ejecuta operaciones de administración sobre Appwrite TablesDB
//  (Appwrite v2) usando la API key del SERVIDOR (variables de
//  entorno de la function). El frontend llama esta function por su
//  endpoint con el body { accion, ...datos }; toda la lectura y
//  escritura de datos pasa por aquí (el SDK del navegador no
//  accede a TablesDB directamente).
//
//  ⚠️ La API key JAMÁS debe vivir en el frontend.
//
//  REQUIERE scopes de API key: tables.read, tables.write,
//  columns.write, rows.read, rows.write, storage.read, storage.write.
//
//  Acciones soportadas (JSON):
//    crear_aviso, listar_avisos
//    crear_gasto, listar_gastos, listar_pagos
//    crear_documento, listar_documentos, get_asamblea_reciente
//    get_fondo, listar_unidades, listar_unidades_estado, get_estado_cuenta
// ============================================================

import { Client, TablesDB, ID, Query } from 'node-appwrite'

const T = {
  unidades: process.env.APPWRITE_TABLE_UNIDADES || 'unidades',
  avisos: process.env.APPWRITE_TABLE_AVISOS || 'avisos',
  documentos: process.env.APPWRITE_TABLE_DOCUMENTOS || 'documentos',
  gastos: process.env.APPWRITE_TABLE_GASTOS || 'gastos',
  pagos: process.env.APPWRITE_TABLE_PAGOS || 'pagos',
  fondo: process.env.APPWRITE_TABLE_FONDO || 'fondo',
  estados: process.env.APPWRITE_TABLE_ESTADOS || 'estados_cuenta',
  usuarios: process.env.APPWRITE_TABLE_USUARIOS || 'usuarios',
}

function parseJSON(cadena, fallback) {
  if (!cadena) return fallback
  try {
    return JSON.parse(cadena)
  } catch {
    return fallback
  }
}

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '')

  const tablesDB = new TablesDB(client)
  const dbId = process.env.APPWRITE_DATABASE_ID

  // Appwrite Functions no emiten cabeceras CORS automáticamente: hay que
  // incluirlas en cada respuesta y responder al preflight OPTIONS.
  const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Appwrite-Project',
  }
  const send = (data, status) => res.json(data, status, CORS_HEADERS)

  // Preflight de CORS (el navegador lo envía antes de peticiones cross-origin).
  if (req.method === 'OPTIONS') {
    return res.json('', 200, CORS_HEADERS)
  }

  const { accion } = req.body || {}

  try {
    switch (accion) {
      // ---------- AVISOS ----------
      case 'crear_aviso': {
        const { titulo, contenido, fecha, importante, imagenes } = req.body
        const fila = await tablesDB.createRow({
          databaseId: dbId,
          tableId: T.avisos,
          rowId: ID.unique(),
          data: {
            titulo,
            contenido,
            fecha,
            importante: Boolean(importante),
            imagenes: JSON.stringify(Array.isArray(imagenes) ? imagenes : []),
          },
        })
        return send({ ok: true, id: fila.$id })
      }

      case 'listar_avisos': {
        const lista = await tablesDB.listRows({
          databaseId: dbId,
          tableId: T.avisos,
          queries: [Query.orderDesc('fecha')],
        })
        return send({
          ok: true,
          avisos: lista.rows.map((r) => ({
            id: r.$id,
            titulo: r.titulo,
            fecha: r.fecha,
            importante: r.importante,
            contenido: r.contenido,
            imagenes: parseJSON(r.imagenes, []),
          })),
        })
      }

      // ---------- GASTOS / PAGOS ----------
      case 'crear_gasto': {
        const { concepto, categoria, monto, fecha, facturaId } = req.body
        const fila = await tablesDB.createRow({
          databaseId: dbId,
          tableId: T.gastos,
          rowId: ID.unique(),
          data: {
            concepto,
            categoria,
            monto: Number(monto),
            fecha,
            facturaId: facturaId || null,
          },
        })
        return send({ ok: true, id: fila.$id })
      }

      case 'listar_gastos': {
        const lista = await tablesDB.listRows({
          databaseId: dbId,
          tableId: T.gastos,
          queries: [Query.orderDesc('fecha')],
        })
        return send({
          ok: true,
          gastos: lista.rows.map((r) => ({
            id: r.$id,
            concepto: r.concepto,
            categoria: r.categoria,
            monto: r.monto,
            fecha: r.fecha,
            facturaId: r.facturaId || null,
          })),
        })
      }

      case 'listar_pagos': {
        const lista = await tablesDB.listRows({
          databaseId: dbId,
          tableId: T.pagos,
          queries: [Query.orderDesc('fecha')],
        })
        return send({
          ok: true,
          pagos: lista.rows.map((r) => ({
            id: r.$id,
            unidad: r.unidad,
            concepto: r.concepto,
            monto: r.monto,
            fecha: r.fecha,
          })),
        })
      }

      // ---------- DOCUMENTOS ----------
      case 'crear_documento': {
        const { titulo, tipo, fecha, descripcion, mes, fileId } = req.body
        const fila = await tablesDB.createRow({
          databaseId: dbId,
          tableId: T.documentos,
          rowId: ID.unique(),
          data: {
            titulo,
            tipo,
            fecha: fecha || null,
            descripcion: descripcion || null,
            mes: mes || null,
            fileId: fileId || null,
            esAsambleaReciente: tipo === 'Acta de Asamblea',
          },
        })
        return send({ ok: true, id: fila.$id })
      }

      case 'listar_documentos': {
        const lista = await tablesDB.listRows({
          databaseId: dbId,
          tableId: T.documentos,
          queries: [Query.orderDesc('fecha')],
        })
        return send({
          ok: true,
          documentos: lista.rows.map((r) => ({
            id: r.$id,
            titulo: r.titulo,
            tipo: r.tipo,
            fecha: r.fecha,
            descripcion: r.descripcion || null,
            mes: r.mes || null,
            fileId: r.fileId || null,
            esAsambleaReciente: r.esAsambleaReciente,
          })),
        })
      }

      case 'get_asamblea_reciente': {
        const lista = await tablesDB.listRows({
          databaseId: dbId,
          tableId: T.documentos,
          queries: [Query.equal('esAsambleaReciente', true), Query.orderDesc('fecha')],
        })
        const d = lista.rows[0]
        return send({
          ok: true,
          asamblea: d
            ? {
                id: d.$id,
                titulo: d.titulo,
                tipo: d.tipo,
                fecha: d.fecha,
                descripcion: d.descripcion || null,
                fileId: d.fileId || null,
              }
            : null,
        })
      }

      // ---------- FONDO ----------
      case 'get_fondo': {
        const lista = await tablesDB.listRows({ databaseId: dbId, tableId: T.fondo })
        const f = lista.rows[0]
        return send({
          ok: true,
          fondo: f
            ? { saldoTotal: f.saldoTotal, mesActual: f.mesActual, cuentaBancaria: f.cuentaBancaria }
            : null,
        })
      }

      // ---------- UNIDADES / ESTADOS DE CUENTA ----------
      case 'listar_unidades': {
        const lista = await tablesDB.listRows({ databaseId: dbId, tableId: T.unidades })
        return send({
          ok: true,
          unidades: lista.rows.map((r) => ({
            id: r.$id,
            numero: r.numero,
            email: r.email,
            rol: r.rol,
            propietario: r.propietario,
            saldoActual: r.saldoActual,
          })),
        })
      }

      case 'listar_unidades_estado': {
        const [unidades, estados] = await Promise.all([
          tablesDB.listRows({ databaseId: dbId, tableId: T.unidades }),
          tablesDB.listRows({ databaseId: dbId, tableId: T.estados }),
        ])
        const porNumero = new Map(estados.rows.map((e) => [e.unidad, e]))
        const unidadesConEstado = unidades.rows.map((u) => {
          const historial = parseJSON(porNumero.get(u.numero)?.historial, [])
          const adeudo = historial.reduce((s, h) => s + (h.adeudo || 0), 0)
          const pendientes = historial.filter((h) => !h.pagado).map((h) => h.mes)
          return {
            id: u.$id,
            numero: u.numero,
            email: u.email,
            rol: u.rol,
            propietario: u.propietario,
            saldoActual: u.saldoActual,
            adeudo,
            pendientes,
          }
        })
        return send({ ok: true, unidades: unidadesConEstado })
      }

      case 'get_estado_cuenta': {
        const { numero } = req.body
        const lista = await tablesDB.listRows({
          databaseId: dbId,
          tableId: T.estados,
          queries: [Query.equal('unidad', Number(numero))],
        })
        const e = lista.rows[0]
        const unidades = await tablesDB.listRows({ databaseId: dbId, tableId: T.unidades })
        const u = unidades.rows.find((x) => Number(x.numero) === Number(numero))
        if (!u) return send({ ok: true, estado: null })
        const historial = parseJSON(e?.historial, []).sort((a, b) => b.periodo.localeCompare(a.periodo))
        return send({
          ok: true,
          estado: {
            id: u.$id,
            numero: u.numero,
            email: u.email,
            rol: u.rol,
            propietario: u.propietario,
            saldoActual: u.saldoActual,
            historial,
          },
        })
      }

      // ---------- ARCHIVOS ----------
      // (Nota: Appwrite v2 no expone archivos en req.files de una function;
      // la subida de archivos queda pendiente — se hará desde el cliente
      // directo al bucket de Storage cuando se retome.)

      case 'get_usuario_rol': {
        const { userId } = req.body
        if (!userId) return send({ ok: false, msg: 'Falta userId' }, 400)
        try {
          const fila = await tablesDB.getRow({ databaseId: dbId, tableId: T.usuarios, rowId: userId })
          return send({
            ok: true,
            usuario: {
              id: fila.$id,
              email: fila.email,
              rol: fila.rol || 'inquilino',
              numero: fila.numero ?? null,
              propietario: fila.propietario || '',
            },
          })
        } catch {
          return send({ ok: true, usuario: null })
        }
      }

      default:
        return send({ ok: false, msg: `Acción '${accion}' no soportada` }, 400)
    }
  } catch (err) {
    error(err)
    return send({ ok: false, msg: err.message }, 500)
  }
}
