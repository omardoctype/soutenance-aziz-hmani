import type { CloudinaryUploadResult, Memory, MemoryInsert } from '../types/memory'
import { supabase } from './supabaseClient'

const MEMORIES_TABLE = 'memories'

type RealtimeChannelStatus =
  | 'SUBSCRIBED'
  | 'TIMED_OUT'
  | 'CLOSED'
  | 'CHANNEL_ERROR'

type RealtimeSubscriptionStatus =
  | 'subscribed'
  | 'timed_out'
  | 'closed'
  | 'error'
  | 'disabled'

type SubscribeToMemoriesOptions = {
  onStatusChange?: (status: RealtimeSubscriptionStatus) => void
}

const createServiceError = (fallbackMessage: string, cause: unknown) => {
  if (cause instanceof Error && cause.message.trim().length > 0) {
    return new Error(cause.message, { cause })
  }

  return new Error(fallbackMessage, { cause })
}

const getSupabaseOrThrow = () => {
  if (!supabase) {
    throw new Error(
      "Supabase n'est pas configuré. Ajoutez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env.local.",
    )
  }

  return supabase
}

export const getMemories = async (): Promise<Memory[]> => {
  if (!supabase) {
    return []
  }

  try {
    const { data, error } = await supabase
      .from(MEMORIES_TABLE)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return data ?? []
  } catch (error) {
    throw createServiceError('Impossible de charger les souvenirs.', error)
  }
}

export const saveMemory = async (
  uploadResult: CloudinaryUploadResult,
  uploaderName: string,
): Promise<Memory> => {
  try {
    const client = getSupabaseOrThrow()

    const normalizedUploaderName = uploaderName.trim()

    if (normalizedUploaderName.length === 0) {
      throw new Error('Le nom du visiteur est requis avant de sauvegarder le souvenir.')
    }

    const payload: MemoryInsert = {
      public_id: uploadResult.public_id,
      url: uploadResult.url,
      secure_url: uploadResult.secure_url,
      resource_type: uploadResult.resource_type,
      uploader_name: normalizedUploaderName,
      original_filename: uploadResult.original_filename ?? null,
      format: uploadResult.format ?? null,
      bytes: uploadResult.bytes ?? null,
      width: uploadResult.width ?? null,
      height: uploadResult.height ?? null,
    }

    const { data, error } = await client
      .from(MEMORIES_TABLE)
      .insert(payload)
      .select('*')
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    throw createServiceError('Impossible de sauvegarder le souvenir.', error)
  }
}

export const getUploaderMemoryCount = async (
  uploaderName: string,
): Promise<number> => {
  if (!supabase) {
    return 0
  }

  const normalizedUploaderName = uploaderName.trim()

  if (normalizedUploaderName.length === 0) {
    return 0
  }

  try {
    const { count, error } = await supabase
      .from(MEMORIES_TABLE)
      .select('id', { count: 'exact', head: true })
      .eq('uploader_name', normalizedUploaderName)

    if (error) {
      throw new Error(error.message)
    }

    return count ?? 0
  } catch (error) {
    throw createServiceError('Impossible de vérifier le nombre de photos partagées.', error)
  }
}

export const deleteMemory = async (memory: Memory): Promise<void> => {
  try {
    const client = getSupabaseOrThrow()

    // Cloudinary asset deletion must remain server-side because it requires
    // signed requests/API secrets, which must never be exposed in frontend code.
    const { error } = await client
      .from(MEMORIES_TABLE)
      .delete()
      .eq('id', memory.id)

    if (error) {
      throw new Error(error.message)
    }
  } catch (error) {
    throw createServiceError('Impossible de supprimer le souvenir.', error)
  }
}

const mapRealtimeStatus = (
  status: RealtimeChannelStatus,
): RealtimeSubscriptionStatus => {
  if (status === 'SUBSCRIBED') {
    return 'subscribed'
  }

  if (status === 'TIMED_OUT') {
    return 'timed_out'
  }

  if (status === 'CLOSED') {
    return 'closed'
  }

  return 'error'
}

export const subscribeToMemories = (
  callback: () => void,
  options: SubscribeToMemoriesOptions = {},
): (() => void) => {
  const client = supabase

  if (!client) {
    options.onStatusChange?.('disabled')
    return () => {}
  }

  // Supabase Realtime must be enabled for the `memories` table (public schema)
  // so connected visitors receive INSERT/UPDATE/DELETE changes automatically.
  const channel = client
    .channel(`memories-live-${Date.now()}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: MEMORIES_TABLE,
      },
      () => callback(),
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: MEMORIES_TABLE,
      },
      () => callback(),
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: MEMORIES_TABLE,
      },
      () => callback(),
    )
    .subscribe((status, error) => {
      const mappedStatus = mapRealtimeStatus(status)
      options.onStatusChange?.(mappedStatus)

      if (
        (mappedStatus === 'error' || mappedStatus === 'timed_out') &&
        error
      ) {
        console.warn('Supabase realtime subscription issue:', error.message)
      }
    })

  return () => {
    void client.removeChannel(channel)
  }
}
