// Conjunto simple y consistente de iconos SVG (trazo lineal).
// Sin dependencias externas. Cada icono recibe className para tamaño.

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
}

export function IconoDolar() {
  return (
    <svg {...base} width="1em" height="1em">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}

export function IconoGrafica() {
  return (
    <svg {...base} width="1em" height="1em">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  )
}

export function IconoDocumento() {
  return (
    <svg {...base} width="1em" height="1em">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  )
}

export function IconoAviso() {
  return (
    <svg {...base} width="1em" height="1em">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

export function IconoRecibo() {
  return (
    <svg {...base} width="1em" height="1em">
      <path d="M5 3v18l3-2 3 2 3-2 3 2 2-2V3z" />
      <line x1="8" y1="8" x2="16" y2="8" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  )
}

export function IconoBuscar() {
  return (
    <svg {...base} width="1em" height="1em">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

export function IconoUsuario() {
  return (
    <svg {...base} width="1em" height="1em">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

export function IconoNota() {
  return (
    <svg {...base} width="1em" height="1em">
      <path d="M12 9L2 5v14l10 4 10-4V5z" />
      <path d="M12 9v14" />
      <path d="M2 5l10 4 10-4" />
    </svg>
  )
}

export function IconoEdificio() {
  return (
    <svg {...base} width="1em" height="1em">
      <rect x="4" y="2" width="16" height="20" rx="1" />
      <line x1="9" y1="22" x2="9" y2="18" />
      <line x1="15" y1="22" x2="15" y2="18" />
      <line x1="9" y1="7" x2="9" y2="7.01" />
      <line x1="15" y1="7" x2="15" y2="7.01" />
    </svg>
  )
}

export function IconoCerrar() {
  return (
    <svg {...base} width="1em" height="1em">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

export function IconoDescarga() {
  return (
    <svg {...base} width="1em" height="1em">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

export function IconoAlert() {
  return (
    <svg {...base} width="1em" height="1em">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

export function IconoChevron() {
  return (
    <svg {...base} width="1em" height="1em">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

export function IconoReloj() {
  return (
    <svg {...base} width="1em" height="1em">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

export function IconoCalendario() {
  return (
    <svg {...base} width="1em" height="1em">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}
