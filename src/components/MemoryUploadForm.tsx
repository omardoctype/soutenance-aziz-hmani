import { useRef, useState } from 'react'
import type { ChangeEventHandler, FormEventHandler } from 'react'
import { Camera, MessageSquare, Upload, User } from 'lucide-react'
import type { UploadMemoryInput } from '../types/memory'
import { formatFileSize } from '../utils/format'

interface MemoryUploadFormProps {
  isUploading: boolean
  isConfigured: boolean
  uploadError: string | null
  onUpload: (payload: UploadMemoryInput) => Promise<void>
  onClearUploadError: () => void
}

const IMAGE_MAX_SIZE = 10 * 1024 * 1024
const VIDEO_MAX_SIZE = 50 * 1024 * 1024

export const MemoryUploadForm = ({
  isUploading,
  isConfigured,
  uploadError,
  onUpload,
  onClearUploadError,
}: MemoryUploadFormProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploaderName, setUploaderName] = useState('')
  const [caption, setCaption] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const resetState = () => {
    setSelectedFile(null)
    setCaption('')
    setSuccessMessage('Souvenir partagé avec succès.')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const onFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const nextFile = event.target.files?.[0] ?? null
    setLocalError(null)
    setSuccessMessage(null)
    onClearUploadError()

    if (!nextFile) {
      setSelectedFile(null)
      return
    }

    if (!nextFile.type.startsWith('image/') && !nextFile.type.startsWith('video/')) {
      setSelectedFile(null)
      setLocalError('Sélectionnez uniquement une image ou une vidéo.')
      return
    }

    if (nextFile.type.startsWith('image/') && nextFile.size > IMAGE_MAX_SIZE) {
      setSelectedFile(null)
      setLocalError('Le fichier image dépasse 10 MB.')
      return
    }

    if (nextFile.type.startsWith('video/') && nextFile.size > VIDEO_MAX_SIZE) {
      setSelectedFile(null)
      setLocalError('Le fichier vidéo dépasse 50 MB.')
      return
    }

    setSelectedFile(nextFile)
  }

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setLocalError(null)
    setSuccessMessage(null)
    onClearUploadError()

    if (!selectedFile) {
      setLocalError("Ajoutez un fichier avant l'envoi.")
      return
    }

    try {
      await onUpload({
        file: selectedFile,
        uploaderName,
        caption,
      })
      resetState()
    } catch {
      // Les erreurs d'envoi sont affichées par le hook.
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-slate-200 bg-mist-50/70 p-4 sm:p-5"
    >
      <div className="mb-4 flex items-center gap-2">
        <Camera className="h-5 w-5 text-gold-600" />
        <h3 className="font-display text-2xl text-navy-900">Ajouter un souvenir</h3>
      </div>

      <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Photo ou vidéo
      </label>
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          disabled={!isConfigured || isUploading}
          onChange={onFileChange}
          className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-navy-900 file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-[0.18em] file:text-white hover:file:bg-navy-800"
        />
        <p className="mt-2 text-xs text-slate-500">
          Formats supportés : images (max 10 MB) et vidéos (max 50 MB).
        </p>
      </div>

      {selectedFile && (
        <p className="mt-2 text-xs text-slate-600">
          {selectedFile.name} - {formatFileSize(selectedFile.size)}
        </p>
      )}

      <label className="mb-2 mt-5 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        <span className="inline-flex items-center gap-2">
          <User className="h-4 w-4 text-gold-600" />
          Votre nom (optionnel)
        </span>
      </label>
      <input
        value={uploaderName}
        onChange={(event) => setUploaderName(event.target.value)}
        maxLength={50}
        disabled={!isConfigured || isUploading}
        placeholder="Ex: Sami"
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-navy-900 outline-none ring-gold-500/30 placeholder:text-slate-400 focus:ring-2"
      />

      <label className="mb-2 mt-5 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        <span className="inline-flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-gold-600" />
          Message (optionnel)
        </span>
      </label>
      <textarea
        value={caption}
        onChange={(event) => setCaption(event.target.value)}
        maxLength={220}
        rows={3}
        disabled={!isConfigured || isUploading}
        placeholder="Un petit mot pour ce souvenir..."
        className="w-full resize-none rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-navy-900 outline-none ring-gold-500/30 placeholder:text-slate-400 focus:ring-2"
      />

      {(localError || uploadError || successMessage) && (
        <p
          className={`mt-4 rounded-lg border px-3 py-2 text-sm ${
            successMessage
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-rose-200 bg-rose-50 text-rose-700'
          }`}
        >
          {successMessage ?? localError ?? uploadError}
        </p>
      )}

      <button
        type="submit"
        disabled={!isConfigured || isUploading}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy-900 px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-navy-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        <Upload className="h-4 w-4" />
        {isUploading ? 'Envoi en cours...' : 'Publier'}
      </button>
    </form>
  )
}
