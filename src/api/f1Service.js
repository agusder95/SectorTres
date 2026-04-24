import { API_BASE } from '../constants'

const fetchJSON = async (url) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`API Error: ${res.status}`)
  return res.json()
}

// Obtener todas las carreras de una temporada
export const getRaces = async (year = new Date().getFullYear()) => {
  const data = await fetchJSON(`${API_BASE}/${year}.json`)
  return data.MRData.RaceTable.Races
}

// Obtener resultados de una carrera específica
export const getRaceResults = async (year, round) => {
  const data = await fetchJSON(`${API_BASE}/${year}/${round}/results.json`)
  return data.MRData.RaceTable.Races[0]
}

// Obtener clasificación/qualifying
export const getQualifying = async (year, round) => {
  const data = await fetchJSON(`${API_BASE}/${year}/${round}/qualifying.json`)
  return data.MRData.RaceTable.Races[0]
}

// Obtener sprint results (si aplica)
export const getSprintResults = async (year, round) => {
  const data = await fetchJSON(`${API_BASE}/${year}/${round}/sprint.json`)
  return data.MRData.RaceTable.Races[0]
}

// standings de pilotos
export const getDriverStandings = async (year = new Date().getFullYear()) => {
  const data = await fetchJSON(`${API_BASE}/${year}/driverStandings.json`)
  return data.MRData.StandingsTable.StandingsLists[0]
}

// standings de constructores
export const getConstructorStandings = async (year = new Date().getFullYear()) => {
  const data = await fetchJSON(`${API_BASE}/${year}/constructorStandings.json`)
  return data.MRData.StandingsTable.StandingsLists[0]
}

// Info de una carrera específica
export const getRaceInfo = async (year, round) => {
  const data = await fetchJSON(`${API_BASE}/${year}/${round}.json`)
  return data.MRData.RaceTable.Races[0]
}