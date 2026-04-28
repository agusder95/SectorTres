import { useState, useEffect } from 'react'
import {useParams, useNavigate, NavLink} from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {ArrowLeft, Clock, Flag, MapPin, Road} from 'lucide-react'
import { getRaceInfo, getRaceResults, getQualifying, getSprintResults } from '../api/f1Service'
import { getCircuitSVG, getCircuitName } from '../api/circuitMapper'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Skeleton } from '../components/Skeletons'
import { DEFAULT_TIME_ZONE, getTeamColor } from '../constants'
import { useLoading } from '../context/LoadingContext'
import { formatDate, formatTime } from '../utils/timeFormatter'

function ScheduleTab({ race, use12h, timezone }) {
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
        const gpDate = session.date + 'T' + (session.time || '00:00:00Z')

        const timeStr = formatTime(gpDate, use12h, timezone)
        const formattedDate = formatDate(gpDate, timezone)
        return (
          <div key={session.key} className={`flex items-center justify-between p-3 rounded-xl ${session.isRace ? 'bg-f1-red/10 border border-f1-red/30' : 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800'}`}>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 rounded-lg text-sm font-bold ${session.isRace ? 'bg-f1-red text-white' : 'bg-f1-red/10 text-f1-red'}`}>
                {session.label}
              </span>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formattedDate} · {timeStr}
              </p>
            </div>
            <Clock size={16} className="text-gray-400 dark:text-zinc-500" />
          </div>
        )
      })}
    </div>
  )
}

// ===== TIMES TAB =====
function TimesTab({ year, round }) {
  const [raceResults, setRaceResults] = useState(null);
  const [qualy, setQualy] = useState(null);
  const [sprintResults, setSprintResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    loadAllData();
  }, [year, round]);

  const loadAllData = async () => {
    setLoading(true);
    startLoading(); // Activa el semáforo de luces
    try {
      const [race, q, sprint] = await Promise.all([
        getRaceResults(year, round).catch(() => null),
        getQualifying(year, round).catch(() => null),
        getSprintResults(year, round).catch(() => null)
      ]);
      setRaceResults(race);
      setQualy(q);
      setSprintResults(sprint);
    } catch (err) {
      console.error('Error al cargar tiempos:', err);
    } finally {
      setLoading(false);
      stopLoading(); // Apaga el semáforo
    }
  };

  // Si está cargando, retornamos null para que el LoadingOverlay sea el protagonista
  if (loading) return null;

  const raceData = raceResults?.Results || [];
  const qualyData = qualy?.QualifyingResults || [];
  const sprintData = sprintResults?.SprintResults || [];

  if (!raceData.length && !qualyData.length && !sprintData.length) {
    return (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-zinc-400 font-medium">Sin tiempos cargados para este GP</p>
        </div>
    );
  }

  // Helper para renderizar grillas (Carrera, Qualy, Sprint)
  const renderGrid = (title, results, isQualy = false, accentColor = '#e10600', isSprintQualy = false) => {
    if (!results?.length) return null;

    // Lógica matemática para cortes de Qualy (Solo si es Qualy)
    const N = results.length;
    const q3Idx = 9; // Después de P10
    const q2Idx = 9 + Math.floor((N - 10) / 2); // Fórmula: Q3 + (Resto / 2)

    return (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: accentColor }} />
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
              {title}
            </h4>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            {results.map((result, idx) => {
              const driver = result.Driver || {};
              const constructor = result.Constructor || {};
              const teamColor = getTeamColor(constructor.constructorId);
              const isFL = result.FastestLap?.rank === "1";
              const isLast = idx === results.length - 1;

              // Posición: Usamos 'grid' para la Qualy de Sprint, sino 'position'
              const pos = isSprintQualy ? (result.grid || idx + 1) : result.position;

              // Renderizado de líneas divisorias en Qualy
              const showQ3Line = isQualy && idx === q3Idx && !isLast;
              const showQ2Line = isQualy && idx === q2Idx && !isLast;

              return (
                  <div key={idx}>
                    <div className={`
                  flex items-center gap-5 px-3 py-3
                  ${idx % 2 === 0 ? 'bg-white dark:bg-zinc-900' : 'bg-zinc-400/10 dark:bg-zinc-700/50'}
                  border-l-[8px] transition-colors
                `} style={{ borderLeftColor: teamColor }}>

                      {/* Posición */}
                      <span className="w-5 text-center font-mono text-xs font-bold text-gray-400 dark:text-zinc-500">
                    {pos}
                  </span>

                      {/* CODE Piloto */}
                      <span className="w-10 font-mono text-sm font-black text-gray-800 dark:text-white">
                    {driver.code}
                  </span>

                      {/* Nombre y Team */}
                      <div className="flex-1 flex items-center gap-2 min-w-0">
                    <span className="text-sm text-gray-900 dark:text-zinc-100 truncate font-light">
                      <b className={"text-s font-bold"}>{driver.familyName}</b> {driver.givenName}
                    </span>
                        <span className="hidden sm:block text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-tighter">
                      {constructor.name}
                    </span>
                      </div>

                      {/* Fastest Lap Indicator */}
                      {isFL && (
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-fuchsia-500/10 text-fuchsia-500 border border-fuchsia-500/20">
                      FL
                    </span>
                      )}

                      {/* Tiempo (Solo si no es Qualy) */}
                      {!isQualy && (
                          <span className="w-20 text-right font-mono text-xs font-medium text-gray-600 dark:text-zinc-400">
                      {result.Time?.time || result.status || '--'}
                    </span>
                      )}
                    </div>

                    {/* Línea divisoria roja de Qualy */}
                    {(showQ3Line || showQ2Line) && (
                        <div className="h-[2px] w-full bg-red-600/60 shadow-[0_0_8px_rgba(225,6,0,0.4)]" />
                    )}
                  </div>
              );
            })}
          </div>
        </div>
    );
  };

  return (
      <div className="animate-in fade-in duration-500">
        {/* 1. Carrera Principal */}
        {raceData.length > 0 && renderGrid('Carrera', raceData, false, '#e10600')}

        {/* 2. Qualy Principal */}
        {qualyData.length > 0 && renderGrid('Clasificación', qualyData, true, '#e10600')}

        {/* 3. Carrera Sprint (si hay) */}
        {sprintData.length > 0 && renderGrid('Carrera Sprint', sprintData, false, '#10b981')}

        {/* 4. Qualy Sprint (si hay) */}
        {sprintData.length > 0 && renderGrid(
            'Clasificación Sprint',
            [...sprintData].sort((a, b) => parseInt(a.grid) - parseInt(b.grid)),
            true,
            '#10b981',
            true
        )}
      </div>
  );
}

// ===== POINTS TAB =====
export default function GPDetailsPage() {
  const { year, round } = useParams()
  const navigate = useNavigate()
  const [settings] = useLocalStorage('f1-settings', { theme: 'dark', use12h: false, timezone: DEFAULT_TIME_ZONE })
  const [race, setRace] = useState(null)
  const [activeTab, setActiveTab] = useState('schedule')
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const { startLoading, stopLoading } = useLoading()

  const theme = settings.theme
  const timezone = settings.timezone || DEFAULT_TIME_ZONE
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
  const use12h = settings.use12h
  const circuitId = race?.Circuit?.circuitId
  const circuitName = getCircuitName(circuitId)
  const circuitLocality = race?.Circuit?.Location.locality
  const circuitCountry = race?.Circuit?.Location?.country
  const circuitSvg = getCircuitSVG(circuitId, theme)
  const images = [{ type: 'svg', src: circuitSvg, label: 'Circuito' }]
  const tabs = [{ id: 'schedule', label: 'Horarios' }, { id: 'times', label: 'Tiempos' }, { id: 'points', label: 'Puntos' }]

  const circuitDate = race?.date ? `${race.date}T${race?.time || '00:00:00Z'}` : null

  const timeStr = circuitDate ? formatTime(circuitDate, use12h, timezone) : ''
  const formattedDate = circuitDate ? formatDate(circuitDate, timezone) : ''

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
//bloque 1
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
        <p className="text-sm text-gray-500 dark:text-zinc-400 flex items-center gap-1 mt-1"><Road size={14} />{circuitName}</p>
        <p className="text-sm text-gray-500 dark:text-zinc-400 flex items-center gap-1 mt-1"><MapPin size={14} />{circuitCountry} {circuitLocality}</p>
        <p className="text-sm text-gray-600 dark:text-zinc-300 mt-2 flex items-center gap-2"><Flag size={14} className="text-f1-red" />{formattedDate} · {timeStr}</p>
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
          {activeTab === 'schedule' && <ScheduleTab race={race} use12h={settings.use12h} timezone={timezone} />}
          {activeTab === 'times' && <TimesTab year={yearNum} round={roundNum} />}
          {activeTab === 'points' && <PointsTab year={yearNum} round={roundNum} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

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
            flex items-center h-12 gap-3 px-2 py-1.5 rounded-xl border-l-8
            ${isEven ? 'bg-white dark:bg-zinc-900' : 'bg-zinc-400/10 dark:bg-zinc-700/50'}
            border border-gray-200 dark:border-zinc-800
            ${isDNF ? 'opacity-50' : ''}
          `} style={{ borderLeftColor: teamColor }}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${parseInt(position) <= 3 ? 'bg-f1-red/10 text-f1-red' : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-white'}`}>
              {position}
            </span>

                <span className="w-8 font-mono text-s font-bold text-gray-700 dark:text-white truncate">
              {driver.code || driver.permanentNumber || ''}
            </span>

                <div className="flex-1 min-w-0">
              <span className="text-sm text-gray-900 dark:text-zinc-100 truncate font-thin mr-8">
                      {driver.givenName} <b className={"text-s font-bold"}>{driver.familyName}</b>
              </span>
                  <span className="hidden sm:inline text-[10px] text-gray-500 dark:text-zinc-500">
                {constructor.name}
              </span>
                </div>

                {/* Desglose de puntos */}
                <div className="flex items-center gap-1.5">
                  {hasSprint && sprintPts > 0 && (
                      <span className="text-[12px] text-zinc-500">+{sprintPts}  +{racePts} </span>
                  )}
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{totalPts}</span>
                </div>

                {isDNF && <span className="text-[10px] text-red-500">DNF</span>}
              </div>
          )
        })}
      <NavLink  to={`/championships`} className="block text-center text-sm text-f1-red hover:underline mt-4">
        <p className={"mt-8 mb-4 text-[15px]"}>Tabla Campeonato</p>
      </NavLink>
      </div>

)
}
