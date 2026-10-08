import { describe, expect, it } from 'vitest';
import { calculateSettlements } from './expense-splitter.service';

describe('campus expense settlements', () => {
  const people = ['A', 'B', 'C'].map(name => ({ name, weight: 1 }));
  const expense = { id: 'test', title: 'Shared meal', amount: 10.01, payer: 'A', participants: [] };

  it('distributes indivisible cents fairly instead of assigning all rounding to the last person', () => {
    expect(calculateSettlements(people, [expense])).toEqual([
      { from: 'B', to: 'A', amount: 3.34 },
      { from: 'C', to: 'A', amount: 3.33 },
    ]);
  });

  it('uses the fractional remainders when weights differ', () => {
    expect(calculateSettlements(people.map((person, index) => ({ ...person, weight: index + 1 })), [expense])).toEqual([
      { from: 'B', to: 'A', amount: 3.34 },
      { from: 'C', to: 'A', amount: 5 },
    ]);
  });

  it('supports an excluded payer and deduplicates selected participants', () => {
    expect(calculateSettlements(people, [{ ...expense, amount: 10, participants: ['B', 'C', 'B'] }])).toEqual([
      { from: 'B', to: 'A', amount: 5 },
      { from: 'C', to: 'A', amount: 5 },
    ]);
  });

  it('rejects invalid weights, participants and money', () => {
    expect(calculateSettlements([{ name: 'A', weight: 0 }, people[1]], [expense])).toBeUndefined();
    expect(calculateSettlements(people, [{ ...expense, participants: ['missing'] }])).toBeUndefined();
    expect(calculateSettlements(people, [{ ...expense, amount: Number.NaN }])).toBeUndefined();
  });
});
