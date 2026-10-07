<script setup lang="ts">
import { calculateGrades, parseGradePointRules, type GradeEntry, type GradeMode } from './grade-calculator.service';
import { makeCampusId, useCampusText } from '../campus-text';

const text = useCampusText();
const entries = useStorage<GradeEntry[]>('campus-grade-calculator:entries', []);
const ruleText = useStorage('campus-grade-calculator:grade-point-rules', '90:4, 85:3.7, 82:3.3, 78:3, 75:2.7, 72:2.3, 68:2, 64:1.5, 60:1');
const mode = ref<GradeMode>('weighted');
const name = ref('');
const score = ref<number | null>(85);
const credits = ref<number | null>(3);
const error = ref('');
const rules = computed(() => parseGradePointRules(ruleText.value));
const result = computed(() => calculateGrades(entries.value, mode.value, rules.value ?? []));
const modeOptions = computed(() => [
  { label: text('算术平均分', 'Simple average'), value: 'simple' },
  { label: text('学分加权平均分', 'Credit-weighted average'), value: 'weighted' },
  { label: text('学分加权绩点', 'Credit-weighted GPA'), value: 'gpa' },
]);

function addEntry() {
  if (!name.value.trim() || score.value === null || credits.value === null || credits.value <= 0) {
    error.value = text('请填写课程名、有效成绩和大于 0 的学分。', 'Enter a course, a valid score, and credits greater than zero.');
    return;
  }
  entries.value.push({ id: makeCampusId('grade'), name: name.value.trim(), score: score.value, credits: credits.value });
  name.value = '';
  error.value = '';
}

function loadSample() {
  if (entries.value.length === 0) {
    entries.value = [
      { id: makeCampusId('grade'), name: text('高等数学', 'Calculus'), score: 88, credits: 4 },
      { id: makeCampusId('grade'), name: text('大学英语', 'College English'), score: 92, credits: 2 },
      { id: makeCampusId('grade'), name: text('程序设计', 'Programming'), score: 79, credits: 3 },
    ];
  }
}
</script>

<template>
  <div class="campus-tool">
    <c-card mb-4>
      <h2>{{ text('按课程成绩和学分计算平均分或绩点', 'Calculate an average or GPA from grades and credits') }}</h2>
      <p>{{ text('绩点换算区间可以编辑。示例规则不代表任何学校的官方算法。', 'Edit the grade-point bands to match your school. The example is not an official formula.') }}</p>
    </c-card>

    <c-card mb-4>
      <div class="form-grid">
        <n-form-item :label="text('计算方式', 'Calculation')">
          <n-select v-model:value="mode" :options="modeOptions" />
        </n-form-item>
        <n-form-item :label="text('课程名', 'Course')"><n-input v-model:value="name" :placeholder="text('例如：高等数学', 'e.g. Calculus')" /></n-form-item>
        <n-form-item :label="text('成绩（0–100）', 'Score (0–100)')"><n-input-number v-model:value="score" :min="0" :max="100" :precision="2" w-full /></n-form-item>
        <n-form-item :label="text('学分', 'Credits')"><n-input-number v-model:value="credits" :min="0.01" :max="30" :precision="2" w-full /></n-form-item>
      </div>
      <div v-if="mode === 'gpa'" class="rules-box">
        <label>{{ text('成绩下限:绩点（逗号分隔）', 'Minimum score: points (comma separated)') }}</label>
        <n-input v-model:value="ruleText" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" />
        <small v-if="!rules" class="error-text">{{ text('规则格式无效，请使用例如 90:4, 60:1。', 'Invalid rules. Use a format such as 90:4, 60:1.') }}</small>
      </div>
      <p v-if="error" class="error-text">{{ error }}</p>
      <div class="actions">
        <c-button type="primary" @click="addEntry">{{ text('添加课程', 'Add course') }}</c-button>
        <c-button v-if="entries.length === 0" @click="loadSample">{{ text('载入示例', 'Load example') }}</c-button>
      </div>
    </c-card>

    <c-card>
      <div class="result"><span>{{ text('计算结果', 'Result') }}</span><strong>{{ result ? result.value.toFixed(2) : '—' }}</strong></div>
      <p v-if="result">{{ text('计入学分', 'Credits included') }}：{{ result.totalCredits.toFixed(2) }}</p>
      <p v-else class="muted">{{ text('添加课程后显示结果；绩点模式需填写有效换算规则。', 'Add courses to calculate. GPA mode also needs valid conversion rules.') }}</p>
      <ul class="rows">
        <li v-for="entry in entries" :key="entry.id">
          <span>{{ entry.name }} · {{ entry.score }} · {{ entry.credits }} {{ text('学分', 'credits') }}</span>
          <c-button size="small" @click="entries = entries.filter(item => item.id !== entry.id)">{{ text('删除', 'Remove') }}</c-button>
        </li>
      </ul>
    </c-card>
  </div>
</template>

<style scoped>
.campus-tool { width: 100%; max-width: 760px; margin: 0 auto; }
.campus-tool h2 { margin: 0; font-size: 1.1rem; }
.campus-tool p { opacity: .75; }
.form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0 1rem; }
.rules-box { display: grid; gap: .5rem; margin-bottom: 1rem; }
.actions { display: flex; flex-wrap: wrap; gap: .5rem; }
.result { display: flex; justify-content: space-between; align-items: center; font-size: 1.1rem; }
.result strong { font-size: 2rem; }
.rows { list-style: none; padding: 0; margin: 1rem 0 0; }
.rows li { display: flex; justify-content: space-between; align-items: center; gap: 1rem; border-top: 1px solid #8883; padding: .65rem 0; }
.error-text { color: #c2413b; }
.muted { opacity: .65; }
</style>
