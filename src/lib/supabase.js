import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''

const hasValidConfig = Boolean(
  supabaseUrl.startsWith('https://') && supabaseKey,
)

export const supabase = hasValidConfig
  ? createClient(supabaseUrl, supabaseKey)
  : null

export function hasSupabaseConfig() {
  return hasValidConfig
}

export function getMenuImageUrl(path) {
  if (!supabase || !path) return null

  return supabase.storage.from('menu-images').getPublicUrl(path).data.publicUrl
}
