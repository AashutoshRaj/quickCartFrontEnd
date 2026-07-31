import type { CurrencyCode } from '../types/index';

export const SUPPORTED_CURRENCIES: CurrencyCode[] = [
  'USD',
  'EUR',
  'GBP',
  'INR',
  'JPY',
  'AUD',
  'CAD',
  'AED',
];

export const DEFAULT_CURRENCY: CurrencyCode = 'USD';

export const normalizeCurrencyCode = (currency?: string): CurrencyCode => {
  if (!currency || typeof currency !== 'string') {
    return DEFAULT_CURRENCY;
  }

  const normalized = currency.toUpperCase() as CurrencyCode;
  return SUPPORTED_CURRENCIES.includes(normalized) ? normalized : DEFAULT_CURRENCY;
};

export const formatCurrency = (
  value: number,
  currency?: string,
  locale?: string,
  maximumFractionDigits = 2,
): string => {
  const normalizedCurrency = normalizeCurrencyCode(currency);
  const amount = Number(value) || 0;

  return new Intl.NumberFormat(locale || undefined, {
    style: 'currency',
    currency: normalizedCurrency,
    maximumFractionDigits,
  }).format(amount);
};
