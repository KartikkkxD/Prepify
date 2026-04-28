import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../utils/theme';
import BrutalistButton from '../components/BrutalistButton';
import BrutalistCard from '../components/BrutalistCard';

export default function BacklogModeScreen({ navigation }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRecalculate = () => {
    setIsProcessing(true);
    // Simulate complex AI recalibration
    setTimeout(() => {
      setIsProcessing(false);
      navigation.replace('Home');
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <BrutalistButton 
          title="Cancel" 
          color={theme.colors.white} 
          style={styles.backBtn}
          textStyle={{ fontSize: 14 }}
          onPress={() => navigation.goBack()}
        />

        <View style={styles.center}>
          <Text style={styles.title}>Recovery Mode ⚡</Text>
          <Text style={styles.subtitle}>You're falling behind 👀 Let's fix that.</Text>

          <BrutalistCard color={theme.colors.white} style={styles.card} rotate={-1}>
            <Text style={styles.body}>
              We are recalibrating your entire schedule to get you back on track for your exams.
            </Text>
            <View style={styles.bullets}>
              <Text style={styles.bullet}>⚠️ Prioritizing Math & Physics</Text>
              <Text style={styles.bullet}>🕒 Compressing today's breaks</Text>
              <Text style={styles.bullet}>🏃 Pushing low-priority tasks</Text>
            </View>
          </BrutalistCard>

          <BrutalistButton 
            title={isProcessing ? "Cooking... 🍳" : "Recalibrate Plan ⚡"} 
            color={theme.colors.danger} 
            onPress={handleRecalculate}
            style={styles.actionBtn}
            textStyle={{ color: theme.colors.white, fontSize: 20 }}
            loading={isProcessing}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFE5E5', // light red background
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
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
    color: theme.colors.danger,
  },
  subtitle: {
    ...theme.typography.bodyBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  card: {
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    width: '100%',
  },
  body: {
    ...theme.typography.bodyBold,
    marginBottom: theme.spacing.md,
    lineHeight: 24,
  },
  bullets: {
    marginTop: theme.spacing.xs,
  },
  bullet: {
    ...theme.typography.bodyBold,
    marginBottom: theme.spacing.sm,
  },
  actionBtn: {
    width: '100%',
    paddingVertical: theme.spacing.lg,
  }
});
