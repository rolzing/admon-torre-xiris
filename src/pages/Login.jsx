// Página de inicio de sesión. En producción usa Appwrite Auth
// (createEmailPasswordSession). En demo valida contra mockData.

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/Button'
import Footer from '../components/Footer'
import { IconoEdificio } from '../components/Icons'
import { TORRE } from '../config/torre'

const DEMO_CREDENTIALS = [
  { rol: 'Administrador', email: 'encargado@mirador.mx', password: 'admin123' },
  { rol: 'Inquilino', email: 'unidad201@mirador.mx', password: 'Test123456' },
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      navigate(user.rol === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-navy-900">
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-600 text-white text-3xl shadow-lg mb-4">
            <IconoEdificio />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Portal del Condominio</h1>
          <p className="mt-1 text-sm text-slate-400">{TORRE.nombre}</p>
          <p className="mt-3 max-w-sm text-sm text-slate-300">
            Tu información al alcance: finanzas, avisos, documentos y estados de cuenta, sin
            tener que buscar en el chat.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-card dark:bg-navy-900 dark:shadow-none">
          <h2 className="mb-4 text-lg font-bold text-navy-900 dark:text-white">Iniciar sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-200 dark:border-slate-700 dark:bg-navy-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-200 dark:border-slate-700 dark:bg-navy-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                required
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/15 dark:text-red-300">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Ingresando…' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-navy-800/60">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Cuentas demo
            </p>
            <div className="space-y-2">
              {DEMO_CREDENTIALS.map((c) => (
                <button
                  key={c.email}
                  type="button"
                  onClick={() => {
                    setEmail(c.email)
                    setPassword(c.password)
                  }}
                  className="flex w-full items-center justify-between rounded-lg bg-white px-3 py-2 text-left text-sm shadow-sm transition hover:bg-slate-50 dark:bg-navy-800 dark:hover:bg-navy-700"
                >
                  <span className="font-medium text-navy-800 dark:text-slate-100">{c.rol}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">{c.email}</span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
              Toca una cuenta para autocompletar y pulsa «Entrar». Otras unidades usan
              «demo123».
            </p>
          </div>
        </div>
        </div>
      </div>
      <Footer className="border-white/10 bg-navy-900" />
    </div>
  )
}
