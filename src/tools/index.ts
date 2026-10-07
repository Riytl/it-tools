import { tool as campusGapAssistant } from './campus-gap-assistant';
import { tool as gradeCalculator } from './grade-calculator';
import { tool as attendanceCalculator } from './attendance-calculator';
import { tool as campusPlanner } from './campus-planner';
import { tool as documentChecklist } from './document-checklist';
import { tool as referenceFormatter } from './reference-formatter';
import { tool as expenseSplitter } from './expense-splitter';
import { tool as dormRotation } from './dorm-rotation';
import type { ToolCategory } from './tools.types';

export const toolsByCategory: ToolCategory[] = [
  {
    name: 'Academic',
    components: [campusGapAssistant, gradeCalculator, attendanceCalculator, campusPlanner],
  },
  {
    name: 'Writing',
    components: [documentChecklist, referenceFormatter],
  },
  {
    name: 'CampusLife',
    components: [expenseSplitter, dormRotation],
  },
];

export const tools = toolsByCategory.flatMap(({ components }) => components);
export const toolsWithCategory = toolsByCategory.flatMap(({ components, name }) =>
  components.map(tool => ({ category: name, ...tool })),
);
