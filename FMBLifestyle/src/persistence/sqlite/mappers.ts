import { centsToDollars, dollarsToCents, normalizeMoneyAmount } from '../../domain/money';

export type SqliteMoneyCents = number;
export type InterestRateBasisPoints = number;

export function toSqliteCents(amount: number): SqliteMoneyCents {
  return dollarsToCents(normalizeMoneyAmount(amount));
}

export function fromSqliteCents(cents: SqliteMoneyCents): number {
  return normalizeMoneyAmount(centsToDollars(cents));
}

export function toBasisPoints(percentRate: number): InterestRateBasisPoints {
  const safeRate = Number.isFinite(percentRate) ? percentRate : 0;
  return Math.max(0, Math.round(safeRate * 100));
}

export function fromBasisPoints(basisPoints: InterestRateBasisPoints): number {
  const safeBasisPoints = Number.isFinite(basisPoints) ? basisPoints : 0;
  return Math.max(0, safeBasisPoints) / 100;
}

export function optionalText(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function nullableToUndefined<T>(value: T | null | undefined): T | undefined {
  return value ?? undefined;
}
