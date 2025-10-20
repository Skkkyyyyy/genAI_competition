import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, AppState, KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../../lib/supabase';
import { Platform } from 'react-native';
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
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  async function signInWithEmail() {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      if (error) {
        Alert.alert(error.message)
        return
      }

      // Successful login — navigate to the app root (main pages)
      router.replace('/(tabs)/home')
    } finally {
      setLoading(false)
    }
  }


  return (
    <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : 10}
            className='flex-1'
          >
    <ScrollView className='h-full bg-bg2'>
      <View className='bg-bg2 h-full'>
          <Text className='mt-10 text-center font-bold text-2xl'>Welcome Back!</Text>
          <View className='mx-auto w-10/12 mt-10'>
            <Text className='font-medium text-gray-500'>Email</Text>
            <TextInput
              onChangeText={(text) => setEmail(text)}
              value={email}
              placeholder="email@address.com"
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
              placeholder="Password"
              autoCapitalize={'none'}
              className='border border-primary rounded-3xl p-4 mt-2'
            />
          </View>
          <View className='mt-10 mx-auto w-10/12 border-primary rounded-3xl p-4'>
            <TouchableOpacity 
              disabled={loading} 
              onPress={() => signInWithEmail()}
              className='bg-primary rounded-3xl p-3'>
              <Text className='text-center font-bold text-bg2 text-xl'>Log In</Text>
            </TouchableOpacity>
          </View>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
  )
}

/*
<View className='mx-auto w-10/12 border-primary rounded-3xl p-4'>
        <TouchableOpacity 
          disabled={loading} 
          onPress={() => signInWithEmail()}
          className='bg-primary rounded-3xl p-3'>
          <Text className='text-center font-bold text-bg2 text-xl'>Log In</Text>
        </TouchableOpacity>
      </View>*/
