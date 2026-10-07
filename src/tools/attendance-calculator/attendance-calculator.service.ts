export interface AttendanceResult {
  attendanceRate: number
  maximumAbsences: number
  remainingAbsences: number
  isOverLimit: boolean
}

export function calculateAttendance(totalSessions: number, absences: number, requiredRate: number): AttendanceResult | undefined {
  if (!Number.isInteger(totalSessions) || totalSessions <= 0
    || !Number.isInteger(absences) || absences < 0 || absences > totalSessions
    || !Number.isFinite(requiredRate) || requiredRate < 0 || requiredRate > 100) {
    return undefined;
  }

  const maximumAbsences = Math.floor(totalSessions * (1 - requiredRate / 100) + 1e-9);
  const remainingAbsences = maximumAbsences - absences;

  return {
    attendanceRate: ((totalSessions - absences) / totalSessions) * 100,
    maximumAbsences,
    remainingAbsences: Math.max(0, remainingAbsences),
    isOverLimit: remainingAbsences < 0,
  };
}
