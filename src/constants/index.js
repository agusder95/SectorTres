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

// Constructor Logos URLs
export const CONSTRUCTOR_LOGOS = {
  mercedes: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_80,h_80/content/dam/fom-assets/constructors/mercedes',
  red_bull: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_80,h_80/content/dam/fom-assets/constructors/red-bull-racing',
  ferrari: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_80,h_80/content/dam/fom-assets/constructors/ferrari',
  mclaren: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_80,h_80/content/dam/fom-assets/constructors/mclaren',
  aston_martin: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_80,h_80/content/dam/fom-assets/constructors/aston-martin',
  alpine: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_80,h_80/content/dam/fom-assets/constructors/alpine',
  alpha_tauri: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_80,h_80/content/dam/fom-assets/constructors/alpha-tauri',
  williams: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_80,h_80/content/dam/fom-assets/constructors/williams',
  haas: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_80,h_80/content/dam/fom-assets/constructors/haas',
  kick_sauber: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_80,h_80/content/dam/fom-assets/constructors/kick-sauber',
}

// Circuit SVG mapping (Julesr0y repo)
export const CIRCUIT_SVGS = {
  monaco: 'https://raw.githubusercontent.com/julesr0y/f1-assets/main/circuits/black-outline/monaco.svg',
  silverstone: 'https://raw.githubusercontent.com/julesr0y/f1-assets/main/circuits/black-outline/silverstone.svg',
  spa: 'https://raw.githubusercontent.com/julesr0y/f1-assets/main/circuits/black-outline/spa.svg',
  monza: 'https://raw.githubusercontent.com/julesr0y/f1-assets/main/circuits/black-outline/monza.svg',
}

// Season years available
export const SEASON_YEARS = [2026, 2025, 2024, 2023]

// API Base URL
export const API_BASE = 'https://api.jolpi.ca/ergast/f1'