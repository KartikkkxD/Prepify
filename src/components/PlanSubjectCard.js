import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import BrutalistCard from './BrutalistCard';
import { theme } from '../utils/theme';

function taskTitle(task) {
  if (typeof task === 'string') return task;
  if (task && typeof task === 'object' && task.title != null) return String(task.title);
  return '';
}

function isTaskDone(task) {
  return typeof task === 'object' && task && task.done === true;
}

export default function PlanSubjectCard({
  subject,
  duration,
  tasks = [],
  subjectIndex,
  rotate = 0,
  color = theme.colors.white,
  onToggleTask,
}) {
  return (
    <BrutalistCard color={color} rotate={rotate} style={styles.card}>
      <Text style={styles.subject}>{subject}</Text>
      <Text style={styles.duration}>{duration}</Text>
      <View style={styles.divider} />
      {tasks.map((task, index) => {
        const title = taskTitle(task);
        const done = isTaskDone(task);
        return (
          <Pressable
            key={index}
            onPress={() => onToggleTask?.(subjectIndex, index)}
            style={({ pressed }) => [
              styles.taskRow,
              done && styles.taskRowDone,
              pressed && styles.taskRowPressed,
            ]}
          >
            <View style={[styles.checkbox, done && styles.checkboxChecked]}>
              {done ? <Text style={styles.checkmark}>✓</Text> : null}
            </View>
            <Text style={[styles.taskText, done && styles.taskTextDone]}>{title}</Text>
          </Pressable>
        );
      })}
    </BrutalistCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: theme.spacing.lg,
  },
  subject: {
    ...theme.typography.h2,
    fontSize: 22,
    marginBottom: theme.spacing.xs,
  },
  duration: {
    ...theme.typography.bodyBold,
    color: '#444',
    marginBottom: theme.spacing.sm,
  },
  divider: {
    height: 3,
    backgroundColor: theme.borders.color,
    marginBottom: theme.spacing.md,
    borderRadius: 2,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
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
    width: 36,
    height: 36,
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
    lineHeight: 22,
  },
  taskTextDone: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
});
