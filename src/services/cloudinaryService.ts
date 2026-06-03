import type { CloudinaryUploadResult } from '../types/memory'
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
  hasCloudinaryConfig,
} from '../utils/env'

const MEMORY_FOLDER = 'soutenance-aziz-hmani/memories'
const COMPRESSED_IMAGE_MAX_BYTES = 2 * 1024 * 1024

const isImage = (fileType: string) => fileType.startsWith('image/')

const ensureUploadConstraints = (file: File) => {
  if (!isImage(file.type)) {
    throw new Error('Seules les photos sont acceptées.')
  }

  if (file.size > COMPRESSED_IMAGE_MAX_BYTES) {
    throw new Error('La photo est trop lourde. Veuillez choisir une autre photo.')
  }
}

const parseCloudinaryError = async (response: Response) => {
  try {
    const payload = (await response.json()) as {
      error?: { message?: string }
    }
    return payload.error?.message ?? "Échec de l'envoi vers Cloudinary."
  } catch {
    return "Échec de l'envoi vers Cloudinary."
  }
}

const toCloudinaryResult = (payload: unknown): CloudinaryUploadResult => {
  const data = payload as Partial<CloudinaryUploadResult>

  if (
    !data.public_id ||
    !data.url ||
    !data.secure_url ||
    data.resource_type !== 'image'
  ) {
    throw new Error('La réponse Cloudinary est invalide.')
  }

  return {
    public_id: data.public_id,
    url: data.url,
    secure_url: data.secure_url,
    resource_type: data.resource_type,
    original_filename: data.original_filename,
    format: data.format,
    bytes: data.bytes,
    width: data.width,
    height: data.height,
  }
}

export const uploadToCloudinary = async (
  file: File,
): Promise<CloudinaryUploadResult> => {
  if (!hasCloudinaryConfig) {
    throw new Error(
      'La configuration Cloudinary est manquante. Ajoutez VITE_CLOUDINARY_CLOUD_NAME et VITE_CLOUDINARY_UPLOAD_PRESET dans .env.local.',
    )
  }

  ensureUploadConstraints(file)

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  formData.append('folder', MEMORY_FOLDER)

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`

  let response: Response

  try {
    response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    })
  } catch {
    throw new Error(
      'Impossible de joindre Cloudinary. Vérifiez votre connexion puis réessayez.',
    )
  }

  if (!response.ok) {
    const cloudinaryMessage = await parseCloudinaryError(response)
    throw new Error(`Échec de l'envoi vers Cloudinary : ${cloudinaryMessage}`)
  }

  return toCloudinaryResult(await response.json())
}
