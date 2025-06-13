import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { BlurView } from 'expo-blur';
import { Search } from 'lucide-react-native';

interface SearchBarProps extends TextInputProps {
  style?: any;
}

export const SearchBar: React.FC<SearchBarProps> = ({ style, ...props }) => {
  return (
    <BlurView intensity={20} style={[styles.container, style]}>
      <Search size={20} color="#71717A" />
      <TextInput
        style={styles.input}
        placeholderTextColor="#71717A"
        {...props}
      />
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#EAEAEA',
  },
});