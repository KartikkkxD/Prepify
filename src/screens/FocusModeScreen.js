import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../utils/theme';
import BrutalistButton from '../components/BrutalistButton';
import BrutalistCard from '../components/BrutalistCard';

export default function FocusModeScreen({ navigation }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <BrutalistButton 
          title="Quit" 
          color={theme.colors.white} 
          style={styles.backBtn}
          textStyle={{ fontSize: 14 }}
          onPress={() => navigation.goBack()}
        />

        <View style={styles.center}>
          <Text style={styles.title}>Stay Locked In 🔒</Text>
          <Text style={styles.subtitle}>Put your phone down. Let's work.</Text>

          <BrutalistCard color={theme.colors.primary} style={styles.timerCard}>
            <Text style={styles.timer}>{formatTime()}</Text>
          </BrutalistCard>

          <BrutalistButton 
            title={isActive ? "PAUSE" : "START"} 
            color={isActive ? theme.colors.white : theme.colors.accent} 
            onPress={toggleTimer}
            style={styles.actionBtn}
            textStyle={{ fontSize: 24 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.text,
  },
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    marginBottom: 0,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.bodyBold,
    color: theme.colors.accent,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  timerCard: {
    paddingVertical: theme.spacing.xxl,
    paddingHorizontal: 50,
    marginBottom: theme.spacing.xl,
    borderRadius: 32, // Extra round for focus
  },
  timer: {
    fontSize: 80,
    fontWeight: '900',
    color: theme.colors.text,
    letterSpacing: -2,
    fontVariant: ['tabular-nums'],
  },
  actionBtn: {
    width: 200,
    paddingVertical: theme.spacing.lg,
  }
});
