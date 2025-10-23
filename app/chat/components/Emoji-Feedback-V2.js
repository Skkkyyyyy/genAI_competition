import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Emoji mapping for academic keywords
const emojiMap = {
  // Technology & Computer Science
  'computer science': '💻',
  'programming': '🔧',
  'software': '📱',
  'algorithm': '⚙️',
  'data science': '📊',
  'artificial intelligence': '🤖',
  'machine learning': '🧠',
  'cybersecurity': '🛡️',
  'web development': '🌐',
  'database': '🗄️',
  'cloud computing': '☁️',
  'mobile development': '📲',
  'game development': '🎮',
  'computer graphics': '🖼️',
  'human-computer interaction': '👆',
  'information technology': '💾',
  'networking': '📡',
  'operating systems': '⚙️',
  'software engineering': '🛠️',
  'computer architecture': '🏛️',
  'computational theory': '🧮',
  'quantum computing': '⚛️',
  
  // Medicine & Health
  'medicine': '⚕️',
  'doctor': '👨‍⚕️',
  'nursing': '💊',
  'pharmacy': '💊',
  'dentistry': '🦷',
  'veterinary': '🐾',
  'biology': '🧬',
  'anatomy': '🦴',
  'genetics': '🧬',
  'neuroscience': '🧠',
  'physiology': '💓',
  'pathology': '🔬',
  'immunology': '🛡️',
  'oncology': '🎗️',
  'cardiology': '❤️',
  'pediatrics': '👶',
  'psychiatry': '🧠',
  'public health': '🏥',
  'epidemiology': '📈',
  'nutrition': '🍎',
  'pharmacology': '💊',
  'radiology': '📷',
  'surgery': '🔪',
  'obstetrics': '🤰',
  'gynecology': '♀️',
  
  // Engineering
  'engineering': '⚙️',
  'mechanical': '🔧',
  'electrical': '⚡',
  'civil': '🏗️',
  'chemical': '🧪',
  'aerospace': '🚀',
  'robotics': '🤖',
  'biomedical': '❤️',
  'environmental': '🌱',
  'industrial': '🏭',
  'materials': '🧱',
  'nuclear': '☢️',
  'petroleum': '🛢️',
  'software': '💻',
  'structural': '🏛️',
  'transportation': '🚗',
  'marine': '🚢',
  'automotive': '🚘',
  'acoustical': '🎵',
  'agricultural': '🚜',
  
  // Business & Economics
  'business': '💼',
  'economics': '📈',
  'finance': '💰',
  'marketing': '📣',
  'management': '👔',
  'accounting': '📋',
  'entrepreneurship': '💡',
  'supply chain': '📦',
  'logistics': '🚚',
  'human resources': '👥',
  'international business': '🌍',
  'operations': '⚙️',
  'strategy': '♟️',
  'investment': '📈',
  'banking': '🏦',
  'insurance': '🛡️',
  'real estate': '🏠',
  'taxation': '💸',
  'auditing': '🔍',
  'corporate finance': '💼',
  
  // Arts & Humanities
  'art': '🎨',
  'design': '✏️',
  'music': '🎵',
  'literature': '📖',
  'history': '📜',
  'philosophy': '🤔',
  'linguistics': '🗣️',
  'theater': '🎭',
  'film': '🎬',
  'dance': '💃',
  'creative writing': '✍️',
  'graphic design': '🎨',
  'photography': '📷',
  'sculpture': '🗿',
  'painting': '🖌️',
  'printmaking': '🖨️',
  'ceramics': '🏺',
  'textile arts': '🧵',
  'digital arts': '🖥️',
  'art history': '🖼️',
  'music theory': '🎼',
  'composition': '🎵',
  'performance': '🎤',
  'conducting': '🎼',
  
  // Sciences
  'physics': '⚛️',
  'chemistry': '🧪',
  'mathematics': 'π',
  'astronomy': '🔭',
  'geology': '🪨',
  'environmental science': '🌱',
  'psychology': '🧠',
  'sociology': '👥',
  'anthropology': '👤',
  'biology': '🧬',
  'biochemistry': '🧪',
  'microbiology': '🔬',
  'zoology': '🐅',
  'botany': '🌿',
  'ecology': '🌳',
  'meteorology': '🌤️',
  'oceanography': '🌊',
  'paleontology': '🦖',
  'genetics': '🧬',
  'neuroscience': '🧠',
  'cognitive science': '🧠',
  'materials science': '🧱',
  'nanotechnology': '🔬',
  
  // Education & Law
  'education': '📚',
  'teaching': '✏️',
  'law': '⚖️',
  'political science': '🏛️',
  'international relations': '🌍',
  'criminal justice': '🚔',
  'social work': '🤝',
  'public policy': '📜',
  'urban planning': '🏙️',
  'curriculum': '📝',
  'educational technology': '💻',
  'special education': '🌟',
  'higher education': '🎓',
  'elementary education': '👦',
  'secondary education': '👩‍🎓',
  'constitutional law': '📜',
  'corporate law': '🏢',
  'international law': '🌐',
  'environmental law': '🌳',
  'human rights': '✊',
  
  // Other fields
  'architecture': '🏛️',
  'agriculture': '🌾',
  'culinary': '👨‍🍳',
  'fashion': '👗',
  'journalism': '📰',
  'sports science': '⚽',
  'hospitality': '🏨',
  'tourism': '✈️',
  'aviation': '✈️',
  'maritime': '🚢',
  'forestry': '🌲',
  'fisheries': '🐟',
  'mining': '⛏️',
  'metallurgy': '🔥',
  'textile': '🧵',
  'library science': '📚',
  'information science': 'ℹ️',
  'museum studies': '🏛️',
  'heritage conservation': '🕍',
  'archival science': '📜',
  
  // Interdisciplinary fields
  'bioinformatics': '🧬',
  'computational biology': '💻',
  'environmental studies': '🌍',
  'global studies': '🌐',
  'digital humanities': '💻',
  'science and technology studies': '🔬',
  'urban studies': '🏙️',
  'sustainability': '♻️',
  'data science': '📊',
  'information systems': '💾',
  'cognitive science': '🧠',
  'neuroscience': '🧠',
  'behavioral economics': '📈',
  'public health': '🏥',
  'health informatics': '🏥',
  'geographic information systems': '🗺️',
  'computational linguistics': '💬',
  'human factors': '👤',
  'ergonomics': '🪑'
};

// Keyword categories
const keywordCategories = {
  popular: [
    'computer science', 'medicine', 'engineering', 'business', 'psychology', 
    'biology', 'economics', 'mathematics', 'physics', 'chemistry'
  ],
  stem: [
    'computer science', 'programming', 'data science', 'artificial intelligence', 'machine learning',
    'biology', 'chemistry', 'physics', 'mathematics', 'engineering',
    'astronomy', 'geology', 'environmental science', 'neuroscience', 'genetics',
    'biochemistry', 'microbiology', 'biotechnology', 'nanotechnology', 'meteorology'
  ],
  humanities: [
    'history', 'philosophy', 'linguistics', 'literature', 'religious studies',
    'classics', 'anthropology', 'archaeology', 'cultural studies', 'medieval studies'
  ],
  arts: [
    'art', 'music', 'theater', 'film', 'dance',
    'creative writing', 'graphic design', 'photography', 'sculpture', 'painting'
  ],
  professional: [
    'law', 'medicine', 'business', 'education', 'social work',
    'public health', 'architecture', 'urban planning', 'journalism', 'public relations'
  ],
  interdisciplinary: [
    'bioinformatics', 'cognitive science', 'environmental studies', 'global studies', 'digital humanities',
    'neuroscience', 'sustainability', 'public policy', 'urban studies', 'data science'
  ]
};

// Function to extract keywords from a sentence
const extractKeywords = (sentence) => {
  const foundKeywords = [];
  const lowerSentence = sentence.toLowerCase();
  
  // Check each keyword to see if it appears in the sentence
  for (const keyword in emojiMap) {
    if (lowerSentence.includes(keyword.toLowerCase())) {
      foundKeywords.push(keyword);
    }
  }
  
  // Sort by length (longer keywords first) to handle overlapping matches
  foundKeywords.sort((a, b) => b.length - a.length);
  
  return foundKeywords;
};

// Chat Message Component
const ChatMessage = ({ message, emojiMap }) => {
  const { text, isUser, keywords, timestamp } = message;

  // Function to highlight keywords in text
  const renderHighlightedText = (text, keywords) => {
    if (!keywords || keywords.length === 0) {
      return <Text style={isUser ? styles.userMessageText : styles.botMessageText}>{text}</Text>;
    }

    let elements = [];
    let lastIndex = 0;
    let textLower = text.toLowerCase();

    // Find all occurrences of keywords
    const matches = [];
    keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      let index = textLower.indexOf(keywordLower);
      while (index !== -1) {
        matches.push({
          keyword,
          start: index,
          end: index + keyword.length
        });
        index = textLower.indexOf(keywordLower, index + 1);
      }
    });

    // Sort matches by start index
    matches.sort((a, b) => a.start - b.start);

    // Create text elements with highlights
    matches.forEach(match => {
      // Add text before the match
      if (match.start > lastIndex) {
        elements.push(
          <Text key={lastIndex} style={isUser ? styles.userMessageText : styles.botMessageText}>
            {text.substring(lastIndex, match.start)}
          </Text>
        );
      }

      // Add highlighted match
      elements.push(
        <Text key={match.start} style={styles.highlightedText}>
          {text.substring(match.start, match.end)}
        </Text>
      );

      lastIndex = match.end;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      elements.push(
        <Text key={lastIndex} style={isUser ? styles.userMessageText : styles.botMessageText}>
          {text.substring(lastIndex)}
        </Text>
      );
    }

    return <Text style={isUser ? styles.userMessageText : styles.botMessageText}>{elements}</Text>;
  };

  return (
    <View style={[
      styles.message,
      isUser ? styles.userMessage : styles.botMessage
    ]}>
      {renderHighlightedText(text, keywords)}
      
      {keywords && keywords.length > 0 && (
        <View style={styles.emojiContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {keywords.map((keyword, index) => (
              <View key={index} style={styles.emojiItem}>
                <Text style={styles.emojiDisplay}>{emojiMap[keyword] || '❓'}</Text>
                <Text style={styles.keywordLabel}>{keyword}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
      
      <Text style={styles.timestamp}>
        {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );
};

// Suggestion Tags Component
const SuggestionTags = ({ keywords, onKeywordPress }) => {
  if (!keywords || keywords.length === 0) {
    return (
      <View style={styles.suggestionTags}>
        <Text style={styles.noKeywordsText}>No keywords found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.suggestionTags}>
      {keywords.map((keyword, index) => (
        <TouchableOpacity
          key={index}
          style={styles.suggestionTag}
          onPress={() => onKeywordPress(keyword)}
        >
          <Text style={styles.suggestionTagText}>{keyword}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

// Main Component
const AcademicEmojiChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [searchText, setSearchText] = useState('');
  const [activeCategory, setActiveCategory] = useState('popular');
  const [filteredKeywords, setFilteredKeywords] = useState([]);
  const flatListRef = useRef(null);

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage = {
      id: Date.now().toString(),
      text: "Hi! I can extract academic keywords from your sentences and show their emojis. Try typing something like 'I'm studying computer science and psychology'.",
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    
    // Initialize filtered keywords
    handleSearch('');
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Process message and add bot response after delay
    setTimeout(() => {
      const keywords = extractKeywords(inputText);
      
      let botMessage;
      if (keywords.length > 0) {
        botMessage = {
          id: (Date.now() + 1).toString(),
          text: `I found ${keywords.length} keyword(s) in your message:`,
          isUser: false,
          keywords: keywords,
          timestamp: new Date(),
        };
      } else {
        botMessage = {
          id: (Date.now() + 1).toString(),
          text: "I didn't find any academic keywords in your message. Try including words like 'computer science', 'medicine', or 'engineering'.",
          isUser: false,
          timestamp: new Date(),
        };
      }

      setMessages(prev => [...prev, botMessage]);
    }, 800);
  };

  const handleSearch = (text) => {
    setSearchText(text);
    
    if (text.trim() === '') {
      // Show default category keywords
      setFilteredKeywords(keywordCategories[activeCategory]);
    } else {
      // Filter keywords based on search
      const matchingKeywords = Object.keys(emojiMap).filter(keyword => 
        keyword.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredKeywords(matchingKeywords.slice(0, 50));
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setSearchText('');
    setFilteredKeywords(keywordCategories[category]);
  };

  const handleSuggestionPress = (keyword) => {
    setInputText(keyword);
  };

  const renderMessageItem = ({ item }) => (
    <ChatMessage 
      message={item} 
      emojiMap={emojiMap}
    />
  );

  return (
    <View style={styles.chatContainer}>
      {/* Header */}
      <View style={styles.chatHeader}>
        <Text style={styles.chatHeaderTitle}>Academic Emoji Chat</Text>
        <Text style={styles.keywordCount}>
          {Object.keys(emojiMap).length}+ Keywords Available
        </Text>
      </View>

      {/* Messages */}
      <View style={styles.chatMessages}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
        />
      </View>

      {/* Input Section */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.chatInputContainer}
      >
        <Text style={styles.welcomeMessage}>
          Type a sentence and press Send to extract keywords and show their emojis
        </Text>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.chatInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Enter a sentence with academic keywords..."
            placeholderTextColor="#999"
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={handleSendMessage}
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons 
            name="search" 
            size={18} 
            color="#999" 
            style={styles.searchIcon} 
          />
          <TextInput
            style={styles.searchInput}
            value={searchText}
            onChangeText={handleSearch}
            placeholder="Search keywords..."
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.keywordStats}>
          <Text style={styles.keywordStatsText}>
            Total Keywords: {Object.keys(emojiMap).length}+
          </Text>
          <Text style={styles.keywordStatsText}>
            Showing: {filteredKeywords.length}
          </Text>
        </View>

        {/* Category Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryTabs}
        >
          {Object.keys(keywordCategories).map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryTab,
                activeCategory === category && styles.categoryTabActive
              ]}
              onPress={() => handleCategoryChange(category)}
            >
              <Text style={[
                styles.categoryTabText,
                activeCategory === category && styles.categoryTabTextActive
              ]}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Suggestion Tags */}
        <SuggestionTags
          keywords={filteredKeywords}
          onKeywordPress={handleSuggestionPress}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  // Main container
  chatContainer: {
    flex: 1,
    backgroundColor: 'white',
  },

  // Header
  chatHeader: {
    backgroundColor: '#4a6fa5',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  chatHeaderTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  keywordCount: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },

  // Messages area
  chatMessages: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  messagesList: {
    padding: 15,
  },

  // Message bubbles
  message: {
    maxWidth: '80%',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 18,
    marginBottom: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#e3f2fd',
    borderBottomRightRadius: 5,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f5f5f5',
    borderBottomLeftRadius: 5,
  },
  userMessageText: {
    fontSize: 16,
    color: '#343a40',
  },
  botMessageText: {
    fontSize: 16,
    color: '#343a40',
  },
  highlightedText: {
    backgroundColor: 'rgba(255, 123, 84, 0.2)',
    paddingHorizontal: 4,
    borderRadius: 4,
    fontSize: 16,
    color: '#343a40',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    alignSelf: 'flex-end',
  },

  // Emoji display
  emojiContainer: {
    marginTop: 10,
  },
  emojiItem: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    marginRight: 10,
    minWidth: 80,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  emojiDisplay: {
    fontSize: 32,
    marginBottom: 8,
    height: 40,
    textAlign: 'center',
  },
  keywordLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4a6fa5',
    textAlign: 'center',
  },

  // Input section
  chatInputContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  welcomeMessage: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginBottom: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 24,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#4a6fa5',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 15,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 24,
    paddingHorizontal: 40,
    paddingVertical: 12,
    fontSize: 14,
  },

  // Stats
  keywordStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  keywordStatsText: {
    fontSize: 12,
    color: '#666',
  },

  // Category tabs
  categoryTabs: {
    marginBottom: 15,
  },
  categoryTab: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    marginRight: 8,
  },
  categoryTabActive: {
    backgroundColor: '#4a6fa5',
    borderColor: '#4a6fa5',
  },
  categoryTabText: {
    fontSize: 12,
    color: '#343a40',
  },
  categoryTabTextActive: {
    color: 'white',
  },

  // Suggestion tags
  suggestionTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  suggestionTag: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 8,
    marginBottom: 8,
  },
  suggestionTagText: {
    fontSize: 12,
    color: '#343a40',
  },
  noKeywordsText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 10,
  },
});

export default AcademicEmojiChat;
