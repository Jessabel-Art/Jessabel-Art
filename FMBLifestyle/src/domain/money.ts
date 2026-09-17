export type MoneyCents = number;

export function dollarsToCents(amount: number): MoneyCents {
  return Math.round((Number.isFinite(amount) ? amount : 0) * 100);
}

export function centsToDollars(cents: MoneyCents): number {
  return cents / 100;
}

export function normalizeMoneyAmount(amount: number): number {
  return centsToDollars(dollarsToCents(amount));
}

export function parseMoneyInput(value: string): number {
  return normalizeMoneyAmount(parseFloat(value));
}

export function isValidMoneyAmount(amount: number, options: { allowNegative?: boolean } = {}): boolean {
  if (!Number.isFinite(amount)) return false;
  return options.allowNegative ? true : amount >= 0;
}
