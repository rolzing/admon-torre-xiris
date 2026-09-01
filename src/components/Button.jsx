// Botón reutilizable con variantes (primario, secundario, peligro).
import { useState } from 'react'

const variants = {
  primary: 'bg-accent-600 text-white hover:bg-accent-700 shadow-sm',
  secondary: 'bg-white text-navy-800 border border-slate-200 hover:bg-slate-50 dark:bg-navy-800 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-navy-700',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'text-navy-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-navy-800',
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled,
  onClick,
  ...rest
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
        variants[variant] || variants.primary
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
