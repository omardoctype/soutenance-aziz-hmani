import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/memory'
import { hasSupabaseConfig, SUPABASE_ANON_KEY, SUPABASE_URL } from '../utils/env'

export const supabase = hasSupabaseConfig
  ? createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  : null
