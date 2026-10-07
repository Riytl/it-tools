import { Book } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.reference-formatter.title'),
  path: '/reference-formatter',
  description: translate('tools.reference-formatter.description'),
  keywords: ['reference', 'citation', 'bibliography', 'apa', 'gbt', '参考文献', '引用', '文献格式'],
  component: () => import('./reference-formatter.vue'),
  icon: Book,
});
