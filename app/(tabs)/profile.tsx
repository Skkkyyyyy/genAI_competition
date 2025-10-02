import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const profile = () => {
  const router = useRouter();
  return (
    <SafeAreaView className='flex-col h-full items-center'>
      <Ionicons name="person-circle-sharp" size={100} color="black" className='mt-20'/>
      <Text className="text-3xl font-bold text-center mt-10">You haven't signed in yet</Text>
      <Text className='text-center font-normal text-lg mt-5'>Sign in now to unlock more features!</Text>
      <TouchableOpacity onPress={()=>router.push('../auth/auth')} className='p-3 bg-gray-300 rounded-xl border-transparent border-0 self-center mt-20 justify-center'>
        <Text className='text-center font-bold text-lg'>Sign In / Sign Up</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default profile

const styles = StyleSheet.create({})