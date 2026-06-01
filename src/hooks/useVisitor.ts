import { useCallback, useEffect, useMemo, useState } from 'react'

export const VISITOR_NAME_STORAGE_KEY = 'soutenance_visitor_name'

const readVisitorNameFromStorage = () => {
  if (typeof window === 'undefined') {
    return ''
  }

  const rawValue = window.localStorage.getItem(VISITOR_NAME_STORAGE_KEY)
  return rawValue?.trim() ?? ''
}

export const useVisitor = () => {
  const [visitorName, setVisitorNameState] = useState<string>(() =>
    readVisitorNameFromStorage(),
  )

  const setVisitorName = useCallback((nextName: string) => {
    const normalizedName = nextName.trim()

    setVisitorNameState(normalizedName)

    if (typeof window === 'undefined') {
      return
    }

    if (normalizedName.length === 0) {
      window.localStorage.removeItem(VISITOR_NAME_STORAGE_KEY)
      return
    }

    window.localStorage.setItem(VISITOR_NAME_STORAGE_KEY, normalizedName)
  }, [])

  const clearVisitorName = useCallback(() => {
    setVisitorNameState('')

    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.removeItem(VISITOR_NAME_STORAGE_KEY)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== VISITOR_NAME_STORAGE_KEY) {
        return
      }

      setVisitorNameState(event.newValue?.trim() ?? '')
    }

    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const hasVisitor = useMemo(() => visitorName.trim().length > 0, [visitorName])

  return {
    visitorName,
    setVisitorName,
    clearVisitorName,
    hasVisitor,
  }
}
