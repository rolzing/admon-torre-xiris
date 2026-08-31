// Layout general de las páginas autenticadas: Navbar + contenido
// centrado con fondo gris suave (slate-50) y buen whitespace.

import Navbar from '../components/Navbar'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">{children}</main>
    </div>
  )
}
