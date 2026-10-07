import { Coin } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.expense-splitter.title'),
  path: '/expense-splitter',
  description: translate('tools.expense-splitter.description'),
  keywords: ['expense', 'split', 'roommate', 'shared cost', '费用', '分摊', '宿舍', '合租'],
  component: () => import('./expense-splitter.vue'),
  icon: Coin,
});
