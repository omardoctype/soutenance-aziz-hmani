import { LoaderCircle, Play, Trash2 } from 'lucide-react'
import type { Memory } from '../types/memory'
import { formatFileSize, formatMemoryDate } from '../utils/format'

interface MemoryCardProps {
  memory: Memory
  onOpen: (memory: Memory) => void
  onDelete: (memory: Memory) => void
  isDeleting?: boolean
}

export const MemoryCard = ({
  memory,
  onOpen,
  onDelete,
  isDeleting = false,
}: MemoryCardProps) => {
  const isVideo = memory.resource_type === 'video'
  const typeLabel = isVideo ? 'Video' : 'Photo'
  const name = memory.original_filename ?? 'Shared memory'
  const uploaderName = memory.uploader_name?.trim() || 'invite'

  return (
    <article
      className="group cursor-pointer overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-[0_16px_34px_rgba(16,40,70,0.08)] transition-transform duration-300 md:hover:-translate-y-0.5 md:hover:shadow-[0_20px_38px_rgba(16,40,70,0.14)]"
      onClick={() => onOpen(memory)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen(memory)
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Ouvrir ${name}`}
    >
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        {isVideo ? (
          <>
            <video
              src={memory.secure_url}
              muted
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,13,20,0.08),rgba(8,13,20,0.5))]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/92 text-navy-900 shadow-[0_12px_24px_rgba(0,0,0,0.22)]">
                <Play className="ml-0.5 h-5 w-5 fill-current" />
              </div>
            </div>
          </>
        ) : (
          <img
            src={memory.secure_url}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 md:group-hover:scale-[1.04]"
          />
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(180deg,rgba(8,13,20,0)_0%,rgba(8,13,20,0.68)_100%)]" />

        <span className="absolute left-2 top-2 inline-flex rounded-full border border-white/20 bg-black/48 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm sm:text-[10px]">
          {typeLabel}
        </span>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onDelete(memory)
          }}
          disabled={isDeleting}
          aria-label={`Delete ${name}`}
          className="absolute right-2 top-2 inline-flex h-11 w-11 touch-manipulation items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-black/35"
        >
          {isDeleting ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </button>

        <p className="pointer-events-none absolute bottom-2 left-2 right-2 truncate text-[0.66rem] font-medium text-white">
          Partage par {uploaderName}
        </p>
      </div>

      <div className="space-y-1 px-3 py-3">
        <p className="truncate text-[0.82rem] font-semibold text-navy-900 sm:text-sm">
          {name}
        </p>
        <p className="text-[0.68rem] text-slate-500 sm:text-xs">
          {formatMemoryDate(memory.created_at)}
        </p>
        <p className="text-[0.68rem] text-slate-500 sm:text-xs">
          {typeLabel} - {formatFileSize(memory.bytes ?? null)}
        </p>
      </div>
    </article>
  )
}
