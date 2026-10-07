<script setup lang="ts">
import { checklistProgress, type DocumentCheckItem } from './document-checklist.service';
import { makeCampusId, useCampusText } from '../campus-text';

const text = useCampusText();
const items = useStorage<DocumentCheckItem[]>('campus-document-checklist:items', []);
const newLabel = ref('');
const error = ref('');
const progress = computed(() => checklistProgress(items.value));

function addItem() {
  const label = newLabel.value.trim();
  if (!label) {
    error.value = text('请输入一条核对事项。', 'Enter a checklist item.');
    return;
  }
  items.value.push({ id: makeCampusId('check'), label, checked: false });
  newLabel.value = '';
  error.value = '';
}

function loadExample() {
  if (!items.value.length) {
    items.value = [
      { id: makeCampusId('check'), label: text('标题信息完整', 'The title information is complete'), checked: false },
      { id: makeCampusId('check'), label: text('正文层级与编号符合规范', 'Headings and numbering follow the guideline'), checked: false },
      { id: makeCampusId('check'), label: text('落款和日期齐全', 'Signature and date are present'), checked: false },
    ];
  }
}
</script>

<template>
  <div class="campus-tool">
    <c-card mb-4>
      <h2>{{ text('按清单逐项核对社团通知和公文材料', 'Review club notices and documents with a checklist') }}</h2>
      <p>{{ text('示例事项仅用于演示。请按协会《公文格式规范》修改清单；本工具不会自动读取 Word 文件。', 'Example items are for demonstration. Update this checklist to match your association rules. This tool does not inspect Word files.') }}</p>
      <div class="progress-line"><strong>{{ progress.checked }} / {{ progress.total }}</strong><span>{{ text('项已完成', 'items checked') }} · {{ progress.percentage }}%</span></div>
    </c-card>
    <c-card mb-4>
      <div class="add-row">
        <n-input v-model:value="newLabel" :placeholder="text('添加协会规范中的检查项', 'Add an item from your association guideline')" @keyup.enter="addItem" />
        <c-button type="primary" @click="addItem">{{ text('添加', 'Add') }}</c-button>
      </div>
      <p v-if="error" class="error-text">{{ error }}</p>
      <c-button v-if="items.length === 0" mt-3 @click="loadExample">{{ text('载入可编辑示例', 'Load editable examples') }}</c-button>
    </c-card>
    <c-card>
      <p v-if="items.length === 0" class="muted">{{ text('添加核对项，或从可编辑示例开始。', 'Add checklist items or start with editable examples.') }}</p>
      <ul v-else class="checklist">
        <li v-for="item in items" :key="item.id">
          <label><input v-model="item.checked" type="checkbox"><span :class="{ checked: item.checked }">{{ item.label }}</span></label>
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
.progress-line { display: flex; align-items: baseline; gap: .5rem; margin-top: 1rem; }
.progress-line strong { font-size: 1.5rem; }
.progress-line span, .muted { opacity: .7; }
.add-row { display: flex; align-items: center; gap: .5rem; }
.add-row > *:first-child { flex: 1; }
.checklist { list-style: none; padding: 0; margin: 0; }
.checklist li, .checklist label { display: flex; align-items: center; gap: .75rem; }
.checklist li { justify-content: space-between; border-bottom: 1px solid #8883; padding: .75rem 0; }
.checklist li:last-child { border-bottom: 0; }
.checklist label { flex: 1; cursor: pointer; }
.checked { text-decoration: line-through; opacity: .55; }
.error-text { color: #c2413b; }
</style>
