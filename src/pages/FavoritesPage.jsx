import { useState, useEffect } from 'react'
import { Heart, Trash2 } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import RaceCard from '../components/RaceCard'
import { RaceCardSkeleton } from '../components/Skeletons'
import { getRaces } from '../api/f1Service'
import { useLoading } from '../context/LoadingContext'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useLocalStorage('f1-favorites', [])
  const [favoriteRaces, setFavoriteRaces] = useState([])
  const [loading, setLoading] = useState(true)
  const { startLoading, stopLoading } = useLoading()

  useEffect(() => {
    loadFavoriteRaces()
  }, [favorites])

  const loadFavoriteRaces = async () => {
    if (favorites.length === 0) {
      setFavoriteRaces([])
      setLoading(false)
      return
    }

    setLoading(true)
    startLoading()
    try {
      const currentYear = new Date().getFullYear()
      const allRaces = await getRaces(currentYear)
      
      const matched = favorites.map(fav => {
        return allRaces.find(r => 
          r.round === fav.round && r.season === fav.season
        ) || fav
      }).filter(Boolean)

      setFavoriteRaces(matched)
    } catch (err) {
      console.error('Error loading favorites:', err)
      setFavoriteRaces(favorites)
    } finally {
      setLoading(false)
      stopLoading()
    }
  }

  const toggleFavorite = (race) => {
    const raceKey = `${race.season}-${race.round}`
    const isFav = favorites.some(f => f.round === race.round && f.season === race.season)
    
    if (isFav) {
      setFavorites(prev => prev.filter(f => !(f.round === race.round && f.season === race.season)))
    } else {
      setFavorites(prev => [...prev, { 
        round: race.round, 
        season: race.season,
        raceName: race.raceName,
        circuit: race.Circuit?.circuitId
      }])
    }
  }

  const isFavorite = (race) => {
    return favorites.some(f => f.round === race.round && f.season === race.season)
  }

  const clearAllFavorites = () => {
    if (window.confirm('¿Eliminar todos los favoritos?')) {
      setFavorites([])
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Heart className="text-f1-red" />
          Favoritos
        </h1>
        
        {favorites.length > 0 && (
          <button
            onClick={clearAllFavorites}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-red-500/50 text-red-500 text-sm hover:bg-red-500/10 transition-colors"
          >
            <Trash2 size={16} />
            Limpiar
          </button>
        )}
      </div>

      {/* Empty State */}
      {!loading && favorites.length === 0 && (
        <div className="text-center py-12">
          <Heart size={48} className="mx-auto text-gray-300 dark:text-zinc-700 mb-4" />
          <p className="text-gray-500 dark:text-zinc-400 text-lg">
            No tenés favoritos aún
          </p>
          <p className="text-gray-400 dark:text-zinc-500 text-sm mt-2">
            Tocá el corazón en una carrera para agregarla
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <RaceCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Favorite Races */}
      {!loading && favoriteRaces.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {favoriteRaces.map((race, index) => (
            <RaceCard
              key={`${race.season}-${race.round}`}
              race={race}
              index={index}
              isFavorite={isFavorite(race)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  )
}