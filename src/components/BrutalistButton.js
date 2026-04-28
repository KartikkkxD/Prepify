import React from 'react';
import { Pressable, Text, StyleSheet, Animated, ActivityIndicator, View } from 'react-native';
import { theme } from '../utils/theme';

export default function BrutalistButton({ 
  title, 
  onPress, 
  color = theme.colors.primary, 
  style, 
  textStyle,
  disabled = false,
  loading = false,
}) {
  const scaleValue = React.useRef(new Animated.Value(1)).current;
  const shadowValue = React.useRef(new Animated.Value(4)).current;

  const handlePressIn = () => {
    if (disabled || loading) return;
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 0.95,
        useNativeDriver: true,
        speed: 20,
        bounciness: 10,
      }),
      Animated.timing(shadowValue, {
        toValue: 0,
        useNativeDriver: false, // shadow props cannot use native driver
        duration: 50,
      })
    ]).start();
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
        bounciness: 10,
      }),
      Animated.timing(shadowValue, {
        toValue: 4,
        useNativeDriver: false,
        duration: 100,
      })
    ]).start();
  };

  const isDisabled = disabled || loading;
  const bgColor = isDisabled ? theme.colors.disabled : color;

  return (
    <Animated.View style={[
      { transform: [{ scale: scaleValue }] }, 
      style
    ]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={isDisabled ? undefined : onPress}
        disabled={isDisabled}
      >
        <Animated.View style={[
          styles.button,
          { 
            backgroundColor: bgColor,
            shadowOffset: { width: shadowValue, height: shadowValue },
            transform: [
              { translateX: shadowValue.interpolate({ inputRange: [0, 4], outputRange: [2, 0] }) },
              { translateY: shadowValue.interpolate({ inputRange: [0, 4], outputRange: [2, 0] }) }
            ]
          }
        ]}>
          {loading ? (
            <ActivityIndicator color={theme.colors.text} size="small" />
          ) : (
            <Text style={[styles.text, textStyle, isDisabled && styles.textDisabled]}>{title}</Text>
          )}
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borders.radius,
    borderWidth: theme.borders.width,
    borderColor: theme.borders.color,
    shadowColor: theme.colors.text,
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm, // Accommodate shadow physically
  },
  text: {
    ...theme.typography.bodyBold,
    textTransform: 'uppercase',
  },
  textDisabled: {
    color: '#888',
  }
});
