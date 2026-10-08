export interface ExpenseParticipant {
  name: string
  weight: number
}

export interface ExpenseEntry {
  id: string
  title: string
  amount: number
  payer: string
  participants: string[]
}

export interface Settlement {
  from: string
  to: string
  amount: number
}

export function calculateSettlements(participants: ExpenseParticipant[], expenses: ExpenseEntry[]): Settlement[] | undefined {
  if (participants.length < 2 || participants.some(person => !person.name.trim() || person.weight <= 0 || !Number.isFinite(person.weight))) {
    return undefined;
  }

  const names = new Set(participants.map(person => person.name));
  if (names.size !== participants.length) {
    return undefined;
  }
  const balances = new Map(participants.map(person => [person.name, 0]));

  for (const expense of expenses) {
    if (!Number.isFinite(expense.amount) || expense.amount <= 0 || !names.has(expense.payer)) {
      return undefined;
    }

    const includedNames = expense.participants.length > 0 ? [...new Set(expense.participants)] : [...names];
    if (includedNames.some(name => !names.has(name))) {
      return undefined;
    }

    const included = includedNames.map(name => participants.find(person => person.name === name)!);
    const totalCents = Math.round(expense.amount * 100);
    if (!Number.isSafeInteger(totalCents) || totalCents < 1) {
      return undefined;
    }
    // Scale weights to keep their sum finite, then allocate whole cents using
    // the largest fractional remainders. Equal remainders use participant order.
    const largestWeight = included.reduce((largest, person) => Math.max(largest, person.weight), 0);
    const totalWeight = included.reduce((sum, person) => sum + person.weight / largestWeight, 0);
    const shares = included.map((person, index) => {
      const exact = totalCents * ((person.weight / largestWeight) / totalWeight);
      const cents = Math.floor(exact);
      return { person, index, cents, remainder: exact - cents };
    });
    const remainingCents = totalCents - shares.reduce((sum, share) => sum + share.cents, 0);
    [...shares]
      .sort((a, b) => b.remainder - a.remainder || a.index - b.index)
      .slice(0, remainingCents)
      .forEach(share => share.cents++);
    shares.forEach(({ person, cents }) => {
      balances.set(person.name, (balances.get(person.name) ?? 0) - cents);
    });

    balances.set(expense.payer, (balances.get(expense.payer) ?? 0) + totalCents);
  }

  const debtors = [...balances.entries()].filter(([, balance]) => balance < 0).map(([name, balance]) => ({ name, cents: -balance }));
  const creditors = [...balances.entries()].filter(([, balance]) => balance > 0).map(([name, balance]) => ({ name, cents: balance }));
  const settlements: Settlement[] = [];
  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const amount = Math.min(debtors[debtorIndex].cents, creditors[creditorIndex].cents);
    if (amount > 0) {
      settlements.push({ from: debtors[debtorIndex].name, to: creditors[creditorIndex].name, amount: amount / 100 });
    }
    debtors[debtorIndex].cents -= amount;
    creditors[creditorIndex].cents -= amount;
    if (debtors[debtorIndex].cents === 0) debtorIndex++;
    if (creditors[creditorIndex].cents === 0) creditorIndex++;
  }

  return settlements;
}
