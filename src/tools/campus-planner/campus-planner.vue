<script setup lang="ts">
import { addDays, format } from 'date-fns';
import { daysUntil, type PlannerItem } from './campus-planner.service';
import { makeCampusId, useCampusText } from '../campus-text';

const text = useCampusText();
const items = useStorage<PlannerItem[]>('campus-planner:items', []);
const title = ref('');
const category = ref<PlannerItem['category']>('exam');
const dueDate = ref(format(addDays(new Date(), 7), 'yyyy-MM-dd'));
const error = ref('');
const categoryOptions = computed(() => [
  { label: text('考试', 'Exam'), value: 'exam' },
  { label: text('作业', 'Assignment'), value: 'assignment' },
  { label: text('校园活动', 'Campus event'), value: 'event' },
]);
const sortedItems = computed(() => [...items.value].sort((a, b) => a.dueDate.localeCompare(b.dueDate)));

function addItem() {
  if (!title.value.trim() || !dueDate.value) {
    error.value = text('请填写事项名称和日期。', 'Enter a title and date.');
    return;
  }
  items.value.push({ id: makeCampusId('planner'), title: title.value.trim(), category: category.value, dueDate: dueDate.value, completed: false });
  title.value = '';
  error.value = '';
}

function countdown(item: PlannerItem) {
  const days = daysUntil(item.dueDate);
  if (days === undefined) return text('日期无效', 'Invalid date');
  if (days === 0) return text('今天', 'Today');
  if (days < 0) return text(`已过期 ${Math.abs(days)} 天`, `${Math.abs(days)} days overdue`);
  return text(`还有 ${days} 天`, `${days} days left`);
}

function loadSample() {
  if (!items.value.length) {
    items.value = [{
      id: makeCampusId('planner'),
      title: text('示例：准备阶段汇报', 'Example: Prepare a progress presentation'),
      category: 'assignment',
      dueDate: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
      completed: false,
    }];
  }
}
</script>

<template>
  <div class="campus-tool">
    <c-card mb-4>
      <h2>{{ text('把考试、作业和校园活动放在一张清单里', 'Keep exams, assignments, and campus events in one list') }}</h2>
      <p>{{ text('事项保存在当前浏览器，可勾选完成或删除。', 'Items stay in this browser. Mark them complete or remove them anytime.') }}</p>
    </c-card>
    <c-card mb-4>
      <div class="form-grid">
        <n-form-item :label="text('事项名称', 'Title')"><n-input v-model:value="title" :placeholder="text('例如：数据结构考试', 'e.g. Data structures exam')" @keyup.enter="addItem" /></n-form-item>
        <n-form-item :label="text('类型', 'Type')"><n-select v-model:value="category" :options="categoryOptions" /></n-form-item>
        <n-form-item :label="text('日期', 'Date')"><input v-model="dueDate" type="date" class="date-input"></n-form-item>
      </div>
      <p v-if="error" class="error-text">{{ error }}</p>
      <div class="actions">
        <c-button type="primary" @click="addItem">{{ text('添加事项', 'Add item') }}</c-button>
        <c-button v-if="items.length === 0" @click="loadSample">{{ text('载入示例', 'Load example') }}</c-button>
      </div>
    </c-card>
    <c-card>
      <p v-if="items.length === 0" class="muted">{{ text('还没有事项，添加一条或载入示例。', 'No items yet. Add one or load an example.') }}</p>
      <ul v-else class="rows">
        <li v-for="item in sortedItems" :key="item.id">
          <input v-model="item.completed" type="checkbox" :aria-label="text('标记完成', 'Mark complete')">
          <div class="item-main" :class="{ completed: item.completed }">
            <strong>{{ item.title }}</strong>
            <span>{{ categoryOptions.find(option => option.value === item.category)?.label }} · {{ item.dueDate }} · {{ countdown(item) }}</span>
          </div>
          <c-button size="small" @click="items = items.filter(entry => entry.id !== item.id)">{{ text('删除', 'Remove') }}</c-button>
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
.date-input { box-sizing: border-box; width: 100%; height: 34px; padding: 6px 10px; border: 1px solid #8885; border-radius: 4px; background: transparent; color: inherit; font: inherit; }
.actions { display: flex; gap: .5rem; }
.rows { list-style: none; padding: 0; margin: 0; }
.rows li { display: flex; align-items: center; gap: .75rem; border-bottom: 1px solid #8883; padding: .75rem 0; }
.rows li:last-child { border-bottom: 0; }
.item-main { display: flex; flex: 1; min-width: 0; flex-direction: column; gap: .2rem; }
.item-main span, .muted { opacity: .7; }
.completed { opacity: .5; text-decoration: line-through; }
.error-text { color: #c2413b; }
</style>
