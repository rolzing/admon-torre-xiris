// Componente de tarjeta reutilizable con esquinas redondeadas
// y sombra suave, base del lenguaje visual de la plataforma.

export default function Card({
  children,
  className = '',
  padding = true,
  hover = false,
}) {
  return (
    <div
      className={`rounded-2xl bg-white shadow-card border border-slate-100 dark:bg-navy-900 dark:border-slate-800 dark:shadow-none ${
        padding ? 'p-5 sm:p-6' : ''
      } ${hover ? 'card-hover hover:shadow-card-hover hover:border-slate-200 dark:hover:border-slate-700' : 'transition-colors duration-200'} ${className}`}
    >
      {children}
    </div>
  )
}
