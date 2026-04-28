// F1 Team Colors 2023-2026 (mapeados por constructorId de la API)
export const TEAM_COLORS = {
  mercedes: '#27f1d0',
  red_bull: '#3671C6',
  redbull: '#1534CC',
  ferrari: '#E8002D',
  mclaren: '#FF8000',
  aston_martin: '#229971',
  alpine: '#FF87BC',
  alpha_tauri: '#469bff',
  rb: '#469bff', // AlphaTauri nuevo nombre
  williams: '#005AFF',
  haas: '#ffffff',
  kick_sauber: '#00FF00',
  sauber: '#52e252',
  cadillac: '#E31837',
  audi: '#8B8B8B',
}

// Obtener color de escudería por constructorId
export const getTeamColor = (constructorId) => {
  if (!constructorId) return '#888888'
  const normalized = constructorId.toLowerCase().replace(/[^a-z_]/g, '')
  return TEAM_COLORS[normalized] || '#888888'
}

// Season years available
export const SEASON_YEARS = [2026, 2025, 2024, 2023]

// API Base URL
export const API_BASE = 'https://api.jolpi.ca/ergast/f1'

export const DEFAULT_TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone

export const  TIMEZONE_GROUPS = [
  {
    country: 'Alemania',
    zones: [{ label: 'Berlín', value: 'Europe/Berlin' }],
  },
  {
    country: 'Arabia Saudita',
    zones: [{ label: 'Riad', value: 'Asia/Riyadh' }],
  },
  {
    country: 'Argentina',
    zones: [{ label: 'Buenos Aires', value: 'America/Argentina/Buenos_Aires' }],
  },
  {
    country: 'Australia',
    zones: [
      { label: 'Melbourne', value: 'Australia/Melbourne' },
      { label: 'Perth', value: 'Australia/Perth' },
      { label: 'Sídney', value: 'Australia/Sydney' },
    ],
  },
  {
    country: 'Brasil',
    zones: [
      { label: 'Manaus', value: 'America/Manaus' },
      { label: 'Recife', value: 'America/Recife' },
      { label: 'São Paulo', value: 'America/Sao_Paulo' },
    ],
  },
  {
    country: 'Canadá',
    zones: [
      { label: 'Halifax', value: 'America/Halifax' },
      { label: 'Toronto / Montreal', value: 'America/Toronto' },
      { label: 'Vancouver', value: 'America/Vancouver' },
    ],
  },
  {
    country: 'Chile',
    zones: [{ label: 'Santiago', value: 'America/Santiago' }],
  },
  {
    country: 'China',
    zones: [{ label: 'Beijing', value: 'Asia/Shanghai' }],
  },
  {
    country: 'Colombia',
    zones: [{ label: 'Bogotá', value: 'America/Bogota' }],
  },
  {
    country: 'Emiratos Árabes Unidos',
    zones: [{ label: 'Dubái', value: 'Asia/Dubai' }],
  },
  {
    country: 'España',
    zones: [{ label: 'Madrid', value: 'Europe/Madrid' }],
  },
  {
    country: 'Estados Unidos',
    zones: [
      { label: 'Chicago', value: 'America/Chicago' },
      { label: 'Denver', value: 'America/Denver' },
      { label: 'Los Ángeles', value: 'America/Los_Angeles' },
      { label: 'Nueva York', value: 'America/New_York' },
    ],
  },
  {
    country: 'Francia',
    zones: [{ label: 'París', value: 'Europe/Paris' }],
  },
  {
    country: 'Italia',
    zones: [{ label: 'Roma', value: 'Europe/Rome' }],
  },
  {
    country: 'Japón',
    zones: [{ label: 'Tokio', value: 'Asia/Tokyo' }],
  },
  {
    country: 'México',
    zones: [
      { label: 'Ciudad de México', value: 'America/Mexico_City' },
      { label: 'Monterrey', value: 'America/Monterrey' },
      { label: 'Tijuana', value: 'America/Tijuana' },
    ],
  },
  {
    country: 'Países Bajos',
    zones: [{ label: 'Ámsterdam', value: 'Europe/Amsterdam' }],
  },
  {
    country: 'Perú',
    zones: [{ label: 'Lima', value: 'America/Lima' }],
  },
  {
    country: 'Portugal',
    zones: [{ label: 'Lisboa', value: 'Europe/Lisbon' }],
  },
  {
    country: 'Qatar',
    zones: [{ label: 'Doha', value: 'Asia/Qatar' }],
  },
  {
    country: 'Reino Unido',
    zones: [{ label: 'Londres', value: 'Europe/London' }],
  },
  {
    country: 'Singapur',
    zones: [{ label: 'Singapur', value: 'Asia/Singapore' }],
  },
  {
    country: 'Sudáfrica',
    zones: [{ label: 'Johannesburgo', value: 'Africa/Johannesburg' }],
  },
  {
    country: 'Turquía',
    zones: [{ label: 'Estambul', value: 'Europe/Istanbul' }],
  },
]

