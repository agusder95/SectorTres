import { Routes, Route } from 'react-router-dom'
import { LoadingProvider } from './context/LoadingContext'
import MainLayout from './layouts/MainLayout'

export default function App() {
  return (
    <LoadingProvider>
      <Routes>
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </LoadingProvider>
  )
}