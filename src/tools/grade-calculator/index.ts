import { Calculator } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.grade-calculator.title'),
  path: '/grade-calculator',
  description: translate('tools.grade-calculator.description'),
  keywords: ['grade', 'gpa', 'credit', 'average', '成绩', '绩点', '学分', '加权平均'],
  component: () => import('./grade-calculator.vue'),
  icon: Calculator,
});
