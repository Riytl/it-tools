import { Home } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.dorm-rotation.title'),
  path: '/dorm-rotation',
  description: translate('tools.dorm-rotation.description'),
  keywords: ['dorm', 'chore', 'rotation', '宿舍', '值日', '轮换', '分工'],
  component: () => import('./dorm-rotation.vue'),
  icon: Home,
});
