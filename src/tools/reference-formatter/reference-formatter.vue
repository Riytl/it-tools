<script setup lang="ts">
import { formatReference, type ReferenceStyle, type ReferenceType } from './reference-formatter.service';
import { useCampusText } from '../campus-text';

const text = useCampusText();
const authors = ref('');
const title = ref('');
const year = ref('');
const source = ref('');
const url = ref('');
const volume = ref('');
const issue = ref('');
const pages = ref('');
const edition = ref('');
const place = ref('');
const accessDate = ref('');
const doi = ref('');
const type = ref<ReferenceType>('journal');
const style = ref<ReferenceStyle>('gbt');
const typeOptions = computed(() => [
  { label: text('期刊论文', 'Journal article'), value: 'journal' },
  { label: text('图书', 'Book'), value: 'book' },
  { label: text('网页', 'Web page'), value: 'website' },
]);
const styleOptions = computed(() => [
  { label: 'GB/T 7714', value: 'gbt' },
  { label: 'APA', value: 'apa' },
]);
const sourceLabel = computed(() => type.value === 'journal'
  ? text('期刊名', 'Journal title')
  : type.value === 'book'
    ? text('出版社', 'Publisher')
    : text('网站名（可选）', 'Website name (optional)'));
const output = computed(() => formatReference({
  authors: authors.value,
  title: title.value,
  year: year.value,
  source: source.value,
  url: url.value,
  type: type.value,
  volume: volume.value,
  issue: issue.value,
  pages: pages.value,
  edition: edition.value,
  place: place.value,
  accessDate: accessDate.value,
  doi: doi.value,
}, style.value));
const recommendedFields = computed(() => {
  const missing: string[] = [];
  if (type.value === 'journal') {
    if (!volume.value.trim()) missing.push(text('卷号', 'volume'));
    if (!issue.value.trim()) missing.push(text('期号', 'issue'));
    if (!pages.value.trim()) missing.push(text('页码或文章编号', 'page range or article number'));
    if (!doi.value.trim()) missing.push(text('DOI（如有）', 'DOI, if available'));
  }
  else if (type.value === 'book') {
    if (!edition.value.trim()) missing.push(text('版次（如适用）', 'edition, if applicable'));
    if (!place.value.trim()) missing.push(text('出版地（如适用）', 'place of publication, if applicable'));
  }
  else if (!accessDate.value.trim()) {
    missing.push(text('访问日期', 'access date'));
  }
  return missing.length
    ? text(`可按实际文献信息补充：${missing.join('、')}。`, `Consider adding available details: ${missing.join(', ')}.`)
    : '';
});
const requiredFieldsHint = computed(() => type.value === 'website'
  ? text('请填写作者、题名、年份和网页链接。', 'Enter authors, title, year, and web address.')
  : text('请填写作者、题名、年份和来源。', 'Enter authors, title, year, and source.'));

function copyOutput() {
  if (output.value) {
    navigator.clipboard?.writeText(output.value);
  }
}
</script>

<template>
  <div class="campus-tool">
    <c-card mb-4>
      <h2>{{ text('填写文献信息，生成参考文献格式草稿', 'Create a formatted reference draft') }}</h2>
      <p>{{ text('支持期刊、图书和网页的常见字段。请按目标格式填写作者，并核对标准版本及院系要求；生成结果不保证完全符合 GB/T 7714 或 APA 的全部细则。', 'Enter common details for journal articles, books, and web pages. Format author names for your chosen style and check its edition and your department’s rules; the draft does not guarantee full compliance with every GB/T 7714 or APA requirement.') }}</p>
    </c-card>
    <c-card>
      <div class="form-grid">
        <n-form-item :label="text('参考文献格式', 'Citation style')"><n-select v-model:value="style" :options="styleOptions" /></n-form-item>
        <n-form-item :label="text('文献类型', 'Reference type')"><n-select v-model:value="type" :options="typeOptions" /></n-form-item>
        <n-form-item :label="text('作者（按目标格式输入）', 'Authors (enter in the desired format)')"><n-input v-model:value="authors" :placeholder="text('请按目标格式整理作者姓名', 'Enter names in the target style')" /></n-form-item>
        <n-form-item :label="text('题名', 'Title')"><n-input v-model:value="title" /></n-form-item>
        <n-form-item :label="text('出版年/发布日期', 'Publication year/date')"><n-input v-model:value="year" :placeholder="text('例如：2024', 'e.g. 2024')" /></n-form-item>
        <n-form-item :label="sourceLabel"><n-input v-model:value="source" /></n-form-item>
        <template v-if="type === 'journal'">
          <n-form-item :label="text('卷号', 'Volume')"><n-input v-model:value="volume" /></n-form-item>
          <n-form-item :label="text('期号', 'Issue')"><n-input v-model:value="issue" /></n-form-item>
          <n-form-item :label="text('页码范围/文章编号', 'Page range/article number')"><n-input v-model:value="pages" :placeholder="text('例如：12–25', 'e.g. 12–25')" /></n-form-item>
          <n-form-item :label="text('DOI（如有）', 'DOI (if available)')"><n-input v-model:value="doi" /></n-form-item>
        </template>
        <template v-else-if="type === 'book'">
          <n-form-item :label="text('版次（可选）', 'Edition (optional)')"><n-input v-model:value="edition" :placeholder="text('例如：第 2 版 / 2nd ed.', 'e.g. 2nd ed.')" /></n-form-item>
          <n-form-item :label="text('出版地（可选）', 'Place of publication (optional)')"><n-input v-model:value="place" /></n-form-item>
        </template>
        <template v-else>
          <n-form-item :label="text('网页链接', 'Web address')"><n-input v-model:value="url" /></n-form-item>
          <n-form-item :label="text('访问日期（可选）', 'Access date (optional)')"><n-input v-model:value="accessDate" :placeholder="text('例如：2025-08-01', 'e.g. 2025-08-01')" /></n-form-item>
        </template>
      </div>
      <p v-if="recommendedFields" class="muted">{{ recommendedFields }}</p>
      <n-form-item :label="text('生成结果', 'Formatted reference')">
        <textarea-copyable v-if="output" :value="output" />
        <n-alert v-else type="info" :title="requiredFieldsHint" />
      </n-form-item>
      <c-button v-if="output" @click="copyOutput">{{ text('复制结果', 'Copy result') }}</c-button>
    </c-card>
  </div>
</template>

<style scoped>
.campus-tool { width: 100%; max-width: 760px; margin: 0 auto; }
.campus-tool h2 { margin: 0; font-size: 1.1rem; }
.campus-tool p { opacity: .75; }
.form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0 1rem; }
</style>
