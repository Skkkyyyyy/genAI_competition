import { search_major } from '@/lib/chat_api'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


export default function QuizResult() {
    const [loading, setLoading] = useState(false)
    const params = useLocalSearchParams() as { answers?: string }
    const answers = params?.answers ?? ''
  const [majors, setMajors] = useState<Array<{ category?: string; description?: string }>>([])
    const faculty = answers  // for clarity

    useEffect(() => {
      const fetchMajors = async () => {
      if (!faculty) return
      setLoading(true)
      try {
        const res = await search_major(faculty)   // expect array of majors
        setMajors(res || [])
      } catch (err) {
        console.error('AI error', err)
      } finally {
        setLoading(false)
      }
    }
    fetchMajors()
  }, [faculty])
    
  return (
    <SafeAreaView style={{ flex: 1 }} className='mt-20'>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View>
          <Text style={{ fontWeight: '700', fontSize: 18, marginTop: 20,marginBottom: 12 }}>Quiz result</Text>
          <Text style={{ marginBottom: 8 }}>{answers ? String(answers) : 'No answers provided'}</Text>
        </View>
        <View>
          {loading && <ActivityIndicator size="large" color="#0000ff" />}
          {!loading && majors.length > 0 && (
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontWeight: '600', fontSize: 16, marginBottom: 12 }}>Recommended majors</Text>
              {majors.map((m, index) => (
                <View key={index} style={styles.card}>
                  <Text style={styles.cardTitle}>{m.category ?? 'Unknown major'}</Text>
                  {m.description ? <Text style={styles.cardDesc}>{m.description}</Text> : null}
                </View>
              ))}
            </View>
          )}
          {!loading && majors.length === 0 && (
            <Text style={{ marginTop: 20, fontStyle: 'italic' }}>No major recommendations available.</Text>
          )}
        </View>
        
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    // subtle border to separate cards
    borderWidth: 1,
    borderColor: '#e6e6e6',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 14,
    color: '#444',
  },
})