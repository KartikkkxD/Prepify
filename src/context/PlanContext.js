import React, { createContext, useCallback, useMemo, useState } from 'react';

const newSubjectId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export function createEmptySubject() {
  return { id: newSubjectId(), name: '', examDate: '', priority: 'medium' };
}

export function createEmptyScheduleInputs() {
  return {
    subjects: [createEmptySubject()],
    dailyStudyHours: '4',
    energyType: 'morning',
  };
}

/** @typedef {{ id: string, title: string, savedAt: string, scheduleInputs: object, generatedPlan: object[] }} SavedSchedule */

export const PlanContext = createContext(null);

export function PlanProvider({ children }) {
  const [scheduleInputs, setScheduleInputs] = useState(createEmptyScheduleInputs);
  const [generatedPlan, setGeneratedPlan] = useState([]);
  /** @type {[SavedSchedule[], function]} */
  const [savedSchedules, setSavedSchedules] = useState([]);

  const startNewScheduleFlow = useCallback(() => {
    setGeneratedPlan([]);
    setScheduleInputs(createEmptyScheduleInputs());
  }, []);

  const addSavedSchedule = useCallback(({ title, scheduleInputs: inputs, generatedPlan: plan }) => {
    const entry = {
      id: newSubjectId(),
      title: title || 'Saved plan',
      savedAt: new Date().toISOString(),
      scheduleInputs: JSON.parse(JSON.stringify(inputs)),
      generatedPlan: JSON.parse(JSON.stringify(plan)),
    };
    setSavedSchedules((prev) => [entry, ...prev]);
  }, []);

  const removeSavedSchedule = useCallback((id) => {
    setSavedSchedules((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const loadSavedSchedule = useCallback(
    (id, list) => {
      const source = list ?? savedSchedules;
      const found = source.find((s) => s.id === id);
      if (!found) return;
      setScheduleInputs(JSON.parse(JSON.stringify(found.scheduleInputs)));
      setGeneratedPlan(JSON.parse(JSON.stringify(found.generatedPlan)));
    },
    [savedSchedules]
  );

  const toggleTaskDone = useCallback((subjectIndex, taskIndex) => {
    setGeneratedPlan((prevPlan) => {
      const next = [...prevPlan];
      const block = { ...next[subjectIndex] };

      // Timeline mode: each block is a single task row.
      if (typeof taskIndex !== 'number') {
        block.done = !block.done;
        next[subjectIndex] = block;
        return next;
      }

      // Legacy mode: grouped tasks under subject blocks.
      const tasks = [...(block.tasks || [])];
      const raw = tasks[taskIndex];
      if (typeof raw === 'string') {
        tasks[taskIndex] = { title: raw, done: true };
      } else if (raw && typeof raw === 'object') {
        tasks[taskIndex] = { ...raw, done: !raw.done };
      }
      block.tasks = tasks;
      next[subjectIndex] = block;
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      scheduleInputs,
      setScheduleInputs,
      generatedPlan,
      setGeneratedPlan,
      toggleTaskDone,
      savedSchedules,
      addSavedSchedule,
      removeSavedSchedule,
      loadSavedSchedule,
      startNewScheduleFlow,
    }),
    [
      scheduleInputs,
      generatedPlan,
      toggleTaskDone,
      savedSchedules,
      addSavedSchedule,
      removeSavedSchedule,
      loadSavedSchedule,
      startNewScheduleFlow,
    ]
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}
