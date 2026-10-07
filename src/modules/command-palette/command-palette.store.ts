import { defineStore } from 'pinia';
import _ from 'lodash';
import type { PaletteOption } from './command-palette.types';
import { useToolStore } from '@/tools/tools.store';
import { useFuzzySearch } from '@/composable/fuzzySearch';
import { useStyleStore } from '@/stores/style.store';

import SunIcon from '~icons/mdi/white-balance-sunny';
import GithubIcon from '~icons/mdi/github';
import DiceIcon from '~icons/mdi/dice-5';
import InfoIcon from '~icons/mdi/information-outline';

export const useCommandPaletteStore = defineStore('command-palette', () => {
  const toolStore = useToolStore();
  const styleStore = useStyleStore();
  const router = useRouter();
  const { t } = useI18n();
  const searchPrompt = ref('');

  const toolsOptions = computed(() => toolStore.tools.map(tool => ({
    ...tool,
    to: tool.path,
    toolCategory: tool.category,
    category: t('home.commandCategories.tools'),
  })));

  const searchOptions = computed<PaletteOption[]>(() => [
    ...toolsOptions.value,
    {
      name: t('home.randomTool'),
      description: t('home.randomToolDescription'),
      action: () => {
        const tool = _.sample(toolStore.tools);
        if (tool) router.push(tool.path);
      },
      icon: DiceIcon,
      category: t('home.commandCategories.tools'),
      keywords: ['random', 'tool', 'pick', 'choose', '随机', '工具'],
      closeOnSelect: true,
    },
    {
      name: t('home.toggleTheme'),
      description: t('home.toggleThemeDescription'),
      action: () => styleStore.toggleDark(),
      icon: SunIcon,
      category: t('home.commandCategories.actions'),
      keywords: ['dark', 'theme', 'toggle', 'mode', 'light', '深色', '主题'],
    },
    {
      name: t('home.githubLink'),
      href: 'https://github.com/Riytl/it-tools',
      category: t('home.commandCategories.external'),
      description: t('home.githubDescription'),
      keywords: ['github', 'repo', 'repository', 'source', 'code', '源码'],
      icon: GithubIcon,
    },
    {
      name: t('home.aboutLink'),
      description: t('home.aboutDescription'),
      to: '/about',
      category: t('home.commandCategories.pages'),
      keywords: ['about', 'learn', 'more', 'info', 'information', '关于'],
      icon: InfoIcon,
    },
  ]);

  const { searchResult } = useFuzzySearch({
    search: searchPrompt,
    data: searchOptions,
    options: {
      keys: [{ name: 'name', weight: 2 }, 'description', 'keywords', 'category'],
      threshold: 0.3,
    },
  });

  const filteredSearchResult = computed(() =>
    _.chain(searchResult.value).groupBy('category').mapValues(categoryOptions => _.take(categoryOptions, 5)).value());

  return {
    filteredSearchResult,
    searchPrompt,
  };
});
