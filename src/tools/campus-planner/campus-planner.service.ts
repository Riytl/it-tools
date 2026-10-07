import { differenceInCalendarDays, isValid, parseISO, startOfDay } from 'date-fns';

export interface PlannerItem {
  id: string
  title: string
  category: 'exam' | 'assignment' | 'event'
  dueDate: string
  completed: boolean
}

export function daysUntil(date: string, now = new Date()) {
  const dueDate = parseISO(date);
  if (!isValid(dueDate)) {
    return undefined;
  }
  return differenceInCalendarDays(startOfDay(dueDate), startOfDay(now));
}
