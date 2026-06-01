const readEnv = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

const hasText = (value: string) => value.length > 0

const isValidUrl = (value: string) => {
  if (!hasText(value)) {
    return false
  }

  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

export const CLOUDINARY_CLOUD_NAME = readEnv(
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
)
export const CLOUDINARY_UPLOAD_PRESET = readEnv(
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
)
export const SUPABASE_URL = readEnv(import.meta.env.VITE_SUPABASE_URL)
export const SUPABASE_ANON_KEY = readEnv(import.meta.env.VITE_SUPABASE_ANON_KEY)
export const MEMORY_ADMIN_CODE = readEnv(import.meta.env.VITE_MEMORY_ADMIN_CODE)

export const hasCloudinaryConfig =
  hasText(CLOUDINARY_CLOUD_NAME) && hasText(CLOUDINARY_UPLOAD_PRESET)

export const hasSupabaseConfig =
  isValidUrl(SUPABASE_URL) && hasText(SUPABASE_ANON_KEY)

export const hasSharedMemoryConfig = hasCloudinaryConfig && hasSupabaseConfig
export const hasMemoryAdminCode = hasText(MEMORY_ADMIN_CODE)

export const getMissingSharedMemoryEnvVars = () => {
  const missing: string[] = []

  if (!hasText(CLOUDINARY_CLOUD_NAME)) {
    missing.push('VITE_CLOUDINARY_CLOUD_NAME')
  }
  if (!hasText(CLOUDINARY_UPLOAD_PRESET)) {
    missing.push('VITE_CLOUDINARY_UPLOAD_PRESET')
  }
  if (!hasText(SUPABASE_URL)) {
    missing.push('VITE_SUPABASE_URL')
  }
  if (!hasText(SUPABASE_ANON_KEY)) {
    missing.push('VITE_SUPABASE_ANON_KEY')
  }

  return missing
}

export const getSharedMemoryConfigErrorMessage = () => {
  const missing = getMissingSharedMemoryEnvVars()

  if (missing.length > 0) {
    return `Missing environment variables: ${missing.join(', ')}. Add them to .env.local to enable shared memories.`
  }

  if (!isValidUrl(SUPABASE_URL)) {
    return 'VITE_SUPABASE_URL must be a valid URL.'
  }

  return null
}

export const getMemoryAdminConfigErrorMessage = () => {
  if (!hasMemoryAdminCode) {
    return 'VITE_MEMORY_ADMIN_CODE is missing. Add it to .env.local to enable protected deletion.'
  }

  return null
}
