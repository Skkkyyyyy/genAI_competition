import { useState } from 'react'
import { Text, TextInput, View } from 'react-native'

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

  const [responses, setResponses] = useState<string[]>(() => prompts.map(() => ''))

  function handleChange(i: number, value: string) {
    setResponses(prev => {
      const copy = [...prev]
      copy[i] = value
      return copy
    })
  }

  return (
    <View className='mt-4 bg-white p-5 rounded-2xl'>
      <Text className='text-2xl font-bold mb-3'>Final Summary & Reflection</Text>

      {actionResult ? (
        <View className='mb-4'>
          <Text className='font-semibold text-xl'>Final Action & Outcome</Text>
          <Text className='text-base text-gray-700 mt-2'>{actionResult}</Text>
        </View>
      ) : null}

      {experienceReview ? (
        <View className='mb-4'>
          <Text className='font-semibold text-xl'>Complete Experience Review</Text>
          <Text className='text-base text-gray-700 mt-2'>{experienceReview}</Text>
        </View>
      ) : null}

      <View className='mb-2'>
        <Text className='font-semibold text-xl'>Career Reflection Questions (open-ended)</Text>
        {prompts.map((q, i) => (
          <View key={i} className='mt-2 p-3 bg-bg2 rounded-md'>
            <Text className='text-base text-gray-800'>Q{i + 1}. {q}</Text>
            <TextInput
              value={responses[i]}
              onChangeText={text => handleChange(i, text)}
              placeholder='Write your reflection here...'
              multiline
              numberOfLines={4}
              className='mt-2 p-3 bg-white rounded-md border border-gray-200 text-base text-gray-800'
              style={{ textAlignVertical: 'top' }}
            />
          </View>
        ))}
      </View>
    </View>
  )
}
