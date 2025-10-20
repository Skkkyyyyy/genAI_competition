import { useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Login from './components/Login'
import Signup from './components/Signup'
export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(true)

  return (
  <SafeAreaView edges={['top','left','right']} className='bg-primary flex-1 h-screen'>
        <View className="w-full mt-20 bg-primary items-center">
          <Image
            source={require('../../assets/images/Image.png')}
            style={{width:400, height:55}}
            resizeMode="contain"
          />
        </View>
        <View className='mt-24 bg-bg2 rounded-t-3xl p-4 flex-1'>
          <View className='flex-row justify-evenly'>
            <TouchableOpacity onPress={() => setIsSignUp(true)} className={`flex-1 px-4 py-3 rounded-2xl ${isSignUp ? 'bg-primary' : ''}`}>
              <Text className={`${isSignUp ? 'text-bg2 font-bold text-center' : 'text-primary text-center font-bold'}`}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsSignUp(false)} className={`flex-1 px-4 py-3 rounded-2xl ${!isSignUp ? 'bg-primary' : ''}`}>
              <Text className={`${!isSignUp ? 'text-bg2 font-bold text-center' : 'text-primary text-center font-bold'}`}>Log In</Text>
            </TouchableOpacity>
          </View>

          {/* auth form area fills the rest of the rounded panel */}
          <View className='flex-1'>
            {isSignUp ? <Signup /> : <Login />}
          </View>
        </View>
    </SafeAreaView>
  )
}
