// Server-side Supabase client. MUST use service role key.
// Only import this from API routes (server code), never from components.
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!serviceRole) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY in environment variables for server-side Supabase client.')
}

export const supabaseAdmin = createClient(url, serviceRole)
