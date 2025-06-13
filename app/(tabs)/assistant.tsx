import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Send, Bot, User, Loader, Sparkles } from 'lucide-react-native';
import { useData } from '@/hooks/useData';
import { useAI } from '@/hooks/useAI';
import { ChatMessage } from '@/components/ai/ChatMessage';
import { AIActionCard } from '@/components/ai/AIActionCard';
import { Message } from '@/types';

export default function AssistantScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const { tasks, notes, journalEntries } = useData();
  const { sendMessage } = useAI();

  useEffect(() => {
    // Welcome message on first load
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: "Hello! I'm your AI productivity assistant. I can help you organize tasks, analyze your journal entries, summarize notes, and provide insights about your productivity patterns. What would you like to work on today?",
        timestamp: new Date().toISOString(),
      }]);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      // Add context about user's data
      const context = {
        tasksCount: tasks.length,
        completedTasks: tasks.filter(t => t.completed).length,
        notesCount: notes.length,
        journalEntriesCount: journalEntries.length,
        recentMoods: journalEntries.slice(-5).map(j => j.mood),
        overdueTasks: tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length,
      };

      const response = await sendMessage(message.trim(), context);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI message error:', error);
      Alert.alert('Error', 'Failed to get AI response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Analyze My Productivity',
      description: 'Get insights about your task completion and patterns',
      icon: Sparkles,
      action: () => setMessage('Analyze my productivity patterns and give me insights'),
    },
    {
      title: 'Plan My Day',
      description: 'Create a schedule based on your current tasks',
      icon: Bot,
      action: () => setMessage('Help me plan my day based on my current tasks'),
    },
    {
      title: 'Journal Reflection',
      description: 'Get a summary of your recent journal entries',
      icon: User,
      action: () => setMessage('Provide a reflection on my recent journal entries'),
    },
  ];

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.botIcon}>
            <Bot size={24} color="#6366F1" />
          </View>
          <View>
            <Text style={styles.title}>AI Assistant</Text>
            <Text style={styles.subtitle}>Your productivity companion</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.length === 1 && (
            <View style={styles.quickActionsContainer}>
              <Text style={styles.quickActionsTitle}>Quick Actions</Text>
              {quickActions.map((action, index) => (
                <AIActionCard
                  key={index}
                  title={action.title}
                  description={action.description}
                  icon={action.icon}
                  onPress={action.action}
                />
              ))}
            </View>
          )}

          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {isLoading && (
            <View style={styles.loadingContainer}>
              <BlurView intensity={20} style={styles.loadingCard}>
                <Loader size={20} color="#6366F1" />
                <Text style={styles.loadingText}>AI is thinking...</Text>
              </BlurView>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <BlurView intensity={20} style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Ask me anything about your productivity..."
              placeholderTextColor="#71717A"
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                { opacity: message.trim() && !isLoading ? 1 : 0.5 }
              ]}
              onPress={handleSendMessage}
              disabled={!message.trim() || isLoading}
            >
              <Send size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </BlurView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  title: {
    fontSize: 24,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#EAEAEA',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#71717A',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 24,
    paddingBottom: 100,
  },
  quickActionsContainer: {
    marginBottom: 32,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#EAEAEA',
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  loadingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#71717A',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 15, 15, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#EAEAEA',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: '#6366F1',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});