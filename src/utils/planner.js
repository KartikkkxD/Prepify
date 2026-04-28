export function calculatePriority(examDateStr) {
  if (!examDateStr) return 1;
  
  // Try to parse the date. If invalid, give a default priority.
  const exam = new Date(examDateStr);
  if (isNaN(exam.getTime())) {
    // If user typed something like "Next month", fallback to 30 days
    return 1 / 30;
  }
  
  const today = new Date();
  const diffTime = exam - today;
  let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 1) diffDays = 1;
  return 1 / diffDays;
}

export function sortSubjects(subjectsWithPriority, energyType) {
  // sort descending by priority (hardest/closest first)
  let sorted = [...subjectsWithPriority].sort((a, b) => b.priority - a.priority);
  
  if (energyType && energyType.toLowerCase() === 'night') {
    // Reverse for night owls if we want to tackle easier/farther things first?
    // Wait, requirement: "If energyType = 'night': reverse order"
    sorted.reverse();
  }
  
  return sorted;
}

export function allocateTime(sortedSubjects, dailyStudyHours) {
  if (sortedSubjects.length === 0) return [];
  
  const totalPriority = sortedSubjects.reduce((sum, s) => sum + s.priority, 0);
  
  return sortedSubjects.map(s => {
    let allocated = Math.round((s.priority / totalPriority) * dailyStudyHours);
    if (allocated < 1) allocated = 1; // Very low hours -> minimum 1 hour/task
    return { ...s, allocatedHours: allocated };
  });
}

const TEMPLATES = [
  "Revise core concepts",
  "Practice problems",
  "Solve past questions",
  "Take a mock test",
  "Read chapter summaries",
  "Create flashcards"
];

export function generateTasks(subjectName) {
  const tasks = [];
  const numTasks = Math.floor(Math.random() * 2) + 2; // 2 or 3
  
  // Shuffle templates
  const shuffled = [...TEMPLATES].sort(() => 0.5 - Math.random());
  
  for (let i = 0; i < numTasks; i++) {
    tasks.push({ 
      id: Math.random().toString(36).substring(7), 
      title: shuffled[i], 
      done: false 
    });
  }
  
  return tasks;
}

export function generateDailyPlan(subjectsInput, dailyStudyHours, energyType) {
  if (!subjectsInput || subjectsInput.length === 0) {
    return { plan: [], summary: "No subjects added." };
  }

  // 1. Priority Calculation
  const subjectsWithPriority = subjectsInput.map(s => ({
    ...s,
    priority: calculatePriority(s.examDate)
  }));

  // 2. Sort Subjects
  const sorted = sortSubjects(subjectsWithPriority, energyType);

  // 3. Time Allocation
  const hours = parseFloat(dailyStudyHours) || 1;
  const allocated = allocateTime(sorted, hours);

  // 4 & 5. Task Generation & Build Daily Plan
  const plan = allocated.map(s => ({
    id: Math.random().toString(36).substring(7),
    subject: s.name,
    duration: s.allocatedHours,
    tasks: generateTasks(s.name)
  }));

  // 7. Add Summary Message
  let summary = "Balanced study plan ready 💪";
  if (sorted.length > 1 && sorted[0].priority > sorted[1].priority * 1.5) {
    summary = `Focus more on ${sorted[0].name} today ⚠️`;
  } else if (sorted.length === 1) {
    summary = `Focus fully on ${sorted[0].name} today ⚠️`;
  }

  return { plan, summary };
}
