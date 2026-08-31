// ============================================================
//  mockData.js — DATOS DE EJEMPLO (SEED)
//  ============================================================
//  Este archivo simula los datos que, en producción, llegarían
//  desde Firebase Firestore (poblada a su vez desde Google
//  Sheets mediante una sincronización).
//
//  ⚠️  NO es una copia de respaldo de producción: es solo una
//  maqueta realista para que el demo funcione sin credenciales.
//
//  DATOS REALES vs. MOCK
//  -----------------------------------------------------------------
//  Cuando se conecte Firebase de verdad, estos mismos "helpers"
//  (getFinanzas, getEstadosCuenta, getAvisos, getDocumentos,
//  getUnidades, login) deberán reimplementarse en los servicios
//  de Firebase correspondientes. La interfaz (páginas/componentes)
//  ya quedó lista para consumir la misma forma de datos.
// ============================================================

// ---------- Identidad de la torre ----------
export const TORRE = {
  nombre: 'Torre Residencial Mirador',
  direccion: 'Av. Principal 123, Col. Centro',
  administrador: 'Sra. Laura Méndez',
}

// ---------- Saldo del fondo común de la torre ----------
export const fondoComun = {
  saldoTotal: 128650.0,
  mesActual: 'Agosto 2026',
  // Cuenta bancaria del fondo común, mostrada de forma enmascarada
  // (sólo los últimos 4 dígitos) para transparencia sin exponer datos
  // sensibles completos. Se publica en la página de inicio.
  cuentaBancaria: '0104 9223 8812 0123',
  // saldoTotal se puede recalcular a partir de movimientos si se desea,
  // pero lo mantenemos como dato "oficial" proveniente de Sheets/producción.
}

// ---------- Unidades / inquilinos ----------
// password es solo para el demo (detección de rol). En producción
// se usaría Firebase Auth con emails reales y roles en Firestore.
export const UNIDADES = [
  {
    id: 'u-101',
    numero: 101,
    email: 'encargado@mirador.mx',
    password: 'admin123',
    rol: 'admin',
    propietario: 'Laura Méndez',
    saldoActual: 0,
  },
  {
    id: 'u-201',
    numero: 201,
    email: 'unidad201@mirador.mx',
    password: 'demo123',
    rol: 'inquilino',
    propietario: 'Jorge Camacho',
    saldoActual: 0,
  },
  {
    id: 'u-202',
    numero: 202,
    email: 'unidad202@mirador.mx',
    password: 'demo123',
    rol: 'inquilino',
    propietario: 'Ana Torres',
    saldoActual: 3500,
  },
  {
    id: 'u-301',
    numero: 301,
    email: 'unidad301@mirador.mx',
    password: 'demo123',
    rol: 'inquilino',
    propietario: 'Carlos Ruiz',
    saldoActual: 0,
  },
  {
    id: 'u-302',
    numero: 302,
    email: 'unidad302@mirador.mx',
    password: 'demo123',
    rol: 'inquilino',
    propietario: 'María Gómez',
    saldoActual: 7800,
  },
  {
    id: 'u-303',
    numero: 303,
    email: 'unidad303@mirador.mx',
    password: 'demo123',
    rol: 'inquilino',
    propietario: 'Pedro Salinas',
    saldoActual: 1200,
  },
]

// ---------- Gastos del mes (egresos) ----------
export const GASTOS = [
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

// ---------- Ingresos del mes (cuotas pagadas) ----------
export const PAGOS_MES = [
  { id: 'p1', unidad: 101, concepto: 'Cuota mensual Agosto', monto: 1850, fecha: '2026-08-03' },
  { id: 'p2', unidad: 201, concepto: 'Cuota mensual Agosto', monto: 1850, fecha: '2026-08-04' },
  { id: 'p3', unidad: 301, concepto: 'Cuota mensual Agosto', monto: 1850, fecha: '2026-08-06' },
  { id: 'p4', unidad: 101, concepto: 'Fondo de reserva', monto: 500, fecha: '2026-08-08' },
  { id: 'p5', unidad: 303, concepto: 'Cuota mensual Agosto + atraso', monto: 2400, fecha: '2026-08-10' },
  { id: 'p6', unidad: 201, concepto: 'Fondo de reserva', monto: 500, fecha: '2026-08-12' },
]

// ---------- Estados de cuenta por unidad (historial mensual) ----------
// Cada registro pertenece a una unidad y mes.
const DEFAULT_ESTADO = (unidad) => ({
  unidad,
  historial: [
    {
      mes: 'Junio 2026',
      periodo: '2026-06',
      cuota: 1850,
      pagado: true,
      fechaPago: '2026-06-05',
      recibo: 'recibo-junio.pdf',
      adeudo: 0,
    },
    {
      mes: 'Julio 2026',
      periodo: '2026-07',
      cuota: 1850,
      pagado: true,
      fechaPago: '2026-07-06',
      recibo: 'recibo-julio.pdf',
      adeudo: 0,
    },
    {
      mes: 'Agosto 2026',
      periodo: '2026-08',
      cuota: 1850,
      pagado: false,
      fechaPago: null,
      recibo: null,
      adeudo: 1850,
    },
    {
      mes: 'Septiembre 2026',
      periodo: '2026-09',
      cuota: 1850,
      pagado: false,
      fechaPago: null,
      recibo: null,
      adeudo: 1850,
    },
  ],
})

// Ajustes de morosidad específicos por unidad:
export const ESTADOS_CUENTA = [
  {
    unidad: 101,
    historial: [
      { mes: 'Junio 2026', periodo: '2026-06', cuota: 1850, pagado: true, fechaPago: '2026-06-04', recibo: 'recibo-junio.pdf', adeudo: 0 },
      { mes: 'Julio 2026', periodo: '2026-07', cuota: 1850, pagado: true, fechaPago: '2026-07-06', recibo: 'recibo-julio.pdf', adeudo: 0 },
      { mes: 'Agosto 2026', periodo: '2026-08', cuota: 1850, pagado: true, fechaPago: '2026-08-03', recibo: 'recibo-agosto.pdf', adeudo: 0 },
      { mes: 'Septiembre 2026', periodo: '2026-09', cuota: 1850, pagado: false, fechaPago: null, recibo: null, adeudo: 1850 },
    ],
  },
  {
    unidad: 201,
    historial: [
      { mes: 'Junio 2026', periodo: '2026-06', cuota: 1850, pagado: true, fechaPago: '2026-06-07', recibo: 'recibo-junio.pdf', adeudo: 0 },
      { mes: 'Julio 2026', periodo: '2026-07', cuota: 1850, pagado: true, fechaPago: '2026-07-06', recibo: 'recibo-julio.pdf', adeudo: 0 },
      { mes: 'Agosto 2026', periodo: '2026-08', cuota: 1850, pagado: true, fechaPago: '2026-08-04', recibo: 'recibo-agosto.pdf', adeudo: 0 },
      { mes: 'Septiembre 2026', periodo: '2026-09', cuota: 1850, pagado: false, fechaPago: null, recibo: null, adeudo: 1850 },
    ],
  },
  {
    unidad: 202,
    historial: [
      { mes: 'Junio 2026', periodo: '2026-06', cuota: 1850, pagado: false, fechaPago: null, recibo: null, adeudo: 1850 },
      { mes: 'Julio 2026', periodo: '2026-07', cuota: 1850, pagado: false, fechaPago: null, recibo: null, adeudo: 1850 },
      { mes: 'Agosto 2026', periodo: '2026-08', cuota: 1850, pagado: false, fechaPago: null, recibo: null, adeudo: 1850 },
      { mes: 'Septiembre 2026', periodo: '2026-09', cuota: 1850, pagado: false, fechaPago: null, recibo: null, adeudo: 1850 },
    ],
  },
  {
    unidad: 301,
    historial: [
      { mes: 'Junio 2026', periodo: '2026-06', cuota: 1850, pagado: true, fechaPago: '2026-06-08', recibo: 'recibo-junio.pdf', adeudo: 0 },
      { mes: 'Julio 2026', periodo: '2026-07', cuota: 1850, pagado: true, fechaPago: '2026-07-06', recibo: 'recibo-julio.pdf', adeudo: 0 },
      { mes: 'Agosto 2026', periodo: '2026-08', cuota: 1850, pagado: true, fechaPago: '2026-08-06', recibo: 'recibo-agosto.pdf', adeudo: 0 },
      { mes: 'Septiembre 2026', periodo: '2026-09', cuota: 1850, pagado: false, fechaPago: null, recibo: null, adeudo: 1850 },
    ],
  },
  {
    unidad: 302,
    historial: [
      { mes: 'Mayo 2026', periodo: '2026-05', cuota: 1850, pagado: false, fechaPago: null, recibo: null, adeudo: 1850 },
      { mes: 'Junio 2026', periodo: '2026-06', cuota: 1850, pagado: false, fechaPago: null, recibo: null, adeudo: 1850 },
      { mes: 'Julio 2026', periodo: '2026-07', cuota: 1850, pagado: false, fechaPago: null, recibo: null, adeudo: 1850 },
      { mes: 'Agosto 2026', periodo: '2026-08', cuota: 1850, pagado: false, fechaPago: null, recibo: null, adeudo: 1850 },
      { mes: 'Septiembre 2026', periodo: '2026-09', cuota: 1850, pagado: false, fechaPago: null, recibo: null, adeudo: 1850 },
    ],
  },
  {
    unidad: 303,
    historial: [
      { mes: 'Junio 2026', periodo: '2026-06', cuota: 1850, pagado: true, fechaPago: '2026-06-06', recibo: 'recibo-junio.pdf', adeudo: 0 },
      { mes: 'Julio 2026', periodo: '2026-07', cuota: 1850, pagado: true, fechaPago: '2026-07-09', recibo: 'recibo-julio.pdf', adeudo: 0 },
      { mes: 'Agosto 2026', periodo: '2026-08', cuota: 1850, pagado: true, fechaPago: '2026-08-10', recibo: 'recibo-agosto.pdf', adeudo: 0 },
      { mes: 'Septiembre 2026', periodo: '2026-09', cuota: 1850, pagado: false, fechaPago: null, recibo: null, adeudo: 1850 },
    ],
  },
]

// ---------- Avisos (muro) ----------
export const AVISOS = [
  {
    id: 'a1',
    titulo: 'Suspensión temporal de agua por mantenimiento',
    fecha: '2026-08-28',
    importante: true,
    contenido:
      'El próximo sábado de 9:00 a 14:00 hrs se realizará el mantenimiento programado de la cisterna y bombas. Se suspenderá el servicio de agua en todo el edificio. Gracias por su comprensión.',
  },
  {
    id: 'a2',
    titulo: 'Memoria de la Asamblea General Ordinaria',
    fecha: '2026-08-20',
    importante: true,
    contenido:
      'Ya está disponible el acta y la memoria de la última asamblea. Los acuerdos principales: aprobación del presupuesto anual, renovación del contrato de la empresa de seguridad y creación del fondo de reserva.',
  },
  {
    id: 'a3',
    titulo: 'Recordatorio: cuota de septiembre',
    fecha: '2026-08-18',
    importante: false,
    contenido:
      'La cuota mensual de septiembre vence el día 5. Recuerda que los pagos se pueden realizar por transferencia a la cuenta de la administración. Consulta tu estado de cuenta en esta plataforma.',
  },
  {
    id: 'a4',
    titulo: 'Reglas de uso del área de asadores',
    fecha: '2026-08-10',
    importante: false,
    contenido:
      'A partir de ahora el área de asadores se reserva con 24 hrs de anticipación en la caseta de vigilancia. Se recuerda que el uso es exclusivo para propietarios e inquilinos al corriente.',
  },
]

// ---------- Documentos (repositorio) ----------
export const DOCUMENTOS = [
  {
    id: 'd1',
    titulo: 'Reglamento Interno del Condominio',
    tipo: 'Reglamento',
    fecha: '2026-01-15',
    url: '/docs/reglamento-interno.pdf',
    descripcion: 'Reglamento vigente aprobado en asamblea. Incluye uso de áreas comunes, cuotas y convivencia.',
  },
  {
    id: 'd2',
    titulo: 'Acta de Asamblea General Ordinaria — Agosto 2026',
    tipo: 'Acta de Asamblea',
    fecha: '2026-08-20',
    url: '/docs/acta-asamblea-agosto.pdf',
    esAsambleaReciente: true,
    resumenAcuerdos: [
      'Se aprobó el presupuesto anual del ejercicio 2026-2027.',
      'Se renovó por un año el contrato con la empresa de seguridad.',
      'Se creó el fondo de reserva con aportación de $500 por unidad.',
      'Se eligió a un nuevo vocal de vigilancia.',
    ],
  },
  {
    id: 'd3',
    titulo: 'Estados Financieros Auditados — Ejercicio 2025',
    tipo: 'Estado Financiero',
    fecha: '2026-03-10',
    url: '/docs/estados-financieros-2025.pdf',
    descripcion: 'Reporte auditado de ingresos y egresos del ejercicio 2025.',
  },
  {
    id: 'd4',
    titulo: 'Acta de Asamblea — Reglas de Áreas Comunes',
    tipo: 'Acta de Asamblea',
    fecha: '2026-05-12',
    url: '/docs/acta-reglas-areas.pdf',
    descripcion: 'Acta de la asamblea donde se definieron las reglas de uso de áreas comunes.',
  },
]

// ---------- Helpers que consumen las páginas ----------
// En producción estas funciones se reemplazan por lecturas a Firestore.
// La FORMA de los datos que regresan se mantiene igual.

export function getFondoComun() {
  return fondoComun
}

export function getGastosMes() {
  return [...GASTOS]
}

export function getPagosMes() {
  return [...PAGOS_MES]
}

export function getAvisos() {
  return [...AVISOS].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
}

export function getDocumentos() {
  return [...DOCUMENTOS]
}

export function getAcuerdoReciente() {
  return DOCUMENTOS.find((d) => d.esAsambleaReciente) || null
}

export function getUnidades() {
  return UNIDADES.map(({ password, ...unidad }) => unidad)
}

// Devuelve el estado de cuenta completo de una unidad (por id o email)
export function getEstadoCuentaPorUnidad(unidadId) {
  const unidad = UNIDADES.find((u) => u.id === unidadId)
  if (!unidad) return null
  const estado = ESTADOS_CUENTA.find((e) => e.unidad === unidad.numero)
  return {
    ...unidad,
    historial: (estado?.historial || []).sort((a, b) => b.periodo.localeCompare(a.periodo)),
  }
}

// Lista de unidades morosas: número y monto total adeudado.
export function getUnidadesMorosas() {
  return UNIDADES.map((u) => {
    const estado = ESTADOS_CUENTA.find((e) => e.unidad === u.numero)
    const adeudado = (estado?.historial || []).reduce((sum, h) => sum + h.adeudo, 0)
    return { numero: u.numero, adeudo: adeudado }
  }).filter((u) => u.adeudo > 0)
}

// Simulación de login local (demo). En producción lo hace Firebase Auth.
export function loginDemo(email, password) {
  const user = UNIDADES.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
  if (user && user.password === password) {
    const { password: _pw, ...rest } = user
    return { usuario: rest }
  }
  return null
}

// Totales calculados del módulo de finanzas
export function calcularTotales() {
  const ingresos = getPagosMes().reduce((s, p) => s + p.monto, 0)
  const egresos = getGastosMes().reduce((s, g) => s + g.monto, 0)
  return {
    ingresos,
    egresos,
    saldo: fondoComun.saldoTotal,
    saldoOperativo: fondoComun.saldoTotal + ingresos - egresos,
  }
}

// Buscar en avisos, documentos y conceptos de gasto (módulo 8)
export function buscar(query) {
  const q = query.trim().toLowerCase()
  if (!q) return { avisos: [], documentos: [], gastos: [] }
  return {
    avisos: getAvisos().filter(
      (a) => a.titulo.toLowerCase().includes(q) || a.contenido.toLowerCase().includes(q)
    ),
    documentos: getDocumentos().filter(
      (d) => d.titulo.toLowerCase().includes(q) || (d.descripcion || '').toLowerCase().includes(q)
    ),
    gastos: getGastosMes().filter(
      (g) => g.concepto.toLowerCase().includes(q) || g.categoria.toLowerCase().includes(q)
    ),
  }
}

const MOCK = {
  TORRE,
  fondoComun,
  UNIDADES,
  GASTOS,
  PAGOS_MES,
  ESTADOS_CUENTA,
  AVISOS,
  DOCUMENTOS,
  getFondoComun,
  getGastosMes,
  getPagosMes,
  getAvisos,
  getDocumentos,
  getAcuerdoReciente,
  getUnidades,
  getEstadoCuentaPorUnidad,
  getUnidadesMorosas,
  loginDemo,
  calcularTotales,
  buscar,
}

export default MOCK
