import { useCallback, useEffect, useRef, useState } from 'react'
import { uploadToCloudinary } from '../services/cloudinaryService'
import {
  deleteMemory as deleteMemoryRecord,
  getMemories,
  saveMemory,
  subscribeToMemories,
} from '../services/memoriesService'
import type { Memory } from '../types/memory'

const IMAGE_MAX_BYTES = 10 * 1024 * 1024
const VIDEO_MAX_BYTES = 50 * 1024 * 1024

const formatErrorMessage = (error: unknown) =>
  error instanceof Error && error.message.trim().length > 0
    ? error.message
    : 'An unexpected error occurred.'

const toFilesArray = (files: FileList | File[]) =>
  Array.isArray(files) ? files : Array.from(files)

const validateFilesBeforeUpload = (files: File[]) => {
  if (files.length === 0) {
    return 'Please select at least one file.'
  }

  for (const file of files) {
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      return `Unsupported file type for "${file.name}". Only image/* and video/* files are allowed.`
    }

    if (file.type.startsWith('image/') && file.size > IMAGE_MAX_BYTES) {
      return `Image "${file.name}" exceeds the 10MB limit.`
    }

    if (file.type.startsWith('video/') && file.size > VIDEO_MAX_BYTES) {
      return `Video "${file.name}" exceeds the 50MB limit.`
    }
  }

  return null
}

const yieldToEventLoop = () =>
  new Promise<void>((resolve) => window.setTimeout(resolve, 0))

export const useSharedMemories = () => {
  const [memories, setMemories] = useState<Memory[]>([])
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

  const loadMemories = useCallback(async () => {
    if (!isMountedRef.current) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const rows = await getMemories()

      if (!isMountedRef.current) {
        return
      }

      setMemories(rows)
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
  }, [])

  const uploadFiles = useCallback(
    async (filesInput: FileList | File[], uploaderName: string | null) => {
      clearMessages()

      const files = toFilesArray(filesInput)
      const normalizedUploaderName = uploaderName?.trim() ?? ''

      if (normalizedUploaderName.length === 0) {
        setError('Entrez votre nom pour partager un souvenir.')
        return
      }

      const validationError = validateFilesBeforeUpload(files)

      if (validationError) {
        setError(validationError)
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
          await saveMemory(uploadResult, normalizedUploaderName)
          uploadedCount += 1
        } catch (uploadError) {
          failedUploads.push(
            `"${file.name}": ${formatErrorMessage(uploadError)}`,
          )
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

      if (!isMountedRef.current) {
        return
      }

      if (uploadedCount > 0 && failedUploads.length === 0) {
        setSuccessMessage(
          uploadedCount === 1
            ? '1 memory uploaded successfully.'
            : `${uploadedCount} memories uploaded successfully.`,
        )
      } else if (uploadedCount > 0 && failedUploads.length > 0) {
        setSuccessMessage(
          `${uploadedCount} file${uploadedCount > 1 ? 's' : ''} uploaded successfully.`,
        )
        setError(
          `${failedUploads.length} upload(s) failed: ${failedUploads.join(' | ')}`,
        )
      } else {
        setError(`Upload failed: ${failedUploads.join(' | ')}`)
      }

      setIsUploading(false)
      setUploadProgress(null)
    },
    [clearMessages, loadMemories],
  )

  const deleteMemory = useCallback(
    async (memory: Memory): Promise<boolean> => {
      clearMessages()

      try {
        await deleteMemoryRecord(memory)
        await loadMemories()

        if (isMountedRef.current) {
          setSuccessMessage('Memory deleted successfully.')
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
