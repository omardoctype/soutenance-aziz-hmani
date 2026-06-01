import { motion } from 'framer-motion'
import { Film, Image as ImageIcon, RefreshCw } from 'lucide-react'
import type { Memory } from '../types/memory'
import { formatFileSize, formatMemoryDate } from '../utils/format'

interface MemoryGalleryProps {
  memories: Memory[]
  isLoading: boolean
  loadError: string | null
  onRetry: () => Promise<void>
}

export const MemoryGallery = ({
  memories,
  isLoading,
  loadError,
  onRetry,
}: MemoryGalleryProps) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
    <div className="mb-4 flex items-center justify-between gap-3">
      <h3 className="font-display text-2xl text-navy-900">Memoires Publiees</h3>
      <button
        type="button"
        onClick={() => void onRetry()}
        className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 transition-colors hover:bg-slate-100"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Rafraichir
      </button>
    </div>

    {loadError && (
      <p className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
        {loadError}
      </p>
    )}

    {isLoading ? (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-56 animate-pulse rounded-xl bg-slate-100"
          />
        ))}
      </div>
    ) : memories.length === 0 ? (
      <div className="rounded-xl border border-dashed border-slate-300 bg-mist-50 p-7 text-center">
        <p className="text-sm text-slate-600">
          Aucun souvenir pour le moment. Soyez le premier a publier.
        </p>
      </div>
    ) : (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {memories.map((memory) => {
          return (
            <motion.article
              key={memory.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden rounded-xl border border-slate-200 bg-mist-50"
            >
              <div className="relative aspect-[4/3] bg-slate-200">
                {memory.resource_type === 'video' ? (
                  <video
                    src={memory.secure_url}
                    controls
                    preload="metadata"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={memory.secure_url}
                    alt={memory.original_filename ?? 'Souvenir partage'}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                )}
                <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                  {memory.resource_type === 'video' ? (
                    <Film className="h-3 w-3" />
                  ) : (
                    <ImageIcon className="h-3 w-3" />
                  )}
                  {memory.resource_type}
                </span>
              </div>

              <div className="space-y-2 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                  {formatMemoryDate(memory.created_at)}
                </p>

                <p className="text-sm text-navy-900">
                  {memory.original_filename ?? 'Souvenir partage'}
                </p>

                <p className="text-xs text-slate-600">
                  {memory.format ? memory.format.toUpperCase() : memory.resource_type} -{' '}
                  {formatFileSize(memory.bytes ?? null)}
                </p>
              </div>
            </motion.article>
          )
        })}
      </div>
    )}
  </div>
)
