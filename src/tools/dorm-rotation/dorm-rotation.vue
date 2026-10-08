<script setup lang="ts">
import { format } from 'date-fns';
import { generateDutyRotation } from './dorm-rotation.service';
import { useCampusText } from '../campus-text';

const text = useCampusText();
const membersText = useStorage('campus-dorm-rotation:members', '室友 A\n室友 B\n室友 C\n室友 D');
const tasksText = useStorage('campus-dorm-rotation:tasks', '公共区域清洁\n垃圾分类\n补充日用品');
const startDate = useStorage('campus-dorm-rotation:start-date', nextMonday());
const weeks = useStorage('campus-dorm-rotation:weeks', 8);
const result = computed(() => generateDutyRotation(
  membersText.value.split(/[\n,，;；]+/),
  tasksText.value.split(/[\n,，;；]+/),
  startDate.value,
  weeks.value,
));

function nextMonday() {
  const date = new Date();
  const daysUntilMonday = (8 - date.getDay()) % 7 || 7;
  date.setDate(date.getDate() + daysUntilMonday);
  return format(date, 'yyyy-MM-dd');
}
</script>

<template>
  <div class="campus-tool">
    <c-card mb-4>
      <h2>{{ text('生成公平轮换的宿舍值日安排', 'Create a rotating dorm chore schedule') }}</h2>
      <p>{{ text('输入成员和任务，按周轮换分配。安排保存在当前浏览器。', 'Enter residents and chores to rotate assignments by week. The schedule stays in this browser.') }}</p>
    </c-card>
    <c-card mb-4>
      <div class="form-grid">
        <n-form-item :label="text('宿舍成员（每行一人）', 'Residents (one per line)')"><n-input v-model:value="membersText" type="textarea" :autosize="{ minRows: 3, maxRows: 6 }" /></n-form-item>
        <n-form-item :label="text('值日任务（每行一项）', 'Chores (one per line)')"><n-input v-model:value="tasksText" type="textarea" :autosize="{ minRows: 3, maxRows: 6 }" /></n-form-item>
        <n-form-item :label="text('开始日期', 'Start date')"><input v-model="startDate" type="date" class="date-input"></n-form-item>
        <n-form-item :label="text('生成周数', 'Number of weeks')"><n-input-number v-model:value="weeks" :min="1" :max="52" :precision="0" w-full /></n-form-item>
      </div>
    </c-card>
    <c-card>
      <n-alert v-if="!result" type="error" :title="text('请至少输入一位成员、一项任务和有效的开始日期。', 'Enter at least one resident, one chore, and a valid start date.')" />
      <div v-else class="schedule">
        <section v-for="week in result" :key="week.week">
          <h3>{{ text(`第 ${week.week} 周`, `Week ${week.week}`) }} <small>{{ week.date }}</small></h3>
          <ul><li v-for="assignment in week.assignments" :key="assignment.task"><span>{{ assignment.task }}</span><strong>{{ assignment.member }}</strong></li></ul>
        </section>
      </div>
    </c-card>
  </div>
</template>

<style scoped>
.campus-tool { width: 100%; max-width: 760px; margin: 0 auto; }
.campus-tool h2 { margin: 0; font-size: 1.1rem; }
.campus-tool p { opacity: .75; }
.form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0 1rem; }
.date-input { box-sizing: border-box; width: 100%; height: 34px; padding: 6px 10px; border: 1px solid #8885; border-radius: 4px; background: transparent; color: inherit; font: inherit; }
.schedule { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1rem; }
.schedule section { border: 1px solid #8883; border-radius: 8px; padding: .75rem; }
.schedule h3 { display: flex; justify-content: space-between; gap: .5rem; margin: 0 0 .5rem; font-size: 1rem; }
.schedule small { opacity: .65; font-weight: 400; }
.schedule ul { list-style: none; margin: 0; padding: 0; }
.schedule li { display: flex; justify-content: space-between; gap: .5rem; padding: .45rem 0; border-top: 1px solid #8883; }
</style>
