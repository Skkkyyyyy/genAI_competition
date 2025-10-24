// Chat home
import { useRouter } from 'expo-router'
import { Image, Pressable, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import 'react-native-url-polyfill/auto'
import 'whatwg-fetch'
import '../global.css'

export default function Index() {
  const router = useRouter()
  return (
    <SafeAreaView className='bg-bg1 flex-1'>
      <View className='mx-auto pt-6'>
        <Image source={require('../../assets/images/Image.png')} style={{ width: 250, height: 60 }} resizeMode='contain' />
      </View>

      <View className='px-6 mt-6'>
        <Text className='text-2xl font-extrabold text-black'>Welcome back!</Text>
        <View className='h-1 w-40 bg-primary rounded-full mt-2' />
        <Text className='text-sm text-gray-600 mt-4'>Get personalized career guidance and chat one-on-one with your assistant.</Text>
      </View>

      <View className='px-4 space-y-4'>
        <Pressable
          className='mt-10 flex-row items-center bg-white rounded-2xl p-4 shadow border-l-8 border-primary'
          onPress={() => router.push('/quiz/quizHome')}
        >
          <View className='bg-primary rounded-xl p-3 mr-4'>
            <Text className='text-bg2 font-bold text-2xl'>📝</Text>
          </View>
          <View className='flex-1'>
            <Text className='text-lg font-semibold'>Personalized recommendations</Text>
            <Text className='text-sm text-gray-500 mt-1'>Fill a short form to receive tailored career and major suggestions.</Text>
          </View>
        </Pressable>

        <Pressable
          className='mt-10 flex-row items-center bg-white rounded-2xl p-4 shadow border-l-8 border-primary'
          onPress={() => router.push('/chat/ask')}
        >
          <View className='bg-primary rounded-xl p-3 mr-4'>
            <Text className='text-bg2 font-bold text-2xl'>💬</Text>
          </View>
          <View className='flex-1'>
            <Text className='text-lg font-semibold'>Chat with your assistant</Text>
            <Text className='text-sm text-gray-500 mt-1'>Ask questions about careers, majors, or next steps and get instant replies.</Text>
          </View>
        </Pressable>

        <Pressable
          className='mt-10 flex-row items-center bg-white rounded-2xl p-4 shadow border-l-8 border-primary'
          onPress={() => router.push('/try-a-major')}
        >
          <View className='bg-primary rounded-xl p-3 mr-4'>
            <Text className='text-bg2 font-bold text-2xl'>🎓</Text>
          </View>
          <View className='flex-1'>
            <Text className='text-lg font-semibold'>Try-A-Major</Text>
            <Text className='text-sm text-gray-500 mt-1'>Discover, experience, and feel your fit - before you decide.</Text>
          </View>
        </Pressable>



      </View>

    </SafeAreaView>
  )
}
