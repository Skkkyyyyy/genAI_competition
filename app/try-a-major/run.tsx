import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { generateNextScene, initialiseScenario } from '../../lib/tryAMajor_api'
import AiResponse from './components/AiResponse'
import FinalSummary from './components/FinalSummary'
import { SCENARIO_DEFS } from './scenarios'
import { StyleSheet } from 'react-native'

export default function RunScenario() {
  const params = useLocalSearchParams() as { scenario?: string }
  const router = useRouter()
  const scenarioId = params.scenario
  const scenario = SCENARIO_DEFS.find((s) => s.id === scenarioId)

  const [round, setRound] = useState(1)
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)
  const [aiResult, setAiResult] = useState<{ actionResult?: string; sceneChange?: string; reflectionPrompts?: string[] } | null>(null)

  console.log('entered run.tsx with scenarioId:', scenarioId)
  if (!scenario) return (
    <SafeAreaView className='flex-1 bg-bg1 items-center justify-center'>
      <Text>Scenario not found</Text>
      <TouchableOpacity onPress={() => router.back()} className='mt-10 p-3 bg-primary rounded-2xl'>
        <Text className='text-bg2'>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )

  const submitAnswer = async () => {
    setLoading(true)
    try {
      const isFinal = round >= 5
      console.log('submitting answer for round', round, 'isFinal:', isFinal)
      const res = await generateNextScene({ scenarioId: scenario.id, round, studentAnswer: answer, previousConflict: '', scenarioPrompt: scenario.prompt, promptType: 'try-a-major', isFinal })
      setAiResult({ actionResult: res.actionResult, sceneChange: res.sceneChange, reflectionPrompts: res.reflectionPrompts })
      if (isFinal) {
        setFinished(true)
      } else {
        setRound((r) => r + 1)
      }
      setAnswer('')
    } catch (err) {
      console.error('AI error', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView className='flex-1 bg-bg1 p-4 mt-10'>
        <ScrollView>
      <View>
        <View className='flex-row justify-between items-center mb-3'>
          <TouchableOpacity onPress={() => (router.back())} className='px-4 py-2 bg-primary rounded-xl'>
            <Text className='text-white font-bold text-lg'>Back</Text>
          </TouchableOpacity>
          <Text className='py-2 text-lg text-gray-500 font-bold justify-center'>Round {round}</Text>
        </View>

        <Text className='text-xl font-bold mb-2 mt-5 mx-1'>{scenario.scenario}</Text>
        <Text className='text-lg text-gray-600 mb-4 mx-1'>{scenario.question}</Text>

        <View className='bg-bg2 p-3 rounded-2xl'>
          <Text className='text-base text-gray-700 m-2'>Your response</Text>
          <TextInput
            multiline
            value={answer}
            onChangeText={setAnswer}
            placeholder='Write your decision or action here...'
            className='bg-white p-3 rounded-md'
            style={{ minHeight: 140 }}
            editable={!loading && !finished}
          />

          <View className='flex-row space-x-3 mt-3'>
            <TouchableOpacity onPress={() => router.back()} className='px-4 py-2 rounded-xl bg-secondary '>
              <Text className='text-white text-center text-lg font-bold '>Cancel</Text>
            </TouchableOpacity>
            {!finished ? (
              <TouchableOpacity onPress={submitAnswer} className='ml-2 px-4 py-2 rounded-xl bg-primary'>
                {loading ? <ActivityIndicator color='#fff' /> : <Text className='text-white text-center text-lg font-bold'>Submit</Text>}
              </TouchableOpacity>
            ) : (
              <View className='flex-row space-x-2'>
                <TouchableOpacity onPress={() => { setRound(1); setAnswer(''); setAiResult(null); setFinished(false); }} className='ml-2 px-4 py-2 rounded-xl bg-primary'>
                  <Text className='text-bg2 text-center text-lg font-bold'>Restart</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.back()} className='px-4 py-2 rounded-xl bg-primary ml-2'>
                  <Text className='text-white text-center text-lg font-bold'>Done</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Show AI response from round 2 onward. When finished, show final UI */}
        {!finished && round > 1 && aiResult && (
          <AiResponse actionResult={aiResult.actionResult} sceneChange={aiResult.sceneChange} reflectionPrompts={aiResult.reflectionPrompts} />
        )}
        {finished && aiResult && (
          <FinalSummary actionResult={aiResult.actionResult} experienceReview={aiResult.sceneChange} reflectionPrompts={aiResult.reflectionPrompts} />
        )}
      </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  scene_parent: {
    alignItems: 'center',
  },
  back_button_container: {
    width: '95%',
    alignItems: 'flex-start',
    padding: 5,
    borderRadius: 8,
  },
  back_button: {
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    margin: 12,
    width: 80,
    alignContent: 'flex-start',
  },
  major_selection_parent: {
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    width: '90%',
    elevation: 2,
  },
});
