<script setup lang="ts">
const { locale, t } = useI18n();

const localesLong: Record<string, string> = {
  en: 'English',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
  no: 'Norwegian',
  pt: 'Português',
  ru: 'Русский',
  uk: 'Українська',
  zh: '中文',
  vi: 'Tiếng Việt',
};

const localeOptions = [
  { label: localesLong.zh, value: 'zh' },
  { label: localesLong.en, value: 'en' },
  { label: localesLong.ru, value: 'ru' },
];
</script>

<template>
  <c-select
    v-model:value="locale"
    :options="localeOptions"
    :placeholder="t('i18n.selectLanguage')"
    w-100px
  />
</template>
