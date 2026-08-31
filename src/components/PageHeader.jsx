// Encabezado de página reutilizable: título, descripción y acción opcional.

export default function PageHeader({ title, description, action }) {
  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold text-navy-900">{title}</h1>
        {description && <p className="mt-1 text-slate-500">{description}</p>}
      </div>
      {action}
    </header>
  )
}
