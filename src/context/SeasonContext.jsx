import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const SeasonContext = createContext(null)

export function SeasonProvider() {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useLocalStorage('f1-selected-year', currentYear.toString())

  return (
    <SeasonContext.Provider value={{ selectedYear, setSelectedYear }}>
      {/* This provider will be wrapped by LoadingProvider */}
    </SeasonContext.Provider>
  )
}

export function useSeason() {
  const context = useContext(SeasonContext)
  if (!context) {
    throw new Error('useSeason must be used within a SeasonProvider')
  }
  return context
}