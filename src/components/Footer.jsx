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
          <div className="flex shrink-0 items-center gap-2.5">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Hecho por{' '}
              <span className="font-semibold text-navy-700 dark:text-slate-200">Ricardo LH</span>
            </span>
            <VersionLabel />
            <span className="h-4 w-px bg-slate-200 dark:bg-slate-700" aria-hidden />
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn de Ricardo LH"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-navy-700 dark:border-slate-700 dark:bg-navy-800 dark:text-slate-400 dark:hover:text-white"
            >
              <IconoLinkedIn className="text-[13px]" />
            </a>
            <a
              href={WEB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Página web de Ricardo LH"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-navy-700 dark:border-slate-700 dark:bg-navy-800 dark:text-slate-400 dark:hover:text-white"
            >
              <IconoWeb className="text-[13px]" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
