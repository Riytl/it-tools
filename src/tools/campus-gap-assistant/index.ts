import { Calendar } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.campus-gap-assistant.title'),
  path: '/campus-gap-assistant',
  description: translate('tools.campus-gap-assistant.description'),
  keywords: ['campus', 'timetable', 'schedule', 'free time', 'class conflict', 'student', '校园', '课表', '空闲时间', '课程冲突', '自习'],
  component: () => import('./campus-gap-assistant.vue'),
  icon: Calendar,
});
