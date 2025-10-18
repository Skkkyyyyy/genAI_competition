import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { supabase } from '../../lib/supabase'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ProfileSetup({ session }: any) {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [resolvedUser, setResolvedUser] = useState<any | null>(null)

  useEffect(() => {
    let mounted = true

    async function resolve() {
      // if a session prop was passed, use it. Otherwise try to fetch the current session/user
      if (session && session.user) {
        if (!mounted) return
        const u = session.user
        setResolvedUser(u)
        const initial = u?.user_metadata?.username || u?.email?.split('@')[0] || ''
        setUsername(initial)
        return
      }

      try {
        // getUser returns the user object (no need to inspect session)
        const { data: { user } } = await supabase.auth.getUser()
        const u = user ?? null
        if (!mounted) return
        setResolvedUser(u)
        const initial = u?.user_metadata?.username || u?.email?.split('@')[0] || ''
        setUsername(initial)
      } catch (err) {
        // ignore
      }
    }

    resolve()

    return () => {
      mounted = false
    }
  }, [session])

  async function createProfile() {
    const u = session?.user ?? resolvedUser
    if (!u?.id) {
      Alert.alert('No user session')
      return
    }
    setLoading(true)
    try {
      const userId = u.id
      const updates = {
        id: userId,
        username: username || null,
        updated_at: new Date(),
      }

      const { error } = await supabase.from('profiles').upsert(updates)
      if (error) throw error

      // go to main app after profile creation
      router.replace('/(tabs)/home')
    } catch (err: any) {
      Alert.alert('Error', err.message || String(err))
    } finally {
      setLoading(false)
    }
  }


  return (
    <SafeAreaView className='h-full bg-bg2 '>
        <View className='mt-12'>
            <Text className='text-2xl font-bold text-center'>Profile</Text>
        </View>

        <View className='mx-auto w-10/12 mt-10'>
            <Text className='font-medium text-gray-500'>Username</Text>
            <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder='Nickname'
            className='mt-2 border border-primary rounded-3xl p-4'
            />
        </View>

         <View className='mx-auto w-10/12 mt-10'>
            <Text className='font-medium text-gray-500'>Bio</Text>
            <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder='Nickname'
            className='mt-2 border border-primary rounded-3xl p-4'
            />
        </View>

        <View className='mx-auto w-10/12 mt-10'>
            <TouchableOpacity disabled={loading} onPress={createProfile} className='bg-primary rounded-3xl p-4'>
                <Text className='text-center text-bg2 font-bold'>{loading ? 'Saving...' : 'Continue'}</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  )
}
