// Mapeo de circuitId (API Jolpi) -> archivo SVG del repo julesr0y
// Tema: 'dark' usa white-outline, 'light' usa black-outline

const GITHUB_RAW = 'https://raw.githubusercontent.com/julesr0y/f1-circuits-svg/main/circuits/detailed'

// Mapeo exacto: ID API -> Nombre archivo SVG
const CIRCUIT_MAP = {
  // ID API : Nombre Archivo Repo
  "albert_park": "melbourne-2.svg",
  "america": "austin-1.svg",
  "americas": "austin-1.svg",
  "bahrain": "bahrain-1.svg",
  "baku": "baku-1.svg",
  "catalunya": "catalunya-6.svg",
  "hungaroring": "hungaroring-3.svg",
  "interlagos": "interlagos-2.svg",
  "imola": "imola.svg",
  "jeddah": "jeddah-1.svg",
  "las_vegas": "las-vegas-1.svg",
  "vegas": "las-vegas-1.svg",
  "losail": "lusail-1.svg",
  "qatar": "lusail-1.svg",
  "madring": "madring-1.svg",
  "ifema": "madring-1.svg",
  "marina_bay": "marina-bay-4.svg",
  "miami": "miami-1.svg",
  "monaco": "monaco-6.svg",
  "villeneuve": "montreal-6.svg",
  "monza": "monza-7.svg",
  "red_bull_ring": "spielberg-3.svg",
  "ricard": "paul-ricard.svg",
  "shanghai": "shanghai-1.svg",
  "silverstone": "silverstone-8.svg",
  "spa": "spa-francorchamps-4.svg",
  "suzuka": "suzuka-2.svg",
  "yas_marina": "yas-marina-2.svg",
  "zandvoort": "zandvoort-5.svg",
  "rodriguez": "mexico-city-3.svg",
}

// Nombres legibles de circuitos
const CIRCUIT_NAMES = {
  "albert_park": "Albert Park Circuit",
  "america": "Circuit of the Americas",
  "americas": "Circuit of the Americas",
  "bahrain": "Bahrain International Circuit",
  "baku": "Baku City Circuit",
  "catalunya": "Circuit de Barcelona-Catalunya",
  "hungaroring": "Hungaroring",
  "interlagos": "Autodromo Jose Carlos Pace",
  "imola": "Autodromo Enzo e Dino Ferrari",
  "jeddah": "Jeddah Corniche Circuit",
  "las_vegas": "Las Vegas Street Circuit",
  "vegas": "Las Vegas Street Circuit",
  "losail": "Losail International Circuit",
  "qatar": "Losail International Circuit",
  "madrid": "Madrid Grand Prix Circuit",
  "ifema": "Madrid Grand Prix Circuit",
  "marina_bay": "Marina Bay Street Circuit",
  "miami": "Miami International Autodrome",
  "monaco": "Circuit de Monaco",
  "villeneuve": "Circuit Gilles Villeneuve",
  "monza": "Autodromo Nazionale Monza",
  "red_bull_ring": "Red Bull Ring",
  "ricard": "Circuit Paul Ricard",
  "shanghai": "Shanghai International Circuit",
  "silverstone": "Silverstone Circuit",
  "spa": "Circuit de Spa-Francorchamps",
  "suzuka": "Suzuka International Racing Course",
  "yas_marina": "Yas Marina Circuit",
  "zandvoort": "Circuit Zandvoort",
}

// Normalizar circuitId: minúsculas y guiones -> guiones bajos
export const normalizeCircuitId = (id) => {
  if (!id) return null
  return id.toLowerCase().replace(/-/g, '_')
}

// Obtener URL del SVG según tema
export const getCircuitSVG = (circuitId, theme = 'dark') => {
  const normalized = normalizeCircuitId(circuitId)
  
  if (!normalized) {
    console.warn('[Mapper] circuitId vacío o null')
    return null
  }

  // Buscar directo en el mapa
  let filename = CIRCUIT_MAP[normalized]
  
  // Fallback: buscar archivo que comience con el ID normalizado
  if (!filename) {
    const keys = Object.keys(CIRCUIT_MAP)
    const match = keys.find(key => key.startsWith(normalized) || normalized.startsWith(key))
    if (match) {
      filename = CIRCUIT_MAP[match]
      console.info(`[Mapper] Fallback usado: "${normalized}" -> "${match}" -> "${filename}"`)
    }
  }

  if (!filename) {
    console.warn(`[Mapper] No se encontró archivo para el ID: "${normalized}". Intentando usar placeholder.`)
    // Placeholder: devolver null o una URL genérica
    return null
  }

  const folder = theme === 'dark' ? 'white-outline' : 'black-outline'
  return `${GITHUB_RAW}/${folder}/${filename}`
}

// Obtener nombre legible del circuito
export const getCircuitName = (circuitId) => {
  const normalized = normalizeCircuitId(circuitId)
  if (!normalized) return 'Circuito desconocido'
  return CIRCUIT_NAMES[normalized] || circuitId
}

// Verificar si un circuito tiene SVG disponible
export const hasCircuitSVG = (circuitId) => {
  const normalized = normalizeCircuitId(circuitId)
  return !!CIRCUIT_MAP[normalized]
}

// Listar todos los مدارج disponibles
export const getAllCircuits = () => {
  return Object.entries(CIRCUIT_MAP).map(([id, file]) => ({
    id,
    file,
    name: CIRCUIT_NAMES[id] || id,
    hasSVG: true,
  }))
}