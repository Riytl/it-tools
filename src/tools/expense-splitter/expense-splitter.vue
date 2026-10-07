<script setup lang="ts">
import { calculateSettlements, type ExpenseEntry, type ExpenseParticipant } from './expense-splitter.service';
import { makeCampusId, useCampusText } from '../campus-text';

const text = useCampusText();
const participantText = useStorage('campus-expense-splitter:participants', '室友 A:1\n室友 B:1\n室友 C:1');
const expenses = useStorage<ExpenseEntry[]>('campus-expense-splitter:expenses', []);
const title = ref('');
const amount = ref<number | null>(0);
const payer = ref('');
const includedText = ref('');
const error = ref('');

const participants = computed<ExpenseParticipant[]>(() => participantText.value
  .split(/[\n,，;；]+/)
  .map((line) => {
    const [name, weightValue] = line.split(/[:：=]/);
    return { name: name?.trim() ?? '', weight: weightValue?.trim() ? Number(weightValue) : 1 };
  })
  .filter(person => person.name));
const participantOptions = computed(() => participants.value.map(person => ({ label: person.name, value: person.name })));
const effectivePayer = computed(() => participantOptions.value.some(option => option.value === payer.value) ? payer.value : participantOptions.value[0]?.value ?? '');
const settlements = computed(() => calculateSettlements(participants.value, expenses.value));

function addExpense() {
  if (!title.value.trim() || amount.value === null || amount.value <= 0 || !effectivePayer.value) {
    error.value = text('请填写费用名称、正数金额和付款人。', 'Enter an expense name, a positive amount, and a payer.');
    return;
  }
  expenses.value.push({
    id: makeCampusId('expense'),
    title: title.value.trim(),
    amount: Math.round(amount.value * 100) / 100,
    payer: effectivePayer.value,
    participants: includedText.value.trim() ? includedText.value.split(/[\n,，;；]+/).map(name => name.trim()).filter(Boolean) : [],
  });
  title.value = '';
  amount.value = 0;
  includedText.value = '';
  error.value = '';
}

function loadSample() {
  if (!expenses.value.length) {
    expenses.value = [
      { id: makeCampusId('expense'), title: text('宿舍清洁用品', 'Dorm cleaning supplies'), amount: 48, payer: participants.value[0]?.name ?? '', participants: [] },
      { id: makeCampusId('expense'), title: text('饮水', 'Drinking water'), amount: 30, payer: participants.value[1]?.name ?? participants.value[0]?.name ?? '', participants: [] },
    ];
  }
}
</script>

<template>
  <div class="campus-tool">
    <c-card mb-4>
      <h2>{{ text('记录共同开销，按成员权重计算结算金额', 'Track shared costs and split them by participant weights') }}</h2>
      <p>{{ text('每行填写一位成员，格式为“姓名:权重”。每笔费用可填写参与分摊的人；留空表示所有人平摊或按权重分摊。数据只保存在此浏览器。', 'Enter one participant per line as “name:weight”. List participants for each expense, or leave the field blank to split among everyone by weight. Data stays in this browser.') }}</p>
    </c-card>
    <c-card mb-4>
      <n-form-item :label="text('成员与分摊权重', 'Participants and split weights')">
        <n-input v-model:value="participantText" type="textarea" :autosize="{ minRows: 3, maxRows: 6 }" />
      </n-form-item>
      <div class="form-grid">
        <n-form-item :label="text('费用名称', 'Expense')"><n-input v-model:value="title" :placeholder="text('例如：宿舍用品', 'e.g. Dorm supplies')" /></n-form-item>
        <n-form-item :label="text('金额（元）', 'Amount')"><n-input-number v-model:value="amount" :min="0" :precision="2" w-full /></n-form-item>
        <n-form-item :label="text('付款人', 'Paid by')"><n-select v-model:value="payer" :options="participantOptions" :placeholder="text('选择成员', 'Select a participant')" /></n-form-item>
        <n-form-item :label="text('参与分摊成员（可选）', 'People sharing this expense (optional)')"><n-input v-model:value="includedText" :placeholder="text('留空表示所有人', 'Blank means everyone')" /></n-form-item>
      </div>
      <p v-if="error || (expenses.length > 0 && !settlements)" class="error-text">{{ error || text('成员、权重、付款人或参与人设置无效，请检查输入。', 'Check participant names, weights, payer, and split participants.') }}</p>
      <div class="actions"><c-button type="primary" @click="addExpense">{{ text('添加费用', 'Add expense') }}</c-button><c-button v-if="expenses.length === 0" @click="loadSample">{{ text('载入示例', 'Load example') }}</c-button></div>
    </c-card>
    <c-card>
      <div class="section-heading"><h3>{{ text('费用记录', 'Expenses') }}</h3><span>{{ expenses.length }}</span></div>
      <p v-if="expenses.length === 0" class="muted">{{ text('添加费用后显示结算结果。', 'Add expenses to see the settlement.') }}</p>
      <ul v-else class="rows"><li v-for="expense in expenses" :key="expense.id"><span>{{ expense.title }} · {{ expense.payer }} · ¥{{ expense.amount.toFixed(2) }}</span><c-button size="small" @click="expenses = expenses.filter(item => item.id !== expense.id)">{{ text('删除', 'Remove') }}</c-button></li></ul>
      <h3 v-if="expenses.length">{{ text('结算建议', 'Suggested settlements') }}</h3>
      <p v-if="expenses.length && settlements?.length === 0" class="muted">{{ text('目前无需转账。', 'No transfers are needed.') }}</p>
      <ul v-else-if="settlements?.length" class="rows"><li v-for="(settlement, index) in settlements" :key="index">{{ settlement.from }} → {{ settlement.to }}：<strong>¥{{ settlement.amount.toFixed(2) }}</strong></li></ul>
    </c-card>
  </div>
</template>

<style scoped>
.campus-tool { width: 100%; max-width: 760px; margin: 0 auto; }
.campus-tool h2 { margin: 0; font-size: 1.1rem; }
.campus-tool p { opacity: .75; }
.form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0 1rem; }
.actions { display: flex; gap: .5rem; }
.section-heading { display: flex; justify-content: space-between; align-items: center; }
.section-heading h3 { margin: 0; }
.rows { list-style: none; padding: 0; margin: .5rem 0 1rem; }
.rows li { display: flex; justify-content: space-between; align-items: center; gap: .75rem; border-bottom: 1px solid #8883; padding: .6rem 0; }
.rows li:last-child { border-bottom: 0; }
.muted { opacity: .7; }
.error-text { color: #c2413b; }
</style>
