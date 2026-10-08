<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { makeCampusId } from '../campus-text';
import type { ClockCourse } from './timetable.service';
import { TimetableInputError, courseKey, exportTimetableCsv, findDailyFreeSlots, formatClockTime, makeClockCourse, makeDailyWindow, mergeCourseSessions, parseTimetableCsv, renderWeekTimetable } from './timetable.service';
import { useTimetableText } from './timetable.text';

const text = useTimetableText();
const { t } = useI18n();
const courses = useStorage<ClockCourse[]>('campus-gap-assistant:clock-courses:v1', []);
const name = ref('');
const day = ref(1);
const start = ref('09:00');
const end = ref('09:45');
const csv = ref('');
const error = ref('');
const success = ref('');
const windowInputs = useStorage('campus-gap-assistant:clock-windows:v1', Array.from({ length: 7 }, (_, index) => ({ day: index + 1, start: '08:00', end: '22:00' })));
const minimumMinutes = useStorage<number | null>('campus-gap-assistant:clock-minimum:v1', 30);
const gapMinutes = useStorage<number | null>('campus-gap-assistant:clock-merge:v1', 10);
const availability = computed(() => {
  try { return windowInputs.value.map(window => makeDailyWindow(window.day, window.start, window.end)); }
  catch { return undefined; }
});
const settingsValid = computed(() => availability.value?.length === 7
  && minimumMinutes.value !== null && Number.isInteger(minimumMinutes.value) && minimumMinutes.value >= 1 && minimumMinutes.value <= 1440
  && gapMinutes.value !== null && Number.isInteger(gapMinutes.value) && gapMinutes.value >= 0 && gapMinutes.value <= 60);
const mergedCourses = computed(() => mergeCourseSessions(courses.value, settingsValid.value ? gapMinutes.value! : 0));
const dailyFree = computed(() => settingsValid.value
  ? availability.value!.map(window => ({ day: window.day, slots: findDailyFreeSlots(courses.value, window, minimumMinutes.value!, gapMinutes.value!) }))
  : []);
const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const days = computed(() => dayKeys.map(key => t(`tools.campus-gap-assistant.days.${key}`)));
const dayOptions = computed(() => days.value.map((label, index) => ({ label, value: index + 1 })));
const weekText = computed(() => renderWeekTimetable(mergedCourses.value, days.value, text('empty')));
const { copy, copied } = useClipboard({ source: weekText });
const sortedCourses = mergedCourses;

function showError(cause: unknown) {
  error.value = cause instanceof TimetableInputError
    ? `${cause.row ? `${text('row')} ${cause.row}: ` : ''}${text(`err_${cause.code}`)}`
    : text('err_read');
  success.value = '';
}

function append(items: ClockCourse[]) {
  const keys = new Set(courses.value.map(courseKey));
  courses.value = [...courses.value, ...items.filter((item) => {
    const key = courseKey(item);
    if (keys.has(key)) return false;
    keys.add(key);
    return true;
  }).map(item => ({ ...item, id: makeCampusId('clock') }))];
  error.value = '';
}

function addCourse() {
  try {
    append([makeClockCourse({ name: name.value, day: day.value, start: start.value, end: end.value }, makeCampusId('clock'))]);
    name.value = ''; success.value = '';
  }
  catch (cause) { showError(cause); }
}

const exampleCsv = '课程名,星期几,开始时间,结束时间\n高等数学,1,09:00,09:45\n高等数学,1,09:55,10:40\n大学英语,3,14:00,15:30';

function importCsv() {
  try { append(parseTimetableCsv(csv.value)); success.value = text('imported'); }
  catch (cause) { showError(cause); }
}

async function readCsv(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  try {
    if (file.size > 1024 * 1024) throw new TimetableInputError('large');
    csv.value = await file.text();
    importCsv();
  }
  catch (cause) { showError(cause); }
  finally { input.value = ''; }
}

function downloadCsv(value: string, filename: string) {
  const url = URL.createObjectURL(new Blob(['\uFEFF', value], { type: 'text/csv;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = filename; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function copyWeek() {
  try { await copy(weekText.value); }
  catch { error.value = text('err_copy'); }
}
</script>

<template>
  <div class="clock-tool">
    <div class="clock-hero">
      <span class="eyebrow">CAMPUS / TIMETABLE</span>
      <h2>{{ text('title') }}</h2>
      <p>{{ text('intro') }}</p>
      <small>{{ text('privacy') }}</small>
    </div>

    <n-alert v-if="error" type="error" role="alert">{{ error }}</n-alert>

    <c-card>
      <div class="section-heading"><h3>{{ text('entry') }}</h3><n-tag type="info">{{ courses.length }} {{ text('count') }}</n-tag></div>
      <form class="clock-form" @submit.prevent="addCourse">
        <label class="name-field">{{ text('name') }}<n-input v-model:value="name" :placeholder="text('placeholder')" :maxlength="100" /></label>
        <label>{{ text('day') }}<n-select v-model:value="day" :options="dayOptions" /></label>
        <label>{{ text('start') }}<input v-model="start" type="time" required class="time-input"></label>
        <label>{{ text('end') }}<input v-model="end" type="time" required class="time-input"></label>
        <button type="submit" class="primary-button">{{ text('add') }}</button>
      </form>
      <div class="actions"><c-button v-if="!courses.length" @click="csv = exampleCsv; importCsv()">{{ text('sample') }}</c-button></div>
    </c-card>

    <c-card>
      <h3>{{ text('csvTitle') }}</h3>
      <p class="muted">{{ text('csvHint') }}</p>
      <div class="actions">
        <label class="file-button">{{ text('choose') }}<input type="file" accept=".csv,text/csv" class="visually-hidden" @change="readCsv"></label>
        <c-button @click="downloadCsv(exampleCsv, 'timetable-example.csv')">{{ text('template') }}</c-button>
        <c-button v-if="courses.length" @click="downloadCsv(exportTimetableCsv(courses), 'timetable.csv')">{{ text('export') }}</c-button>
      </div>
      <label class="csv-input">{{ text('paste') }}<n-input v-model:value="csv" type="textarea" :autosize="{ minRows: 3, maxRows: 8 }" placeholder="name,day,start,end" /></label>
      <c-button type="primary" @click="importCsv">{{ text('import') }}</c-button>
      <n-alert v-if="success" type="success" class="notice" role="status">{{ success }}</n-alert>
    </c-card>

    <c-card>
      <h3>{{ text('availability') }}</h3>
      <p class="muted">{{ text('availabilityHint') }}</p>
      <div class="window-grid">
        <div v-for="window in windowInputs" :key="window.day" class="window-row">
          <strong>{{ days[window.day - 1] }}</strong>
          <label>{{ text('start') }}<input v-model="window.start" class="time-input" inputmode="numeric" maxlength="5" :aria-label="`${days[window.day - 1]} ${text('start')}`"></label>
          <label>{{ text('end') }}<input v-model="window.end" class="time-input" inputmode="numeric" maxlength="5" :aria-label="`${days[window.day - 1]} ${text('end')}`"></label>
        </div>
      </div>
      <div class="rules-grid">
        <label>{{ text('minimum') }}<n-input-number v-model:value="minimumMinutes" :min="1" :max="1440" :precision="0" /></label>
        <label>{{ text('gap') }}<n-input-number v-model:value="gapMinutes" :min="0" :max="60" :precision="0" /></label>
      </div>
      <p class="muted">{{ text('mergeHint') }}</p>
      <n-alert v-if="!settingsValid" type="error" role="alert">{{ text('err_settings') }}</n-alert>
    </c-card>

    <c-card v-if="settingsValid">
      <h3>{{ text('dailyFree') }}</h3>
      <div class="week-grid">
        <section v-for="result in dailyFree" :key="result.day" class="day-card">
          <h4>{{ days[result.day - 1] }}</h4>
          <div class="slot-list"><n-tag v-for="slot in result.slots" :key="slot.startMinute" type="success">{{ formatClockTime(slot.startMinute) }}–{{ formatClockTime(slot.endMinute) }} · {{ slot.endMinute - slot.startMinute }} {{ text('minutes') }}</n-tag></div>
          <p v-if="!result.slots.length" class="muted">{{ text('noFree') }}</p>
        </section>
      </div>
    </c-card>

    <c-card>
      <div class="section-heading"><h3>{{ text('week') }}</h3><c-button @click="copyWeek">{{ copied ? text('copied') : text('copy') }}</c-button></div>
      <div class="week-grid">
        <section v-for="(label, index) in days" :key="label" class="day-card">
          <h4>{{ label }}</h4>
          <p v-if="!sortedCourses.some(course => course.day === index + 1)" class="muted">{{ text('empty') }}</p>
          <div v-for="course in sortedCourses.filter(item => item.day === index + 1)" :key="course.id" class="course-row">
            <div><strong>{{ course.name }}</strong><span>{{ formatClockTime(course.startMinute) }}–{{ formatClockTime(course.endMinute) }}</span><small v-if="course.sourceIds.length > 1">{{ course.sourceIds.length }} {{ text('merged') }}</small></div>
            <c-button size="small" @click="courses = courses.filter(item => !course.sourceIds.includes(item.id))">{{ text('removeBlock') }}</c-button>
          </div>
        </section>
      </div>
      <n-input :value="weekText" type="textarea" readonly :aria-label="text('week')" :autosize="{ minRows: 6, maxRows: 12 }" class="text-view" />
    </c-card>
  </div>
</template>

<style scoped lang="less">
.clock-tool { display: grid; gap: 18px; }
.clock-hero { padding: 26px; border-radius: 16px; background: linear-gradient(120deg, #032b74, #164994); color: #fff; }
.clock-hero h2 { margin: 10px 0; font-size: 26px; }
.clock-hero p { margin: 8px 0 12px; opacity: .9; }
.clock-hero small { opacity: .75; }
.eyebrow { letter-spacing: .14em; font-size: 11px; }
h3 { margin: 0 0 14px; font-size: 17px; } h4 { margin: 0 0 10px; }
.section-heading { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; } .section-heading h3 { margin: 0; }
.clock-form { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 14px; align-items: end; }
label { display: grid; gap: 7px; font-size: 13px; }
.time-input { box-sizing: border-box; height: 34px; padding: 6px 10px; width: 100%; min-width: 0; border: 1px solid #b7c3d7; border-radius: 4px; background: transparent; color: inherit; font: inherit; }
.primary-button, .file-button { padding: 9px 14px; border: 0; border-radius: 6px; background: #032b74; color: #fff; cursor: pointer; font: inherit; width: fit-content; }
.file-button { display: inline-block; } .visually-hidden { width: 1px; height: 1px; position: absolute; opacity: 0; } .file-button:focus-within { outline: 2px solid #d42744; outline-offset: 3px; }
.actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 12px; }
.csv-input { margin: 16px 0 12px; } .muted { opacity: .65; font-size: 13px; line-height: 1.6; } .notice { margin-top: 14px; }
.week-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.day-card { padding: 14px; border: 1px solid #a9b9d044; border-radius: 10px; }
.course-row { display: flex; gap: 10px; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #a9b9d033; }
.course-row div { min-width: 0; } .course-row strong { display: block; overflow-wrap: anywhere; } .course-row span { display: block; margin-top: 4px; opacity: .65; font-size: 13px; }
.text-view { margin-top: 18px; font-family: monospace; }
.window-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.window-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; align-items: center; border-bottom: 1px solid #a9b9d033; padding: 8px 0; }
.rules-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin-top: 20px; }
.slot-list { display: flex; flex-wrap: wrap; gap: 8px; } .course-row small { color: #a45b1d; }
@media(max-width: 700px) { .window-grid, .rules-grid { grid-template-columns: 1fr; } }
@media(max-width: 700px) { .clock-form { grid-template-columns: repeat(2, minmax(0, 1fr)); } .name-field { grid-column: span 2; } .week-grid { grid-template-columns: 1fr; } .clock-hero { padding: 20px; } .clock-hero h2 { font-size: 23px; } }
</style>
