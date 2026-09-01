// Footer discreto y profesional para toda la app.
// Muestra versión (calculada por release-please via VersionLabel)
// y crédito a Ricardo LH con enlaces a LinkedIn y web personal.

import VersionLabel from './VersionLabel'
import { IconoLinkedIn, IconoWeb } from './Icons'

const LINKEDIN_URL = 'https://www.linkedin.com/in/riclopezh/'
const WEB_URL = 'https://rolzing.github.io/website/'

export default function Footer({ className = '' }) {
  return (
    <footer
      className={`mt-auto border-t border-slate-200 bg-white/70 backdrop-blur dark:border-slate-800 dark:bg-navy-900/40 ${className}`}
    >
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-end">
          <div className="flex shrink-0 flex-wrap items-center justify-center gap-2.5">
            <span className="whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
              Hecho por{' '}
              <span className="font-semibold text-navy-700 dark:text-slate-200">Ricardo LH</span>
            </span>
            <VersionLabel className="whitespace-nowrap" />
            <span className="hidden h-4 w-px bg-slate-200 dark:bg-slate-700 sm:block" aria-hidden />
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn de Ricardo LH"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-navy-700 active:scale-95 dark:border-slate-700 dark:bg-navy-800 dark:text-slate-400 dark:hover:text-white"
            >
              <IconoLinkedIn className="text-sm" />
            </a>
            <a
              href={WEB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Página web de Ricardo LH"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-navy-700 active:scale-95 dark:border-slate-700 dark:bg-navy-800 dark:text-slate-400 dark:hover:text-white"
            >
              <IconoWeb className="text-sm" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
