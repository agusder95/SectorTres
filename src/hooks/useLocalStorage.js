import { useState, useEffect } from 'react'

const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (!item) return initialValue

      const parsed = JSON.parse(item)
      return isPlainObject(initialValue) && isPlainObject(parsed)
        ? { ...initialValue, ...parsed }
        : parsed
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}