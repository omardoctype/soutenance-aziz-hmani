export type MemoryResourceType = 'image' | 'video'

type MemoryFields = {
  id: string
  public_id: string
  url: string
  secure_url: string
  resource_type: MemoryResourceType
  uploader_name?: string | null
  original_filename?: string | null
  format?: string | null
  bytes?: number | null
  width?: number | null
  height?: number | null
  created_at: string
}

export type Memory = MemoryFields & Record<string, unknown>

export interface CloudinaryUploadResult {
  public_id: string
  url: string
  secure_url: string
  resource_type: MemoryResourceType
  original_filename?: string
  format?: string
  bytes?: number
  width?: number
  height?: number
}

export interface UploadMemoryInput {
  file: File
  uploaderName: string
  caption: string
}

type MemoryInsertFields = Omit<MemoryFields, 'id' | 'created_at'> & {
  created_at?: string
}

export type MemoryInsert = MemoryInsertFields & Record<string, unknown>

export type MemoryUpdate = Partial<MemoryInsert> & Record<string, unknown>

export interface Database {
  public: {
    Tables: {
      memories: {
        Row: Memory
        Insert: MemoryInsert
        Update: MemoryUpdate
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
