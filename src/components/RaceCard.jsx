import { motion } from 'framer-motion'
import { Clock, MapPin, Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getCircuitSVG, getCircuitName } from '../api/circuitMapper'
import { formatDate, formatTime, isMadrugada } from '../utils/timeFormatter'
import { useLocalStorage } from '../hooks/useLocalStorage'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function RaceCard({ 
  race, 
  index, 
  isCurrent = false, 
  isLive = false, 
  isFavorite = false, 
  onToggleFavorite 
}) {
  const navigate = useNavigate()
  const [settings] = useLocalStorage('f1-settings', { theme: 'dark', use12h: false })
  const theme = settings.theme
  const use12h = settings.use12h
  
  const circuitSvgUrl = getCircuitSVG(race.Circuit.circuitId, theme)
  const circuitName = getCircuitName(race.Circuit.circuitId)
  const raceDate = race.date + 'T' + (race.time || '00:00:00Z')
  
  const dateStr = formatDate(raceDate)
  const timeStr = formatTime(raceDate, use12h)
  const madrugada = isMadrugada(raceDate)

  // Determinar si la carrera ya pasó (fecha < hoy)
  const raceDateObj = new Date(race.date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const isPastRace = raceDateObj < today

  // Tags
  const showFinalizado = isPastRace || race.status === 'Finished'
  const showLive = isLive || isCurrent

  const handleCardClick = () => {
    navigate(`/race/${race.season}/${race.round}`)
  }

  return (
    <motion.div
      variants={item}
      onClick={handleCardClick}
      className="
        max-w-4xl
        relative overflow-hidden rounded-xl border cursor-pointer
        bg-white dark:bg-zinc-900
        border-gray-200 dark:border-zinc-800
        transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
        dark:hover:border-f1-red/30
      "
    >
      {/* Favorite Button - Absolute top-right */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggleFavorite?.(race)
        }}
        className={`
          absolute top-2 right-2 z-10 p-1.5 rounded-full transition-all duration-200
          ${isFavorite 
            ? 'text-f1-red bg-f1-red/10' 
            : 'text-gray-300 dark:text-zinc-600 hover:text-f1-red hover:bg-f1-red/10'
          }`
        }
      >
        <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
      </button>
      
      {/* Live accent bar */}
      {showLive && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-f1-red to-orange-500" />
      )}
      
      <div className="p-3 flex flex-col gap-7">
        {/* Header Row */}
        <div className="flex items-start gap-2">
          {/* Circuit SVG */}
          <div className="w-24 h-24 flex-shrink-0 rounded-lg bg-gray-100 dark:bg-zinc-800 p-2">
            {circuitSvgUrl ? (
              <img
                src={circuitSvgUrl}
                alt={circuitName}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-zinc-500">
                <MapPin size={18} />
              </div>
            )}
          </div>
          
          {/* Info */}
          <div className="flex-1 min-w-0 pr-3">
            <div className="flex flex-wrap items-center gap-5">
              <span className="text-[13px] text-gray-400 dark:text-zinc-500 font-mono">GP-{race.round}</span>
              
              {showLive && !showFinalizado && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded border bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/50">
                  ACTUAL
                </span>
              )}
              
              {showFinalizado && !showLive && (
                <span className="px-1.5 py-0.5 text-[10px] font-medium rounded border bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/50">
                  FINALIZADO
                </span>
              )}
            </div>
            
            <h3 className="font-semibold text-gray-900 dark:text-white text-s leading-tight mt-3 line-clamp-2">
              {race.raceName}
            </h3>
            
            <p className="text-[14px] text-gray-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
              {circuitName}
            </p>
          </div>
        </div>
        
        {/* Date/Time Row */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-1.5">
            <Clock size={11} className="text-gray-400 dark:text-zinc-500" />
            <span className="text-[13px] font-medium text-gray-600 dark:text-zinc-300">
              {dateStr} · {timeStr}
            </span>
          </div>
          
          {/* Madrugada Badge - Solo si aplica (00:00-05:00) */}
          {madrugada && (
            <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-amber-500/20 text-amber-600 dark:text-amber-400">
              Trasnoche
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export { container, item }