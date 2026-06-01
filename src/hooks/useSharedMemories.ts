import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { uploadToCloudinary } from '../services/cloudinaryService'
import {
  deleteMemory as deleteMemoryRecord,
  getMemories,
  getUploaderMemoryCount,
  saveMemory,
  subscribeToMemories,
} from '../services/memoriesService'
import type { Memory } from '../types/memory'

const IMAGE_MAX_BYTES = 10 * 1024 * 1024
export const MAX_VISITOR_PHOTOS = 5

const formatErrorMessage = (error: unknown) =>
  error instanceof Error && error.message.trim().length > 0
    ? error.message
    : 'Une erreur inattendue est survenue.'

const toFilesArray = (files: FileList | File[]) =>
  Array.isArray(files) ? files : Array.from(files)

const validateFilesBeforeUpload = (files: File[]) => {
  if (files.length === 0) {
    return 'Sélectionnez au moins une photo.'
  }

  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      return 'Seules les photos sont acceptées.'
    }

    if (file.size > IMAGE_MAX_BYTES) {
      return `La photo "${file.name}" dépasse la limite de 10MB.`
    }
  }

  return null
}

const yieldToEventLoop = () =>
  new Promise<void>((resolve) => window.setTimeout(resolve, 0))

export const useSharedMemories = (visitorName: string | null) => {
  const normalizedVisitorName = useMemo(
    () => visitorName?.trim() ?? '',
    [visitorName],
  )

  const [memories, setMemories] = useState<Memory[]>([])
  const [visitorUploadCount, setVisitorUploadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [isRealtimeActive, setIsRealtimeActive] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)

  const isMountedRef = useRef(true)

  const clearMessages = useCallback(() => {
    setError(null)
    setSuccessMessage(null)
  }, [])

  const refreshVisitorUploadCount = useCallback(async () => {
    if (normalizedVisitorName.length === 0) {
      if (isMountedRef.current) {
        setVisitorUploadCount(0)
      }

      return 0
    }

    const count = await getUploaderMemoryCount(normalizedVisitorName)

    if (isMountedRef.current) {
      setVisitorUploadCount(count)
    }

    return count
  }, [normalizedVisitorName])

  const loadMemories = useCallback(async () => {
    if (!isMountedRef.current) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const [rows, count] = await Promise.all([
        getMemories(),
        normalizedVisitorName.length > 0
          ? getUploaderMemoryCount(normalizedVisitorName)
          : Promise.resolve(0),
      ])

      if (!isMountedRef.current) {
        return
      }

      setMemories(rows)
      setVisitorUploadCount(count)
    } catch (loadError) {
      if (!isMountedRef.current) {
        return
      }

      setError(formatErrorMessage(loadError))
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [normalizedVisitorName])

  const uploadFiles = useCallback(
    async (filesInput: FileList | File[]) => {
      clearMessages()

      if (normalizedVisitorName.length === 0) {
        setError('Entrez votre nom pour partager un souvenir.')
        return
      }

      const files = toFilesArray(filesInput)
      const validationError = validateFilesBeforeUpload(files)

      if (validationError) {
        setError(validationError)
        return
      }

      let currentCount = 0

      try {
        currentCount = await refreshVisitorUploadCount()
      } catch (countError) {
        setError(formatErrorMessage(countError))
        return
      }

      if (currentCount >= MAX_VISITOR_PHOTOS) {
        setError('Vous avez déjà partagé 5 photos. Merci pour vos souvenirs.')
        return
      }

      const remainingUploads = MAX_VISITOR_PHOTOS - currentCount

      if (files.length > remainingUploads) {
        setError(
          `Vous pouvez encore ajouter seulement ${remainingUploads} photo(s).`,
        )
        return
      }

      setIsUploading(true)
      setUploadProgress(0)

      let uploadedCount = 0
      const failedUploads: string[] = []

      for (let index = 0; index < files.length; index += 1) {
        const file = files[index]

        try {
          const uploadResult = await uploadToCloudinary(file)
          await saveMemory(uploadResult, normalizedVisitorName)
          uploadedCount += 1
        } catch (uploadError) {
          failedUploads.push(`"${file.name}": ${formatErrorMessage(uploadError)}`)
        } finally {
          if (isMountedRef.current) {
            const progress = Math.round(((index + 1) / files.length) * 100)
            setUploadProgress(progress)
          }
        }

        if (!isMountedRef.current) {
          return
        }

        await yieldToEventLoop()
      }

      await loadMemories()
      await refreshVisitorUploadCount()

      if (!isMountedRef.current) {
        return
      }

      if (uploadedCount > 0 && failedUploads.length === 0) {
        setSuccessMessage(
          uploadedCount === 1
            ? '1 photo partagee avec succes.'
            : `${uploadedCount} photos partagees avec succes.`,
        )
      } else if (uploadedCount > 0 && failedUploads.length > 0) {
        setSuccessMessage(
          `${uploadedCount} photo(s) partagee(s) avec succes.`,
        )
        setError(`${failedUploads.length} upload(s) en echec: ${failedUploads.join(' | ')}`)
      } else {
        setError(`Echec de l'upload: ${failedUploads.join(' | ')}`)
      }

      setIsUploading(false)
      setUploadProgress(null)
    },
    [
      clearMessages,
      loadMemories,
      normalizedVisitorName,
      refreshVisitorUploadCount,
    ],
  )

  const deleteMemory = useCallback(
    async (memory: Memory): Promise<boolean> => {
      clearMessages()

      try {
        await deleteMemoryRecord(memory)
        await loadMemories()

        if (isMountedRef.current) {
          setSuccessMessage('Souvenir supprime avec succes.')
        }

        return true
      } catch (deleteError) {
        if (!isMountedRef.current) {
          return false
        }

        setError(formatErrorMessage(deleteError))
        return false
      }
    },
    [clearMessages, loadMemories],
  )

  useEffect(() => {
    isMountedRef.current = true
    const timeout = window.setTimeout(() => {
      void loadMemories()
    }, 0)

    const unsubscribe = subscribeToMemories(
      () => {
        void loadMemories()
      },
      {
        // If Supabase realtime is unavailable, the gallery still works with
        // manual refresh and after local upload/delete actions.
        onStatusChange: (status) => {
          if (!isMountedRef.current) {
            return
          }

          if (status === 'subscribed') {
            setIsRealtimeActive(true)
            return
          }

          if (
            status === 'disabled' ||
            status === 'timed_out' ||
            status === 'error' ||
            status === 'closed'
          ) {
            setIsRealtimeActive(false)
          }
        },
      },
    )

    return () => {
      isMountedRef.current = false
      window.clearTimeout(timeout)
      unsubscribe()
    }
  }, [loadMemories])

  return {
    memories,
    visitorUploadCount,
    isLoading,
    isUploading,
    error,
    successMessage,
    uploadProgress,
    isRealtimeActive,
    loadMemories,
    uploadFiles,
    deleteMemory,
    clearMessages,
  }
}
