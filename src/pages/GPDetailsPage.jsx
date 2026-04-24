import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Clock, Flag, MapPin } from 'lucide-react'
import { getRaceInfo, getRaceResults, getQualifying, getSprintResults } from '../api/f1Service'
import { getCircuitSVG, getCircuitName } from '../api/circuitMapper'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Skeleton } from '../components/Skeletons'
import { getTeamColor } from '../constants'
import { useLoading } from '../context/LoadingContext'
import { formatDateWithDay, formatTime } from '../utils/timeFormatter'

function ScheduleTab({ race }) {
  if (!race) return <div className="p-4 text-gray-500 dark:text-zinc-400">Sin datos</div>

  const sessions = []
  if (race.FirstPractice) sessions.push({ key: 'FirstPractice', label: 'FP1', date: race.FirstPractice.date, time: race.FirstPractice.time })
  if (race.SecondPractice) sessions.push({ key: 'SecondPractice', label: 'FP2', date: race.SecondPractice.date, time: race.SecondPractice.time })
  if (race.ThirdPractice) sessions.push({ key: 'ThirdPractice', label: 'FP3', date: race.ThirdPractice.date, time: race.ThirdPractice.time })
  if (race.Qualifying) sessions.push({ key: 'Qualifying', label: 'Qualy', date: race.Qualifying.date, time: race.Qualifying.time })
  if (race.SprintQualifying || race.SprintShootout) {
    const sq = race.SprintQualifying || race.SprintShootout
    sessions.push({ key: 'SprintQualifying', label: 'SQ', date: sq.date, time: sq.time })
  }
  if (race.Sprint) sessions.push({ key: 'Sprint', label: 'Sprint', date: race.Sprint.date, time: race.Sprint.time })
  if (race.date) sessions.push({ key: 'Race', label: 'Carrera', date: race.date, time: race.time, isRace: true })

  sessions.sort((a, b) => {
    const dateA = new Date(a.date + 'T' + (a.time || '00:00:00Z'))
    const dateB = new Date(b.date + 'T' + (b.time || '00:00:00Z'))
    return dateB - dateA
  })

  return (
    <div className="space-y-2">
      {sessions.map((session) => {
        const { date: formattedDate, dayName } = formatDateWithDay(session.date)
        const timeStr = session.time?.substring(0, 5) || 'TBD'
        
        return (
          <div key={session.key} className={`flex items-center justify-between p-3 rounded-xl ${session.isRace ? 'bg-f1-red/10 border border-f1-red/30' : 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800'}`}>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 rounded-lg text-sm font-bold ${session.isRace ? 'bg-f1-red text-white' : 'bg-f1-red/10 text-f1-red'}`}>
                {session.label}
              </span>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formattedDate} · {dayName} - {timeStr}
              </p>
            </div>
            <Clock size={16} className="text-gray-400 dark:text-zinc-500" />
          </div>
        )
      })}
    </div>
  )
}

// ===== HELPER: Fila con barra de equipo =====
function ResultRow({ result, index, showFL = false, showTime = false }) {
  const driver = result.Driver || {}
  const constructor = result.Constructor || {}
  const teamColor = getTeamColor(constructor.constructorId)
  const isFL = showFL && result.FastestLap?.rank === '1'
  const isDNF = result.status?.includes('DNF') || result.status?.includes('DSQ')
  const isEven = index % 2 === 0

  return (
    <div className={`
      flex items-center gap-2 px-2 py-1.5
      ${isEven ? 'bg-white dark:bg-zinc-900' : 'bg-zinc-50 dark:bg-zinc-800/40'}
      ${isDNF ? 'opacity-50' : ''}
      border-l-4 transition-colors
    `} style={{ borderLeftColor: teamColor }}>
      {/* Posición */}
      <span className="w-6 text-center font-mono text-xs font-bold text-gray-500 dark:text-zinc-500">
        {result.position}
      </span>
      
      {/* CODE del piloto - más visible */}
      <span className="w-8 font-mono text-xs font-bold text-gray-700 dark:text-white truncate">
        {driver.code || driver.permanentNumber || ''}
      </span>
      
      {/* Nombre */}
      <span className="flex-1 text-xs text-gray-900 dark:text-white truncate">
        {driver.familyName}
      </span>
      
      {/* Constructor - solo en desktop */}
      <span className="hidden sm:block w-20 text-[10px] text-gray-500 dark:text-zinc-400 truncate">
        {constructor.name?.split(' ')[0] || ''}
      </span>
      
      {/* FL */}
      {isFL && <span className="text-[10px] font-bold text-fuchsia-500">FL</span>}
      
      {/* Tiempo */}
      {showTime && (
        <span className="w-16 text-right font-mono text-xs text-gray-600 dark:text-zinc-400">
          {result.Time?.time || result.status || '-'}
        </span>
      )}
    </div>
  )
}

// ===== TIMES TAB =====
function TimesTab({ year, round }) {
  const [raceResults, setRaceResults] = useState(null)
  const [qualy, setQualy] = useState(null)
  const [sprintResults, setSprintResults] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadAllData() }, [year, round])

  const loadAllData = async () => {
    setLoading(true)
    try {
      const [race, q, sprint] = await Promise.all([
        getRaceResults(year, round).catch(() => null),
        getQualifying(year, round).catch(() => null),
        getSprintResults(year, round).catch(() => null)
      ])
      setRaceResults(race)
      setQualy(q)
      setSprintResults(sprint)
    } catch (err) {
      console.error('Error loading times:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="space-y-2"><Skeleton count={5} /></div>

  // Extraer datos
  const raceData = raceResults?.Results || []
  const qualyData = qualy?.QualifyingResults || []
  const sprintData = sprintResults?.SprintResults || []

  if (!raceData.length && !qualyData.length && !sprintData.length) {
    return <div className="text-center py-12"><p className="text-gray-500 dark:text-zinc-400">Sin tiempos por ahora</p></div>
  }

  // Cálculo matemático de cortes para Qualy
  const N = qualyData.length
  const Q3_CUT = 10  // Siempre 10 pilotos en Q3
  const eliminatedQ1 = Math.round((N - Q3_CUT) / 2)
  const Q2_CUT = Q3_CUT + eliminatedQ1  // Posición donde termina Q2
  const q3DividerIdx = Q3_CUT - 1  // Índice 9 (posición 10)
  const q2DividerIdx = Q2_CUT - 1  // Índice calculado dinámicamente

  // Renderizar grilla con divisores (para qualy normal y qualy sprint)
  const renderGrid = (title, results, dividerIdx1, dividerIdx2, accentColor, showDividers = true) => {
    if (!results?.length) return null

    return (
      <div className="mb-6">
        <h4 className="text-xs font-bold uppercase mb-2 px-1" style={{ color: accentColor }}>{title}</h4>
        <div className="rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
          {results.map((result, idx) => {
            const driver = result.Driver || {}
            const constructor = result.Constructor || {}
            const teamColor = getTeamColor(constructor.constructorId)
            const isEven = idx % 2 === 0
            const isLastRow = idx === results.length - 1
            const showDivider1 = showDividers && idx === dividerIdx1 && !isLastRow
            const showDivider2 = showDividers && idx === dividerIdx2 && idx < dividerIdx1 && !isLastRow

            return (
              <div key={result.position || result.grid || idx}>
                <div className={`
                  flex items-center gap-2 px-2 py-1.5
                  ${isEven ? 'bg-white dark:bg-zinc-900' : 'bg-zinc-50 dark:bg-zinc-800/40'}
                  border-l-4
                `} style={{ borderLeftColor: teamColor }}>
                  <span className="w-6 text-center font-mono text-xs font-bold text-gray-500 dark:text-zinc-500">
                    {result.position}
                  </span>
                  <span className="w-8 font-mono text-xs font-bold text-gray-700 dark:text-white truncate">
                    {driver.code || driver.permanentNumber || ''}
                  </span>
                  <span className="flex-1 text-xs text-gray-900 dark:text-white truncate">
                    {driver.familyName}
                  </span>
                  <span className="hidden sm:block w-20 text-[10px] text-gray-500 dark:text-zinc-400 truncate">
                    {constructor.name?.split(' ')[0] || ''}
                  </span>
                </div>
                {showDivider1 && <div className="h-px bg-red-600/60 mx-2" />}
                {showDivider2 && <div className="h-px bg-red-600/40 mx-2" />}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Renderizar grilla de Sprint Qualy (usa campo grid para posición)
  const renderSprintQualyGrid = (results, N) => {
    if (!results?.length) return null

    // Ordenar por grid position
    const sorted = [...results].sort((a, b) => parseInt(a.grid || a.position) - parseInt(b.grid || b.position))
    
    const Q3_CUT = 10
    const eliminatedQ1 = Math.round((N - Q3_CUT) / 2)
    const Q2_CUT = Q3_CUT + eliminatedQ1
    const q3Idx = Q3_CUT - 1
    const q2Idx = Q2_CUT - 1

    return (
      <div className="mb-6">
        <h4 className="text-xs font-bold uppercase mb-2 px-1" style={{ color: '#10b981' }}>Clasificación Sprint</h4>
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 overflow-hidden">
          {sorted.map((result, idx) => {
            const driver = result.Driver || {}
            const constructor = result.Constructor || {}
            const teamColor = getTeamColor(constructor.constructorId)
            const isEven = idx % 2 === 0
            const isLastRow = idx === sorted.length - 1
            const showDivider1 = idx === q3Idx && !isLastRow
            const showDivider2 = idx === q2Idx && idx < q3Idx && !isLastRow

            return (
              <div key={result.grid || result.position || idx}>
                <div className={`
                  flex items-center gap-2 px-2 py-1.5
                  ${isEven ? 'bg-white dark:bg-zinc-900' : 'bg-zinc-50 dark:bg-zinc-800/40'}
                  border-l-4
                `} style={{ borderLeftColor: teamColor }}>
                  <span className="w-6 text-center font-mono text-xs font-bold text-emerald-500">
                    {result.grid || result.position}
                  </span>
                  <span className="w-8 font-mono text-xs font-bold text-gray-700 dark:text-white truncate">
                    {driver.code || driver.permanentNumber || ''}
                  </span>
                  <span className="flex-1 text-xs text-gray-900 dark:text-white truncate">
                    {driver.familyName}
                  </span>
                  <span className="hidden sm:block w-20 text-[10px] text-gray-500 dark:text-zinc-400 truncate">
                    {constructor.name?.split(' ')[0] || ''}
                  </span>
                </div>
                {showDivider1 && <div className="h-px bg-red-600/60 mx-2" />}
                {showDivider2 && <div className="h-px bg-red-600/40 mx-2" />}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* 1° Carrera Principal */}
      {raceData.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xs font-bold text-f1-red uppercase mb-2 px-1">Carrera</h4>
          <div className="rounded-xl border border-f1-red/30 bg-f1-red/5 overflow-hidden">
            {raceData.map((result, idx) => (
              <ResultRow key={result.position} result={result} index={idx} showFL={true} showTime={true} />
            ))}
          </div>
        </div>
      )}

      {/* 2° Clasificación (Qualy) */}
      {qualyData.length > 0 && renderGrid('Qualy', qualyData, q3DividerIdx, q2DividerIdx, '#e10600')}

      {/* 3° Carrera Sprint */}
      {sprintData.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase mb-2 px-1" style={{ color: '#10b981' }}>Carrera Sprint</h4>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 overflow-hidden">
            {sprintData.map((result, idx) => (
              <ResultRow key={result.position} result={result} index={idx} showFL={true} showTime={true} />
            ))}
          </div>
        </div>
      )}

      {/* 4° Clasificación Sprint (usa campo grid) */}
      {sprintData.length > 0 && renderSprintQualyGrid(sprintData, sprintData.length)}
    </div>
  )
}

// ===== POINTS TAB =====
function PointsTab({ year, round }) {
  const [raceResults, setRaceResults] = useState(null)
  const [sprintResults, setSprintResults] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadResults() }, [year, round])

  const loadResults = async () => {
    setLoading(true)
    try {
      const [race, sprint] = await Promise.all([
        getRaceResults(year, round).catch(() => null),
        getSprintResults(year, round).catch(() => null)
      ])
      setRaceResults(race)
      setSprintResults(sprint)
    } catch (err) {
      console.error('Error loading results:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="space-y-2"><Skeleton count={5} /></div>

  const raceData = raceResults?.Results || []
  const sprintData = sprintResults?.SprintResults || []
  const hasSprint = sprintData.length > 0

  if (!raceData.length) {
    return <div className="text-center py-12"><p className="text-gray-500 dark:text-zinc-400">Puntos aún no disponibles</p></div>
  }

  // Crear mapa de puntos de sprint por driverId
  const SPRINT_PTS = [8, 7, 6, 5, 4, 3, 2, 1]
  const sprintPtsMap = {}
  sprintData.forEach((r, i) => {
    if (r.Driver?.driverId && SPRINT_PTS[i]) {
      sprintPtsMap[r.Driver.driverId] = SPRINT_PTS[i]
    }
  })

  // Crear lista unificada de pilotos con puntos
  const driversWithPoints = raceData
    .filter(r => parseInt(r.points) > 0)
    .map(r => {
      const driver = r.Driver || {}
      const constructor = r.Constructor || {}
      const racePts = parseInt(r.points) || 0
      const sprintPts = sprintPtsMap[driver.driverId] || 0
      return {
        ...r,
        driver,
        constructor,
        racePts,
        sprintPts,
        totalPts: racePts + sprintPts
      }
    })
    .sort((a, b) => b.totalPts - a.totalPts)

  return (
    <div className="space-y-1">
      {driversWithPoints.map((item, idx) => {
        const { driver, constructor, racePts, sprintPts, totalPts, position } = item
        const teamColor = getTeamColor(constructor.constructorId)
        const isEven = idx % 2 === 0
        const isDNF = item.status?.includes('DNF') || item.status?.includes('DSQ')

        return (
          <div key={item.position} className={`
            flex items-center gap-2 px-2 py-1.5 rounded-xl border-l-4
            ${isEven ? 'bg-white dark:bg-zinc-900' : 'bg-zinc-50 dark:bg-zinc-800/40'}
            border border-gray-200 dark:border-zinc-800
            ${isDNF ? 'opacity-50' : ''}
          `} style={{ borderLeftColor: teamColor }}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${parseInt(position) <= 3 ? 'bg-f1-red/10 text-f1-red' : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-white'}`}>
              {position}
            </span>
            
            <span className="w-8 font-mono text-xs font-bold text-gray-700 dark:text-white truncate">
              {driver.code || driver.permanentNumber || ''}
            </span>
            
            <div className="flex-1 min-w-0">
              <span className="text-xs text-gray-900 dark:text-white truncate block">
                {driver.familyName}
              </span>
              <span className="hidden sm:inline text-[10px] text-gray-500 dark:text-zinc-500">
                {constructor.name}
              </span>
            </div>

            {/* Desglose de puntos */}
            <div className="flex items-center gap-1.5">
              {hasSprint && sprintPts > 0 && (
                <span className="text-[10px] text-zinc-500">+{sprintPts} +{racePts}</span>
              )}
              <span className="text-base font-bold text-gray-900 dark:text-white">{totalPts}</span>
            </div>

            {isDNF && <span className="text-[10px] text-red-500">DNF</span>}
          </div>
        )
      })}
    </div>
  )
}

export default function GPDetailsPage() {
  const { year, round } = useParams()
  const navigate = useNavigate()
  const [settings] = useLocalStorage('f1-settings', { theme: 'dark', use12h: false })
  const [race, setRace] = useState(null)
  const [activeTab, setActiveTab] = useState('schedule')
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const { startLoading, stopLoading } = useLoading()

  const theme = settings.theme
  const yearNum = parseInt(year)
  const roundNum = parseInt(round)

  useEffect(() => { loadRace() }, [yearNum, roundNum])

  const loadRace = async () => {
    setLoading(true)
    startLoading()
    try {
      const data = await getRaceInfo(yearNum, roundNum)
      setRace(data)
    } catch (err) {
      console.error('Error loading race:', err)
    } finally {
      setLoading(false)
      stopLoading()
    }
  }

  const circuitId = race?.Circuit?.circuitId
  const circuitName = getCircuitName(circuitId)
  const circuitSvg = getCircuitSVG(circuitId, theme)
  const images = [{ type: 'svg', src: circuitSvg, label: 'Circuito' }]
  const tabs = [{ id: 'schedule', label: 'Horarios' }, { id: 'times', label: 'Tiempos' }, { id: 'points', label: 'Puntos' }]

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-48 rounded-xl bg-gray-200 dark:bg-zinc-800 animate-pulse" />
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-white transition-colors">
        <ArrowLeft size={20} />
        <span className="text-sm">Volver</span>
      </button>

      <div className="space-y-3">
        <div className="relative h-48 rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
          {images[activeImage]?.src ? (
            <img src={images[activeImage].src} alt={circuitName} className="w-full h-full object-contain p-6" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MapPin size={48} className="text-gray-300 dark:text-zinc-700" />
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {images.map((img, idx) => (
            <button key={idx} onClick={() => setActiveImage(idx)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${activeImage === idx ? 'border-f1-red' : 'border-transparent'}`}>
              {img.src ? <img src={img.src} alt={img.label} className="w-full h-full object-cover opacity-50" /> : <div className="w-full h-full bg-gray-200 dark:bg-zinc-800" />}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded bg-gray-200 dark:bg-zinc-800 text-xs font-mono text-gray-600 dark:text-zinc-400">GP {round}</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{race?.raceName || 'Gran Premio'}</h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400 flex items-center gap-1 mt-1"><MapPin size={14} />{circuitName}</p>
        <p className="text-sm text-gray-600 dark:text-zinc-300 mt-2 flex items-center gap-2"><Flag size={14} className="text-f1-red" />{race?.date} · {race?.time?.substring(0, 5) || 'TBD'}</p>
      </div>

      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-zinc-900 rounded-xl">
        {tabs.map(({ id, label }) => (
          <button key={id} onClick={() => setActiveTab(id)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === id ? 'bg-white dark:bg-zinc-800 text-f1-red shadow-sm' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-white'}`}>
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
          {activeTab === 'schedule' && <ScheduleTab race={race} />}
          {activeTab === 'times' && <TimesTab year={yearNum} round={roundNum} />}
          {activeTab === 'points' && <PointsTab year={yearNum} round={roundNum} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}