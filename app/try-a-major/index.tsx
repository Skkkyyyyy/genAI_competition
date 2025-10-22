import { useRouter } from 'expo-router'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const MAJORS = [
  { id: 'cs', label: 'Computer Science' },
  { id: 'fintech', label: 'FinTech' },
  { id: 'finance', label: 'Finance' },
  { id: 'design', label: 'Design' },
  { id: 'biology', label: 'Biology' },
  { id: 'education', label: 'Education' },
]

export default function TryAMajorIndex() {
  const router = useRouter()

  const renderItem = ({ item }: { item: { id: string; label: string } }) => (
    <TouchableOpacity
      onPress={() => (router.push as any)({ pathname: '/try-a-major/simulate', params: { major: item.id } })}
      className='mx-4 my-2 bg-bg2 p-4 rounded-xl'
    >
      <Text className='text-lg font-semibold'>{item.label}</Text>
      <Text className='text-sm text-gray-500 mt-1'>Try a 1-day simulated experience</Text>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView className='flex-1 bg-bg1'>
      <View className='px-4 py-6'>
        <Text className='text-2xl font-bold mb-2'>Try a Major</Text>
        <Text className='text-gray-600 mb-4'>Pick a major to experience a day in the life of a student.</Text>
        <FlatList<{ id: string; label: string }> data={MAJORS} renderItem={renderItem} keyExtractor={(i: { id: string; label: string }) => i.id} />
      </View>
    </SafeAreaView>
  )
}
