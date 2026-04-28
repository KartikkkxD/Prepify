const PRIORITY_MULTIPLIER = {
  low: 0.8,
  medium: 1,
  high: 1.3,
};

const TASK_POOL = [
  'Revise concepts',
  'Solve problems',
  'Flashcards',
  'Mock test',
  'Review mistakes',
];

function daysUntil(examDate) {
  const target = new Date(examDate);
  if (Number.isNaN(target.getTime())) return 30;
  const diffMs = target.getTime() - Date.now();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(1, days);
}

function normalizePriority(priority) {
  const p = String(priority || 'medium').toLowerCase();
  return PRIORITY_MULTIPLIER[p] ?? PRIORITY_MULTIPLIER.medium;
}

function buildSummary(sortedSubjects) {
  if (!sortedSubjects.length) return 'Balanced study plan ready 💪';
  return `Focus more on ${sortedSubjects[0].name} today ⚠️`;
}

function formatLabel(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = ((h + 11) % 12) + 1;
  return `${hour12}:${String(m).padStart(2, '0')} ${suffix}`;
}

function slotLabel(startMinutes) {
  const end = startMinutes + 30;
  return `${formatLabel(startMinutes)} - ${formatLabel(end)}`;
}

function buildSlotCounts(scoredSubjects, totalBlocks) {
  const totalPriority = scoredSubjects.reduce((acc, s) => acc + s.priorityScore, 0) || 1;
  const counts = scoredSubjects.map((s) => ({
    ...s,
    blocks: Math.max(1, Math.floor((s.priorityScore / totalPriority) * totalBlocks)),
  }));

  let assigned = counts.reduce((sum, s) => sum + s.blocks, 0);
  while (assigned < totalBlocks) {
    counts.sort((a, b) => b.priorityScore - a.priorityScore);
    counts[0].blocks += 1;
    assigned += 1;
  }
  while (assigned > totalBlocks) {
    counts.sort((a, b) => a.priorityScore - b.priorityScore);
    const candidate = counts.find((s) => s.blocks > 1);
    if (!candidate) break;
    candidate.blocks -= 1;
    assigned -= 1;
  }

  return counts;
}

function buildSubjectQueue(slotCounts, energyType) {
  let ordered = [...slotCounts].sort((a, b) => b.priorityScore - a.priorityScore);
  if (energyType === 'night') {
    ordered = ordered.reverse();
  }
  const queue = [];
  ordered.forEach((s) => {
    for (let i = 0; i < s.blocks; i += 1) queue.push(s.name);
  });
  return queue;
}

function getStartMinutesForEnergy(energyType) {
  // Morning plans start at 7:00 AM, night plans start at 6:00 PM.
  return energyType === 'night' ? 18 * 60 : 7 * 60;
}

export function generateLocalPlan(inputs) {
  const subjects = Array.isArray(inputs?.subjects) ? inputs.subjects : [];
  const dailyStudyHours = Number(inputs?.dailyStudyHours) || 1;
  const energyType = String(inputs?.energyType || 'morning').toLowerCase();

  if (subjects.length === 0) {
    return { plan: [], summary: 'No subjects added.' };
  }

  const scored = subjects.map((subject) => {
    const daysRemaining = daysUntil(subject.examDate);
    const priorityMultiplier = normalizePriority(subject.priority);
    const priorityScore = (1 / daysRemaining) * priorityMultiplier;
    return { ...subject, priorityScore };
  });

  const totalBlocks = Math.max(1, Math.round(dailyStudyHours * 2));
  const slotCounts = buildSlotCounts(scored, totalBlocks);
  const queue = buildSubjectQueue(slotCounts, energyType);

  // Rotate the task pool differently each run for variation.
  const taskOffset = Math.floor(Math.random() * TASK_POOL.length);
  const startBaseMinutes = getStartMinutesForEnergy(energyType);
  const plan = Array.from({ length: totalBlocks }, (_, index) => {
    const subject = queue[index % queue.length];
    const taskTemplate = TASK_POOL[(index + taskOffset) % TASK_POOL.length];
    const startMinutes = startBaseMinutes + index * 30;
    return {
      time: slotLabel(startMinutes),
      subject,
      task: `${taskTemplate} for ${subject}`,
    };
  });

  const sortedForSummary = [...scored].sort((a, b) => b.priorityScore - a.priorityScore);

  return {
    plan,
    summary: buildSummary(sortedForSummary),
  };
}

