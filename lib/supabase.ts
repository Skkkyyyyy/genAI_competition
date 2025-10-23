import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL ?? 'https://mujwsyhzvzlquejqtjwb.supabase.co'
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11andzeWh6dnpscXVlanF0andiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMDA3OTksImV4cCI6MjA3NDg3Njc5OX0.KBrO4rgdnQegxIDHSjhFaPS2TobXvlYE1OGS2yAbvRo'

let _client: SupabaseClient | null = null

function createSupabaseClient(): SupabaseClient {
  if (_client) return _client

  // If running in Node (SSR / route-scan) avoid using browser/native storage that expects `window`.
  if (typeof window === 'undefined') {
    // Minimal in-memory storage implementing the Supabase storage interface for auth.
    const dummyStorage = {
      getItem: async (_key: string) => null,
      setItem: async (_key: string, _value: string) => {},
      removeItem: async (_key: string) => {},
    }
    _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { storage: dummyStorage as any },
    })
    return _client
  }

  // Client/runtime: prefer react-native-async-storage on native; on web fall back to default localStorage
  let storageOption: any = undefined
  try {
    // require lazily so Node route scan doesn't evaluate this import
    // On React Native this resolves to AsyncStorage; on web it may throw and we fall back to default
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    storageOption = require('@react-native-async-storage/async-storage').default
  } catch (e) {
    storageOption = undefined
  }

  if (storageOption) {
    _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { storage: storageOption },
    })
  } else {
    // Browser: allow supabase-js to use localStorage
    _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  }

  return _client
}

// Export a proxy so imports won't initialize client at module-evaluation time
export const supabase = new Proxy(
  {},
  {
    get(_, prop: string) {
      const c = createSupabaseClient() as any
      return c[prop]
    },
    set(_, prop: string, value) {
      const c = createSupabaseClient() as any
      c[prop] = value
      return true
    },
    apply(_, thisArg, args) {
      const c = createSupabaseClient() as any
      return (c as any).apply(thisArg, args)
    },
  }
) as unknown as SupabaseClient

export default supabase