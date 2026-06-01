import { useCallback, useEffect, useState } from 'react'
import { fetchMemories, uploadMemoryAsset } from '../services/memoryService'
import type { Memory, UploadMemoryInput } from '../types/memory'
import { hasSharedMemoryConfig } from '../utils/env'

const formatError = (error: unknown) =>
  error instanceof Error ? error.message : 'An unexpected error occurred.'

export const useMemories = () => {
  const [memories, setMemories] = useState<Memory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const loadMemories = useCallback(async () => {
    if (!hasSharedMemoryConfig) {
      setIsLoading(false)
      setMemories([])
      setLoadError(null)
      return
    }

    setIsLoading(true)
    setLoadError(null)

    try {
      const records = await fetchMemories()
      setMemories(records)
    } catch (error) {
      setLoadError(formatError(error))
    } finally {
      setIsLoading(false)
    }
  }, [])

  const uploadMemory = useCallback(async (payload: UploadMemoryInput) => {
    setUploadError(null)
    setIsUploading(true)

    try {
      const record = await uploadMemoryAsset(payload)
      setMemories((current) => [record, ...current])
    } catch (error) {
      const message = formatError(error)
      setUploadError(message)
      throw new Error(message, { cause: error })
    } finally {
      setIsUploading(false)
    }
  }, [])

  const clearUploadError = useCallback(() => {
    setUploadError(null)
  }, [])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadMemories()
    }, 0)

    return () => window.clearTimeout(timeout)
  }, [loadMemories])

  return {
    memories,
    isLoading,
    isUploading,
    loadError,
    uploadError,
    loadMemories,
    uploadMemory,
    clearUploadError,
  }
}
