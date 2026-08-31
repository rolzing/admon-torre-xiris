// Barra de navegación superior (desktop) + navegación inferior (móvil).
// Estilo corporativo: fondo azul marino oscuro (navy-800), sombra y
// acceso rápido a los módulos.

import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { TORRE } from '../services/mockData'
import {
  IconoEdificio,
  IconoDolar,
  IconoRecibo,
  IconoAviso,
  IconoDocumento,
  IconoGrafica,
  IconoBuscar,
  IconoCerrar,
  IconoUsuario,
} from './Icons'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Panel', icon: IconoEdificio },
  { to: '/finanzas', label: 'Finanzas', icon: IconoDolar },
  { to: '/estado-de-cuenta', label: 'Mi cuenta', icon: IconoRecibo },
  { to: '/avisos', label: 'Avisos', icon: IconoAviso },
  { to: '/documentos', label: 'Documentos', icon: IconoDocumento },
]

export default function Navbar() {
  const { usuario, esAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const linkCls = ({ isActive }) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
    }`

  return (
    <nav className="sticky top-0 z-30 border-b border-white/10 bg-navy-800 text-white shadow-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <NavLink to="/dashboard" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-600 text-white">
            <IconoEdificio />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold">Portal del Condominio</p>
            <p className="hidden text-xs text-slate-400 sm:block">{TORRE.nombre}</p>
          </div>
        </NavLink>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkCls}>
              <span className="text-base">{item.icon()}</span>
              {item.label}
            </NavLink>
          ))}
          <NavLink to="/buscar" className={linkCls}>
            <span className="text-base">
              <IconoBuscar />
            </span>
            Buscar
          </NavLink>
          {esAdmin && (
            <NavLink to="/admin" className={linkCls}>
              <span className="text-base">
                <IconoGrafica />
              </span>
              Admin
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium">{usuario?.propietario}</p>
            <p className="text-xs text-slate-400">Unidad {usuario?.numero}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-slate-200 transition hover:bg-white/20"
            title="Cerrar sesión"
          >
            <IconoCerrar />
          </button>
        </div>
      </div>

      {/* Nav inferior móvil */}
      <div className="border-t border-white/10 bg-navy-900 md:hidden">
        <div className="mx-auto flex max-w-6xl items-stretch justify-around overflow-x-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-2 text-[11px] font-medium ${
                  isActive ? 'text-accent-300' : 'text-slate-400'
                }`
              }
            >
              <span className="text-xl">{item.icon()}</span>
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to={esAdmin ? '/admin' : '/buscar'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-2 text-[11px] font-medium ${
                isActive ? 'text-accent-300' : 'text-slate-400'
              }`
            }
          >
            <span className="text-xl">{esAdmin ? <IconoGrafica /> : <IconoBuscar />}</span>
            {esAdmin ? 'Admin' : 'Buscar'}
          </NavLink>
        </div>
      </div>
    </nav>
  )
}
