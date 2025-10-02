import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Auth from '../auth/auth';
const form = () => {
  const router = useRouter();
  return (
    <SafeAreaView>
      <TouchableOpacity className="w-full pl-3 py-2" onPress={()=>router.back()}>
        <AntDesign name="left" size={24} color="black" />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default form

const styles = StyleSheet.create({})