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

// 完整的关键词表情映射配置
const KEYWORD_MAP = {
  // 情感类关键词
  'happy': { emoji: '😄', message: 'Detected happiness! Keep up the good mood!' },
  'glad': { emoji: '😊', message: 'Happy for you!' },
  'joy': { emoji: '😁', message: 'Joy is the best state of mind!' },
  'excited': { emoji: '🤩', message: 'Excitement is a great motivator!' },
  'satisfied': { emoji: '😌', message: 'Satisfaction is a wonderful feeling!' },
  'confident': { emoji: '😎', message: 'Confidence is key! You can achieve anything!' },
  'love': { emoji: '❤️', message: 'Love is the most beautiful emotion!' },
  'like': { emoji: '🥰', message: 'Liking something is a great start!' },
  
  // 负面情绪
  'sad': { emoji: '😢', message: "Don't be sad, things will get better" },
  'upset': { emoji: '😔', message: "When you're upset, remember people care about you" },
  'disappointed': { emoji: '😞', message: 'Disappointment is temporary, new opportunities will come' },
  'angry': { emoji: '😠', message: 'Take a deep breath when you are angry' },
  'worried': { emoji: '😟', message: "Don't worry too much, things will work out" },
  'anxious': { emoji: '😰', message: 'When anxious, try relaxation exercises' },
  'scared': { emoji: '😨', message: 'Fear is normal, face it bravely' },
  'stressed': { emoji: '😥', message: 'Take breaks when feeling stressed' },
  
  // 中性/思考状态
  'confused': { emoji: '🤔', message: 'Confusion is normal, take time to figure things out' },
  'thinking': { emoji: '🧐', message: 'Deep thinking leads to great solutions' },
  'lost': { emoji: '😶', message: 'Everyone feels lost sometimes, you will find your way' },
  'unsure': { emoji: '😕', message: 'When unsure, gather more information' },
  'curious': { emoji: '🤨', message: 'Curiosity drives learning!' },
  
  // 活动/状态
  'coding': { emoji: '💻', message: 'Time to code! Let\'s build something amazing!' },
  'learning': { emoji: '📚', message: 'Learning new things enriches your mind!' },
  'working': { emoji: '💼', message: 'Hard work pays off!' },
  'resting': { emoji: '😴', message: 'Rest is important for productivity' },
  'exercising': { emoji: '🏃', message: 'Exercise keeps you healthy!' },
  'music': { emoji: '🎵', message: 'Music is good for the soul' },
  'gaming': { emoji: '🎮', message: 'Game time! Have fun!' },
  'travel': { emoji: '✈️', message: 'Travel broadens your horizons' },
  
  // 庆祝/成就
  'success': { emoji: '🎉', message: 'Congratulations on your success! Keep going!' },
  'completed': { emoji: '✅', message: 'Task completed! Well done!' },
  'celebration': { emoji: '🥳', message: 'Time to celebrate! Enjoy the moment!' },
  'victory': { emoji: '🏆', message: 'Victory is yours! Amazing!' },
  'award': { emoji: '🎖️', message: 'Award received! You deserve it!' },
  
  // 默认反馈
  'default': { emoji: '😊', message: 'Received your input!' }
};

// 扩展的建议关键词列表
const SUGGESTIONS = [
  'happy', 'coding', 'confused', 'celebration', 
  'sad', 'success', 'love', 'music', 'gaming'
];

type Feedback = { emoji: string; message: string };
type Props = {
  onKeywordMatch?: (keyword: string, feedback: Feedback) => void;
};

const EmojiFeedbackComponent = ({ onKeywordMatch}: Props) => {
  const [keyword, setKeyword] = useState('');
  const [feedback, setFeedback] = useState(KEYWORD_MAP.default);
  const [matchedKeyword, setMatchedKeyword] = useState('none');
  const [bounceAnim] = useState(new Animated.Value(0));

  // 根据关键词类型获取不同的背景色
  const getFeedbackColor = (keyword: string) => {
    const positiveKeywords = ['happy', 'glad', 'joy', 'excited', 'satisfied', 'confident', 'love', 'like',
                             'success', 'completed', 'celebration', 'victory', 'award'];
    const negativeKeywords = ['sad', 'upset', 'disappointed', 'angry', 'worried', 'anxious', 'scared', 'stressed'];
    
    if (positiveKeywords.includes(keyword)) {
      return '#e8f5e9'; // Positive light green
    } else if (negativeKeywords.includes(keyword)) {
      return '#ffebee'; // Negative light red
    } else {
      return '#f8f9fa'; // Neutral light gray
    }
  };

  const processKeyword = (input: string) => {
    setKeyword(input);
    
    if (input.trim().length === 0) {
      setFeedback(KEYWORD_MAP.default);
      setMatchedKeyword('none');
      return;
    }
    
    const inputLower = input.toLowerCase();
    let matchedKey = 'default';
    let matchedFeedback = KEYWORD_MAP.default;
    
    // 查找匹配的关键词
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
    
    // 触发动画
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

  const handleSuggestionPress = (suggestion: string) => {
    setKeyword(suggestion);
    processKeyword(suggestion);
  };

  return (
    <View style={[styles.container]}>
      <View style={styles.content}>
        <Text className='text-base text-gray-600'>How are you feeling right now?</Text>
        <View className='my-2'>
          <TextInput
            style={styles.keywordInput}
            placeholder="Enter keywords like: happy, coding, love, confused..."
            placeholderTextColor="#999"
            value={keyword}
            onChangeText={processKeyword}
          />
        </View>
        
        <View style={[
          styles.feedbackContainer, 
          { backgroundColor: getFeedbackColor(matchedKeyword) }
        ]}>
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
     //#eaf5f7
    borderRadius: 20,
    padding: 20,
    width: width - 40,
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
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
    padding: 10,
    borderWidth: 2,
    borderColor: '#e1e5e9',
    borderRadius: 12,
    fontSize: 12,
    backgroundColor: 'white',
  },
  feedbackContainer: {
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    padding: 10,
    borderRadius: 15,
    backgroundColor: '#f8f9fa',
  },
  emoji: {
    fontSize: 50,
    marginBottom: 15,
  },
  message: {
    fontSize: 15,
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
    paddingHorizontal: 10,
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
