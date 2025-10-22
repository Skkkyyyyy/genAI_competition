import { Text, View } from 'react-native';

export default function AiResponse({ actionResult, sceneChange, reflectionPrompts }: { actionResult?: string; sceneChange?: string; reflectionPrompts?: string[] }) {
  return (
    <View className='mt-4 bg-white p-4 rounded-xl'>
      {actionResult ? (
        <View className='mb-3'>
          <Text className='font-semibold'>Action Result + New Conflict/Event</Text>
          <Text className='text-sm text-gray-700 mt-1'>{actionResult}</Text>
        </View>
      ) : null}

      {sceneChange ? (
        <View className='mb-3'>
          <Text className='font-semibold'>Scene Change</Text>
          <Text className='text-sm text-gray-700 mt-1'>{sceneChange}</Text>
        </View>
      ) : null}

      {reflectionPrompts && reflectionPrompts.length > 0 ? (
        <View>
          <Text className='font-semibold'>Reflection Questions</Text>
          {reflectionPrompts.map((q, i) => (
            <Text key={i} className='text-sm text-gray-700 mt-1'>· {q}</Text>
          ))}
        </View>
      ) : null}
    </View>
  )
}
