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
      className={`rounded-2xl bg-white shadow-card border border-slate-100 ${
        padding ? 'p-5 sm:p-6' : ''
      } ${hover ? 'transition-shadow duration-200 hover:shadow-card-hover' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
