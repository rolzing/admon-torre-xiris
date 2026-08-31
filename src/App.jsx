// Configuración de rutas y protección por autenticación/rol.

import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import DashboardGeneral from './pages/DashboardGeneral'
import DashboardPersonal from './pages/DashboardPersonal'
import Finanzas from './pages/Finanzas'
import EstadosCuenta from './pages/EstadosCuenta'
import Avisos from './pages/Avisos'
import Documentos from './pages/Documentos'
import Buscador from './pages/Buscador'
import AdminPanel from './pages/AdminPanel'
import { useAuth } from './hooks/useAuth'

function RequireAuth({ children }) {
  const { usuario } = useAuth()
  if (!usuario) return <Navigate to="/login" replace />
  return children
}

function RequireAdmin({ children }) {
  const { usuario } = useAuth()
  if (!usuario) return <Navigate to="/login" replace />
  if (usuario.rol !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  const { usuario } = useAuth()

  // Si no hay sesión, solo se permite el login.
  if (!usuario) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  const esAdmin = usuario.rol === 'admin'

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/dashboard" replace />} />

      {/* Panel principal: general + personal */}
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Layout>
              <DashboardGeneral />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/mi-panel"
        element={
          <RequireAuth>
            <Layout>
              <DashboardPersonal />
            </Layout>
          </RequireAuth>
        }
      />

      <Route
        path="/finanzas"
        element={
          <RequireAuth>
            <Layout>
              <Finanzas />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/estado-de-cuenta"
        element={
          <RequireAuth>
            <Layout>
              <EstadosCuenta />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/avisos"
        element={
          <RequireAuth>
            <Layout>
              <Avisos />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/documentos"
        element={
          <RequireAuth>
            <Layout>
              <Documentos />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/buscar"
        element={
          <RequireAuth>
            <Layout>
              <Buscador />
            </Layout>
          </RequireAuth>
        }
      />

      {esAdmin && (
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <Layout>
                <AdminPanel />
              </Layout>
            </RequireAdmin>
          }
        />
      )}

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
