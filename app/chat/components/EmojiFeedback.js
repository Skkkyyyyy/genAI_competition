// src/components/EmojiFeedbackComponent.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView
} from 'react-native';

const { width } = Dimensions.get('window');

const KEYWORD_MAP = {
  'happy': { emoji: '😄', message: 'Detected happiness! Keep up the good mood!' },
  'sad': { emoji: '😢', message: "Don't be sad, things will get better" },
  'coding': { emoji: '💻', message: 'Time to code! Let\'s build something amazing!' },
  'confused': { emoji: '🤔', message: 'Confusion is normal, take time to figure things out' },
  'success': { emoji: '🎉', message: 'Congratulations on your success! Keep going!' },
  'default': { emoji: '😊', message: 'Received your input!' }
};

const SUGGESTIONS = ['happy', 'coding', 'confused', 'success', 'sad'];

const EmojiFeedbackComponent = ({ onKeywordMatch }) => {
  const [keyword, setKeyword] = useState('');
  const [feedback, setFeedback] = useState(KEYWORD_MAP.default);
  const [matchedKeyword, setMatchedKeyword] = useState('none');
  const [bounceAnim] = useState(new Animated.Value(0));

  const processKeyword = (input) => {
    setKeyword(input);
    
    if (input.trim().length === 0) {
      setFeedback(KEYWORD_MAP.default);
      setMatchedKeyword('none');
      return;
    }
    
    const inputLower = input.toLowerCase();
    let matchedKey = 'default';
    let matchedFeedback = KEYWORD_MAP.default;
    
    for (const [key, value] of Object.entries(KEYWORD_MAP)) {
      if (key !== 'default' && inputLower.includes(key)) {
        matchedKey = key;
        matchedFeedback = value;
        break;
      }
    }
    
    setFeedback(matchedFeedback);
    setMatchedKeyword(matchedKey);
    
    // 如果有回调函数，调用它
    if (onKeywordMatch && matchedKey !== 'default') {
      onKeywordMatch(matchedKey, matchedFeedback);
    }
    
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: -10,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSuggestionPress = (suggestion) => {
    setKeyword(suggestion);
    processKeyword(suggestion);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Keyword Emoji Feedback</Text>
        <Text style={styles.subtitle}>Enter keywords to get emoji feedback</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.keywordInput}
            placeholder="Enter keywords like: happy, coding, confused..."
            placeholderTextColor="#999"
            value={keyword}
            onChangeText={processKeyword}
          />
        </View>
        
        <View style={styles.feedbackContainer}>
          <Animated.Text 
            style={[
              styles.emoji,
              { transform: [{ translateY: bounceAnim }] }
            ]}
          >
            {feedback.emoji}
          </Animated.Text>
          <Text style={styles.message}>{feedback.message}</Text>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestionsContainer}
        >
          {SUGGESTIONS.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionChip}
              onPress={() => handleSuggestionPress(suggestion)}
            >
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            Matched keyword: <Text style={styles.keywordText}>{matchedKeyword}</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: width - 40,
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
  },
  inputContainer: {
    marginBottom: 30,
  },
  keywordInput: {
    width: '100%',
    padding: 15,
    borderWidth: 2,
    borderColor: '#e1e5e9',
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  feedbackContainer: {
    minHeight: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 25,
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#f8f9fa',
  },
  emoji: {
    fontSize: 70,
    marginBottom: 15,
  },
  message: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
  suggestionsContainer: {
    paddingVertical: 10,
  },
  suggestionChip: {
    backgroundColor: '#f1f3f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 5,
  },
  suggestionText: {
    fontSize: 14,
    color: '#495057',
  },
  statusContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    color: '#6c757d',
  },
  keywordText: {
    fontWeight: 'bold',
    color: '#495057',
  },
});

export default EmojiFeedbackComponent;
