import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, AppState, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { supabase } from '../../../lib/supabase'
// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Signup() {
  const [name, setName] = useState('')
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)

  const router = useRouter()

  async function signUpWithEmail() {
    setLoading(true)
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.signUp({ 
        email, 
        password,
        options:{
          data:{
            name: name
          }
        } })

      if (error) {
        Alert.alert(error.message)
        return
      }
    }
    catch{
    }
    router.replace('/(tabs)/home')
}

  return (
    <View className='bg-bg2 h-full'>
      <View className='mx-auto w-10/12 mt-10'>
        <Text className='font-medium text-gray-500'>Nickname</Text>
        <TextInput
          onChangeText={(text) => setName(text)}
          value={name}
          placeholder='Nickname'
          autoCapitalize={'none'}
          className='mt-2 border border-primary rounded-3xl p-4'
        />
      </View>
      <View className='mx-auto w-10/12 mt-10'>
        <Text className='font-medium text-gray-500'>Email</Text>
        <TextInput
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder='email@address.com'
          autoCapitalize={'none'}
          className='mt-2 border border-primary rounded-3xl p-4'
        />
      </View>
      <View className='mx-auto w-10/12 mt-10'>
        <Text className='font-medium text-gray-500'>Password</Text>
        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder='Password'
          autoCapitalize={'none'}
          className='border border-primary rounded-3xl p-4 mt-2'
        />
      </View>
      <View className='mx-auto w-10/12 mt-10 border-primary rounded-3xl p-4'>
        <TouchableOpacity disabled={loading} onPress={() => signUpWithEmail()} className='bg-primary rounded-3xl p-3'>
          <Text className='text-center font-bold text-bg2 text-xl'>{loading ? 'Signing up...' : 'Sign Up'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

