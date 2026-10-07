import { CalendarEvent } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.campus-planner.title'),
  path: '/campus-planner',
  description: translate('tools.campus-planner.description'),
  keywords: ['exam', 'deadline', 'assignment', 'event', '考试', '作业', '活动', '倒计时'],
  component: () => import('./campus-planner.vue'),
  icon: CalendarEvent,
});
