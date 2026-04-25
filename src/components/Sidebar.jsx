import { NavLink } from 'react-router-dom'
import { Flag, Trophy, Heart, Settings } from 'lucide-react'
import {useLocalStorage} from "../hooks/useLocalStorage.js";
import iconB from "../assets/iconB.png"
import iconW from "../assets/iconW.png"



const navItems = [
  { to: '/', icon: Flag, label: 'Carreras' },
  { to: '/championships', icon: Trophy, label: 'Campeonatos' },
  { to: '/favorites', icon: Heart, label: 'Favoritos' },
  { to: '/settings', icon: Settings, label: 'Configuración' },
]

export default function Sidebar() {

    const [settings] = useLocalStorage('f1-settings',{
        theme: 'dark',
        use12:false,
    })

    const isDark = settings.theme === 'dark'

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-full bg-white dark:bg-f1-dark border-r border-gray-200 dark:border-white/10 flex-col z-50 transition-colors duration-300">
      <div className="p-6 border-b border-gray-200  dark:border-white/10">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <img src={isDark ? iconB : iconW} alt="SectorTres Logo" className="w-14 h-14" />
          <span className="text-gray-900 dark:text-white">SectorTres</span>
        </h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-f1-red/10 text-f1-red' 
                  : 'text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
              }`
            }
          >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}