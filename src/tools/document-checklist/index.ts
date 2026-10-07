import { FileText } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.document-checklist.title'),
  path: '/document-checklist',
  description: translate('tools.document-checklist.description'),
  keywords: ['document', 'format', 'checklist', 'notice', '公文', '格式', '规范', '清单'],
  component: () => import('./document-checklist.vue'),
  icon: FileText,
});
