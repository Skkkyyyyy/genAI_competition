import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://mujwsyhzvzlquejqtjwb.supabase.co";
const supabasePublishableKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11andzeWh6dnpscXVlanF0andiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMDA3OTksImV4cCI6MjA3NDg3Njc5OX0.KBrO4rgdnQegxIDHSjhFaPS2TobXvlYE1OGS2yAbvRo";

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})