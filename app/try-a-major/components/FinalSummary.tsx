import { Text, TouchableOpacity, View } from 'react-native'

export default function FinalSummary({
  actionResult,
  experienceReview,
  reflectionPrompts,
}: {
  actionResult?: string
  experienceReview?: string
  reflectionPrompts?: string[]
}) {
  // Ensure exactly three prompts (truncate or pad)
  const prompts = (reflectionPrompts || []).slice(0, 3)
  while (prompts.length < 3) {
    const defaults = [
      'What was the most important takeaway from this experience?',
      'If you could do this again, what would you choose or do differently?',
      'How did this experience affect your career interests or long-term goals?',
    ]
    prompts.push(defaults[prompts.length])
  }

  return (
    <View className='mt-4 bg-white p-5 rounded-2xl'>
      <Text className='text-2xl font-bold mb-3'>Final Summary & Reflection</Text>

      {actionResult ? (
        <View className='mb-4'>
          <Text className='font-semibold text-lg'>Final Action & Outcome</Text>
          <Text className='text-sm text-gray-700 mt-2'>{actionResult}</Text>
        </View>
      ) : null}

      {experienceReview ? (
        <View className='mb-4'>
          <Text className='font-semibold text-lg'>Complete Experience Review</Text>
          <Text className='text-sm text-gray-700 mt-2'>{experienceReview}</Text>
        </View>
      ) : null}

      <View className='mb-2'>
        <Text className='font-semibold text-lg'>Career Reflection Questions (open-ended)</Text>
        {prompts.map((q, i) => (
          <View key={i} className='mt-2 p-3 bg-bg2 rounded-md'>
            <Text className='text-sm text-gray-800'>Q{i + 1}. {q}</Text>
            <TouchableOpacity className='mt-2 px-3 py-2 bg-primary rounded-2xl'>
              <Text className='text-bg2'>Record my reflection</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  )
}
