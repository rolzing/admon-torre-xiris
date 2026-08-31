# Portal del Condominio 🏢

Portal web **informativo** para la administración de un condominio/torre residencial.
Reemplaza el caos de un chat de WhatsApp donde la gente pelea y no encuentra información,
por una plataforma clara donde cada inquilino consulta su información: finanzas, avisos,
documentos y estados de cuenta.

> **Demo:** se ejecuta 100% con datos de ejemplo (mock), sin necesidad de credenciales.
> El código ya está estructurado para conectarse a **Appwrite** (Auth + Database + Storage)
> y a Google Sheets en producción.

---

## ✨ ¿Qué responde la plataforma?

| Pregunta del inquilino | Dónde encontrarla |
| ---------------------- | ----------------- |
| ¿Cuánto hay en la cuenta de la torre? | Dashboard / Módulo Finanzas |
| ¿Cuánto se gastó este mes? | Módulo Finanzas |
| ¿En qué se gastó? | Módulo Finanzas (desglose por concepto/categoría) |
| ¿Qué cuotas se han pagado? | Módulo Finanzas (tabla de cuotas) |
| ¿Qué unidades tienen adeudos? | Módulo Finanzas (morosidad) |
| ¿Cuál es mi estado de cuenta? | Módulo Estados de Cuenta |
| ¿Cuándo se hizo mi pago? | Módulo Estados de Cuenta (fechas + filtro) |
| ¿Cuál es el reglamento? | Módulo Documentos |
| ¿Cuáles fueron los acuerdos de la asamblea? | Módulo Documentos (sección destacada) |
| ¿Qué avisos oficiales existen? | Muro de Avisos |
| ¿Dónde están actas y documentos? | Módulo Documentos |

Además hay un **buscador** por palabra clave en avisos, documentos y conceptos de gasto.

---

## 🚀 Cómo correrlo localmente

Requiere Node 18+.

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`. No necesitas configurar nada para ver el demo.

### Cuentas demo

| Rol | Email | Contraseña |
| --- | ----- | ---------- |
| Administrador | `encargado@mirador.mx` | `admin123` |
| Inquilino (unidad 201) | `unidad201@mirador.mx` | `demo123` |

Cualquier otra unidad usa `demo123` (unidad202, unidad301, unidad302, unidad303).

---

## 🧱 Stack técnico

- **React 18 + Vite** (build rápido, despliegue sencillo en Vercel)
- **React Router** para navegación
- **Tailwind CSS** para el estilo visual (cards, sombras suaves, azul marino + acento verde)
- **Appwrite** (Auth + Database + Storage) — *estructura lista, uso mock en demo*
- **Sin backend propio**: sin Express, sin servidor Node independiente

---

## 📁 Estructura de archivos

```
src/
├── services/            # Capa de servicios (cada archivo = una responsabilidad)
│   ├── auth.service.js       # Autenticación y sesión (Appwrite Auth o mock)
│   ├── finanzas.service.js   # Fondo, gastos, pagos, morosidad (Database o mock)
│   ├── avisos.service.js     # Muro de avisos
│   ├── documentos.service.js # Repositorio documental
│   ├── estadosCuenta.service.js # Estados de cuenta y unidades
│   ├── storage.service.js    # Archivos (Appwrite Storage o mock)
│   ├── buscar.service.js     # Búsqueda por palabra clave
│   └── mockData.js           # Datos de ejemplo (simulan lo que vendría de Appwrite/Sheets)
├── config/
│   ├── appwrite.js      # Inicialización del cliente Appwrite (env vars)
│   ├── torre.js         # Identidad estática de la torre
│   └── whatsapp.js      # Placeholder de config Twilio (sin lógica implementada)
├── pages/               # Login, DashboardGeneral, DashboardPersonal, Finanzas,
│                        # EstadosCuenta, Avisos, Documentos, Buscador, AdminPanel
├── components/          # Navbar, Card, StatCard, Table, Badge, SearchBar, Button, Layout…
├── hooks/               # useAuth, useFinanzas, useEstadoCuenta, useAvisos, useDocumentos
├── utils/               # format (moneda/fechas), storage (claves locales)
├── App.jsx              # rutas + guard de autenticación/rol
└── main.jsx
.env.example             # variables de entorno documentadas (Appwrite + Twilio)
```

---

## 🔐 Variables de entorno

Copia `.env.example` a `.env` **solo si vas a conectar un proyecto Appwrite real**. Para el
demo no hace falta.

| Variable | Para qué sirve |
| -------- | -------------- |
| `VITE_APPWRITE_ENDPOINT` | Appwrite (p. ej. `https://cloud.appwrite.io/v1`) |
| `VITE_APPWRITE_PROJECT_ID` | ID del proyecto Appwrite |
| `VITE_APPWRITE_DATABASE_ID` | ID de la Database |
| `VITE_APPWRITE_COLLECTION_UNIDADES` | Colección de unidades |
| `VITE_APPWRITE_COLLECTION_AVISOS` | Colección de avisos |
| `VITE_APPWRITE_COLLECTION_DOCUMENTOS` | Colección de documentos |
| `VITE_APPWRITE_COLLECTION_GASTOS` | Colección de gastos |
| `VITE_APPWRITE_COLLECTION_PAGOS` | Colección de pagos |
| `VITE_APPWRITE_STORAGE_BUCKET_ID` | Bucket de Storage (archivos) |
| `VITE_TWILIO_ACCOUNT_SID` | Futuro bot WhatsApp (secreto) |
| `VITE_TWILIO_AUTH_TOKEN` | Futuro bot WhatsApp (secreto) |
| `VITE_TWILIO_WHATSAPP_NUMBER` | Número WhatsApp del bot |

> ⚠️ Las variables de Twilio son **secretos**: en producción deben vivir en el entorno de la
> función (Appwrite Functions / Vercel), **nunca** en el bundle del cliente. El archivo
> `src/config/whatsapp.js` documenta el contrato de configuración.

---

## ☁️ Deploy en Vercel

1. Sube el repo a GitHub.
2. En [vercel.com](https://vercel.com) → *New Project* → importa el repo.
3. Vercel detecta automáticamente **Vite** (build `vite build`, output `dist`). No hace falta
   configuración extra.
4. Opcional: agrega las variables de entorno (`VITE_APPWRITE_*`) con el endpoint y los IDs de
   tu proyecto Appwrite en *Settings → Environment Variables*.

---

## 📝 Lo que falta implementar (demo → producción)

1. **Appwrite real**
   - Crear un proyecto en Appwrite (console / cloud.appwrite.io), habilitar Auth (email),
     crear una Database (con las colecciones de `unidades`, `avisos`, `documentos`, `gastos`
     y `pagos`) y un Storage bucket.
   - Crear usuarios con emails reales y asignar rol (atributo `rol` en la colección de unidades)
     o usar *teams/roles* de Appwrite.
   - Completar los `TODO(producción)` de los archivos en `src/services/` que ya dejan el punto de
     integración (autenticación, lectura/escritura de datos y subida de archivos).

2. **Sincronización con Google Sheets**
   - Implementar una Appwrite Function (o microservicio) que lea la hoja de cálculo de la
     administración y escriba en Appwrite Database (gastos, pagos, estados de cuenta) de forma
     periódica. El comentario en `AdminPanel` y `mockData.js` documenta dónde iría esta
     integración.

3. **Bot de WhatsApp vía Twilio**
   - Crear una función (Appwrite Function o microservicio) que reciba el webhook de Twilio y
     responda con el estado de cuenta de la unidad, consultando la **misma** base de datos de
     Appwrite. Configurar el número en el panel de Twilio. Ver `src/config/whatsapp.js`.

4. **Generación de recibos PDF reales**
   - Actualmente el recibo se genera como un archivo de texto de demostración. Producción:
     generar un PDF (p. ej. `pdf-lib` o `jsPDF`) o subir plantillas a Appwrite Storage.

5. **Autenticación por unidad real**
   - Vincular cada cuenta al número de unidad y, opcionalmente, al número de teléfono para el
     bot de WhatsApp (detección de la unidad a partir del `From` de Twilio).

**Explícitamente fuera de alcance** en este demo (y no deseado): pasarela de pagos, facturación
CFDI, seguridad avanzada de roles, webhook de Twilio e integración real de Sheets.

---

## 🎨 Nota de diseño

El lenguaje visual (cars con esquinas redondeadas, sombras suaves, tonos azul marino/gris
carbón con acento verde, tipografía Inter y cifras destacadas como métricas) es **similar** al
de plataformas proptech mexicanas como Neivor, tomado **solo como referencia de estilo**.
No se usan su marca, logo, colores exactos ni contenido textual.
