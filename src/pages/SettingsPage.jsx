import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Sun, Moon, Clock, Globe, Trash2, AlertTriangle, Check } from 'lucide-react'
import { DEFAULT_TIME_ZONE, TIMEZONE_GROUPS } from '../constants'

export default function SettingsPage() {
  const [settings, setSettings] = useLocalStorage('f1-settings', {
    theme: 'dark',
    use12h: false,
    timezone: DEFAULT_TIME_ZONE,
  })
  const currentTimezone = settings.timezone || DEFAULT_TIME_ZONE
  const timezoneExistsInList = TIMEZONE_GROUPS.some((group) =>
    group.zones.some((zone) => zone.value === currentTimezone)
  )
  
  const [showDestroyConfirm, setShowDestroyConfirm] = useState(false)
  const [destroySuccess, setDestroySuccess] = useState(false)
  const [showTimezonePicker, setShowTimezonePicker] = useState(false)

  const toggleTheme = () => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }))
    // Redirect to home for full theme refresh
    window.location.href = '/'
  }

  const toggleTimeFormat = () => {
    setSettings(prev => ({
      ...prev,
      use12h: !prev.use12h,
    }))
  }

  const handleTimezoneChange = (timezone) => {
    setSettings(prev => ({
      ...prev,
      timezone,
    }))
    setShowTimezonePicker(false)
  }

  const handleDestroyData = () => {
    if (showDestroyConfirm) {
      localStorage.clear()
      setDestroySuccess(true)
      setTimeout(() => {
        setDestroySuccess(false)
        setShowDestroyConfirm(false)
        window.location.reload()
      }, 1500)
    } else {
      setShowDestroyConfirm(true)
      setTimeout(() => setShowDestroyConfirm(false), 5000)
    }
  }

  const [appVersion, setAppVersion] = useState('1.0.0') // Valor por defecto

  useEffect(() => {
    const fetchChangelog = async () => {
      try {
        const response = await fetch('/changelog.json', { cache: 'no-store' })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const changelog = await response.json()
        setAppVersion(changelog?.current?.version || '1.0.0') // Actualiza la versión
      } catch (error) {
        console.error('Error al cargar changelog:', error)
      }
    }

    fetchChangelog()
  }, [])

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configuración</h1>

      {/* Theme Toggle */}
      <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-4 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {settings.theme === 'dark' ? <Moon className="text-white/70" size={20} /> : <Sun className="text-gray-500" size={20} />}
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Tema</p>
              <p className="text-sm text-gray-500 dark:text-white/50">
                {settings.theme === 'dark' ? 'Oscuro' : 'Claro'}
              </p>
            </div>
          </div>
          
          <button
            onClick={toggleTheme}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              settings.theme === 'dark' ? 'bg-f1-red' : 'bg-gray-300'
            }`}
          >
            <motion.div
              animate={{ x: settings.theme === 'dark' ? 24 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md"
            />
          </button>
        </div>
      </div>

      {/* Time Format Toggle */}
      <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-4 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-gray-500 dark:text-white/70" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Formato de hora</p>
              <p className="text-sm text-gray-500 dark:text-white/50">
                {settings.use12h ? '12 horas (AM/PM)' : '24 horas'}
              </p>
            </div>
          </div>
          
          <button
            onClick={toggleTimeFormat}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              settings.use12h 
                ? 'bg-f1-red text-white' 
                : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/70'
            }`
            }
          >
            {settings.use12h ? '12h' : '24h'}
          </button>
        </div>
      </div>

      {/* Timezone Selector */}
      <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-4 transition-colors duration-300">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <Globe size={20} className="mt-0.5 text-gray-500 dark:text-white/70" />
            <div className="min-w-0">
              <p className="font-medium text-gray-900 dark:text-white">Horario país</p>
              <p className="text-sm text-gray-500 dark:text-white/50">
                {currentTimezone}
              </p>
            </div>
          </div>

          <div className="relative min-w-[180px] sm:min-w-[260px] max-w-full">
            <button
              onClick={() => setShowTimezonePicker(!showTimezonePicker)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
            >
              <span className="text-sm font-semibold text-gray-700 dark:text-white truncate">
                {currentTimezone === DEFAULT_TIME_ZONE
                  ? 'Zona local del dispositivo'
                  : currentTimezone}
              </span>
              <svg
                className={`w-4 text-gray-500 dark:text-white/60 transition-transform ${showTimezonePicker ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            <AnimatePresence mode="wait">
              {showTimezonePicker && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-full max-h-72 overflow-auto rounded-lg bg-white dark:bg-f1-dark border border-gray-200 dark:border-zinc-800 shadow-xl z-50"
                >
                  {/* Local device option always first */}
                  <button
                    onClick={() => handleTimezoneChange(DEFAULT_TIME_ZONE)}
                    className={`w-full px-4 py-2 text-left transition-colors ${
                      currentTimezone === DEFAULT_TIME_ZONE
                        ? 'text-f1-red font-semibold bg-f1-red/5'
                        : 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    Zona local del dispositivo
                  </button>

                  {/* Saved timezone not in list */}
                  {!timezoneExistsInList && currentTimezone !== DEFAULT_TIME_ZONE && (
                    <button
                      onClick={() => handleTimezoneChange(currentTimezone)}
                      className="w-full px-4 py-2 text-left transition-colors text-f1-red font-semibold bg-f1-red/5"
                    >
                      Zona local del dispositivo ({currentTimezone})
                    </button>
                  )}

                  {TIMEZONE_GROUPS.map((group) => (
                    <div key={group.country} className="border-t border-gray-100 dark:border-zinc-800">
                      <div className="px-4 py-2 text-[16px] font-bold uppercase tracking-wider text-gray-700 dark:text-white  bg-gray-100 dark:bg-zinc-900/90">
                        {group.country}
                      </div>
                      {group.zones.map((zone) => (
                        <button
                          key={zone.value}
                          onClick={() => handleTimezoneChange(zone.value)}
                          className={`text-sm w-full px-4 py-2 text-left transition-colors ${
                            zone.value === currentTimezone
                              ? 'text-f1-red font-semibold bg-f1-red/5'
                              : ' text-gray-500  dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
                          }`}
                        >
                          {zone.label}
                        </button>
                      ))}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5 p-4 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trash2 size={20} className="text-red-500" />
            <div>
              <p className="font-medium text-red-600 dark:text-red-400">Destruir datos</p>
              <p className="text-sm text-gray-500 dark:text-white/50">
                Borra todos los datos guardados
              </p>
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            {destroySuccess ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500 text-white text-sm font-medium"
              >
                <Check size={16} />
                Listo
              </motion.div>
            ) : showDestroyConfirm ? (
              <div className="flex gap-2">
                <button
                  onClick={handleDestroyData}
                  className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setShowDestroyConfirm(false)}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/70 text-sm font-medium hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                onClick={handleDestroyData}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-300 dark:border-red-500/50 text-red-500 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-500/10 transition-colors"
              >
                <AlertTriangle size={14} />
                Borrar
              </button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Info */}
      <div className="text-center text-gray-400 dark:text-white/30 text-sm transition-colors duration-300">
        <p>SectorTres v{appVersion}</p>
        <p className="mt-1">Datos de F1 © Jolpi API</p>
        <p className="mt-1">Circuitos julesr0y</p>
      </div>
    </div>
  )
}