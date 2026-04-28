import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Platform,
  Keyboard,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme } from '../utils/theme';
import BrutalistInput from './BrutalistInput';
import BrutalistButton from './BrutalistButton';
import BrutalistCard from './BrutalistCard';

export function getStartOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function formatDateOnly(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseDateOnly(str) {
  if (!str || typeof str !== 'string') return null;
  const p = str.trim().split('-');
  if (p.length !== 3) return null;
  const y = Number(p[0]);
  const mo = Number(p[1]);
  const da = Number(p[2]);
  if (!y || !mo || !da) return null;
  const out = new Date(y, mo - 1, da);
  if (Number.isNaN(out.getTime())) return null;
  return out;
}

export function isExamDateAllowed(date) {
  const t = getStartOfToday();
  const x = new Date(date);
  x.setHours(0, 0, 0, 0);
  return x >= t;
}

function displayLabel(iso) {
  if (!iso) return 'Choose exam date';
  const d = parseDateOnly(iso);
  if (!d) return iso;
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const PRIORITIES = [
  { key: 'low', label: 'Low' },
  { key: 'medium', label: 'Med' },
  { key: 'high', label: 'High' },
];

export default function SubjectScheduleSection({
  index,
  subject,
  onChangeName,
  onChangeExamDate,
  onChangePriority,
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [iosDraft, setIosDraft] = useState(() => getStartOfToday());

  const minimumDate = useMemo(() => getStartOfToday(), []);

  const openPicker = () => {
    Keyboard.dismiss();
    const base = parseDateOnly(subject.examDate);
    const initial = base && isExamDateAllowed(base) ? base : getStartOfToday();
    setIosDraft(initial);
    setPickerOpen(true);
  };

  const applyDate = (date) => {
    if (!date) return;
    const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    if (!isExamDateAllowed(normalized)) return;
    onChangeExamDate(formatDateOnly(normalized));
  };

  const onAndroidChange = (event, date) => {
    if (Platform.OS !== 'android') return;
    if (event.type === 'dismissed') {
      setPickerOpen(false);
      return;
    }
    if (date) applyDate(date);
    setPickerOpen(false);
  };

  const sectionTitle = `Subject ${index + 1}`;

  return (
    <BrutalistCard color={theme.colors.white} rotate={index % 2 === 0 ? 0.5 : -0.5}>
      <Text style={styles.sectionLabel}>{sectionTitle}</Text>

      <BrutalistInput
        label="Subject name"
        placeholder="e.g. Physics"
        value={subject.name}
        onChangeText={onChangeName}
      />

      <Text style={styles.fieldLabel}>Exam date</Text>
      {Platform.OS === 'web' ? (
        <BrutalistInput
          label="Date (YYYY-MM-DD)"
          placeholder="2026-05-01"
          value={subject.examDate}
          onChangeText={onChangeExamDate}
          containerStyle={{ marginBottom: theme.spacing.md }}
        />
      ) : (
        <>
          <Pressable onPress={openPicker} style={styles.dateTrigger}>
            <Text style={[styles.dateTriggerText, !subject.examDate && styles.datePlaceholder]}>
              {displayLabel(subject.examDate)}
            </Text>
            <Text style={styles.dateChevron}>▾</Text>
          </Pressable>
          {Platform.OS === 'android' && pickerOpen ? (
            <DateTimePicker
              value={parseDateOnly(subject.examDate) || getStartOfToday()}
              mode="date"
              display="default"
              minimumDate={minimumDate}
              onChange={onAndroidChange}
            />
          ) : null}
          {Platform.OS === 'ios' ? (
            <Modal visible={pickerOpen} animationType="slide" transparent>
              <View style={styles.modalRoot}>
                <Pressable style={styles.modalBackdrop} onPress={() => setPickerOpen(false)} />
                <View style={styles.modalSheet}>
                  <Text style={styles.modalTitle}>{sectionTitle}</Text>
                  <DateTimePicker
                    value={iosDraft}
                    mode="date"
                    display="inline"
                    minimumDate={minimumDate}
                    themeVariant="light"
                    onChange={(_, date) => {
                      if (date) setIosDraft(date);
                    }}
                    style={styles.iosPicker}
                  />
                  <BrutalistButton
                    title="Save date"
                    color={theme.colors.primary}
                    onPress={() => {
                      applyDate(iosDraft);
                      setPickerOpen(false);
                    }}
                  />
                  <BrutalistButton
                    title="Cancel"
                    color={theme.colors.white}
                    onPress={() => setPickerOpen(false)}
                    style={{ marginBottom: 0 }}
                  />
                </View>
              </View>
            </Modal>
          ) : null}
        </>
      )}

      <Text style={styles.fieldLabel}>Priority</Text>
      <View style={styles.priorityRow}>
        {PRIORITIES.map((p, i) => (
          <BrutalistButton
            key={p.key}
            title={p.label}
            color={subject.priority === p.key ? theme.colors.primary : theme.colors.white}
            style={[styles.priorityBtn, i < PRIORITIES.length - 1 && styles.priorityBtnSpacing]}
            textStyle={{ fontSize: 12 }}
            onPress={() => onChangePriority(p.key)}
          />
        ))}
      </View>
    </BrutalistCard>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.md,
  },
  fieldLabel: {
    ...theme.typography.bodyBold,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  dateTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: theme.borders.width,
    borderColor: theme.borders.color,
    borderRadius: theme.borders.radius,
    backgroundColor: theme.colors.background,
    ...theme.shadows.brutalSmall,
  },
  dateTriggerText: {
    ...theme.typography.bodyBold,
    flex: 1,
  },
  datePlaceholder: {
    color: '#888',
  },
  dateChevron: {
    fontSize: 16,
    fontWeight: '900',
  },
  priorityRow: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  priorityBtn: {
    flex: 1,
    marginBottom: 0,
    paddingVertical: theme.spacing.sm,
  },
  priorityBtnSpacing: {
    marginRight: theme.spacing.sm,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  modalSheet: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    borderTopWidth: theme.borders.width,
    borderColor: theme.borders.color,
    paddingBottom: theme.spacing.xl,
  },
  modalTitle: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.sm,
  },
  iosPicker: {
    alignSelf: 'stretch',
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: '#DADADA',
    borderRadius: 12,
    marginBottom: theme.spacing.md,
  },
});
