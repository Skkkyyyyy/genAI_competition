import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import quizData from '../../chatbots/major_rec_quiz.json';

type QuizResults = {
  timestamp: string;
  answers: {
    questionId: number;
    dimension: string;
    selected: {
      text_en: string;
      text_zh: string;
      score: Record<string, number>;
    };
  }[];
};

export default function QuizEnd() {
  const { results } = useLocalSearchParams<{ results?: string }>();
  const quizResults: QuizResults | null = results ? JSON.parse(results) : null;
  const recommendedMajor = "";

  const mapping = quizData.result_mapping_logic;
  const types = quizData.result_types;

  // --- helper functions to map answers -> mapping logic / result types ---
  const computeTotals = (results?: QuizResults) => {
    const totals: Record<string, number> = {};
    if (!results) return totals;
    results.answers.forEach((ans) => {
      const scores = ans.selected?.score ?? {};
      Object.entries(scores).forEach(([k, v]) => {
        totals[k] = (totals[k] || 0) + (typeof v === 'number' ? v : 0);
      });
    });
    return totals;
  };

  const findResultTypeByCode = (code?: string) => {
    if (!code || !types) return null;
    return types.find((t: any) => t.code === code) ?? null;
  };

  const findScoreRangeForTotal = (total: number) => {
    if (!mapping?.score_ranges) return null;
    // tolerant matching: support ranges defined with min/max or other keys
    return mapping.score_ranges.find((r: any) => {
      const min = typeof r.min === 'number' ? r.min : r.range_min ?? r.from ?? null;
      const max = typeof r.max === 'number' ? r.max : r.range_max ?? r.to ?? null;
      if (min == null || max == null) return false;
      return total >= min && total <= max;
    }) ?? null;
  };

  // map each answer to its highest scoring category + corresponding result type
  const perAnswerMappings = (quizResults?.answers ?? []).map((ans) => {
    const scores = ans.selected?.score ?? {};
    const entries = Object.entries(scores);
    const top = entries.sort((a, b) => (b[1] as number) - (a[1] as number))[0];
    const topCode = top ? top[0] : null;
    const topValue = top ? (top[1] as number) : 0;
    const resultType = findResultTypeByCode(topCode ?? undefined);
    return {
      ...ans,
      topCode,
      topValue,
      resultType,
    };
  });

  const totals = computeTotals(quizResults ?? undefined);
  const overallTop = Object.entries(totals).sort((a, b) => b[1] - a[1])[0] ?? [null, 0];
  const overallType = findResultTypeByCode(overallTop[0] as string | null);
  const overallRange = findScoreRangeForTotal(overallTop[1] as number);
  // --- end helpers ---

  const handleFinish = () => {
    // go to home or main screen
    router.push('/');
  };

  const handleGoBack = () => {
    router.back();
  };

  const [showResult, setShowResult] = useState(false);
  const toggleShowResult = () => {
    setShowResult(prev => true);
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scene_parent}>
        <View style={styles.scene_child}>
          <Text style={styles.scene_title}>Quiz Results</Text>

          {showResult ? (
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.scene_result}>{recommendedMajor}</Text>
            <View style={styles.result_container}>
            <Text style={{ fontWeight: '700', alignItems: 'center', fontSize: 22 }}>Overall totals</Text>
            {Object.entries(totals).length === 0 ? (
                <Text>No totals</Text>
            ) : (
                <View style={{ alignItems: 'center'}}>
                {Object.entries(totals).map(([k,v]) => <Text style={{ fontSize: 16 }} key={k}>{k}: {v}</Text>)}
                <Text style={{ marginTop: 8, fontSize: 16 }}>Top overall: {overallTop[0] ?? '—'} </Text>
                {overallType && <Text style={{flexDirection: 'row', textAlign: 'center', fontSize: 16}}>Overall type: {overallType.code} — {overallType.description_en ?? ''}</Text>}
                </View>
            )}
            </View>
          </View>
          ) : ( 
            <TouchableOpacity style={styles.scene_button} onPress={toggleShowResult}>
              <Text style={styles.scene_button_text}>Show Result</Text>
            </TouchableOpacity>
          )}

          <View style={{ marginTop: 20, flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity style={styles.scene_button} onPress={handleGoBack}>
              <Text style={styles.scene_button_text}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.scene_button} onPress={handleFinish}>
              <Text style={styles.scene_button_text}>Finish</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scene_parent: {
    flexGrow: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    paddingVertical: 24,
  },
  scene_child: {
    width: '90%',
    minHeight: '50%',
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  scene_title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#083344',
    marginBottom: 8,
  },
  scene_result: {
    color: '#083344',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 6,
  },
  scene_button: {
    marginTop: 8,
    backgroundColor: '#82ddf0',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scene_button_text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  listItem: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  listTitle: {
    fontWeight: '700',
  },
  result_container: {
    width: '100%',
    alignItems: 'center',
  },
});