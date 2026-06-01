import type { Memory, MemoryInsert, UploadMemoryInput } from '../types/memory'
import { uploadToCloudinary } from './cloudinaryService'
import { supabase } from './supabaseClient'

export const fetchMemories = async (): Promise<Memory[]> => {
  if (!supabase) {
    throw new Error('Supabase configuration is missing.')
  }

  const { data, error } = await supabase
    .from('memories')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data ?? []
}

export const uploadMemoryAsset = async (
  input: UploadMemoryInput,
): Promise<Memory> => {
  if (!supabase) {
    throw new Error('Supabase configuration is missing.')
  }

  const uploadResult = await uploadToCloudinary(input.file)
  const resourceType =
    uploadResult.resource_type === 'video' ? 'video' : 'image'

  const payload: MemoryInsert = {
    public_id: uploadResult.public_id,
    url: uploadResult.url ?? uploadResult.secure_url,
    secure_url: uploadResult.secure_url,
    resource_type: resourceType,
    original_filename: uploadResult.original_filename ?? input.file.name,
    format: uploadResult.format ?? null,
    bytes: uploadResult.bytes ?? input.file.size,
    width: uploadResult.width ?? null,
    height: uploadResult.height ?? null,
  }

  const { data, error } = await supabase
    .from('memories')
    .insert(payload)
    .select('*')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}
