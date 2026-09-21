/** Frontenddagi mukofot hisoblash qoidalari */
export const ATTENDANCE_REWARD = {
  present: 500,
  absent: 0,
} as const;

export const HOMEWORK_REWARD = {
  full: 500,
  partial: 200,
  none: 0,
} as const;

export const LESSON_LOCK_HOURS = 24;

export function calcLessonReward(
  attendance: 'present' | 'absent',
  homework: 'full' | 'partial' | 'none',
  rewardsEnabled = true,
): { attendanceReward: number; homeworkReward: number; total: number } {
  if (!rewardsEnabled) {
    return { attendanceReward: 0, homeworkReward: 0, total: 0 };
  }
  const attendanceReward = ATTENDANCE_REWARD[attendance];
  const homeworkReward =
    attendance === 'present' ? HOMEWORK_REWARD[homework] : 0;
  return {
    attendanceReward,
    homeworkReward,
    total: attendanceReward + homeworkReward,
  };
}

export function calcExamReward(score: number): number {
  if (score < 30) return 0;
  if (score < 50) return 1000;
  if (score < 70) return 2000;
  if (score < 90) return 3000;
  return 5000;
}
