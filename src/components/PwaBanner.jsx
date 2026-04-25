import { useEffect, useState } from 'react'
import { Download, RefreshCw, X } from 'lucide-react'
import { useRegisterSW } from 'virtual:pwa-register/react'

export default function PwaBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [dismissedKey, setDismissedKey] = useState(null)

  const { needRefresh, updateServiceWorker } = useRegisterSW({
    immediate: true,
  })

  const [isNeedRefresh] = needRefresh

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

  return (
    <div className="fixed bottom-20 left-4 right-4 z-[60] md:left-auto md:right-6 md:w-[26rem] rounded-2xl border border-white/10 bg-f1-dark/95 text-white shadow-2xl shadow-black/30 backdrop-blur-xl">
      <div className="flex gap-3 p-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-f1-red/15 text-f1-red">
          <Icon size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-5">{content.title}</p>
          <p className="mt-1 text-sm leading-5 text-white/70">{content.description}</p>

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
