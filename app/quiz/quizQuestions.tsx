import * as FileSystem from 'expo-file-system';
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import quizData from '../../chatbots/major_rec_quiz.json';

type Option = {
  text_en: string;
  text_zh: string;
  score: Record<string, number>;
};

type Question = {
  id: number;
  dimension: string;
  text_en: string;
  text_zh: string;
  options: Option[];
};

export default function QuizQuestions() {
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [answers, setAnswers] = useState<Record<number, Option>>({});
    const questions: Question[] = quizData.questions || [];

    // Save choices to local JSON file
    const saveChoicesToFile = async (answersMap: Record<number, Option>) => {
      try {
        const items = Object.entries(answersMap).map(([qIndex, option]) => {
          const qi = Number(qIndex);
          return {
            questionId: questions[qi]?.id ?? qi,
            dimension: questions[qi]?.dimension ?? null,
            selected: {
              text_en: option.text_en,
              text_zh: option.text_zh,
              // include index/score if you want:
              score: option.score ?? {},
            }
          }
        });

        const payload = {
          createdAt: new Date().toISOString(),
          totalQuestions: questions.length,
          answers: items
        };

        const fileUri = `quiz_choices.json`;
        // Try to read existing file and append (optional). Here we overwrite for simplicity.
        await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(payload, null, 2), { encoding: FileSystem.EncodingType.UTF8 });
        console.log('Saved quiz choices to', fileUri);
      } catch (err) {
        console.error('Failed to save quiz choices', err);
      }
    };

    const handleAnswer = (option: Option) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion]: option
        }));

        // Quiz complete: save choices and navigate or show result
        (async () => {
          await saveChoicesToFile({
            ...answers,
            [currentQuestion]: option
          });
        })();
    };

    const handlePrev = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            router.push('/quiz/quizHome');
        }
    };

    return (
        <ScrollView style={styles.container}>
            
            {/* Back Button */}
            <View style={styles.backButtonContainer}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => router.push('/quiz/quizHome')}
                >
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
            </View>

            {/* Question */}
            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>
                    {questions[currentQuestion].text_en}
                </Text>
                <Text style={styles.questionTextChinese}>
                    {questions[currentQuestion].text_zh}
                </Text>
            </View>

            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View 
                        style={[
                            styles.progressFill, 
                            { width: `${((currentQuestion + 1) / questions.length) * 100}%` }
                        ]} 
                    />
                </View>
            </View>

            {/* Options */}
            <View style={styles.optionsContainer}>
                {questions[currentQuestion].options.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.optionButton,
                            answers[currentQuestion] === option && styles.selectedOption
                        ]}
                        onPress={() => handleAnswer(option)}
                    >
                        <Text style={styles.optionText}>{option.text_en}</Text>
                        <Text style={styles.optionTextChinese}>{option.text_zh}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.questionControlContainer}>
                <TouchableOpacity style={styles.prevButton} onPress={handlePrev}>
                    <Text style={styles.prevButtonText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.progressText}>
                    {currentQuestion + 1} / {questions.length}
                </Text>
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 16,
    },
    backButtonContainer: {
        marginBottom: 20,
    },
    backButton: {
        backgroundColor: '#82ddf0',
        padding: 10,
        borderRadius: 8,
        width: 80,
        alignItems: 'center',
    },
    backButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    questionControlContainer: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        marginTop: 20,
    },
    prevButton: {
        backgroundColor: '#82ddf0',
        padding: 10,
        borderRadius: 8,
        width: 40,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    prevButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    nextButton: {
        backgroundColor: '#82ddf0',
        padding: 10,
        borderRadius: 8,
        width: 40,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    progressContainer: {
        marginBottom: 20,
    },
    progressText: {
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 8,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#5296a5',
        borderRadius: 4,
    },
    questionContainer: {
        marginBottom: 24,
    },
    questionText: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
    },
    questionTextChinese: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
    },
    optionsContainer: {
        gap: 12,
    },
    optionButton: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    selectedOption: {
        backgroundColor: '#e8f4f6',
        borderColor: '#5296a5',
    },
    optionText: {
        fontSize: 16,
        marginBottom: 4,
    },
    optionTextChinese: {
        fontSize: 14,
        color: '#666',
    },
});