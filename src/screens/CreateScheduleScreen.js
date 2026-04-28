import React, { useContext, useEffect, useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  LayoutAnimation,
  UIManager,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../utils/theme';
import BrutalistButton from '../components/BrutalistButton';
import BrutalistCard from '../components/BrutalistCard';
import PrepifyLogoBadge from '../components/PrepifyLogoBadge';
import BrutalistInput from '../components/BrutalistInput';
import SubjectScheduleSection, {
  parseDateOnly,
  isExamDateAllowed,
} from '../components/SubjectScheduleSection';
import { PlanContext, createEmptySubject } from '../context/PlanContext';

function makeSubjectRow() {
  return { ...createEmptySubject() };
}

function buildInitialRows(scheduleInputs) {
  const list =
    scheduleInputs.subjects?.length > 0 ? scheduleInputs.subjects : [createEmptySubject()];
  const n = Math.min(10, Math.max(1, list.length));
  const subjects = Array.from({ length: n }, (_, i) => {
    const s = list[i] || {};
    return {
      id: s.id || `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 9)}`,
      name: typeof s.name === 'string' ? s.name : '',
      examDate: typeof s.examDate === 'string' ? s.examDate : '',
      priority: ['low', 'medium', 'high'].includes(s.priority) ? s.priority : 'medium',
    };
  });
  return { subjectCount: n, subjects };
}

function validateSubjects(subjectCount, subjects) {
  if (!Array.isArray(subjects) || subjects.length !== subjectCount) {
    return 'Adjust the number of subjects or finish each section.';
  }
  for (let i = 0; i < subjects.length; i += 1) {
    const s = subjects[i];
    if (!s.name?.trim()) {
      return `Subject ${i + 1}: enter a name.`;
    }
    if (!s.examDate?.trim()) {
      return `Subject ${i + 1}: pick an exam date.`;
    }
    const d = parseDateOnly(s.examDate);
    if (!d) {
      return `Subject ${i + 1}: invalid exam date.`;
    }
    if (!isExamDateAllowed(d)) {
      return `Subject ${i + 1}: exam date cannot be in the past.`;
    }
  }
  return null;
}

function validateHours(hoursStr) {
  if (hoursStr == null || String(hoursStr).trim() === '') {
    return 'Enter daily study hours.';
  }
  const n = parseFloat(String(hoursStr).replace(',', '.'));
  if (Number.isNaN(n) || n <= 0) {
    return 'Enter a positive number for daily study hours.';
  }
  if (n > 24) {
    return 'Daily study hours cannot exceed 24.';
  }
  return null;
}

function AnimatedSection({ delay, children }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 320,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 320,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, opacity, translateY]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>{children}</Animated.View>
  );
}

export default function CreateScheduleScreen({ navigation }) {
  const { scheduleInputs, setScheduleInputs } = useContext(PlanContext);

  const seedRef = useRef(buildInitialRows(scheduleInputs));
  const [subjectCount, setSubjectCount] = useState(seedRef.current.subjectCount);
  const [subjects, setSubjects] = useState(seedRef.current.subjects);

  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSubjects((prev) => {
      const next = prev.slice(0, subjectCount);
      while (next.length < subjectCount) {
        next.push(makeSubjectRow());
      }
      return next;
    });
  }, [subjectCount]);

  const updateSubject = (index, patch) => {
    setSubjects((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...patch };
      return copy;
    });
  };

  const bumpCount = (delta) => {
    setSubjectCount((c) => Math.min(10, Math.max(1, c + delta)));
  };

  const formError = useMemo(() => {
    const subjectErr = validateSubjects(subjectCount, subjects);
    if (subjectErr) return subjectErr;
    return validateHours(scheduleInputs.dailyStudyHours);
  }, [subjectCount, subjects, scheduleInputs.dailyStudyHours]);
  const canProceed = !formError;

  const handleNext = () => {
    if (!canProceed) return;
    setScheduleInputs({
      ...scheduleInputs,
      subjects: subjects.map((s) => ({
        id: s.id,
        name: s.name.trim(),
        examDate: s.examDate.trim(),
        priority: s.priority,
      })),
    });
    navigation.navigate('Review');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <PrepifyLogoBadge size={46} onPress={() => navigation.goBack()} />
          <Text style={styles.title}>New schedule</Text>
          <View style={{ width: 80 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.microcopy}>{"Let's build your plan ⚡"}</Text>

          <BrutalistCard color={theme.colors.accent} rotate={-0.5}>
            <Text style={styles.countQuestion}>How many subjects are you preparing for?</Text>
            <View style={styles.stepperRow}>
              <Pressable
                onPress={() => bumpCount(-1)}
                disabled={subjectCount <= 1}
                style={({ pressed }) => [
                  styles.stepperBtn,
                  subjectCount <= 1 && styles.stepperBtnDisabled,
                  pressed && subjectCount > 1 && styles.stepperBtnPressed,
                ]}
              >
                <Text style={[styles.stepperGlyph, subjectCount <= 1 && styles.stepperGlyphDisabled]}>-</Text>
              </Pressable>
              <View style={styles.countDisplay}>
                <Text style={styles.countNumber}>{subjectCount}</Text>
              </View>
              <Pressable
                onPress={() => bumpCount(1)}
                disabled={subjectCount >= 10}
                style={({ pressed }) => [
                  styles.stepperBtn,
                  subjectCount >= 10 && styles.stepperBtnDisabled,
                  pressed && subjectCount < 10 && styles.stepperBtnPressed,
                ]}
              >
                <Text style={[styles.stepperGlyph, subjectCount >= 10 && styles.stepperGlyphDisabled]}>+</Text>
              </Pressable>
            </View>
            <Text style={styles.countHint}>Between 1 and 10 subjects</Text>
          </BrutalistCard>

          {subjects.map((subject, index) => (
            <AnimatedSection key={subject.id} delay={index * 45}>
              <SubjectScheduleSection
                index={index}
                subject={subject}
                onChangeName={(text) => updateSubject(index, { name: text })}
                onChangeExamDate={(iso) => updateSubject(index, { examDate: iso })}
                onChangePriority={(priority) => updateSubject(index, { priority })}
              />
            </AnimatedSection>
          ))}

          <BrutalistCard color={theme.colors.secondary} rotate={-1}>
            <BrutalistInput
              label="Daily study hours"
              placeholder="e.g. 4"
              keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
              value={scheduleInputs.dailyStudyHours}
              onChangeText={(text) => setScheduleInputs({ ...scheduleInputs, dailyStudyHours: text })}
            />

            <Text style={styles.label}>Energy type</Text>
            <View style={styles.row}>
              <BrutalistButton
                title="Morning ☀️"
                color={scheduleInputs.energyType === 'morning' ? theme.colors.primary : theme.colors.white}
                style={styles.halfBtn}
                textStyle={{ fontSize: 12 }}
                onPress={() => setScheduleInputs({ ...scheduleInputs, energyType: 'morning' })}
              />
              <View style={{ width: theme.spacing.md }} />
              <BrutalistButton
                title="Night 🌙"
                color={scheduleInputs.energyType === 'night' ? theme.colors.primary : theme.colors.white}
                style={styles.halfBtn}
                textStyle={{ fontSize: 12 }}
                onPress={() => setScheduleInputs({ ...scheduleInputs, energyType: 'night' })}
              />
            </View>
          </BrutalistCard>

          {formError ? <Text style={styles.inlineError}>{formError}</Text> : null}

          <View style={styles.spacer} />

          <BrutalistButton
            title="Next"
            color={theme.colors.primary}
            onPress={handleNext}
            disabled={!canProceed}
            style={styles.cta}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
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
    flexGrow: 1,
  },
  microcopy: {
    ...theme.typography.bodyBold,
    marginBottom: theme.spacing.lg,
    color: '#555',
  },
  countQuestion: {
    ...theme.typography.bodyBold,
    marginBottom: theme.spacing.md,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  stepperBtn: {
    width: 56,
    height: 56,
    marginBottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: theme.borders.width,
    borderColor: theme.borders.color,
    borderRadius: theme.borders.radius,
    backgroundColor: theme.colors.white,
    ...theme.shadows.brutalSmall,
  },
  stepperBtnPressed: {
    opacity: 0.9,
  },
  stepperBtnDisabled: {
    backgroundColor: '#F2F2F2',
  },
  stepperGlyph: {
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '900',
    color: theme.colors.text,
    textAlign: 'center',
    includeFontPadding: false,
  },
  stepperGlyphDisabled: {
    color: '#666',
  },
  countDisplay: {
    minWidth: 64,
    marginHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderWidth: theme.borders.width,
    borderColor: theme.borders.color,
    borderRadius: theme.borders.radius,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
  },
  countNumber: {
    ...theme.typography.h2,
    fontSize: 28,
  },
  countHint: {
    ...theme.typography.caption,
    color: '#555',
  },
  label: {
    ...theme.typography.bodyBold,
    marginBottom: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfBtn: {
    flex: 1,
    marginBottom: 0,
  },
  inlineError: {
    ...theme.typography.bodyBold,
    color: theme.colors.danger,
    marginTop: theme.spacing.md,
  },
  spacer: {
    height: theme.spacing.xl,
  },
  cta: {
    marginBottom: theme.spacing.xxl,
    paddingVertical: 20,
  },
});
