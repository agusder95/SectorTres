import { useEffect, useState } from 'react'
import { Download, RefreshCw, X } from 'lucide-react'
import { useRegisterSW } from 'virtual:pwa-register/react'

const CHANGELOG_URL = '/changelog.json'
const APP_VERSION_KEY = 's3-app-version'

export default function PwaBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [dismissedKey, setDismissedKey] = useState(null)
  const [changelog, setChangelog] = useState(null)
  const [changelogError, setChangelogError] = useState(null)

  const { needRefresh, updateServiceWorker } = useRegisterSW({
    immediate: true,
  })

  const [isNeedRefresh] = needRefresh
  //descomentar force banner
  //const FORCE_REFRESH_BANNER = import.meta.env.DEV && new URLSearchParams(window.location.search).has('forceUpdate')
  //const forcedNeedRefresh = FORCE_REFRESH_BANNER ? true : isNeedRefresh
  //

  useEffect(() => {
    // Load changelog only when an update is available.
    if (!isNeedRefresh) return
    //comentar arriba para force banner
    //if (!forcedNeedRefresh) return

    let cancelled = false

    const loadChangelog = async () => {
      try {
        setChangelogError(null)
        const res = await fetch(CHANGELOG_URL, { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (!cancelled) setChangelog(data?.current || null)
      } catch (err) {
        if (!cancelled) {
          setChangelog(null)
          setChangelogError(err)
        }
      }
    }

    loadChangelog()
    return () => {
      cancelled = true
    }
  }, [isNeedRefresh])
  //}, [forcedNeedRefresh])

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault()
      setDeferredPrompt(event)
      setDismissedKey(null)
    }

    const handleAppInstalled = () => {
      setDeferredPrompt(null)
      setDismissedKey(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const bannerType = isNeedRefresh ? 'refresh' : deferredPrompt ? 'install' : null
  //comentar arriba
  //const bannerType = forcedNeedRefresh ? 'refresh' : deferredPrompt ? 'install' : null


  if (!bannerType || dismissedKey === bannerType) return null

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
    setDismissedKey(null)
  }

  const handleUpdate = async () => {
    await updateServiceWorker(true)
    // When the app reloads, it will store the new version in localStorage.
    if (changelog?.version) {
      try {
        localStorage.setItem(APP_VERSION_KEY, changelog.version)
      } catch {
        // ignore
      }
    }
    setDismissedKey(null)
  }

  const content = {
    refresh: {
      icon: RefreshCw,
      title: 'Nueva versión disponible',
      description: 'Actualizá la app para obtener los últimos cambios.',
      actionLabel: 'Actualizar',
      onAction: handleUpdate,
    },
    install: {
      icon: Download,
      title: 'Instalá SectorTres',
      description: 'Agregala a tu pantalla de inicio para usarla como app.',
      actionLabel: 'Instalar',
      onAction: handleInstall,
    },
  }[bannerType]

  const Icon = content.icon
  const installedVersion = (() => {
    try {
      return localStorage.getItem(APP_VERSION_KEY)
    } catch {
      return null
    }
  })()

  const showChangelog =
    bannerType === 'refresh' &&
    changelog?.changes?.length &&
    (!installedVersion || installedVersion !== changelog.version)

  return (
    <div className="fixed bottom-20 left-4 right-4 z-[60] md:left-auto md:right-6 md:w-[26rem] rounded-2xl border border-white/10 bg-f1-dark/95 text-white shadow-2xl shadow-black/30 backdrop-blur-xl">
      <div className="flex gap-3 p-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-f1-red/15 text-f1-red">
          <Icon size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-5">{content.title}</p>
          <p className="mt-1 text-sm leading-5 text-white/70">{content.description}</p>

          {bannerType === 'refresh' && (
            <div className="mt-3">
              {showChangelog ? (
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                    Novedades{changelog?.version ? ` · v${changelog.version}` : ''}
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-white/80">
                    {changelog.changes.slice(0, 6).map((item, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-f1-red shrink-0" />
                        <span className="min-w-0">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : changelogError ? (
                <p className="text-xs text-white/50 mt-2">
                  No se pudieron cargar los cambios de la actualización.
                </p>
              ) : null}
            </div>
          )}

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={content.onAction}
              className="inline-flex items-center gap-2 rounded-lg bg-f1-red px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-f1-red/90"
            >
              <Icon size={16} />
              {content.actionLabel}
            </button>

            <button
              type="button"
              onClick={() => setDismissedKey(bannerType)}
              className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={16} />
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
