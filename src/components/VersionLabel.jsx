// Pequeño label de versión — lee la versión actual de package.json,
// que es la fuente de verdad para release-please (.release-please-manifest.json
// y package.json se bumpean juntos en cada release).
// Release-please (release-please-config.json) usa "release-type": "node"
// y actualiza package.json en cada PR de release, por lo que este label
// refleja siempre la versión calculada por la GitHub Action.

import pkg from '../../package.json'

export default function VersionLabel({ className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:border-slate-700 dark:bg-navy-900 dark:text-slate-400 ${className}`}
      title={`Versión actual del portal (release-please: ${pkg.version})`}
    >
      v{pkg.version}
    </span>
  )
}
