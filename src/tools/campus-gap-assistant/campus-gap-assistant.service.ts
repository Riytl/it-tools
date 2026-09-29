export type WeekPattern = 'all' | 'odd' | 'even';

export interface Course {
  id: string
  name: string
  day: number
  startPeriod: number
  endPeriod: number
  startWeek: number
  endWeek: number
  weekPattern: WeekPattern
}

export interface CourseConflict {
  day: number
  startPeriod: number
  endPeriod: number
  first: Course
  second: Course
}

export interface FreeSlot {
  startPeriod: number
  endPeriod: number
}

export function isCourseActiveInWeek(course: Course, week: number) {
  if (week < course.startWeek || week > course.endWeek) {
    return false;
  }

  if (course.weekPattern === 'odd') {
    return week % 2 === 1;
  }

  if (course.weekPattern === 'even') {
    return week % 2 === 0;
  }

  return true;
}

export function findCourseConflicts(courses: Course[], week: number): CourseConflict[] {
  const activeCourses = courses
    .filter(course => isCourseActiveInWeek(course, week))
    .sort((a, b) => a.day - b.day || a.startPeriod - b.startPeriod);
  const conflicts: CourseConflict[] = [];

  for (let firstIndex = 0; firstIndex < activeCourses.length; firstIndex++) {
    const first = activeCourses[firstIndex];

    for (let secondIndex = firstIndex + 1; secondIndex < activeCourses.length; secondIndex++) {
      const second = activeCourses[secondIndex];

      if (second.day !== first.day) {
        if (second.day > first.day) {
          break;
        }
        continue;
      }

      if (second.startPeriod > first.endPeriod) {
        break;
      }

      const startPeriod = Math.max(first.startPeriod, second.startPeriod);
      const endPeriod = Math.min(first.endPeriod, second.endPeriod);

      if (startPeriod <= endPeriod) {
        conflicts.push({
          day: first.day,
          startPeriod,
          endPeriod,
          first,
          second,
        });
      }
    }
  }

  return conflicts;
}

export function findFreeSlots(
  courses: Course[],
  day: number,
  week: number,
  periodsPerDay = 12,
  minimumLength = 1,
): FreeSlot[] {
  const occupied = Array.from({ length: periodsPerDay + 1 }, () => false);

  courses
    .filter(course => course.day === day && isCourseActiveInWeek(course, week))
    .forEach((course) => {
      const start = Math.max(1, course.startPeriod);
      const end = Math.min(periodsPerDay, course.endPeriod);

      for (let period = start; period <= end; period++) {
        occupied[period] = true;
      }
    });

  const slots: FreeSlot[] = [];
  let slotStart = 0;

  for (let period = 1; period <= periodsPerDay + 1; period++) {
    if (period <= periodsPerDay && !occupied[period]) {
      if (slotStart === 0) {
        slotStart = period;
      }
      continue;
    }

    if (slotStart !== 0) {
      const endPeriod = period - 1;
      if (endPeriod - slotStart + 1 >= minimumLength) {
        slots.push({ startPeriod: slotStart, endPeriod });
      }
      slotStart = 0;
    }
  }

  return slots;
}
