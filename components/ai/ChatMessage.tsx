import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Bot, User } from 'lucide-react-native';
import { Message } from '@/types';
import { formatTime } from '@/utils/dateUtils';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.container, isUser && styles.userContainer]}>
      <View style={[styles.avatar, isUser && styles.userAvatar]}>
        {isUser ? (
          <User size={16} color="#FFFFFF" />
        ) : (
          <Bot size={16} color="#6366F1" />
        )}
      </View>
      
      <BlurView 
        intensity={20} 
        style={[
          styles.messageCard,
          isUser && styles.userMessageCard
        ]}
      >
        <Text style={[styles.messageText, isUser && styles.userMessageText]}>
          {message.content}
        </Text>
        <Text style={[styles.timestamp, isUser && styles.userTimestamp]}>
          {formatTime(new Date(message.timestamp))}
        </Text>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  userContainer: {
    flexDirection: 'row-reverse',
  },
  avatar: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#6366F1',
    marginTop: 4,
  },
  userAvatar: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  messageCard: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    padding: 16,
    maxWidth: '85%',
  },
  userMessageCard: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderColor: '#6366F1',
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#EAEAEA',
    lineHeight: 20,
    marginBottom: 8,
  },
  userMessageText: {
    color: '#EAEAEA',
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#71717A',
  },
  userTimestamp: {
    color: '#A1A1AA',
  },
});