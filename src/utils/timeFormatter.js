import { useState, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

// Formatear fecha UTC a local
export const formatToLocal = (utcDateString, options = {}) => {
  const date = new Date(utcDateString)
  const defaults = {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }
  return date.toLocaleString(undefined, { ...defaults, ...options })
}

// Formatear solo hora
export const formatTime = (utcDateString, use12h = false) => {
  const date = new Date(utcDateString)
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: use12h,
  })
}

// Formatear solo fecha
export const formatDate = (utcDateString) => {
  const date = new Date(utcDateString)
  return date.toLocaleDateString(undefined, {
    day: '2-digit',
    month: '2-digit',
  })
}

// Detectar si el evento ocurre en un día calendario distinto al del usuario
export const isNextDay = (utcDateString) => {
  const eventDate = new Date(utcDateString)
  const localDate = new Date()
  
  // Comparar fechas ignoring time
  const eventDay = eventDate.toDateString()
  const localDay = localDate.toDateString()
  
  return eventDay !== localDay
}

// Detectar si es "trasnoche" (entre 00:00 y 05:00 hora local)
export const isMadrugada = (utcDateString) => {
  const date = new Date(utcDateString)
  const hour = date.getHours()
  return hour >= 0 && hour <= 5  // 00:00 hasta 04:59
}

// Hook para detectar "trasnoche" (evento en día diferente)
/*export const useIsNextDay = (utcDateString) => {
  const [isNext, setIsNext] = useState(false)
  
  useEffect(() => {
    if (!utcDateString) {
      setIsNext(false)
      return
    }
    
    const checkNextDay = () => {
      setIsNext(isNextDay(utcDateString))
    }
    
    checkNextDay()
    // Revalidar cada minuto
    const interval = setInterval(checkNextDay, 60000)
    return () => clearInterval(interval)
  }, [utcDateString])
  
  return isNext
}*/

// Hook para formato de hora con settings del usuario
export const useTimeFormat = () => {
  const [settings] = useLocalStorage('f1-settings', {
    theme: 'dark',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    use12h: false,
  })
  
  return {
    use12h: settings.use12h,
    timezone: settings.timezone,
  }
}

// Tiempo relativo ("Hace 2 horas", "En 3 días")
export const getRelativeTime = (utcDateString) => {
  const now = new Date()
  const event = new Date(utcDateString)
  const diff = event - now
  const absDiff = Math.abs(diff)
  
  const minutes = Math.floor(absDiff / (1000 * 60))
  const hours = Math.floor(absDiff / (1000 * 60 * 60))
  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24))
  
  const isPast = diff < 0
  const suffix = isPast ? 'hace' : 'en'
  
  if (days > 0) return `${suffix} ${days} día${days > 1 ? 's' : ''}`
  if (hours > 0) return `${suffix} ${hours} hora${hours > 1 ? 's' : ''}`
  if (minutes > 0) return `${suffix} ${minutes} min`
  return isPast ? 'ahora' : 'ahora'
}

// Estado de carrera: 'upcoming', 'live', 'finished'
export const getRaceStatus = (race) => {
  const now = new Date()
  const firstPractice = race.FirstPractice?.date ? new Date(race.FirstPractice.date) : null
  const raceDate = race.date ? new Date(race.date) : null
  
  if (!firstPractice || !raceDate) return 'unknown'
  
  if (now < firstPractice) return 'upcoming'
  if (now >= firstPractice && now <= raceDate) return 'live'
  return 'finished'
}