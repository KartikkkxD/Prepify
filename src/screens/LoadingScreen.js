import React, { useEffect, useContext, useState, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../utils/theme';
import BrutalistCard from '../components/BrutalistCard';
import BrutalistButton from '../components/BrutalistButton';
import { PlanContext } from '../context/PlanContext';
import { generateLocalPlan } from '../utils/localPlanner';

function toUiPlan(plan) {
  return plan.map((block) => ({
    ...block,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    done: !!block.done,
  }));
}

export default function LoadingScreen({ navigation }) {
  const { scheduleInputs, setGeneratedPlan, addSavedSchedule } = useContext(PlanContext);
  const inputsSnapshot = useRef(scheduleInputs);
  inputsSnapshot.current = scheduleInputs;

  const [error, setError] = useState(null);
  const [phase, setPhase] = useState('loading');

  const requestGen = useRef(0);

  useEffect(() => {
    const id = ++requestGen.current;

    async function fetchPlan() {
      setPhase('loading');
      setError(null);
      try {
        const waitMs = 1000 + Math.floor(Math.random() * 1000);
        await new Promise((resolve) => setTimeout(resolve, waitMs));
        const { plan: rawPlan } = generateLocalPlan(inputsSnapshot.current);
        if (id !== requestGen.current) return;

        const initializedPlan = toUiPlan(rawPlan);
        setGeneratedPlan(initializedPlan);

        const title =
          inputsSnapshot.current.subjects
            ?.map((s) => s.name?.trim())
            .filter(Boolean)
            .join(', ') || 'Study plan';

        addSavedSchedule({
          title,
          scheduleInputs: inputsSnapshot.current,
          generatedPlan: initializedPlan,
        });

        navigation.replace('Plan');
      } catch (err) {
        if (id !== requestGen.current) return;
        setError(err.message || 'Something went wrong.');
        setPhase('error');
      }
    }

    fetchPlan();
    return () => {
      requestGen.current += 1;
    };
  }, [addSavedSchedule, navigation, setGeneratedPlan]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.center}>
        {phase === 'loading' ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.danger} style={styles.spinner} />
            <Text style={styles.title}>Generating your study plan...</Text>
            <BrutalistCard color={theme.colors.white} rotate={-1} style={styles.card}>
              <Text style={styles.body}>
                Prepify is building a structured plan locally from your schedule inputs.
              </Text>
            </BrutalistCard>
          </View>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Could not generate plan</Text>
            <BrutalistCard color={theme.colors.white} rotate={1} style={styles.card}>
              <Text style={styles.body}>{error}</Text>
            </BrutalistCard>
            <Text style={styles.fallbackHint}>
              Go back, adjust your inputs, and generate again.
            </Text>
            <BrutalistButton
              title="Try again"
              color={theme.colors.primary}
              onPress={() => navigation.goBack()}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.accent,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  loadingContainer: {
    alignItems: 'center',
    width: '100%',
  },
  spinner: {
    marginBottom: theme.spacing.lg,
    transform: [{ scale: 1.5 }],
  },
  title: {
    ...theme.typography.h1,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  body: {
    ...theme.typography.bodyBold,
    textAlign: 'center',
    lineHeight: 24,
  },
  errorContainer: {
    width: '100%',
    alignItems: 'center',
  },
  errorTitle: {
    ...theme.typography.h1,
    color: theme.colors.danger,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  fallbackHint: {
    ...theme.typography.caption,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    color: '#333',
    paddingHorizontal: theme.spacing.sm,
  },
});
