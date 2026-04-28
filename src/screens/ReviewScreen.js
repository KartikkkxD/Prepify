import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../utils/theme';
import BrutalistButton from '../components/BrutalistButton';
import BrutalistCard from '../components/BrutalistCard';
import PrepifyLogoBadge from '../components/PrepifyLogoBadge';
import { PlanContext } from '../context/PlanContext';

export default function ReviewScreen({ navigation }) {
  const { scheduleInputs } = useContext(PlanContext);

  const handleGenerate = () => {
    navigation.navigate('Loading');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <PrepifyLogoBadge size={46} onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Review Plan</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Does this look correct?</Text>

        <BrutalistCard color={theme.colors.white} rotate={0.5}>
          <Text style={styles.sectionTitle}>Subjects</Text>
          {scheduleInputs.subjects.map((sub) => (
            <View key={sub.id} style={styles.subjectRow}>
              <View style={styles.subjectLeft}>
                <Text style={styles.boldText}>• {sub.name}</Text>
                <Text style={styles.priorityPill}>{sub.priority || 'medium'}</Text>
              </View>
              <Text style={styles.dateText}>{sub.examDate}</Text>
            </View>
          ))}
        </BrutalistCard>

        <BrutalistCard color={theme.colors.accent} rotate={-1}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.subjectRow}>
            <Text style={styles.boldText}>Daily Hours:</Text>
            <Text style={styles.dateText}>{scheduleInputs.dailyStudyHours} hrs</Text>
          </View>
          <View style={styles.subjectRow}>
            <Text style={styles.boldText}>Energy Profile:</Text>
            <Text style={styles.dateText}>{scheduleInputs.energyType}</Text>
          </View>
        </BrutalistCard>

        <View style={styles.spacer} />
        
        <BrutalistButton 
          title="Generate Plan ⚡" 
          color={theme.colors.danger} 
          onPress={handleGenerate}
          style={styles.cta}
          textStyle={{ color: theme.colors.white, fontSize: 20 }}
        />
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
  },
  subtitle: {
    ...theme.typography.bodyBold,
    marginBottom: theme.spacing.xl,
    color: '#666',
  },
  sectionTitle: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.md,
    textDecorationLine: 'underline',
  },
  subjectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  subjectLeft: {
    flex: 1,
    paddingRight: theme.spacing.sm,
  },
  priorityPill: {
    ...theme.typography.caption,
    marginTop: 4,
    textTransform: 'capitalize',
    color: '#555',
  },
  boldText: {
    ...theme.typography.bodyBold,
  },
  dateText: {
    ...theme.typography.bodyBold,
    color: '#555',
  },
  spacer: {
    height: theme.spacing.xxl,
  },
  cta: {
    paddingVertical: 20,
  }
});
