import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../utils/theme';
import BrutalistButton from '../components/BrutalistButton';
import BrutalistCard from '../components/BrutalistCard';
import PrepifyLogoBadge from '../components/PrepifyLogoBadge';
import { PlanContext } from '../context/PlanContext';

export default function InsightsScreen({ navigation }) {
  const { generatedPlan } = React.useContext(PlanContext);
  const statAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(statAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);

  const widthAnim = (percent) => statAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', `${percent}%`]
  });

  // Calculate stats for both timeline mode and legacy grouped mode.
  let totalAllocatedHours = 0;
  let totalTasks = 0;
  let completedTasks = 0;
  const subjectHours = {};

  if (generatedPlan) {
    generatedPlan.forEach((s) => {
      const isTimelineBlock = typeof s.time === 'string' && typeof s.task === 'string';
      if (isTimelineBlock) {
        totalAllocatedHours += 0.5;
        totalTasks += 1;
        if (s.done) completedTasks += 1;
        subjectHours[s.subject] = (subjectHours[s.subject] || 0) + 0.5;
        return;
      }

      const dur = parseFloat(s.duration) || 0;
      totalAllocatedHours += dur;
      if (s.subject) {
        subjectHours[s.subject] = (subjectHours[s.subject] || 0) + dur;
      }
      if (s.tasks) {
        totalTasks += s.tasks.length;
        completedTasks += s.tasks.filter(
          (t) => typeof t === 'object' && t && t.done === true
        ).length;
      }
    });
  }

  const completionPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const colors = [theme.colors.primary, theme.colors.secondary, theme.colors.accent, theme.colors.white];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <PrepifyLogoBadge size={46} onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Your Progress 📊</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.row}>
          <BrutalistCard color={theme.colors.accent} style={styles.statCard} rotate={0.5}>
            <Text style={styles.statLabel}>Total Hours</Text>
            <Text style={styles.statValue}>{totalAllocatedHours}</Text>
          </BrutalistCard>

          <BrutalistCard color={theme.colors.secondary} style={styles.statCard} rotate={-0.5}>
            <Text style={styles.statLabel}>Completion</Text>
            <Text style={styles.statValue}>{completionPercent}%</Text>
          </BrutalistCard>
        </View>

        <BrutalistCard color={theme.colors.white} style={styles.card}>
          <Text style={styles.h3}>Subject Distribution</Text>
          
          <View style={styles.barContainer}>
            {!generatedPlan || generatedPlan.length === 0 ? (
              <Text style={styles.barLabel}>No subjects added yet.</Text>
            ) : (
              Object.entries(subjectHours).map(([subject, dur], i) => {
                const percent =
                  totalAllocatedHours > 0 ? Math.round((dur / totalAllocatedHours) * 100) : 0;
                return (
                  <View key={`${subject}-${i}`}>
                    <View style={styles.barLabelRow}>
                      <Text style={styles.barLabel}>{subject}</Text>
                      <Text style={styles.barLabel}>{`${dur} hrs`}</Text>
                    </View>
                    <View style={styles.barBg}>
                      <Animated.View style={[styles.barFill, { width: widthAnim(percent), backgroundColor: colors[i % colors.length] }]} />
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </BrutalistCard>

        <BrutalistCard color={theme.colors.white} style={styles.card} rotate={0.5}>
          <Text style={styles.h3}>Weekly Consistency</Text>
          <View style={styles.daysRow}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <View 
                key={i} 
                style={[
                  styles.dayCircle, 
                  { backgroundColor: i < 4 ? theme.colors.primary : theme.colors.white }
                ]}
              >
                <Text style={styles.dayText}>{day}</Text>
              </View>
            ))}
          </View>
        </BrutalistCard>
        
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
    fontSize: 24,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  row: {
    marginBottom: theme.spacing.sm,
  },
  statCard: {
    width: '100%',
    minHeight: 130,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  statLabel: {
    ...theme.typography.bodyBold,
    marginBottom: theme.spacing.sm,
    fontSize: 20,
    textAlign: 'center',
  },
  statValue: {
    ...theme.typography.h1,
    fontSize: 56,
    lineHeight: 60,
    textAlign: 'center',
  },
  card: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
  },
  h3: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.md,
  },
  barContainer: {
    marginTop: theme.spacing.xs,
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  barLabel: {
    ...theme.typography.bodyBold,
  },
  barBg: {
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    borderWidth: 3,
    borderColor: theme.colors.text,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRightWidth: 3,
    borderRightColor: theme.colors.text,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xs,
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: theme.colors.text,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.brutalSmall,
  },
  dayText: {
    ...theme.typography.bodyBold,
    fontSize: 16,
  },
  spacer: {
    height: theme.spacing.xxl,
  }
});
