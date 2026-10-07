import { addWeeks, format, isValid, parseISO } from 'date-fns';

export interface DutyAssignment {
  week: number
  date: string
  assignments: Array<{ task: string, member: string }>
}

export function generateDutyRotation(members: string[], tasks: string[], startDate: string, weeks: number): DutyAssignment[] | undefined {
  const start = parseISO(startDate);
  const uniqueMembers = [...new Set(members.map(name => name.trim()).filter(Boolean))];
  const uniqueTasks = [...new Set(tasks.map(task => task.trim()).filter(Boolean))];

  if (!isValid(start) || uniqueMembers.length === 0 || uniqueTasks.length === 0 || !Number.isInteger(weeks) || weeks < 1 || weeks > 52) {
    return undefined;
  }

  return Array.from({ length: weeks }, (_, index) => ({
    week: index + 1,
    date: format(addWeeks(start, index), 'yyyy-MM-dd'),
    assignments: uniqueTasks.map((task, taskIndex) => ({
      task,
      member: uniqueMembers[(index + taskIndex) % uniqueMembers.length],
    })),
  }));
}
