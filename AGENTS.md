# AGENTS.md — Portal del Condominio (Torre Xiris)

Guía de contexto para agentes de IA y desarrolladores. Documenta la arquitectura
actual, cómo está conectada cada pieza, los pasos operativos y lo que falta por hacer.

> **Última actualización:** 2026-09-01
> **Stack:** React (Vite) + Appwrite Cloud (TablesDB) + Appwrite Functions
> **Repositorio:** https://github.com/rolzing/admon-torre-xiris (rama `main`)
> **Producción:** https://admon-torre-xiris.vercel.app

---

## 1. Panorama general

App web del administrador y residentes de un condominio: avisos, finanzas
(gastos/pagos), documentos, estados de cuenta por unidad y un panel de administración.

- **Frontend:** React 18 + Vite 5, React Router. No usa backend propio: habla
  directo con **Appwrite Cloud**.
- **Backend:** Appwrite Cloud (proyecto "My first project"). Almacenamiento en
  **TablesDB** (Appwrite v2), accedido **solo desde Appwrite Functions** del lado
  del servidor (donde vive la API key). El navegador **no** accede a las tablas
  directamente.

**Arquitectura de datos (decisión clave):**
Toda lectura/escritura de datos pasa por la **Appwrite Function `administracion`**
(se invoca por HTTP `POST` desde el frontend). El navegador solo usa el SDK para
**autenticación** (`Account`); nunca maneja la API key ni accede a TablesDB.

> ⚠️ **Regla de oro:** el frontend nunca contiene secretos. La API key vive solo
> en las variables de entorno de las funciones (gitignored).

---

## 2. Stack y versiones

| Capa | Tecnología | Versión |
|---|---|---|
| Frontend | React + Vite | React 18, Vite 5 |
| Router | react-router-dom | v6 |
| SDK cliente | `appwrite` (Browser, solo `Account`) | 16.x |
| Backend SDK (funciones) | `node-appwrite` (TablesDB) | ^28.0.0 |
| Funciones runtime | node-22 (build s-2vcpu-2gb) | — |
| Cloud | Appwrite Cloud, región `fra` | API v2 / TablesDB |

**Endpoints e IDs de Appwrite:**
- Endpoint: `https://fra.cloud.appwrite.io/v1`
- Project ID: `6a95ff16003616503f0a`
- Database (TablesDB): `6a961d5000022d07ecad` (nombre "Production")
- Storage bucket: `6a9617370036b267259c` (no usado aún; subidas pendientes)
- Org (team): `6a95ff150037cd3f5a60`

---

## 3. Estructura del repositorio

```
condominio-portal/
├── appwrite.config.json        # Definición de funciones + proyecto (deploy CLI)
├── .env                        # Variables reales del frontend (GITIGNORED)
├── .env.example                # Plantilla de variables (commitado)
├── .gitignore                  # Ignora .env*, .vercel, node_modules, etc.
├── functions/
│   ├── administracion/        # Appwrite Function: toda la lógica de datos
│   │   ├── src/main.js        #  Acciones (crear/listar/leer) sobre TablesDB
│   │   └── .env               #  Secretos de la función (GITIGNORED)
│   └── seed/                  # SCRIPT LOCAL (ya NO es función desplegada)
│       ├── src/main.js        #  runSeed(): crea tablas + siembra datos
│       └── .env               #  Secretos (GITIGNORED)
├── src/
│   ├── config/appwrite.js     # Cliente, Account, callFunction, callFunctionMultipart
│   ├── config/torre.js
│   ├── hooks/
│   │   ├── useAuth.jsx        # Contexto: { usuario, esAdmin, login, logout }
│   │   └── useFinanzas.js
│   ├── pages/                 # Login, Inicio, Dashboard, AdminPanel, etc.
│   ├── services/
│   │   ├── auth.service.js    # signIn/signOut/getSession/fetchUserRole (Appwrite o mock)
│   │   ├── avisos.service.js  # listas/crea avisos via callFunction
│   │   ├── finanzas.service.js# gastos/pagos/fondo via callFunction
│   │   ├── documentos.service.js
│   │   ├── estadosCuenta.service.js
│   │   ├── storage.service.js # placeholder (subida de archivos pendiente)
│   │   └── mockData.js        # datos mock (solo si no hay proyecto configurado)
│   └── utils/storage.js       # helpers localStorage
└── .vercel/                   # Link de Vercel (GITIGNORED)
```

---

## 4. Modo mock vs. producción

`src/config/appwrite.js` define `APPWRITE_CONFIGURED`.

```js
export const APPWRITE_CONFIGURED = Boolean(
  APPWRITE_CONFIG.endpoint && APPWRITE_CONFIG.projectId
)
```

- **Mock** (`APPWRITE_CONFIGURED === false`): si `VITE_APPWRITE_ENDPOINT` o
  `VITE_APPWRITE_PROJECT_ID` están vacíos. Usa `mockData` y `loginDemo`.
- **Producción real**: cuando hay endpoint + projectId. Usa Appwrite Account para
  auth y la Function para datos.

Los servicios (`*.service.js`) ramifican según `APPWRITE_CONFIGURED`.

---

## 5. Variables de entorno

### Frontend (`.env`, raíz) — importadas por Vite (`VITE_*`)

| Variable | Valor en producción | Uso |
|---|---|---|
| `VITE_APPWRITE_ENDPOINT` | `https://fra.cloud.appwrite.io/v1` | Cliente Appwrite |
| `VITE_APPWRITE_PROJECT_ID` | `6a95ff16003616503f0a` | ID de proyecto |
| `VITE_APPWRITE_DATABASE_ID` | `6a961d5000022d07ecad` | DB (referencia) |
| `VITE_APPWRITE_FUNCTION_URL` | `https://administracion.fra.appwrite.run` | URL de la function |

> El `.env` raíz está **gitignored**. En **Vercel** estas variables deben estar en
> Settings → Environment Variables (ya agregadas a Production: ENDPOINT, PROJECT_ID,
> FUNCTION_URL). El build en Vercel NO lee el `.env` local.

### Function `administracion` (`functions/administracion/.env`) — gitignored

| Variable | Valor |
|---|---|
| `APPWRITE_ENDPOINT` | `https://fra.cloud.appwrite.io/v1` |
| `APPWRITE_PROJECT_ID` | `6a95ff16003616503f0a` |
| `APPWRITE_DATABASE_ID` | `6a961d5000022d07ecad` |
| `APPWRITE_API_KEY` | `standard_cfd9…` (secreto, tiene scopes TablesDB) |
| `APPWRITE_TABLE_*` | `unidades, avisos, gastos, documentos, pagos, fondo, estados_cuenta, usuarios` |
| `APPWRITE_STORAGE_BUCKET_ID` | `6a9617370036b267259c` |

### Script `seed` (`functions/seed/.env`) — gitignored

Mismas variables (`APPWRITE_ENDPOINT`, `APPWRITE_PROJECT_ID`, `APPWRITE_DATABASE_ID`,
`APPWRITE_API_KEY`).

> ⚠️ La key `standard_cfd9…` está activa. Hubo una key anterior (`standard_dc25…`)
> expuesta en sesiones anteriores: se recomienda **revocarla** en la consola.

---

## 6. Appwrite Functions

### `administracion` (única función desplegada)
- **`execute: ["any"]`** — se invoca de forma pública (sin sesión) por `POST`.
- URL: `https://administracion.fra.appwrite.run`
- Recibe `{ accion, ...datos }` en el body JSON.
- **CORS**: resuelto manualmente en el código (Appwrite v2 no emite CORS en
  functions). Responde a `OPTIONS` (preflight) y agrega
  `Access-Control-Allow-Origin: *` a toda respuesta.
- Formato: `export default async ({ req, res }) => { ... }`, con helper `send()`
  que añade los headers CORS.

**Acciones disponibles:**

| Acción | Método | Descripción |
|---|---|---|
| `crear_aviso` | TablesDB | Crea un aviso |
| `listar_avisos` | TablesDB | Lista avisos (orden fecha desc) |
| `crear_gasto` | TablesDB | Crea un gasto |
| `listar_gastos` | TablesDB | Lista gastos |
| `listar_pagos` | TablesDB | Lista pagos |
| `crear_documento` | TablesDB | Crea un documento |
| `listar_documentos` | TablesDB | Lista documentos |
| `get_asamblea_reciente` | TablesDB | Devuelve doc de asamblea reciente |
| `get_fondo` | TablesDB | Fondo común |
| `listar_unidades` | TablesDB | Lista unidades |
| `listar_unidades_estado` | TablesDB | Unidades + adeudo/pendientes |
| `get_estado_cuenta` | TablesDB | Estado de cuenta por unidad |
| `get_usuario_rol` | TablesDB | Rol/unidad de un usuario por su `$id` |

### `seed` — convertida a SCRIPT LOCAL (ya no está en Appwrite)
Para liberar slots del plan free, la función `seed` se eliminó de Appwrite y ahora
se ejecuta localmente como script idempotente.

**Uso:**
```bash
cd functions/seed
npm run seed        # == node --env-file=.env src/main.js
```
Crea las tablas y columnas si faltan y solo inserta filas que no existan
(idempotente). Úsala para crear la base desde cero o repoblar.

**Tablas creadas por la seed:** `unidades`, `avisos`, `documentos`, `gastos`,
`pagos`, `fondo`, `estados_cuenta`, `usuarios`.

---

## 7. Autenticación (Appwrite Auth)

- **Login**: `auth.service.js` → `account.createEmailPasswordSession(email, password)`
  + `account.get()`.
- **Rol/unidad**: se resuelven vía la table `usuarios` (rowId = `$id` del usuario).
  El frontend llama `get_usuario_rol` (por la Function) con el `$id`; si no hay
  registro, devuelve `usuario: null` y se asume rol `inquilino` por defecto.
- **Sesión persistida** en localStorage (`USER_SESSION_KEY`) por `useAuth`; se
  valida con `account.get()` al recargar.

### Cuentas demo (creadas en Appwrite)
| Usuario | `$id` | Email | Password | Rol | Unidad |
|---|---|---|---|---|---|
| Admin | `user-admin-demo` | `encargado@mirador.mx` | `admin123` | `admin` | (ninguna) |
| Inquilino | `user-unidad201` | `unidad201@mirador.mx` | `Test123456` | `inquilino` | 201 |

> En `src/pages/Login.jsx` hay botones "Cuentas demo" que autocompletan email y
> password (auto-relleno para el demo). Mantener sincronizados con Appwrite.

---

## 8. CORS / Web Platforms (Appwrite)

Appwrite controla el CORS de los **endpoints estándar del proyecto** mediante
"web platforms". Las **funciones** NO heredan ese CORS (se resuelve manual en el
código de la function).

Plataformas web registradas:
- `web-permit-cors` → hostname `localhost` (desarrollo)
- `web-vercel-<timestamp>` → hostname `admon-torre-xiris.vercel.app` (producción)

**Síntoma resuelto:** el login daba **403** en el navegador (pero 201 en curl)
porque el origen de producción no estaba registrado. Se agregó la web platform de
Vercel y el CORS quedó OK.

**Agregar una web platform (sin el CLI, vía API):**
```bash
curl -X POST -H "X-Appwrite-Key: $KEY" -H "X-Appwrite-Project: $PROJECT_ID" \
  -H "Content-Type: application/json" \
  -d '{"platformId":"app-<unico>","name":"...","hostname":"tudominio.com"}' \
  "https://fra.cloud.appwrite.io/v1/project/platforms/web"
```
> El `hostname` no incluye esquema ni puerto. Usa un `platformId` único (mejor con
> timestamp): Appwrite devuelve **409 "already exists"** si el ID se repite aunque
> la plataforma no figure al listar.

---

## 9. Vercel / despliegue

- **Proyecto Vercel:** `admon-torre-xiris` → `https://admon-torre-xiris.vercel.app`.
- Conectado a GitHub (deploy automático por push a `main`).
- Build: `vite build` (output `dist`). Node 24.x en Vercel.
- **Variables de entorno (Vercel, Production)**: `VITE_APPWRITE_ENDPOINT`,
  `VITE_APPWRITE_PROJECT_ID`, `VITE_APPWRITE_FUNCTION_URL` (ya agregadas).
  Vercel NO lee el `.env` local (gitignored).

**CLI de Vercel (útil):**
```bash
node -v                                          # usar Node 20
export PATH=/Users/richard/.nvm/versions/node/v20.19.6/bin:$PATH
vercel login                                     # autenticación (navegador)
vercel link --yes --project admon-torre-xiris    # vincular el directorio
vercel env add VITE_X production --value "<v>" --yes   # agregar variable
vercel --prod --yes                              # deploy a producción
```

El **CORS de Appwrite** ya cubre el dominio de Vercel, así que el login y las
llamadas a la function funcionan en producción sin redeploy.

---

## 10. Lo que falta por hacer (TODO)

1. **Subida de archivos (imágenes/facturas) — PENDIENTE.**
   Appwrite v2 no expone archivos en `req.files` dentro de una Function (expone el
   multipart como string en `req.body`). Se decidió **diferir**: los documentos/avisos
   guardan `fileId` como texto pero no se sube el binario. Opciones a futuro:
   subir directo al Storage bucket desde el cliente (revisar permisos) o parsear
   el multipart dentro de la function. Ver `storage.service.js` (placeholder) y la
   nota `callFunctionMultipart` en `config/appwrite.js`.
2. **Verificar/limpiar variables heredadas.** En Vercel quedaron variables de
   Firebase y Twilio de la migración. No se usan ya; pueden removerse.
3. **Revocar la API key antigua `standard_dc25…`** (expuesta en sesiones previas).
4. **Revisar permisos de la function.** `execute: ["any"]` + CORS `*` es abierto.
   Para producción se recomienda restringir orígenes en `Access-Control-Allow-Origin`
   a `localhost` + dominio de Vercel (no `*`).
5. **Scopes/Directorio de funciones:** al desplegar `administracion`, el scope
   `users.read` en `appwrite.config.json` está presente; validar que la API key
   tenga los scopes de TablesDB necesarios (tables.read/write, columns.write,
   rows.read/write) — ya verificados.
6. **Estados de cuenta / exportaciones:** los recibo/factura son campos de texto;
   no se generan archivos PDF.

---

## 11. Comandos útiles

```bash
# Instalar dependencias frontend
npm install

# Local (mock si no hay .env, o real con .env)
npm run dev           # http://localhost:3000

# Build producción
npm run build

# Ejecutar la seed (repoblar base)
cd functions/seed && npm run seed

# Desplegar la function administracion (con variables del .env)
cd ../..  # raíz
export PATH=/Users/richard/.nvm/versions/node/v20.19.6/bin:$PATH
appwrite push function --function-id administracion --with-variables --force

# Probar la function (CORS activo, acceso público)
curl -X POST -H "Content-Type: application/json" -H "X-Appwrite-Project: 6a95ff16003616503f0a" \
  -d '{"accion":"get_fondo"}' https://administracion.fra.appwrite.run
```

---

## 12. Flujo de login (referencia rápida)

1. `Login.jsx` → `useAuth().login(email, password)` → `auth.service.signIn`.
2. `createEmailPasswordSession` (Appwrite, CORS desde dominio permitido).
3. `account.get()` → `$id`.
4. `fetchUserRole($id)` → `callFunction("get_usuario_rol", { userId })` →
   lee tabla `usuarios/{$id}`.
5. `mapAppwriteUser` combina cuenta + rol/unidad → se guarda en el estado.
6. `App.jsx` redirige según `usuario.rol`: `/admin` (admin) o `/dashboard` (resto).

---

## 13. Control de versiones (versionado automático con release-please)

> **Regla:** el versionado es **automático**. En cada push a `main`, el GitHub
> Action `release-please` (`.github/workflows/release-please.yml`):
> 1. Analiza los mensajes de commit desde el último release.
> 2. Calcula el bump SemVer automáticamente.
> 3. Bumpea `package.json`.
> 4. Abre un **PR de release** (bump + `CHANGELOG.md`). Al mergear ese PR, se
>    crea el **tag** (`vX.Y.Z`) y el **GitHub Release**.
>
> Por eso **NO se debe crear tags manualmente** ni usar `npm version`; release-please
> lo hace solo. El agente/desarrollador solo escribe mensajes de commit correctos y
> mergea el PR de release cuando aparece.

### Requisito de permisos (GITHUB_TOKEN)
release-please necesita que el Action tenga permiso de **escritura** en el repo y
pueda **crear PRs**. Ya está configurado en Settings → Actions → General:
`default_workflow_permissions: write` y `can_approve_pull_request_reviews: true`.
> ⚠️ Si el Action falla con *"GitHub Actions is not permitted to create or approve
> pull requests"*, revisar que esas dos opciones sigan habilitadas.

### Convención de commits (Conventional Commits) — REQUERIDO
Para que el bump automático sea correcto, los mensajes de commit DEBEN seguir
**Conventional Commits**. El `release-please` mapea así:

| Prefijo del mensaje | Bump | Ejemplo |
|---|---|---|
| `feat:` | **MINOR** | `feat: agregar panel de pagos` |
| `fix:` | **PATCH** | `fix: corregir login en producción` |
| `perf:`, `refactor:`, `docs:`, `chore:`, `test:` | **PATCH** (si aplica) o sin release | `docs: actualizar AGENTS.md` |
| `BREAKING CHANGE` o `feat!:` | **MAJOR** | `feat!: migrar a Appwrite v2` |

Reglas:
- El mensaje empieza con el tipo + `:` + espacio + descripción en español.
- Para cambios que rompen, añadir `!` tras el tipo o una línea `BREAKING CHANGE:`.
- **No usar** mensajes sin prefijo de tipo (como «Agregar AGENTS.md») para cambios
  de código, porque no generan bump. Para solo-documentación se usa `docs:`.

### Flujo normal (commits + push + merge del PR de release)
```bash
# 1) Commit con Conventional Commit
git add <archivos>
git commit -m "feat: <descripción en español>"

# 2) Push a main — release-please abre el PR de release (bump + changelog)
git push origin main

# 3) Mergear el PR de release que aparece (bumpea package.json)
#    → al mergear se crea el tag vX.Y.Z y el GitHub Release
gh pr merge <N> --merge     # o mergear desde la web
```

### Solo-documentación
```bash
git commit -m "docs: actualizar AGENTS.md"
git push origin main
# No genera release nuevo (o solo PATCH según sea), pero se versiona igual.
```

### Recordatorios
- Revisar antes de commitear: `git status`, `git diff --stat`, `git log --oneline -5`.
- **No commitear** `.agents/`, `.claude/`, `.env*` (ni el `.env` real ni los de
  las funciones): están fuera del alcance o gitignored.
- **No** crear tags ni releases manualmente: lo hace el Action.
- El primer tag manual existente es `v0.1.0` (estado inicial de la automatización).

### Registro de versiones (los completa release-please en los GitHub Releases)
| Tag | Descripción |
|---|---|
| `v1.1.1` | **Publicada.** Ajustes de documentación tras automatizar el versionado. Última versión. |
| `v1.1.0` | **Publicada.** Versionado automático (release-please) + permiso write de Actions. |
| `v0.1.0` | Estado inicial: auth Appwrite, CORS producción, Vercel, seed local, AGENTS.md |

> Historial completo y changelog: pestaña **Releases** del repositorio.

### Flujo verificado (funcionando end-to-end)
1. `git push origin main` con commits Conventional Commits.
2. release-please (GitHub Action) calcula el bump y **abre un PR de release**.
3. Mergear ese PR → release-please publica el **tag** y el **GitHub Release** automáticamente.

> Cada push que contenga un `feat:`/`fix:` genera un PR de release con bump propio.
> Los pushes de solo-documentación (`docs:`) generan bump PATCH (p.ej. 1.1.0 → 1.1.1).

---

## 14. Notas de seguridad

- La API key **solo** vive en `.env` de las funciones (gitignored). Nunca en el
  frontend, bundle, ni en variables que el navegador pueda leer.
- El `.gitignore` ignora `.env*` y `.vercel`.
- Las funciones son públicas por diseño actual (demo); revisar antes de exponer
  datos sensibles a producción real.
- `<code-base>`: este archivo debe mantenerse actualizado cuando cambie la
  arquitectura (tablas, acciones, endpoints, credenciales de despliegue).
