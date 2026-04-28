import React from 'react';
import { View, StyleSheet, Pressable, Animated } from 'react-native';
import { theme } from '../utils/theme';

export default function BrutalistCard({ children, style, color = theme.colors.white, rotate = 0, onPress }) {
  const rotation = `${rotate}deg`;
  
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!onPress) return;
    Animated.spring(scaleValue, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 20,
      bounciness: 10,
    }).start();
  };

  const handlePressOut = () => {
    if (!onPress) return;
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 10,
    }).start();
  };

  const CardContent = (
    <Animated.View style={[{ transform: [{ scale: scaleValue }] }]}>
      <View style={[styles.card, { backgroundColor: color, transform: [{ rotate: rotation }] }, style]}>
        {children}
      </View>
    </Animated.View>
  );

  if (onPress) {
    return (
      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress}>
        {CardContent}
      </Pressable>
    );
  }

  return CardContent;
}

const styles = StyleSheet.create({
  card: {
    padding: theme.spacing.lg,
    borderRadius: theme.borders.radius,
    borderWidth: theme.borders.width,
    borderColor: theme.borders.color,
    ...theme.shadows.brutal,
    marginBottom: theme.spacing.lg,
  }
});
