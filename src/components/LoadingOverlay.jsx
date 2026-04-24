import { useState, useEffect } from 'react'

export default function LoadingOverlay({ isLoading }) {
  const [activeLights, setActiveLights] = useState(0)

  useEffect(() => {
    if (!isLoading) {
      setActiveLights(0)
      return
    }

    const lightInterval = setInterval(() => {
      setActiveLights(prev => {
        if (prev >= 5) {
          return prev
        }
        return prev + 1
      })
    }, 300)

    const resetTimeout = setTimeout(() => {
      setActiveLights(0)
    }, 5 * 300 + 600)

    return () => {
      clearInterval(lightInterval)
      clearTimeout(resetTimeout)
    }
  }, [isLoading])

  useEffect(() => {
    if (!isLoading) return

    const loopTimeout = setTimeout(() => {
      setActiveLights(0)
    }, 5 * 300 + 600)

    return () => clearTimeout(loopTimeout)
  }, [activeLights, isLoading])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`
                w-4 h-4 rounded-full transition-all duration-200
                ${i < activeLights 
                  ? 'bg-f1-red shadow-lg shadow-f1-red/50' 
                  : 'bg-zinc-700'
                }
              `}
            />
          ))}
        </div>
        <span className="text-sm text-white/70 font-medium tracking-wide">Cargando...</span>
      </div>
    </div>
  )
}