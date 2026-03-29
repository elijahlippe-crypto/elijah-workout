import { useState } from 'react'

export function useStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : defaultValue
    } catch {
      return defaultValue
    }
  })

  const set = (newValue) => {
    try {
      const toStore = typeof newValue === 'function' ? newValue(value) : newValue
      localStorage.setItem(key, JSON.stringify(toStore))
      setValue(toStore)
    } catch (e) {
      console.error('Storage write failed', e)
    }
  }

  return [value, set]
}
