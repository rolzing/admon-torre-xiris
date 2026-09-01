// Layout general de las páginas autenticadas: Navbar + contenido
// centrado con fondo gris suave (slate-50) y buen whitespace.

import Navbar from '../components/Navbar'
import Footer from './Footer'

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-navy-950">
      <Navbar />
      <main className="page-enter mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">{children}</main>
      <Footer />
    </div>
  )
}
