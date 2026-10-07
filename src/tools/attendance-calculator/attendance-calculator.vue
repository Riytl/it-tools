<script setup lang="ts">
import { calculateAttendance } from './attendance-calculator.service';
import { useCampusText } from '../campus-text';

const text = useCampusText();
const totalSessions = ref<number | null>(16);
const absences = ref<number | null>(0);
const requiredRate = ref<number | null>(75);
const result = computed(() => totalSessions.value === null || absences.value === null || requiredRate.value === null
  ? undefined
  : calculateAttendance(totalSessions.value, absences.value, requiredRate.value));
</script>

<template>
  <div class="campus-tool">
    <c-card mb-4>
      <h2>{{ text('考勤余量计算器', 'Attendance allowance calculator') }}</h2>
      <p>{{ text('根据课程总课次、当前缺勤和最低出勤率，估算剩余可缺勤次数。最终要求请以课程规定为准。', 'Estimate remaining absences from the course length, current absences, and required attendance. Confirm the policy with your course.') }}</p>
    </c-card>
    <c-card>
      <div class="form-grid">
        <n-form-item :label="text('课程总课次', 'Total sessions')"><n-input-number v-model:value="totalSessions" :min="1" :max="300" :precision="0" w-full /></n-form-item>
        <n-form-item :label="text('已缺勤次数', 'Absences so far')"><n-input-number v-model:value="absences" :min="0" :max="300" :precision="0" w-full /></n-form-item>
        <n-form-item :label="text('最低出勤率（%）', 'Required attendance (%)')"><n-input-number v-model:value="requiredRate" :min="0" :max="100" :precision="1" w-full /></n-form-item>
      </div>
      <n-alert v-if="!result" type="error" :title="text('请检查输入范围', 'Check the input values')" />
      <n-alert v-else :type="result.isOverLimit ? 'error' : 'success'" :title="result.isOverLimit ? text('已超过按当前要求估算的缺勤上限', 'The estimated absence limit has been exceeded') : text('仍在估算范围内', 'Within the estimated limit')">
        <div class="metrics">
          <div><strong>{{ result.attendanceRate.toFixed(1) }}%</strong><span>{{ text('当前出勤率', 'Current attendance') }}</span></div>
          <div><strong>{{ result.maximumAbsences }}</strong><span>{{ text('最多可缺勤', 'Maximum absences') }}</span></div>
          <div><strong>{{ result.remainingAbsences }}</strong><span>{{ text('剩余可缺勤', 'Remaining absences') }}</span></div>
        </div>
      </n-alert>
    </c-card>
  </div>
</template>

<style scoped>
.campus-tool { width: 100%; max-width: 760px; margin: 0 auto; }
.campus-tool h2 { margin: 0; font-size: 1.1rem; }
.campus-tool p { opacity: .75; }
.form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0 1rem; }
.metrics { display: flex; flex-wrap: wrap; gap: 1.25rem; }
.metrics div { min-width: 105px; display: flex; flex-direction: column; gap: .25rem; }
.metrics strong { font-size: 1.5rem; }
.metrics span { opacity: .75; }
</style>
