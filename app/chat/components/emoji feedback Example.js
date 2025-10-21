// examples/BasicUsageExample.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import EmojiFeedbackComponent from '../src/components/EmojiFeedbackComponent';

const BasicUsageExample = () => {
  const [lastMatched, setLastMatched] = useState('None');

  const handleKeywordMatch = (keyword, feedback) => {
    setLastMatched(keyword);
    // 可以在这里添加你的业务逻辑
    console.log(`用户输入了关键词: ${keyword}`);
    console.log(`系统回复: ${feedback.message}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Emoji Feedback Demo</Text>
      <Text style={styles.subHeader}>Last matched keyword: {lastMatched}</Text>
      
      <EmojiFeedbackComponent 
        onKeywordMatch={handleKeywordMatch}
        containerStyle={styles.componentContainer}
      />
      
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Try these keywords:</Text>
        <Text style={styles.tipsText}>
          • Emotions: happy, sad, love, angry{'\n'}
          • Activities: coding, learning, gaming{'\n'}
          • States: success, confused, excited{'\n'}
          • And many more!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  componentContainer: {
    flex: 1,
  },
  tipsContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1976d2',
  },
  tipsText: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
  },
});

export default BasicUsageExample;
