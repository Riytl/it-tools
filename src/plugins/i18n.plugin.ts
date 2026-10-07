import messages from '@intlify/unplugin-vue-i18n/messages';
import { get } from '@vueuse/core';
import type { Plugin } from 'vue';
import { createI18n } from 'vue-i18n';

const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  fallbackLocale: 'en',
  messages,
});

export const i18nPlugin: Plugin = {
  install: (app) => {
    app.use(i18n);
  },
};

export const translate = function (localeKey: string) {
  const activeLocale = get(i18n.global.locale);
  const hasKey = i18n.global.te(localeKey, activeLocale) || i18n.global.te(localeKey, 'en');
  return hasKey ? i18n.global.t(localeKey) : localeKey;
};
