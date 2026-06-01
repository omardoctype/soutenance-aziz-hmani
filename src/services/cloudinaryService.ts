import type { CloudinaryUploadResult, MemoryResourceType } from '../types/memory'
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
  hasCloudinaryConfig,
} from '../utils/env'

const MEMORY_FOLDER = 'soutenance-aziz-hmani/memories'
const IMAGE_MAX_BYTES = 10 * 1024 * 1024

const isImage = (fileType: string) => fileType.startsWith('image/')

const getFileKind = (fileType: string): MemoryResourceType | null => {
  if (isImage(fileType)) {
    return 'image'
  }

  return null
}

const ensureUploadConstraints = (file: File) => {
  const fileKind = getFileKind(file.type)

  if (!fileKind) {
    throw new Error('Seules les photos sont acceptées.')
  }

  if (file.size > IMAGE_MAX_BYTES) {
    throw new Error('Image file is too large. Maximum allowed size is 10MB.')
  }
}

const parseCloudinaryError = async (response: Response) => {
  try {
    const payload = (await response.json()) as {
      error?: { message?: string }
    }
    return payload.error?.message ?? 'Cloudinary upload failed.'
  } catch {
    return 'Cloudinary upload failed.'
  }
}

const toCloudinaryResult = (payload: unknown): CloudinaryUploadResult => {
  const data = payload as Partial<CloudinaryUploadResult>

  if (
    !data.public_id ||
    !data.url ||
    !data.secure_url ||
    !data.resource_type ||
    (data.resource_type !== 'image' && data.resource_type !== 'video')
  ) {
    throw new Error('Cloudinary response is invalid.')
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
      'Cloudinary configuration is missing. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to .env.local.',
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
      'Unable to reach Cloudinary. Please check your connection and try again.',
    )
  }

  if (!response.ok) {
    const cloudinaryMessage = await parseCloudinaryError(response)
    throw new Error(`Cloudinary upload failed: ${cloudinaryMessage}`)
  }

  return toCloudinaryResult(await response.json())
}
