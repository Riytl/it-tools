export interface DocumentCheckItem {
  id: string
  label: string
  checked: boolean
}

export function checklistProgress(items: DocumentCheckItem[]) {
  const checked = items.filter(item => item.checked).length;
  return {
    checked,
    total: items.length,
    percentage: items.length === 0 ? 0 : Math.round((checked / items.length) * 100),
    remaining: items.filter(item => !item.checked),
  };
}
