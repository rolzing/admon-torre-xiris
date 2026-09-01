// ============================================================
//  appwrite-function: seed — CREAR TABLAS, COLUMNAS Y SEMBRAR DATOS
//  ============================================================
//  Puebla Appwrite (sistema TablesDB de Appwrite v2) con los datos
//  iniciales del condominio, usando la API key del SERVIDOR que vive
//  en las variables de entorno de la function.
//
//  La seed es IDEMPOTENTE: crea tablas/columnas si faltan y solo
//  inserta filas que no existan (igualando por un id de fila fijo).
//
//  ⚠️ La API key JAMÁS debe vivir en el frontend. Se lee desde las
//  variables de entorno de la function:
//    APPWRITE_ENDPOINT
//    APPWRITE_PROJECT_ID
//    APPWRITE_API_KEY
//    APPWRITE_DATABASE_ID
//
//  REQUIERE scopes de API key: databases.read, tables.write,
//  columns.write, rows.read, rows.write.
// ============================================================

import { Client, TablesDB, ID } from 'node-appwrite'

// --- Definición de tablas y sus columnas -----------------------
// type: varchar | text | integer | boolean
const TABLAS = {
  unidades: {
    columnas: {
      numero: ['integer', {}],
      email: ['varchar', { size: 255 }],
      rol: ['varchar', { size: 50 }],
      propietario: ['varchar', { size: 255 }],
      saldoActual: ['integer', {}],
    },
  },
  avisos: {
    columnas: {
      titulo: ['varchar', { size: 500 }],
      contenido: ['text', {}],
      fecha: ['varchar', { size: 50 }],
      importante: ['boolean', {}],
      imagenes: ['text', {}], // JSON en cadena (lista de fileId)
    },
  },
  documentos: {
    columnas: {
      titulo: ['varchar', { size: 500 }],
      tipo: ['varchar', { size: 100 }],
      fecha: ['varchar', { size: 50 }],
      descripcion: ['text', {}],
      mes: ['varchar', { size: 50 }],
      fileId: ['varchar', { size: 255 }],
      esAsambleaReciente: ['boolean', {}],
    },
  },
  gastos: {
    columnas: {
      concepto: ['varchar', { size: 500 }],
      categoria: ['varchar', { size: 100 }],
      monto: ['integer', {}],
      fecha: ['varchar', { size: 50 }],
      facturaId: ['varchar', { size: 255 }],
    },
  },
  pagos: {
    columnas: {
      unidad: ['integer', {}],
      concepto: ['varchar', { size: 500 }],
      monto: ['integer', {}],
      fecha: ['varchar', { size: 50 }],
    },
  },
  fondo: {
    columnas: {
      saldoTotal: ['integer', {}],
      mesActual: ['varchar', { size: 100 }],
      cuentaBancaria: ['varchar', { size: 100 }],
    },
  },
  estados_cuenta: {
    columnas: {
      unidad: ['integer', {}],
      historial: ['text', {}], // JSON en cadena
    },
  },
  usuarios: {
    columnas: {
      email: ['varchar', { size: 255 }],
      rol: ['varchar', { size: 50 }],
      numero: ['integer', {}],
      propietario: ['varchar', { size: 255 }],
    },
  },
}

// --- Datos a sembrar (semilla inicial) -------------------------
const UNIDADES = [
  { numero: 101, email: 'encargado@mirador.mx', rol: 'admin', propietario: 'Laura Méndez', saldoActual: 0 },
  { numero: 201, email: 'unidad201@mirador.mx', rol: 'inquilino', propietario: 'Jorge Camacho', saldoActual: 0 },
  { numero: 202, email: 'unidad202@mirador.mx', rol: 'inquilino', propietario: 'Ana Torres', saldoActual: 3500 },
  { numero: 301, email: 'unidad301@mirador.mx', rol: 'inquilino', propietario: 'Carlos Ruiz', saldoActual: 0 },
  { numero: 302, email: 'unidad302@mirador.mx', rol: 'inquilino', propietario: 'María Gómez', saldoActual: 7800 },
  { numero: 303, email: 'unidad303@mirador.mx', rol: 'inquilino', propietario: 'Pedro Salinas', saldoActual: 1200 },
]

// Usuarios de inicio de sesión (Appwrite Auth). El rowId es el $id del
// usuario creado en Appwrite. `numero` es null para el admin (sin unidad).
const USUARIOS = [
  { id: 'user-admin-demo', email: 'encargado@mirador.mx', rol: 'admin', numero: null, propietario: 'Laura Méndez' },
  { id: 'user-unidad201', email: 'unidad201@mirador.mx', rol: 'inquilino', numero: 201, propietario: 'Jorge Camacho' },
]

const AVISOS = [
  {
    id: 'a1', titulo: 'Suspensión temporal de agua por mantenimiento', fecha: '2026-08-28',
    importante: true, contenido: 'El próximo sábado de 9:00 a 14:00 hrs se realizará el mantenimiento programado de la cisterna y bombas. Se suspenderá el servicio de agua en todo el edificio. Gracias por su comprensión.',
  },
  {
    id: 'a2', titulo: 'Memoria de la Asamblea General Ordinaria', fecha: '2026-08-20',
    importante: true, contenido: 'Ya está disponible el acta y la memoria de la última asamblea. Los acuerdos principales: aprobación del presupuesto anual, renovación del contrato de la empresa de seguridad y creación del fondo de reserva.',
  },
  {
    id: 'a3', titulo: 'Recordatorio: cuota de septiembre', fecha: '2026-08-18',
    importante: false, contenido: 'La cuota mensual de septiembre vence el día 5. Recuerda que los pagos se pueden realizar por transferencia a la cuenta de la administración. Consulta tu estado de cuenta en esta plataforma.',
  },
  {
    id: 'a4', titulo: 'Reglas de uso del área de asadores', fecha: '2026-08-10',
    importante: false, contenido: 'A partir de ahora el área de asadores se reserva con 24 hrs de anticipación en la caseta de vigilancia. Se recuerda que el uso es exclusivo para propietarios e inquilinos al corriente.',
  },
]

const DOCUMENTOS = [
  {
    id: 'd1', titulo: 'Reglamento Interno del Condominio', tipo: 'Reglamento', fecha: '2026-01-15',
    descripcion: 'Reglamento vigente aprobado en asamblea. Incluye uso de áreas comunes, cuotas y convivencia.',
  },
  {
    id: 'd2', titulo: 'Acta de Asamblea General Ordinaria — Agosto 2026', tipo: 'Acta de Asamblea', fecha: '2026-08-20',
    esAsambleaReciente: true,
    descripcion: 'Actas con los acuerdos de la asamblea de agosto 2026.',
  },
  {
    id: 'd3', titulo: 'Estados Financieros Auditados — Ejercicio 2025', tipo: 'Estado Financiero', fecha: '2026-03-10',
    descripcion: 'Reporte auditado de ingresos y egresos del ejercicio 2025.',
  },
  {
    id: 'd4', titulo: 'Acta de Asamblea — Reglas de Áreas Comunes', tipo: 'Acta de Asamblea', fecha: '2026-05-12',
    descripcion: 'Acta de la asamblea donde se definieron las reglas de uso de áreas comunes.',
  },
]

const GASTOS = [
  { id: 'g1', concepto: 'Nómina del personal de mantenimiento', categoria: 'Mantenimiento', monto: 18500, fecha: '2026-08-03' },
  { id: 'g2', concepto: 'Pago de vigilante (turno nocturno)', categoria: 'Seguridad', monto: 9800, fecha: '2026-08-05' },
  { id: 'g3', concepto: 'Limpieza áreas comunes y plumas', categoria: 'Limpieza', monto: 4200, fecha: '2026-08-07' },
  { id: 'g4', concepto: 'Mantenimiento preventivo de elevadores', categoria: 'Mantenimiento', monto: 12400, fecha: '2026-08-10' },
  { id: 'g5', concepto: 'Recarga de cisterna de agua', categoria: 'Servicios', monto: 6100, fecha: '2026-08-12' },
  { id: 'g6', concepto: 'Consumo de luz de áreas comunes', categoria: 'Servicios', monto: 5450, fecha: '2026-08-15' },
  { id: 'g7', concepto: 'Fumigación y control de plagas', categoria: 'Limpieza', monto: 2300, fecha: '2026-08-17' },
  { id: 'g8', concepto: 'Reparación de fuga en bomba de agua', categoria: 'Mantenimiento', monto: 3150, fecha: '2026-08-20' },
  { id: 'g9', concepto: 'Jardinería y poda', categoria: 'Limpieza', monto: 1850, fecha: '2026-08-22' },
  { id: 'g10', concepto: 'Internet y cámaras de seguridad', categoria: 'Seguridad', monto: 1690, fecha: '2026-08-25' },
]

const PAGOS = [
  { unidad: 101, concepto: 'Cuota mensual Agosto', monto: 1850, fecha: '2026-08-03' },
  { unidad: 201, concepto: 'Cuota mensual Agosto', monto: 1850, fecha: '2026-08-04' },
  { unidad: 301, concepto: 'Cuota mensual Agosto', monto: 1850, fecha: '2026-08-06' },
  { unidad: 101, concepto: 'Fondo de reserva', monto: 500, fecha: '2026-08-08' },
  { unidad: 303, concepto: 'Cuota mensual Agosto + atraso', monto: 2400, fecha: '2026-08-10' },
  { unidad: 201, concepto: 'Fondo de reserva', monto: 500, fecha: '2026-08-12' },
]

const FONDO = { saldoTotal: 123123, mesActual: 'Agosto 2026', cuentaBancaria: '0104 9223 2345 1233' }

const ESTADOS_CUENTA = [
  {
    numero: 101,
    historial: [
      { mes: 'Junio 2026', periodo: '2026-06', cuota: 1850, pagado: true, fechaPago: '2026-06-04', recibo: 'recibo-junio.pdf', adeudo: 0 },
      { mes: 'Julio 2026', periodo: '2026-07', cuota: 1850, pagado: true, fechaPago: '2026-07-06', recibo: 'recibo-julio.pdf', adeudo: 0 },
      { mes: 'Agosto 2026', periodo: '2026-08', cuota: 1850, pagado: true, fechaPago: '2026-08-03', recibo: 'recibo-agosto.pdf', adeudo: 0 },
      { mes: 'Septiembre 2026', periodo: '2026-09', cuota: 1850, pagado: false, fechaPago: null, recibo: null, adeudo: 1850 },
    ],
  },
  {
    numero: 201,
    historial: [
      { mes: 'Junio 2026', periodo: '2026-06', cuota: 1850, pagado: true, fechaPago: '2026-06-07', recibo: 'recibo-junio.pdf', adeudo: 0 },
      { mes: 'Julio 2026', periodo: '2026-07', cuota: 1850, pagado: true, fechaPago: '2026-07-06', recibo: 'recibo-julio.pdf', adeudo: 0 },
      { mes: 'Agosto 2026', periodo: '2026-08', cuota: 1850, pagado: true, fechaPago: '2026-08-04', recibo: 'recibo-agosto.pdf', adeudo: 0 },
      { mes: 'Septiembre 2026', periodo: '2026-09', cuota: 1850, pagado: false, fechaPago: null, recibo: null, adeudo: 1850 },
    ],
  },
  {
    numero: 202,
    historial: [
      { mes: 'Junio 2026', periodo: '2026-06', cuota: 1850, pagado: false, fechaPago: null, recibo: null, adeudo: 1850 },
      { mes: 'Julio 2026', periodo: '2026-07', cuota: 1850, pagado: false, fechaPago: null, recibo: null, adeudo: 1850 },
      { mes: 'Agosto 2026', periodo: '2026-08', cuota: 1850, pagado: false, fechaPago: null, recibo: null, adeudo: 1850 },
      { mes: 'Septiembre 2026', periodo: '2026-09', cuota: 1850, pagado: false, fechaPago: null, recibo: null, adeudo: 1850 },
    ],
  },
  {
    numero: 301,
    historial: [
      { mes: 'Junio 2026', periodo: '2026-06', cuota: 1850, pagado: true, fechaPago: '2026-06-08', recibo: 'recibo-junio.pdf', adeudo: 0 },
      { mes: 'Julio 2026', periodo: '2026-07', cuota: 1850, pagado: true, fechaPago: '2026-07-06', recibo: 'recibo-julio.pdf', adeudo: 0 },
      { mes: 'Agosto 2026', periodo: '2026-08', cuota: 1850, pagado: true, fechaPago: '2026-08-06', recibo: 'recibo-agosto.pdf', adeudo: 0 },
      { mes: 'Septiembre 2026', periodo: '2026-09', cuota: 1850, pagado: false, fechaPago: null, recibo: null, adeudo: 1850 },
    ],
  },
  {
    numero: 302,
    historial: [
      { mes: 'Mayo 2026', periodo: '2026-05', cuota: 1850, pagado: false, fechaPago: null, recibo: null, adeudo: 1850 },
      { mes: 'Junio 2026', periodo: '2026-06', cuota: 1850, pagado: false, fechaPago: null, recibo: null, adeudo: 1850 },
      { mes: 'Julio 2026', periodo: '2026-07', cuota: 1850, pagado: false, fechaPago: null, recibo: null, adeudo: 1850 },
      { mes: 'Agosto 2026', periodo: '2026-08', cuota: 1850, pagado: false, fechaPago: null, recibo: null, adeudo: 1850 },
      { mes: 'Septiembre 2026', periodo: '2026-09', cuota: 1850, pagado: false, fechaPago: null, recibo: null, adeudo: 1850 },
    ],
  },
  {
    numero: 303,
    historial: [
      { mes: 'Junio 2026', periodo: '2026-06', cuota: 1850, pagado: true, fechaPago: '2026-06-06', recibo: 'recibo-junio.pdf', adeudo: 0 },
      { mes: 'Julio 2026', periodo: '2026-07', cuota: 1850, pagado: true, fechaPago: '2026-07-09', recibo: 'recibo-julio.pdf', adeudo: 0 },
      { mes: 'Agosto 2026', periodo: '2026-08', cuota: 1850, pagado: true, fechaPago: '2026-08-10', recibo: 'recibo-agosto.pdf', adeudo: 0 },
      { mes: 'Septiembre 2026', periodo: '2026-09', cuota: 1850, pagado: false, fechaPago: null, recibo: null, adeudo: 1850 },
    ],
  },
]

// --- Utilidades --------------------------------------------------
async function asegurarTabla(tablesDB, dbId, nombre) {
  const { columnas } = TABLAS[nombre]
  try {
    await tablesDB.getTable({ databaseId: dbId, tableId: nombre })
    return false
  } catch {
    await tablesDB.createTable({
      databaseId: dbId,
      tableId: nombre,
      name: nombre,
    })
    for (const [key, [tipo, opts]] of Object.entries(columnas)) {
      if (tipo === 'varchar') {
        await tablesDB.createVarcharColumn({ databaseId: dbId, tableId: nombre, key, size: opts.size, required: false })
      } else if (tipo === 'integer') {
        await tablesDB.createIntegerColumn({ databaseId: dbId, tableId: nombre, key, required: false })
      } else if (tipo === 'boolean') {
        await tablesDB.createBooleanColumn({ databaseId: dbId, tableId: nombre, key, required: false })
      } else {
        await tablesDB.createTextColumn({ databaseId: dbId, tableId: nombre, key, required: false })
      }
    }
    return true
  }
}

async function yaExiste(tablesDB, dbId, tabla, campo, valor) {
  const lista = await tablesDB.listRows({ databaseId: dbId, tableId: tabla })
  return lista.rows.some((r) => String(r[campo]) === String(valor))
}

export async function runSeed({ log = console.log, error = console.error } = {}) {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '')

  const tablesDB = new TablesDB(client)
  const dbId = process.env.APPWRITE_DATABASE_ID

  try {
    // 0) Asegura que la database exista.
    try {
      await tablesDB.get({ databaseId: dbId })
    } catch {
      await tablesDB.create({ databaseId: dbId, name: 'Condominio' })
    }

    // 1) Crea todas las tablas y sus columnas.
    for (const nombre of Object.keys(TABLAS)) {
      await asegurarTabla(tablesDB, dbId, nombre)
    }

    // Fondo común (id fijo).
    if (!(await yaExiste(tablesDB, dbId, 'fondo', 'mesActual', FONDO.mesActual))) {
      await tablesDB.createRow({ databaseId: dbId, tableId: 'fondo', rowId: 'fondo-unico', data: FONDO })
    }

    // 2) Unidades (id determinista).
    for (const u of UNIDADES) {
      const rowId = `unidad-${u.numero}`
      if (!(await yaExiste(tablesDB, dbId, 'unidades', 'numero', u.numero))) {
        await tablesDB.createRow({ databaseId: dbId, tableId: 'unidades', rowId, data: u })
      }
    }

    // 3) Avisos (id determinista).
    for (const a of AVISOS) {
      const rowId = `aviso-${a.id}`
      if (!(await yaExiste(tablesDB, dbId, 'avisos', 'titulo', a.titulo))) {
        const { id, ...datos } = a
        await tablesDB.createRow({
          databaseId: dbId,
          tableId: 'avisos',
          rowId,
          data: { ...datos, imagenes: JSON.stringify(datos.imagenes || []) },
        })
      }
    }

    // 4) Documentos (id determinista).
    for (const d of DOCUMENTOS) {
      const rowId = `doc-${d.id}`
      if (!(await yaExiste(tablesDB, dbId, 'documentos', 'titulo', d.titulo))) {
        const { id, ...datos } = d
        await tablesDB.createRow({ databaseId: dbId, tableId: 'documentos', rowId, data: datos })
      }
    }

    // 5) Gastos (id determinista).
    for (const g of GASTOS) {
      const rowId = `gasto-${g.id}`
      if (!(await yaExiste(tablesDB, dbId, 'gastos', 'concepto', g.concepto))) {
        const { id, ...datos } = g
        await tablesDB.createRow({ databaseId: dbId, tableId: 'gastos', rowId, data: datos })
      }
    }

    // 6) Pagos (id determinista corto).
    for (let idx = 0; idx < PAGOS.length; idx++) {
      const p = PAGOS[idx]
      const rowId = `pago-${idx + 1}`
      if (!(await yaExiste(tablesDB, dbId, 'pagos', 'fecha', p.fecha))) {
        await tablesDB.createRow({ databaseId: dbId, tableId: 'pagos', rowId, data: p })
      }
    }

    // 7) Estados de cuenta (por número de unidad; historial en JSON).
    for (const e of ESTADOS_CUENTA) {
      const rowId = `estado-${e.numero}`
      if (!(await yaExiste(tablesDB, dbId, 'estados_cuenta', 'unidad', e.numero))) {
        await tablesDB.createRow({
          databaseId: dbId,
          tableId: 'estados_cuenta',
          rowId,
          data: { unidad: e.numero, historial: JSON.stringify(e.historial) },
        })
      }
    }

    // 8) Usuarios de auth (rowId = $id de Appwrite).
    for (const u of USUARIOS) {
      if (!(await yaExiste(tablesDB, dbId, 'usuarios', 'email', u.email))) {
        await tablesDB.createRow({
          databaseId: dbId,
          tableId: 'usuarios',
          rowId: u.id,
          data: { email: u.email, rol: u.rol, numero: u.numero, propietario: u.propietario },
        })
      }
    }

    log('Seed completado correctamente.')
    return { ok: true, msg: 'Seed completado correctamente.' }
  } catch (err) {
    error(err)
    return { ok: false, msg: err.message }
  }
}

// Punto de entrada CLI: si este archivo se ejecuta directamente con
// node (no importado), corre la seed y sale con el código apropiado.
const esEjecutadoDirectamente =
  import.meta.url === `file://${process.argv[1]}`

if (esEjecutadoDirectamente) {
  runSeed()
    .then((resultado) => {
      if (!resultado.ok) process.exitCode = 1
    })
    .catch((err) => {
      console.error(err)
      process.exitCode = 1
    })
}
