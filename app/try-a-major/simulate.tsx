import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { generateNextScene } from '../../lib/tryAMajor_api';
import AiResponse from './components/AiResponse';
import FinalSummary from './components/FinalSummary';
import { SCENARIO_DEFS, ScenarioDef } from './scenarios';
import { initialiseScenario } from '../../lib/tryAMajor_api';
import { ActivityIndicator } from 'react-native';

export default function Simulate() {
  const router = useRouter()
  const params = useLocalSearchParams() as { scenario?: string; major?: string }
  const scenarioId = params.scenario
  const major = params.major
  const scenario = scenarioId ? SCENARIO_DEFS.find((s) => s.id === scenarioId) : undefined

  // if major present and no scenario, show list
  if (major && !scenarioId) {
    const scenarios = SCENARIO_DEFS.filter((s) => s.major === major)
    return (
      <SafeAreaView className='flex-1 bg-bg1'>
        <View className='px-4 py-6'>
          <View className='flex-row justify-between items-center mb-3'>
            <TouchableOpacity onPress={() => (router.back())} className='px-3 py-2 bg-secondary rounded-2xl'>
              <Text className='text-white'>Back</Text>
            </TouchableOpacity>
            <Text className='text-sm text-gray-500'>Major: {major}</Text>
          </View>
          <Text className='text-2xl font-bold mb-2'>{major.toUpperCase()} scenarios</Text>
          <Text className='text-gray-600 mb-4'>Choose a scenario to begin the simulation.</Text>
          <FlatList<ScenarioDef>
            data={scenarios}
            keyExtractor={(i: ScenarioDef) => i.id}
            renderItem={({ item }: { item: ScenarioDef }) => (
              <View className='bg-bg2 p-4 rounded-xl my-2'>
                <Text className='font-semibold'>{item.scenario}</Text>
                <Text className='text-sm text-gray-500 mt-1'>{item.question}</Text>
                <TouchableOpacity
                  className='mt-3 bg-primary rounded-2xl p-2'
                  onPress={async () => {
                    try {
                      await initialiseScenario(item.id); // ensure backend is ready (pass the scenario id)
                      (router.push as any)({ pathname: '/try-a-major/run', params: { scenario: item.id } });
                    } catch (err) {
                      console.error('failed to start scenario', err);
                      // optionally show a toast/error UI
                    }
                  }}>
                  <Text className='text-bg2 text-center'>Start simulation</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </SafeAreaView>
    )
  }

  // runner state
  const [round, setRound] = useState(1)
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)
  const [aiResult, setAiResult] = useState<{ actionResult?: string; sceneChange?: string; reflectionPrompts?: string[] } | null>(null)

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
      const res = await generateNextScene({ scenarioId: scenario.id, round, studentAnswer: answer, previousConflict: '', scenarioPrompt: scenario.prompt, promptType: 'try-a-major', isFinal })
      setAiResult({ actionResult: res.actionResult, sceneChange: res.sceneChange, reflectionPrompts: res.reflectionPrompts })
      // If this was the final round, mark finished and don't advance
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
    <SafeAreaView className='flex-1 bg-bg1 p-4'>
      <View>
        <View className='flex-row justify-between items-center mb-3'>
          <TouchableOpacity onPress={() => router.back()} className='px-3 py-2 bg-secondary rounded-2xl'>
            <Text className='text-white'>Back</Text>
          </TouchableOpacity>
          <Text className='text-sm text-gray-500'>Round {round}</Text>
        </View>

        <Text className='text-xl font-bold mb-2'>{scenario.scenario}</Text>
        <Text className='text-sm text-gray-600 mb-4'>{scenario.question}</Text>

        <View className='bg-bg2 p-3 rounded-2xl'>
          <Text className='text-sm text-gray-700 mb-2'>Your response</Text>
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
            <TouchableOpacity onPress={() => router.back()} className='px-4 py-2 rounded-2xl bg-secondary'>
              <Text className='text-white'>Cancel</Text>
            </TouchableOpacity>
            {!finished ? (
              <TouchableOpacity onPress={submitAnswer} className='px-4 py-2 rounded-2xl bg-primary'>
                {loading ? <ActivityIndicator color='#fff' /> : <Text className='text-bg2 font-bold'>Submit decision</Text>}
              </TouchableOpacity>
            ) : (
              <View className='flex-row space-x-2'>
                <TouchableOpacity onPress={() => { setRound(1); setAnswer(''); setAiResult(null); setFinished(false); }} className='px-4 py-2 rounded-2xl bg-primary'>
                  <Text className='text-bg2 font-bold'>Restart</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.back()} className='px-4 py-2 rounded-2xl bg-secondary'>
                  <Text className='text-white'>Done</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Show AI response from round 2 onward. When finished, show a dedicated final UI */}
        {!finished && round > 1 && aiResult && (
          <AiResponse actionResult={aiResult.actionResult} sceneChange={aiResult.sceneChange} reflectionPrompts={aiResult.reflectionPrompts} />
        )}
        {finished && aiResult && (
          <FinalSummary actionResult={aiResult.actionResult} experienceReview={aiResult.sceneChange} reflectionPrompts={aiResult.reflectionPrompts} />
        )}
      </View>
    </SafeAreaView>
  )
}
