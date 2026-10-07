export type GradeMode = 'simple' | 'weighted' | 'gpa'

export interface GradeEntry {
  id: string
  name: string
  score: number
  credits: number
}

export interface GradePointRule {
  minimumScore: number
  points: number
}

export interface GradeResult {
  value: number
  totalCredits: number
}

export function parseGradePointRules(value: string): GradePointRule[] | undefined {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return undefined;
  }

  const parts = trimmedValue.split(/[\n,;]+/);
  if (parts.some(part => !part.trim())) {
    return undefined;
  }

  const rules: GradePointRule[] = [];
  for (const part of parts) {
    const fields = part.split(/[:=]/).map(item => item.trim());
    if (fields.length !== 2 || fields.some(field => !/^\d+(?:\.\d+)?$/.test(field))) {
      return undefined;
    }

    rules.push({ minimumScore: Number(fields[0]), points: Number(fields[1]) });
  }

  if (rules.length === 0 || rules.some(rule => !Number.isFinite(rule.minimumScore) || !Number.isFinite(rule.points)
    || rule.minimumScore < 0 || rule.minimumScore > 100 || rule.points < 0 || rule.points > 5)) {
    return undefined;
  }

  const uniqueThresholds = new Set(rules.map(rule => rule.minimumScore));
  if (uniqueThresholds.size !== rules.length) {
    return undefined;
  }

  return rules.sort((a, b) => b.minimumScore - a.minimumScore);
}

export function scoreToGradePoint(score: number, rules: GradePointRule[]) {
  return rules.find(rule => score >= rule.minimumScore)?.points ?? 0;
}

export function calculateGrades(entries: GradeEntry[], mode: GradeMode, rules: GradePointRule[] = []): GradeResult | undefined {
  if (entries.length === 0 || entries.some(entry => !Number.isFinite(entry.score) || entry.score < 0 || entry.score > 100
    || !Number.isFinite(entry.credits) || entry.credits <= 0)) {
    return undefined;
  }

  const totalCredits = entries.reduce((total, entry) => total + entry.credits, 0);
  let value: number;

  if (mode === 'simple') {
    value = entries.reduce((total, entry) => total + entry.score, 0) / entries.length;
  }
  else if (mode === 'weighted') {
    value = entries.reduce((total, entry) => total + entry.score * entry.credits, 0) / totalCredits;
  }
  else {
    if (rules.length === 0) {
      return undefined;
    }
    value = entries.reduce((total, entry) => total + scoreToGradePoint(entry.score, rules) * entry.credits, 0) / totalCredits;
  }

  return { value, totalCredits };
}
