import { ClipboardCheck } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.attendance-calculator.title'),
  path: '/attendance-calculator',
  description: translate('tools.attendance-calculator.description'),
  keywords: ['attendance', 'absence', 'class', '出勤', '缺勤', '考勤'],
  component: () => import('./attendance-calculator.vue'),
  icon: ClipboardCheck,
});
