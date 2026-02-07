// Safe localStorage wrapper for Next.js SSR compatibility
// Handles: SSR, incognito mode, cookies blocked, localStorage disabled

const isClient = typeof window !== 'undefined'

// In-memory fallback when localStorage is not available
const memoryStorage: Record<string, string> = {}

function canUseLocalStorage(): boolean {
  if (!isClient) return false
  try {
    const testKey = '__storage_test__'
    window.localStorage.setItem(testKey, testKey)
    window.localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

const useLocalStorage = canUseLocalStorage()

export const safeStorage = {
  getItem: (key: string): string | null => {
    if (!isClient) return null
    if (useLocalStorage) {
      try {
        return window.localStorage.getItem(key)
      } catch {
        return memoryStorage[key] || null
      }
    }
    return memoryStorage[key] || null
  },

  setItem: (key: string, value: string): void => {
    if (!isClient) return
    if (useLocalStorage) {
      try {
        window.localStorage.setItem(key, value)
      } catch {
        memoryStorage[key] = value
      }
    } else {
      memoryStorage[key] = value
    }
  },

  removeItem: (key: string): void => {
    if (!isClient) return
    if (useLocalStorage) {
      try {
        window.localStorage.removeItem(key)
      } catch {
        delete memoryStorage[key]
      }
    } else {
      delete memoryStorage[key]
    }
  },

  clear: (): void => {
    if (!isClient) return
    if (useLocalStorage) {
      try {
        window.localStorage.clear()
      } catch {
        Object.keys(memoryStorage).forEach(key => delete memoryStorage[key])
      }
    } else {
      Object.keys(memoryStorage).forEach(key => delete memoryStorage[key])
    }
  },

  key: (index: number): string | null => {
    if (!isClient) return null
    if (useLocalStorage) {
      try {
        return window.localStorage.key(index)
      } catch {
        return Object.keys(memoryStorage)[index] || null
      }
    }
    return Object.keys(memoryStorage)[index] || null
  },

  get length(): number {
    if (!isClient) return 0
    if (useLocalStorage) {
      try {
        return window.localStorage.length
      } catch {
        return Object.keys(memoryStorage).length
      }
    }
    return Object.keys(memoryStorage).length
  }
}

export default safeStorage
