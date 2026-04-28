export const DEFAULT_TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone

const resolveTimeZone = (timeZone) => timeZone || DEFAULT_TIME_ZONE

const buildDateTimeFormatter = (locale, options, timeZone) => {
  try {
    return new Intl.DateTimeFormat(locale, {
      ...options,
      timeZone: resolveTimeZone(timeZone),
    })
  } catch {
    return new Intl.DateTimeFormat(locale, options)
  }
}

const getZonedHour = (date, timeZone) => {
  const formatter = buildDateTimeFormatter('en-GB', {
    hour: '2-digit',
    hourCycle: 'h23',
  }, timeZone)
  const parts = formatter.formatToParts(date)
  return Number(parts.find((part) => part.type === 'hour')?.value ?? 0)
}

// Formatear solo hora
export const formatTime = (utcDateString, use12h = false, timeZone) => {
  const date = new Date(utcDateString)
  return buildDateTimeFormatter('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: use12h,
  }, timeZone).format(date)
}

// Formatear solo fecha DD/MM/YYYY
export const formatDate = (utcDateString, timeZone) => {
  if (!utcDateString) return ''

  // Si viene solo la fecha (YYYY-MM-DD), no la pasamos por Date
  // para evitar que se desplace un día por la zona horaria.
  if (/^\d{4}-\d{2}-\d{2}$/.test(utcDateString)) {
    const [year, month, day] = utcDateString.split('-')
    return `${day}/${month}/${year}`
  }

  const date = new Date(utcDateString)
  const formatter = buildDateTimeFormatter('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }, timeZone)
  const [day, month, year] = formatter.format(date).split('/')
  return `${day}/${month}/${year}`
}

// Detectar si es "trasnoche" (entre 00:00 y 05:00 hora local)
export const isMadrugada = (utcDateString, timeZone) => {
  const date = new Date(utcDateString)
  const hour = getZonedHour(date, timeZone)
  return hour >= 0 && hour < 5  // 00:00 hasta 04:59
}

