import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Sun, Moon, Clock, Trash2, AlertTriangle, Check } from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useLocalStorage('f1-settings', {
    theme: 'dark',
    use12h: false,
  })
  
  const [showDestroyConfirm, setShowDestroyConfirm] = useState(false)
  const [destroySuccess, setDestroySuccess] = useState(false)

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
        <p>SectorTres v1.0.0</p>
        <p className="mt-1">Datos de F1 © Jolpi API</p>
        <p className="mt-1">Circuitos julesr0y</p>
      </div>
    </div>
  )
}