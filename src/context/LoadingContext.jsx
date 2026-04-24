import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import LoadingOverlay from '../components/LoadingOverlay'

const LoadingContext = createContext(null)

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoadingState] = useState(false)
  const [showSpinner, setShowSpinner] = useState(false)
  const timeoutRef = useRef(null)

  // Delay de 200ms para evitar parpadeos
  useEffect(() => {
    if (isLoading) {
      timeoutRef.current = setTimeout(() => setShowSpinner(true), 200)
    } else {
      setShowSpinner(false)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [isLoading])

  const startLoading = useCallback(() => setIsLoadingState(true), [])
  
  const stopLoading = useCallback(() => {
    setIsLoadingState(false)
  }, [])

  const setLoading = useCallback((loading) => {
    setIsLoadingState(loading)
  }, [])

  return (
    <LoadingContext.Provider value={{ isLoading: showSpinner, startLoading, stopLoading, setLoading }}>
      {children}
      <LoadingOverlay isLoading={showSpinner} />
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}