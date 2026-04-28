import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../utils/theme';
import BrutalistButton from '../components/BrutalistButton';
import BrutalistCard from '../components/BrutalistCard';
import PrepifyLogoBadge from '../components/PrepifyLogoBadge';
import { PlanContext } from '../context/PlanContext';

function formatSavedDate(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

export default function HomeScreen({ navigation }) {
  const {
    generatedPlan,
    savedSchedules,
    loadSavedSchedule,
    removeSavedSchedule,
    startNewScheduleFlow,
  } = React.useContext(PlanContext);

  const hasPlan = generatedPlan && generatedPlan.length > 0;

  const goCreate = () => {
    startNewScheduleFlow();
    navigation.navigate('CreateSchedule');
  };

  const openSaved = (id) => {
    loadSavedSchedule(id);
    navigation.navigate('Plan');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.brandRow}><PrepifyLogoBadge size={46} /><Text style={styles.title}>Prepify</Text></View>
        </View>

        <BrutalistButton
          title="Create New Schedule"
          color={theme.colors.primary}
          onPress={goCreate}
          style={styles.createBtn}
        />

        {hasPlan ? (
          <View style={styles.block}>
            <Text style={styles.h2}>Current plan</Text>
            <BrutalistCard color={theme.colors.white} rotate={-0.5} style={styles.card}>
              <Text style={styles.h3}>{generatedPlan.length} focus blocks</Text>
              <Text style={styles.bodyMuted}>Based on your latest generation.</Text>
            </BrutalistCard>
            <BrutalistButton
              title="View plan"
              color={theme.colors.secondary}
              onPress={() => navigation.navigate('Plan')}
              style={styles.secondaryBtn}
            />
          </View>
        ) : (
          <Text style={styles.hint}>No active plan yet — create a schedule to generate one with AI.</Text>
        )}

        {savedSchedules.length > 0 ? (
          <View style={styles.block}>
            <Text style={styles.h2}>Saved schedules</Text>
            {savedSchedules.map((item) => (
              <BrutalistCard key={item.id} color={theme.colors.accent} rotate={0.4} style={styles.savedCard}>
                <Pressable onPress={() => openSaved(item.id)}>
                  <Text style={styles.savedTitle}>{item.title}</Text>
                  <Text style={styles.savedMeta}>{formatSavedDate(item.savedAt)}</Text>
                </Pressable>
                <Pressable
                  onPress={() => removeSavedSchedule(item.id)}
                  style={styles.removeTap}
                  hitSlop={12}
                >
                  <Text style={styles.removeText}>Remove</Text>
                </Pressable>
              </BrutalistCard>
            ))}
          </View>
        ) : null}

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    flexGrow: 1,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  title: {
    ...theme.typography.h1,
  },
  h2: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  h3: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.xs,
  },
  bodyMuted: {
    ...theme.typography.bodyBold,
    color: '#555',
  },
  hint: {
    ...theme.typography.bodyBold,
    color: '#666',
    marginTop: theme.spacing.lg,
  },
  createBtn: {
    paddingVertical: 20,
  },
  secondaryBtn: {
    paddingVertical: 18,
  },
  card: {
    padding: theme.spacing.xl,
  },
  block: {
    marginTop: theme.spacing.sm,
  },
  savedCard: {
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  savedTitle: {
    ...theme.typography.h3,
    fontSize: 18,
  },
  savedMeta: {
    ...theme.typography.caption,
    color: '#444',
    marginTop: 4,
  },
  removeTap: {
    paddingLeft: theme.spacing.md,
  },
  removeText: {
    ...theme.typography.bodyBold,
    color: theme.colors.danger,
    fontSize: 14,
  },
  spacer: {
    height: theme.spacing.xxl,
  },
});
