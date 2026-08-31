// ============================================================
//  CONFIGURACIÓN DE WHATSAPP (Twilio) — PLACEHOLDER
//  ============================================================
//  ⚠️  IMPORTANTE: En este DEMO NO hay ninguna lógica de
//  WhatsApp/Twilio implementada. Este archivo es únicamente
//  un "contrato de configuración" que documenta dónde se
//  engancharía el bot en el futuro.
//
//  PLAN PARA PRODUCCIÓN (fuera del alcance de este demo):
//  --------------------------------------------------------
//  1. Crear una Cloud Function de Firebase
//     (functions/whatsapp.js, en un repo por separado o la
//     carpeta /functions de este mismo proyecto).
//  2. Registrar un número de WhatsApp en Twilio y configurar
//     el Webhook entrante para apuntar a esa función.
//  3. En la función: al recibir un mensaje de un inquilino,
//     buscar a la unidad por su número de teléfono en la
//     misma base de datos de Firebase y responder con su
//     estado de cuenta / saldo / avisos.
//
//  Las variables de entorno que esperaría esa función se
//  leen desde el entorno de Firebase / Vercel (nunca debe
//  viajar un secreto en el bundle del cliente).
// ============================================================

export const WHATSAPP_CONFIG = {
  /**
   * SID de la cuenta Twilio. Fuente: console.twilio.com
   * Variable de entorno de producción: TWILIO_ACCOUNT_SID
   */
  accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID || '',

  /**
   * Token de autenticación de la cuenta Twilio (SECRETO).
   * Variable de entorno de producción: TWILIO_AUTH_TOKEN
   */
  authToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN || '',

  /**
   * Número de WhatsApp desde el cual Twilio envía/recibe.
   * Formato E.164, ej. '+5215512345678'
   * Variable de entorno de producción: TWILIO_WHATSAPP_NUMBER
   */
  whatsappNumber: import.meta.env.VITE_TWILIO_WHATSAPP_NUMBER || '',
}

// ------------------------------------------------------------------
//  NOTA TÉCNICA PARA EL INTEGRADOR
//  ------------------------------------------------------------------
//  El bot consultaría la MISMA base de datos de Firebase que usa la
//  interfaz web. Por eso aquí NO duplicamos datos: la fuente de
//  verdad única vive en Firestore (o en mockData.js para el demo).
//
//  Ejemplo conceptual de la Cloud Function futura (NO ejecutar ahora):
//
//    export const whatsappWebhook = functions.https.onRequest(
//      async (req, res) => {
//        const { From, Body } = req.body            // de Twilio
//        const unidad = await findUnidadByPhone(From)
//        const saldo   = await getSaldoUnidad(unidad.id)
//        const reply   = `Unidad ${unidad.numero}: su saldo es $${saldo}`
//        await twilio.messages.create({ to: From, from: FROM, body: reply })
//        res.send('<Response></Response>')
//      }
//    )
// ------------------------------------------------------------------
