import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../utils/theme';
import BrutalistButton from '../components/BrutalistButton';
import BrutalistCard from '../components/BrutalistCard';
import PrepifyLogoBadge from '../components/PrepifyLogoBadge';
import { PlanContext } from '../context/PlanContext';

const CARD_COLORS = [
  theme.colors.white,
  theme.colors.accent,
  theme.colors.primary,
  theme.colors.secondary,
];

export default function PlanScreen({ navigation }) {
  const { generatedPlan, toggleTaskDone } = React.useContext(PlanContext);
  const totalBlocks = (generatedPlan || []).length;
  const uniqueSubjects = new Set((generatedPlan || []).map((b) => b.subject).filter(Boolean)).size;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <PrepifyLogoBadge size={46} onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Your plan</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {generatedPlan && generatedPlan.length > 0 ? (
          <>
            {generatedPlan.map((block, sIndex) => {
              const isDone = !!block.done;
              return (
                <BrutalistCard
                  key={block.id || `${block.time}-${sIndex}`}
                  rotate={sIndex % 2 === 0 ? 0.6 : -0.6}
                  color={CARD_COLORS[sIndex % CARD_COLORS.length]}
                  style={styles.timelineCard}
                >
                  <View style={styles.timelineHeader}>
                    <Text style={styles.timeText}>{block.time}</Text>
                    <Text style={styles.subjectText}>{block.subject}</Text>
                  </View>
                  <Pressable
                    onPress={() => toggleTaskDone(sIndex)}
                    style={({ pressed }) => [
                      styles.taskRow,
                      isDone && styles.taskRowDone,
                      pressed && styles.taskRowPressed,
                    ]}
                  >
                    <View style={[styles.checkbox, isDone && styles.checkboxChecked]}>
                      {isDone ? <Text style={styles.checkmark}>✓</Text> : null}
                    </View>
                    <Text style={[styles.taskText, isDone && styles.taskDone]}>{block.task}</Text>
                  </Pressable>
                </BrutalistCard>
              );
            })}
            <BrutalistCard color={theme.colors.white} rotate={-0.5} style={styles.insightsCard}>
              <Text style={styles.insightsTitle}>Insights</Text>
              <Text style={styles.insightsBody}>
                You have {totalBlocks} study slots across {uniqueSubjects} subjects today.
              </Text>
              <BrutalistButton
                title="Open Insights"
                color={theme.colors.secondary}
                onPress={() => navigation.navigate('Insights')}
                style={styles.insightsBtn}
              />
            </BrutalistCard>
          </>
        ) : (
          <Text style={styles.empty}>No plan yet. Generate one from the home flow.</Text>
        )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.lg,
  },
  backBtn: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    width: 80,
    marginBottom: 0,
  },
  title: {
    ...theme.typography.h2,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  empty: {
    ...theme.typography.bodyBold,
    color: '#555',
  },
  spacer: {
    height: theme.spacing.xxl,
  },
  insightsCard: {
    marginTop: theme.spacing.sm,
  },
  insightsTitle: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.xs,
  },
  insightsBody: {
    ...theme.typography.bodyBold,
    color: '#555',
    marginBottom: theme.spacing.md,
  },
  insightsBtn: {
    marginBottom: 0,
  },
  timelineCard: {
    padding: theme.spacing.md,
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  timeText: {
    ...theme.typography.bodyBold,
    fontSize: 14,
  },
  subjectText: {
    ...theme.typography.h3,
    fontSize: 18,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    borderWidth: theme.borders.width,
    borderColor: theme.borders.color,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
  },
  taskRowDone: {
    opacity: 0.85,
  },
  taskRowPressed: {
    opacity: 0.92,
  },
  checkbox: {
    width: 34,
    height: 34,
    borderWidth: 3,
    borderColor: theme.colors.text,
    borderRadius: 10,
    marginRight: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    ...theme.shadows.brutalSmall,
  },
  checkboxChecked: {
    backgroundColor: theme.colors.success,
  },
  checkmark: {
    fontSize: 20,
    fontWeight: '900',
    color: theme.colors.text,
    marginTop: -2,
  },
  taskText: {
    ...theme.typography.bodyBold,
    flex: 1,
  },
  taskDone: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
});
