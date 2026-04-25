import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Award } from 'lucide-react'
import { getDriverStandings, getConstructorStandings } from '../api/f1Service'
import {getTeamColor, TEAM_COLORS} from '../constants'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { StandingsSkeleton } from '../components/Skeletons'
import { useLoading, useSeason } from '../context/LoadingContext'

const PODIUM_COLORS = {
  1: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', text: 'text-yellow-500' },      // Oro
  2: { bg: 'bg-gray-400/20', border: 'border-gray-400/50', text: 'text-gray-400' },             // Plata
  3: { bg: 'bg-orange-700/20', border: 'border-orange-700/50', text: 'text-orange-700' },        // Bronce
}


function DriverStandings({ standings, loading }) {
  const [settings] = useLocalStorage('f1-settings', { theme: 'dark' })

  if (loading) return <StandingsSkeleton count={10} />

  if (!standings?.DriverStandings) return (
    <div className="text-center py-12 text-gray-500 dark:text-white/50">
      Sin datos de pilotos
    </div>
  )

  return (
    <div className="space-y-2">
      {standings.DriverStandings.map((driver, index) => {
        const pos = index + 1
        const podiumColors = PODIUM_COLORS[pos]
        const teamColor = getTeamColor(driver.Constructors?.[0]?.constructorId)
        return (
          <motion.div
            key={driver.Driver.driverId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`
              flex items-center gap-3 p-3 rounded-xl border
              bg-white dark:bg-zinc-900
              ${podiumColors ? `${podiumColors.bg} ${podiumColors.border}` : 'border-gray-200 dark:border-zinc-800'}
            `}
          >
            {/* Position */}
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
              ${podiumColors ? `${podiumColors.bg} ${podiumColors.text} border ${podiumColors.border}` : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-white'}
            `}>
              {pos}
            </div>

            {/* Driver Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 dark:text-white truncate">
                  {driver.Driver.givenName} {driver.Driver.familyName}
                </span>
                {/* Team color dot */}
                <div 
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: teamColor }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                {driver.Constructors?.[0]?.name || 'Sin equipo'}
              </p>
            </div>

            {/* Wins indicator */}
            {parseInt(driver.wins) > 0 && (
                <div className="px-2 py-1 rounded bg-f1-red/10">
                  <span className="text-xs font-bold text-f1-red">{driver.wins}V</span>
                </div>
            )}

            {/* Points */}
            <div className="text-right">
              <span className="text-xl font-bold text-f1-red">{driver.points}</span>
              <p className="text-[10px] text-gray-400 dark:text-zinc-500">PTS</p>
            </div>

          </motion.div>
        )
      })}
    </div>
  )
}

function ConstructorStandings({ standings, loading }) {
  if (loading) return <StandingsSkeleton count={10} />

  if (!standings?.ConstructorStandings) return (
    <div className="text-center py-12 text-gray-500 dark:text-white/50">
      Sin datos de constructores
    </div>
  )

  return (
    <div className="space-y-2">
      {standings.ConstructorStandings.map((constructor, index) => {
        const pos = index + 1
        const podiumColors = PODIUM_COLORS[pos]
        const teamColor = getTeamColor(constructor.Constructor.constructorId)

        return (
          <motion.div
            key={constructor.Constructor.constructorId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`
              flex items-center gap-3 p-3 rounded-xl border
              bg-white dark:bg-zinc-900
              ${podiumColors ? `${podiumColors.bg} ${podiumColors.border}` : 'border-gray-200 dark:border-zinc-800'}
            `}
          >
            {/* Position */}
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
              ${podiumColors ? `${podiumColors.bg} ${podiumColors.text} border ${podiumColors.border}` : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-white'}
            `}>
              {pos}
            </div>

            {/* Team color bar */}
            <div 
              className="w-1 h-12 rounded-full"
              style={{ backgroundColor: teamColor }}
            />

            {/* Constructor Info */}
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-gray-900 dark:text-white truncate">
                {constructor.Constructor.name}
              </span>
            </div>

            {/* Wins indicator */}
            {parseInt(constructor.wins) > 0 && (
                <div className="px-2 py-1 rounded bg-f1-red/10">
                  <span className="text-xs font-bold text-f1-red">{constructor.wins}V</span>
                </div>
            )}

            {/* Points */}
            <div className="text-right">
              <span className="text-xl font-bold text-f1-red">{constructor.points}</span>
              <p className="text-[10px] text-gray-400 dark:text-zinc-500">PTS</p>
            </div>

          </motion.div>
        )
      })}
    </div>
  )
}

export default function ChampionshipsPage() {
  const { selectedYear, setSelectedYear } = useSeason()
  const [activeTab, setActiveTab] = useState('drivers')
  const [driverStandings, setDriverStandings] = useState(null)
  const [constructorStandings, setConstructorStandings] = useState(null)
  const [loading, setLoading] = useState(true)
  const { startLoading, stopLoading } = useLoading()
  const [showYearPicker, setShowYearPicker] = useState(false)
  const yearNum = parseInt(selectedYear)

  useEffect(() => {
    loadStandings()
  }, [yearNum])

  const loadStandings = async () => {
    setLoading(true)
    startLoading()
    try {
      const [drivers, constructors] = await Promise.all([
        getDriverStandings(yearNum),
        getConstructorStandings(yearNum)
      ])
      setDriverStandings(drivers)
      setConstructorStandings(constructors)
    } catch (err) {
      console.error('Error loading standings:', err)
    } finally {
      setLoading(false)
      stopLoading()
    }
  }

  const tabs = [
    { id: 'drivers', label: 'Pilotos', icon: Award },
    { id: 'constructors', label: 'Constructores', icon: Trophy },
  ]

  const yearOptions = [2026, 2025, 2024, 2023, 2022, 2021]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Trophy className="text-f1-red" />
          Campeonatos {selectedYear}
        </h1>
        
        {/* Season selector */}
        <div className="relative">
          <button
              onClick={() => setShowYearPicker(!showYearPicker)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
          >
            <span className="font-semibold text-gray-700 dark:text-white">{selectedYear}</span>
            <svg
                size={16}
                className={`text-gray-500 dark:text-white/60 transition-transform ${showYearPicker ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {showYearPicker && (
              <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-28 rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-xl z-50 overflow-hidden"
              >
                {yearOptions.map(year => (
                    <button
                        key={year}
                        onClick={() => {
                          setSelectedYear(year)
                          setShowYearPicker(false)
                        }}
                        className={`
                    w-full px-4 py-2 text-left transition-colors
                    ${year === parseInt(selectedYear)
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
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-zinc-800">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`
              flex items-center gap-2 px-4 py-3 border-b-2 transition-colors
              ${activeTab === id 
                ? 'border-f1-red text-f1-red' 
                : 'border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'drivers' && (
            <DriverStandings standings={driverStandings} loading={loading} />
          )}
          {activeTab === 'constructors' && (
            <ConstructorStandings standings={constructorStandings} loading={loading} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Remaining races info */}
      {!loading && driverStandings?.round && (
        <div className="text-center text-sm text-gray-400 dark:text-zinc-500 pt-4">
          <p>Carreras restantes: {24 - parseInt(driverStandings.round)}</p>
        </div>
      )}
    </div>
  )
}