import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PwaBanner from '../components/PwaBanner'
import RacesPage from '../pages/RacesPage'
import ChampionshipsPage from '../pages/ChampionshipsPage'
import FavoritesPage from '../pages/FavoritesPage'
import SettingsPage from '../pages/SettingsPage'
import GPDetailsPage from '../pages/GPDetailsPage'
import { useLocalStorage } from '../hooks/useLocalStorage'

function ThemeSync() {
  const [settings] = useLocalStorage('f1-settings', {
    theme: 'dark',
    use12h: false,
  })

  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    }
  }, [settings.theme])

  return null
}

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-f1-dark text-gray-900 dark:text-white pb-20 md:pb-0 md:pl-64 transition-colors duration-300">
      <ThemeSync />
      <Header />
      <Sidebar />
      <PwaBanner />
      <main className="px-4 py-4 pt-4 md:pt-4 min-h-screen">
        <Routes>
          <Route path="/" element={<RacesPage />} />
          <Route path="/championships" element={<ChampionshipsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/race/:year/:round" element={<GPDetailsPage />} />
        </Routes>
      </main>
      <Footer />
      <BottomNav />
    </div>
  )
}