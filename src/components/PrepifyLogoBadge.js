import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../utils/theme';

export default function PrepifyLogoBadge({ size = 46, onPress }) {
  const innerSize = Math.max(12, size - 16);
  const content = (
    <View style={[styles.badge, { width: size, height: size, borderRadius: size * 0.28 }]}>
      <View
        style={[
          styles.inner,
          {
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize * 0.3,
          },
        ]}
      >
        <Text style={styles.bolt}>⚡</Text>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} hitSlop={8} style={({ pressed }) => pressed && styles.pressed}>
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: theme.borders.width,
    borderColor: theme.borders.color,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.brutalSmall,
  },
  inner: {
    borderWidth: 2,
    borderColor: theme.colors.text,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bolt: {
    fontSize: 15,
    fontWeight: '900',
    color: theme.colors.primary,
    marginTop: -1,
  },
  pressed: {
    opacity: 0.9,
  },
});

