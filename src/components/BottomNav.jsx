import { NavLink } from 'react-router-dom'
import { Flag, Trophy, Heart, Settings, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSeason } from '../context/LoadingContext'
import { SEASON_YEARS } from '../constants'

const navItems = [
  { to: '/', icon: Flag, label: 'Carreras' },
  { to: '/championships', icon: Trophy, label: 'Campeonatos' },
  { to: '/favorites', icon: Heart, label: 'Favoritos' },
  { to: '/settings', icon: Settings, label: 'Ajustes' },
]

export default function BottomNav() {
  const { selectedYear, setSelectedYear } = useSeason()
  const [showYearPicker, setShowYearPicker] = useState(false)

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-f1-dark/95 backdrop-blur-lg border-t border-gray-200 dark:border-white/10 md:hidden z-50 transition-colors duration-300">
      <div className="flex justify-around items-center h-16">


        {/* Nav items */}
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors duration-200 ${
                isActive ? 'text-f1-red' : 'text-gray-500 dark:text-white/60'
              }`
            }
          >
            <Icon size={22} />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}