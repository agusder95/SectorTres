import { Heart } from 'lucide-react'

export default function FavoritesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Heart className="text-f1-red" />
        Favoritos
      </h1>
      <p className="text-white/60">Contenido de Favoritos - Fase 4</p>
    </div>
  )
}