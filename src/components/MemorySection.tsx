import { motion } from 'framer-motion'
import { Camera, Images, KeyRound, LoaderCircle, RefreshCw, Upload, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { MAX_VISITOR_PHOTOS, useSharedMemories } from '../hooks/useSharedMemories'
import type { Memory } from '../types/memory'
import {
  getMemoryAdminConfigErrorMessage,
  getSharedMemoryConfigErrorMessage,
  hasSharedMemoryConfig,
  MEMORY_ADMIN_CODE,
} from '../utils/env'
import { MemoryCard } from './MemoryCard'
import { MemoryLightbox } from './MemoryLightbox'

const gridMotion = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
}

const isDragFileEvent = (event: React.DragEvent<HTMLDivElement>) =>
  Array.from(event.dataTransfer.types).includes('Files')

const openFilePicker = (input: HTMLInputElement | null) => {
  input?.click()
}

interface MemorySectionProps {
  visitorName: string | null
}

export const MemorySection = ({ visitorName }: MemorySectionProps) => {
  const {
    memories,
    visitorUploadCount,
    isLoading,
    isUploading,
    isRealtimeActive,
    error,
    successMessage,
    uploadProgress,
    loadMemories,
    uploadFiles,
    deleteMemory,
    clearMessages,
  } = useSharedMemories(visitorName)

  const galleryInputRef = useRef<HTMLInputElement | null>(null)
  const cameraInputRef = useRef<HTMLInputElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [memoryPendingDelete, setMemoryPendingDelete] = useState<Memory | null>(
    null,
  )
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [adminCodeInput, setAdminCodeInput] = useState('')
  const [adminCodeError, setAdminCodeError] = useState<string | null>(null)

  const normalizedVisitorName = visitorName?.trim() ?? ''
  const configMessage = getSharedMemoryConfigErrorMessage()
  const adminConfigMessage = getMemoryAdminConfigErrorMessage()
  const canUploadMore = visitorUploadCount < MAX_VISITOR_PHOTOS
  const isUploadDisabled =
    isUploading ||
    normalizedVisitorName.length === 0 ||
    !hasSharedMemoryConfig ||
    !canUploadMore

  const uploadStatusMessage =
    visitorUploadCount === 0
      ? `Vous pouvez partager jusqu’à ${MAX_VISITOR_PHOTOS} photos.`
      : visitorUploadCount < MAX_VISITOR_PHOTOS
        ? `Vous avez partagé ${visitorUploadCount}/${MAX_VISITOR_PHOTOS} photos.`
        : 'Vous avez déjà partagé 5 photos. Merci pour vos souvenirs.'

  const handleGalleryFilesSelected: React.ChangeEventHandler<HTMLInputElement> =
    async (event) => {
      const files = event.target.files

      if (!files || files.length === 0) {
        return
      }

      await uploadFiles(files)
      event.target.value = ''
    }

  const handleCameraFileSelected: React.ChangeEventHandler<HTMLInputElement> =
    async (event) => {
      const files = event.target.files

      if (!files || files.length === 0) {
        return
      }

      await uploadFiles(files)
      event.target.value = ''
    }

  const handleDrop: React.DragEventHandler<HTMLDivElement> = async (event) => {
    event.preventDefault()
    setIsDragging(false)

    if (!isDragFileEvent(event)) {
      return
    }

    await uploadFiles(event.dataTransfer.files)
  }

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (event) => {
    if (!isDragFileEvent(event)) {
      return
    }

    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave: React.DragEventHandler<HTMLDivElement> = (event) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return
    }

    setIsDragging(false)
  }

  const handleRefresh = async () => {
    clearMessages()
    await loadMemories()
  }

  const closeDeleteModal = () => {
    setMemoryPendingDelete(null)
    setAdminCodeInput('')
    setAdminCodeError(null)
  }

  const openDeleteModal = (memory: Memory) => {
    clearMessages()
    setMemoryPendingDelete(memory)
    setAdminCodeInput('')
    setAdminCodeError(null)
  }

  const handleDeleteConfirm = async () => {
    if (!memoryPendingDelete) {
      return
    }

    if (!MEMORY_ADMIN_CODE) {
      setAdminCodeError(
        'VITE_MEMORY_ADMIN_CODE is missing. Add it to .env.local first.',
      )
      return
    }

    // Demo-only guard: frontend env values can be discovered in the client bundle.
    // Real secure moderation/deletion must be enforced on a backend.
    if (adminCodeInput.trim() !== MEMORY_ADMIN_CODE) {
      setAdminCodeError('Code administrateur incorrect.')
      return
    }

    setDeletingId(memoryPendingDelete.id)
    const isDeleted = await deleteMemory(memoryPendingDelete)
    setDeletingId(null)

    if (isDeleted) {
      closeDeleteModal()
    }
  }

  return (
    <section
      id="souvenirs"
      className="scroll-mt-24"
    >
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/92 shadow-[0_32px_85px_rgba(16,40,70,0.1)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(198,167,105,0.18),transparent_22%),radial-gradient(circle_at_90%_8%,rgba(16,40,70,0.11),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.26),rgba(255,255,255,0))]" />
        <div className="pointer-events-none absolute -right-16 top-16 h-48 w-48 rounded-full border border-gold-500/15 bg-[radial-gradient(circle,rgba(198,167,105,0.12),transparent_72%)]" />

        <div className="relative px-4 py-6 sm:px-8 sm:py-9 lg:px-10">
          <motion.div
            {...gridMotion}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
          >
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-gold-600">
                <Images className="h-4 w-4" />
                Souvenirs
              </div>

              <h2 className="mt-4 font-display text-3xl leading-tight text-navy-900 sm:text-5xl">
                Partagez vos moments spéciaux
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                Ajoutez vos photos préférées et partagez vos souvenirs avec tout le monde.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void handleRefresh()}
              disabled={isLoading || isUploading}
              className="inline-flex min-h-10 touch-manipulation items-center justify-center gap-2 self-start rounded-full border border-navy-900/12 bg-white/85 px-3.5 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-navy-900 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
          </motion.div>

          <motion.div
            {...gridMotion}
            transition={{ duration: 0.55, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 grid gap-5 lg:grid-cols-[0.98fr_1.02fr] lg:gap-6"
          >
            <div className="min-w-0 space-y-4">
              <input
                ref={galleryInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(event) => void handleGalleryFilesSelected(event)}
                className="hidden"
              />

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(event) => void handleCameraFileSelected(event)}
                className="hidden"
              />

              <div
                onDrop={(event) => void handleDrop(event)}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`relative overflow-hidden rounded-[1.8rem] border border-dashed p-5 transition-all sm:p-6 ${
                  isDragging
                    ? 'border-gold-500 bg-gold-500/10'
                    : 'border-slate-300 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(248,250,252,0.95))]'
                }`}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.82),transparent_52%)]" />

                <div className="relative z-10">
                  <p className="text-sm font-semibold text-navy-900">
                    Vous partagez en tant que :{' '}
                    <span className="text-gold-600">
                      {normalizedVisitorName || 'invité'}
                    </span>
                  </p>

                  <p className="mt-2 text-xs text-slate-600">{uploadStatusMessage}</p>

                  <div className="mt-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900 text-white shadow-[0_16px_30px_rgba(16,40,70,0.22)]">
                    {isUploading ? (
                      <LoaderCircle className="h-6 w-6 animate-spin" />
                    ) : (
                      <Upload className="h-6 w-6" />
                    )}
                  </div>

                  <p className="mt-5 font-display text-2xl text-navy-900 sm:text-3xl">
                    Partagez vos photos
                  </p>

                  <p className="mt-3 text-xs leading-relaxed text-slate-600">
                    Ajoutez une photo depuis votre galerie ou prenez une photo
                    directement.
                  </p>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => openFilePicker(galleryInputRef.current)}
                      disabled={isUploadDisabled}
                      className="inline-flex min-h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-full bg-navy-900 px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-[0_18px_34px_rgba(16,40,70,0.2)] transition-colors hover:bg-navy-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                      <Upload className="h-4 w-4" />
                      {isUploading ? 'Envoi en cours...' : 'Choisir depuis la galerie'}
                    </button>

                    <button
                      type="button"
                      onClick={() => openFilePicker(cameraInputRef.current)}
                      disabled={isUploadDisabled}
                      className="inline-flex min-h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-full border border-navy-900/25 bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-navy-900 shadow-[0_12px_24px_rgba(16,40,70,0.08)] transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400"
                    >
                      <Camera className="h-4 w-4" />
                      Prendre une photo
                    </button>
                  </div>

                  {uploadProgress !== null && (
                    <div className="mt-5">
                      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,#ac8a4a_0%,#102846_100%)] transition-[width] duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs font-medium text-slate-500">
                        Progression de l&apos;envoi : {uploadProgress}%
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {!hasSharedMemoryConfig && configMessage && (
                <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  {configMessage}
                </div>
              )}

              {adminConfigMessage && (
                <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  {adminConfigMessage}
                </div>
              )}

              {error && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {successMessage}
                </div>
              )}

              {isRealtimeActive === false && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-600">
                  Le mode temps réel est indisponible pour le moment. Utilisez
                  le bouton Actualiser pour recharger la galerie.
                </div>
              )}
            </div>

            <div className="min-w-0 space-y-4">
              {isLoading ? (
                <div className="grid grid-cols-2 gap-2.5 min-[430px]:gap-3 sm:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="aspect-square animate-pulse rounded-[1.4rem] bg-slate-100"
                    />
                  ))}
                </div>
              ) : memories.length === 0 ? (
                <div className="flex min-h-[15.5rem] flex-col items-center justify-center rounded-[1.8rem] border border-dashed border-slate-300 bg-mist-50/80 px-5 text-center sm:min-h-[18rem] sm:px-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900 text-white">
                    <Images className="h-6 w-6" />
                  </div>
                  <p className="mt-5 font-display text-2xl text-navy-900 sm:text-3xl">
                    Aucun souvenir pour le moment
                  </p>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600">
                    Soyez le premier invité à partager une photo.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5 min-[430px]:gap-3 sm:grid-cols-3 xl:grid-cols-4">
                  {memories.map((memory, index) => (
                    <motion.div
                      key={memory.id}
                      initial={{ opacity: 0, y: 18, scale: 0.98 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{
                        duration: 0.35,
                        delay: index * 0.03,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <MemoryCard
                        memory={memory}
                        onOpen={setSelectedMemory}
                        onDelete={openDeleteModal}
                        isDeleting={deletingId === memory.id}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {memoryPendingDelete && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy-900/45 px-3 pb-3 pt-16 sm:items-center sm:px-4 sm:pb-4">
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-[0_28px_60px_rgba(16,40,70,0.2)] sm:p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold-600">
                  <KeyRound className="h-3.5 w-3.5" />
                  Code administrateur
                </p>
                <h3 className="mt-3 font-display text-2xl text-navy-900">
                  Confirmer la suppression
                </h3>
              </div>

              <button
                type="button"
                onClick={closeDeleteModal}
                className="inline-flex h-10 w-10 touch-manipulation items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                aria-label="Fermer la fenêtre de suppression"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Entrez le code administrateur pour supprimer cet élément de la
              galerie publique.
            </p>

            <form
              className="mt-5 space-y-4"
              onSubmit={(event) => {
                event.preventDefault()
                void handleDeleteConfirm()
              }}
            >
              <input
                type="password"
                autoComplete="off"
                value={adminCodeInput}
                onChange={(event) => {
                  setAdminCodeInput(event.target.value)
                  if (adminCodeError) {
                    setAdminCodeError(null)
                  }
                }}
                placeholder="Code administrateur"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none ring-0 transition-colors placeholder:text-slate-400 focus:border-navy-800"
              />

              {adminCodeError && (
                <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                  {adminCodeError}
                </p>
              )}

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  className="min-h-11 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={deletingId === memoryPendingDelete.id}
                  className="min-h-11 rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {deletingId === memoryPendingDelete.id
                    ? 'Suppression...'
                    : 'Supprimer'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {selectedMemory && (
        <MemoryLightbox
          memory={selectedMemory}
          onClose={() => setSelectedMemory(null)}
        />
      )}
    </section>
  )
}
