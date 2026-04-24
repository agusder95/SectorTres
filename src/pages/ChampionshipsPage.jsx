import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Award } from 'lucide-react'
import { getDriverStandings, getConstructorStandings } from '../api/f1Service'
import { TEAM_COLORS } from '../constants'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { StandingsSkeleton } from '../components/Skeletons'
import { useLoading } from '../context/LoadingContext'

const PODIUM_COLORS = {
  1: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', text: 'text-yellow-500' },      // Oro
  2: { bg: 'bg-gray-400/20', border: 'border-gray-400/50', text: 'text-gray-400' },             // Plata
  3: { bg: 'bg-orange-700/20', border: 'border-orange-700/50', text: 'text-orange-700' },        // Bronce
}

const CONSTRUCTOR_COLORS = {
  mercedes: '#27f1d0',
  red_bull: '#1e41ff',
  ferrari: '#ff0000',
  mclaren: '#ff8700',
  aston_martin: '#006f62',
  alpine: '#0072b3',
  alpha_tauri: '#469bff',
  williams: '#64c4ff',
  haas: '#ffffff',
  kick_sauber: '#52e252',
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
        const teamColor = TEAM_COLORS[driver.Constructors?.[0]?.name?.toLowerCase().replace(/\s+/g, '_')] || '#888'

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

            {/* Points */}
            <div className="text-right">
              <span className="text-xl font-bold text-f1-red">{driver.points}</span>
              <p className="text-[10px] text-gray-400 dark:text-zinc-500">PTS</p>
            </div>

            {/* Wins indicator */}
            {parseInt(driver.wins) > 0 && (
              <div className="px-2 py-1 rounded bg-f1-red/10">
                <span className="text-xs font-bold text-f1-red">{driver.wins}V</span>
              </div>
            )}
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
        const teamName = constructor.Constructor.name?.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z_]/g, '')
        const teamColor = CONSTRUCTOR_COLORS[teamName] || '#888'

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

            {/* Points */}
            <div className="text-right">
              <span className="text-xl font-bold text-f1-red">{constructor.points}</span>
              <p className="text-[10px] text-gray-400 dark:text-zinc-500">PTS</p>
            </div>

            {/* Wins indicator */}
            {parseInt(constructor.wins) > 0 && (
              <div className="px-2 py-1 rounded bg-f1-red/10">
                <span className="text-xs font-bold text-f1-red">{constructor.wins}V</span>
              </div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

export default function ChampionshipsPage() {
  const currentYear = new Date().getFullYear()
  const [activeTab, setActiveTab] = useState('drivers')
  const [driverStandings, setDriverStandings] = useState(null)
  const [constructorStandings, setConstructorStandings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const { startLoading, stopLoading } = useLoading()

  useEffect(() => {
    loadStandings()
  }, [selectedYear])

  const loadStandings = async () => {
    setLoading(true)
    startLoading()
    try {
      const [drivers, constructors] = await Promise.all([
        getDriverStandings(selectedYear),
        getConstructorStandings(selectedYear)
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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Trophy className="text-f1-red" />
          Campeonatos {selectedYear}
        </h1>
        
        {/* Season selector */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-white text-sm"
        >
          {[2026, 2025, 2024, 2023].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
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