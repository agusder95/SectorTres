import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { getRaces } from '../api/f1Service'
import { SEASON_YEARS } from '../constants'
import RaceCard, { container, item } from '../components/RaceCard'
import { RaceCardSkeleton } from '../components/Skeletons'
import { ChevronDown, Flag } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useLoading } from '../context/LoadingContext'

export default function RacesPage() {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useLocalStorage('f1-selected-year', currentYear.toString())
  const [races, setRaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showYearPicker, setShowYearPicker] = useState(false)
  const [favorites, setFavorites] = useLocalStorage('f1-favorites', [])
  const { startLoading, stopLoading } = useLoading()

  const yearNum = parseInt(selectedYear)

  useEffect(() => {
    loadRaces()
  }, [yearNum])

  const loadRaces = async () => {
    setLoading(true)
    startLoading()
    setError(null)
    try {
      const data = await getRaces(yearNum)
      setRaces(data || [])
    } catch (err) {
      setError('Error al cargar las carreras')
      console.error(err)
    } finally {
      setLoading(false)
      stopLoading()
    }
  }

  // Encontrar el GP "Actual" (primero no finalizado en orden cronológico)
  const findCurrentRace = (racesList) => {
    const now = new Date()
    for (const race of racesList) {
      const raceDate = new Date(race.date + 'T' + (race.time || '23:59:59Z'))
      if (now <= raceDate) {
        return race.round
      }
    }
    return null
  }

  const currentRaceRound = findCurrentRace(races)

  const toggleFavorite = (race) => {
    const raceKey = `${race.season}-${race.round}`
    const isFav = favorites.some(f => f.round === race.round && f.season === race.season)
    
    if (isFav) {
      setFavorites(prev => prev.filter(f => !(f.round === race.round && f.season === race.season)))
    } else {
      setFavorites(prev => [...prev, { 
        round: race.round, 
        season: race.season,
        raceName: race.raceName,
        circuit: race.Circuit.circuitId
      }])
    }
  }

  const isFavorite = (race) => {
    return favorites.some(f => f.round === race.round && f.season === race.season)
  }

  return (
    <div className="space-y-4">
      {/* Header con selector de año */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Flag className="text-f1-red" />
          Carreras
        </h1>
        
        <div className="relative">
          <button
            onClick={() => setShowYearPicker(!showYearPicker)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
          >
            <span className="font-semibold text-gray-700 dark:text-white">{selectedYear}</span>
            <ChevronDown size={16} className={`text-gray-500 dark:text-white/60 transition-transform ${showYearPicker ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {showYearPicker && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-2 w-28 rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-xl z-50 overflow-hidden"
              >
                {SEASON_YEARS.map(year => (
                  <button
                    key={year}
                    onClick={() => {
                      setSelectedYear(year)
                      setShowYearPicker(false)
                    }}
                    className={`
                      w-full px-4 py-2 text-left transition-colors
                      ${year === selectedYear 
                        ? 'text-f1-red font-semibold bg-f1-red/5' 
                        : 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800'
                      }`
                    }
                  >
                    {year}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-white/60 mb-4">{error}</p>
          <button
            onClick={loadRaces}
            className="px-4 py-2 rounded-lg bg-f1-red text-white font-medium hover:bg-f1-red/80 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <RaceCardSkeleton key={i} />
          ))}
        </motion.div>
      )}

      {/* Races Grid */}
      {!loading && !error && races.length > 0 && (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
        >
          {races.map((race) => {
            const isCurrent = race.round === currentRaceRound
            return (
              <RaceCard
                key={race.round}
                race={race}
                index={race.round}
                isCurrent={isCurrent}
                isFavorite={isFavorite(race)}
                onToggleFavorite={toggleFavorite}
              />
            )
          })}
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && !error && races.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 dark:text-white/40 text-lg">No hay carreras para esta temporada</p>
        </div>
      )}
    </div>
  )
}