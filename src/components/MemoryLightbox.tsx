import { motion } from 'framer-motion'
import { Play, X } from 'lucide-react'
import { useEffect } from 'react'
import type { Memory } from '../types/memory'
import { formatMemoryDate } from '../utils/format'

interface MemoryLightboxProps {
  memory: Memory
  onClose: () => void
}

const getUploaderLabel = (memory: Memory) => {
  const uploaderName = memory.uploader_name?.trim()
  return uploaderName && uploaderName.length > 0 ? uploaderName : 'invité'
}

export const MemoryLightbox = ({ memory, onClose }: MemoryLightboxProps) => {
  const isVideo = memory.resource_type === 'video'

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-navy-900/75 px-2.5 py-3 backdrop-blur-sm sm:px-4 sm:py-5"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-label="Aperçu du souvenir"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-4xl overflow-hidden rounded-[1.4rem] border border-white/20 bg-[#071B3A] shadow-[0_35px_90px_rgba(0,0,0,0.35)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2.5 sm:px-4 sm:py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              Partagé par {getUploaderLabel(memory)}
            </p>
            <p className="truncate text-xs text-slate-200/85">
              {formatMemoryDate(memory.created_at)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer l'aperçu"
            className="inline-flex h-10 w-10 touch-manipulation items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="relative max-h-[85vh] overflow-auto bg-black/35 p-2.5 sm:p-3">
          {isVideo ? (
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black">
              <video
                src={memory.secure_url}
                controls
                playsInline
                className="max-h-[70vh] w-full object-contain"
              />
              <div className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold text-white">
                <Play className="h-3.5 w-3.5 fill-current" />
                Vidéo
              </div>
            </div>
          ) : (
            <img
              src={memory.secure_url}
              alt={memory.original_filename ?? 'Souvenir partagé'}
              className="mx-auto max-h-[85vh] w-auto max-w-[95vw] rounded-xl border border-white/10 bg-black object-contain"
            />
          )}
        </div>
      </motion.div>
    </div>
  )
}
