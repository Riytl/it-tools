<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { Course, WeekPattern } from './campus-gap-assistant.service';
import { findCourseConflicts, findFreeSlots } from './campus-gap-assistant.service';

const { t } = useI18n();

const courses = useStorage<Course[]>('campus-gap-assistant:courses', []);
const selectedWeek = ref(1);
const selectedDay = ref(1);
const minimumFreePeriods = ref(2);

const courseName = ref('');
const courseDay = ref(1);
const startPeriod = ref(1);
const endPeriod = ref(2);
const startWeek = ref(1);
const endWeek = ref(16);
const weekPattern = ref<WeekPattern>('all');
const formError = ref('');

const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const dayOptions = computed(() => dayKeys.map((day, index) => ({
  label: t(`tools.campus-gap-assistant.days.${day}`),
  value: index + 1,
})));

const weekPatternOptions = computed<Array<{ label: string, value: WeekPattern }>>(() => [
  { label: t('tools.campus-gap-assistant.patterns.all'), value: 'all' },
  { label: t('tools.campus-gap-assistant.patterns.odd'), value: 'odd' },
  { label: t('tools.campus-gap-assistant.patterns.even'), value: 'even' },
]);

const currentConflicts = computed(() => findCourseConflicts(courses.value, selectedWeek.value)
  .filter(conflict => conflict.day === selectedDay.value));

const freeSlots = computed(() => findFreeSlots(
  courses.value,
  selectedDay.value,
  selectedWeek.value,
  12,
  minimumFreePeriods.value,
));

const sortedCourses = computed(() => [...courses.value].sort((a, b) =>
  a.day - b.day || a.startWeek - b.startWeek || a.startPeriod - b.startPeriod,
));

function dayLabel(day: number) {
  return dayOptions.value.find(option => option.value === day)?.label ?? '';
}

function periodLabel(start: number, end: number) {
  return start === end
    ? t('tools.campus-gap-assistant.singlePeriod', { period: start })
    : t('tools.campus-gap-assistant.periodRange', { start, end });
}

function firstActiveWeek() {
  for (let week = startWeek.value; week <= endWeek.value; week++) {
    if (weekPattern.value === 'all'
      || (weekPattern.value === 'odd' && week % 2 === 1)
      || (weekPattern.value === 'even' && week % 2 === 0)) {
      return week;
    }
  }

  return undefined;
}

function addCourse() {
  const name = courseName.value.trim();

  if (!name) {
    formError.value = t('tools.campus-gap-assistant.errors.name');
    return;
  }

  if (startPeriod.value > endPeriod.value) {
    formError.value = t('tools.campus-gap-assistant.errors.periods');
    return;
  }

  if (startWeek.value > endWeek.value) {
    formError.value = t('tools.campus-gap-assistant.errors.weeks');
    return;
  }

  const activeWeek = firstActiveWeek();
  if (activeWeek === undefined) {
    formError.value = t('tools.campus-gap-assistant.errors.weekPattern');
    return;
  }

  courses.value.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name,
    day: courseDay.value,
    startPeriod: startPeriod.value,
    endPeriod: endPeriod.value,
    startWeek: startWeek.value,
    endWeek: endWeek.value,
    weekPattern: weekPattern.value,
  });

  selectedDay.value = courseDay.value;
  selectedWeek.value = activeWeek;
  courseName.value = '';
  formError.value = '';
}

function removeCourse(id: string) {
  courses.value = courses.value.filter(course => course.id !== id);
}

function loadSample() {
  if (courses.value.length > 0) {
    return;
  }

  courses.value = [
    {
      id: 'sample-math',
      name: t('tools.campus-gap-assistant.sampleMath'),
      day: 1,
      startPeriod: 1,
      endPeriod: 2,
      startWeek: 1,
      endWeek: 16,
      weekPattern: 'all',
    },
    {
      id: 'sample-english',
      name: t('tools.campus-gap-assistant.sampleEnglish'),
      day: 1,
      startPeriod: 2,
      endPeriod: 3,
      startWeek: 1,
      endWeek: 16,
      weekPattern: 'all',
    },
    {
      id: 'sample-lab',
      name: t('tools.campus-gap-assistant.sampleLab'),
      day: 3,
      startPeriod: 5,
      endPeriod: 6,
      startWeek: 1,
      endWeek: 16,
      weekPattern: 'odd',
    },
  ];
}
</script>

<template>
  <div class="campus-gap-assistant">
    <c-card mb-4>
      <h2 class="section-title">
        {{ t('tools.campus-gap-assistant.heading') }}
      </h2>
      <p class="intro-text">
        {{ t('tools.campus-gap-assistant.intro') }}
      </p>
      <p class="privacy-note">
        {{ t('tools.campus-gap-assistant.privacy') }}
      </p>
    </c-card>

    <c-card mb-4>
      <div class="query-controls">
        <n-form-item :label="t('tools.campus-gap-assistant.week')">
          <n-input-number v-model:value="selectedWeek" :min="1" :max="20" w-full />
        </n-form-item>
        <n-form-item :label="t('tools.campus-gap-assistant.day')">
          <n-select v-model:value="selectedDay" :options="dayOptions" />
        </n-form-item>
        <n-form-item :label="t('tools.campus-gap-assistant.minimumFreePeriods')">
          <n-input-number v-model:value="minimumFreePeriods" :min="1" :max="12" w-full />
        </n-form-item>
      </div>

      <n-alert v-if="currentConflicts.length" type="warning" :title="t('tools.campus-gap-assistant.conflictsFound')" mb-3>
        <ul class="result-list">
          <li v-for="(conflict, index) in currentConflicts" :key="`${conflict.first.id}-${conflict.second.id}-${index}`">
            {{ conflict.first.name }} · {{ conflict.second.name }} — {{ periodLabel(conflict.startPeriod, conflict.endPeriod) }}
          </li>
        </ul>
      </n-alert>
      <n-alert v-else type="success" :title="t('tools.campus-gap-assistant.noConflicts')" mb-3 />

      <div class="free-slots-heading">
        <h3>{{ t('tools.campus-gap-assistant.freeSlots') }}</h3>
        <span>{{ dayLabel(selectedDay) }} · {{ t('tools.campus-gap-assistant.weekNumber', { week: selectedWeek }) }}</span>
      </div>
      <div v-if="freeSlots.length" class="free-slots">
        <n-tag v-for="slot in freeSlots" :key="`${slot.startPeriod}-${slot.endPeriod}`" type="success" size="large">
          {{ periodLabel(slot.startPeriod, slot.endPeriod) }}
        </n-tag>
      </div>
      <p v-else class="muted-text">
        {{ t('tools.campus-gap-assistant.noFreeSlots') }}
      </p>
    </c-card>

    <c-card mb-4>
      <h3 class="section-title">
        {{ t('tools.campus-gap-assistant.addCourse') }}
      </h3>
      <div class="course-form">
        <n-form-item :label="t('tools.campus-gap-assistant.courseName')" class="course-name-field">
          <n-input v-model:value="courseName" :placeholder="t('tools.campus-gap-assistant.courseNamePlaceholder')" @keyup.enter="addCourse" />
        </n-form-item>
        <n-form-item :label="t('tools.campus-gap-assistant.day')">
          <n-select v-model:value="courseDay" :options="dayOptions" />
        </n-form-item>
        <n-form-item :label="t('tools.campus-gap-assistant.startPeriod')">
          <n-input-number v-model:value="startPeriod" :min="1" :max="12" w-full />
        </n-form-item>
        <n-form-item :label="t('tools.campus-gap-assistant.endPeriod')">
          <n-input-number v-model:value="endPeriod" :min="1" :max="12" w-full />
        </n-form-item>
        <n-form-item :label="t('tools.campus-gap-assistant.startWeek')">
          <n-input-number v-model:value="startWeek" :min="1" :max="20" w-full />
        </n-form-item>
        <n-form-item :label="t('tools.campus-gap-assistant.endWeek')">
          <n-input-number v-model:value="endWeek" :min="1" :max="20" w-full />
        </n-form-item>
        <n-form-item :label="t('tools.campus-gap-assistant.weekPattern')">
          <n-select v-model:value="weekPattern" :options="weekPatternOptions" />
        </n-form-item>
      </div>

      <n-alert v-if="formError" type="error" mb-3>
        {{ formError }}
      </n-alert>

      <div class="form-actions">
        <c-button type="primary" @click="addCourse">
          {{ t('tools.campus-gap-assistant.addCourseButton') }}
        </c-button>
        <c-button v-if="courses.length === 0" @click="loadSample">
          {{ t('tools.campus-gap-assistant.loadSample') }}
        </c-button>
      </div>
    </c-card>

    <c-card>
      <div class="free-slots-heading">
        <h3>{{ t('tools.campus-gap-assistant.courseList') }}</h3>
        <span>{{ t('tools.campus-gap-assistant.courseCount', { count: courses.length }) }}</span>
      </div>

      <p v-if="courses.length === 0" class="muted-text">
        {{ t('tools.campus-gap-assistant.emptyState') }}
      </p>
      <ul v-else class="course-list">
        <li v-for="course in sortedCourses" :key="course.id" class="course-row">
          <div class="course-details">
            <strong>{{ course.name }}</strong>
            <span>
              {{ dayLabel(course.day) }} · {{ periodLabel(course.startPeriod, course.endPeriod) }} ·
              {{ t('tools.campus-gap-assistant.weeksRange', { start: course.startWeek, end: course.endWeek }) }} ·
              {{ t(`tools.campus-gap-assistant.patterns.${course.weekPattern}`) }}
            </span>
          </div>
          <c-button size="small" @click="removeCourse(course.id)">
            {{ t('tools.campus-gap-assistant.remove') }}
          </c-button>
        </li>
      </ul>
    </c-card>
  </div>
</template>

<style lang="less" scoped>
.campus-gap-assistant {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
}

.section-title,
.free-slots-heading h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.intro-text,
.muted-text {
  margin: 0.5rem 0 0;
  opacity: 0.75;
}

.privacy-note {
  margin: 0.75rem 0 0;
  color: #16804a;
  font-size: 0.9rem;
}

.query-controls,
.course-form {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 0 1rem;
}

.free-slots-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  margin: 0.25rem 0 0.75rem;
}

.free-slots-heading span,
.course-details span {
  opacity: 0.7;
  font-size: 0.9rem;
}

.free-slots {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.result-list {
  margin: 0;
  padding-left: 1.25rem;
}

.form-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.course-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.course-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(128, 128, 128, 0.2);
}

.course-row:last-child {
  border-bottom: 0;
}

.course-details {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}

@media (min-width: 640px) {
  .query-controls {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .course-form {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .course-name-field {
    grid-column: span 2;
  }
}
</style>
