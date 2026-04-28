import React, { useState } from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { theme } from '../utils/theme';

export default function BrutalistInput({ 
  label, 
  error,
  style,
  containerStyle,
  ...props 
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          error && styles.inputError,
          style
        ]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor="#999"
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    ...theme.typography.bodyBold,
    marginBottom: 8,
  },
  input: {
    borderWidth: 3,
    borderColor: theme.borders.color,
    borderRadius: theme.borders.radius - 4,
    padding: 16,
    ...theme.typography.bodyBold,
    backgroundColor: theme.colors.white,
    ...theme.shadows.brutalSmall,
  },
  inputFocused: {
    backgroundColor: '#FFFBE6', // Slight yellow tint when focused
    borderColor: theme.colors.primary,
  },
  inputError: {
    borderColor: theme.colors.danger,
    backgroundColor: '#FFF0F0',
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.danger,
    marginTop: 8,
  }
});
