/** Currencies offered when adding a wish; the database accepts any ISO 4217 code. */
export const currencies = ['EUR', 'USD', 'GBP', 'CHF', 'CAD'] as const;

const maxCents = 99_999_999;

/**
 * Reads a price as people type it ("129", "12,50", "1 299.9", "12 €") into cents.
 * Empty means no price; anything else unreadable is an error rather than a guess.
 */
export function parsePrice(input: string): { cents: number | null } | { error: 'invalid' } {
  const compact = input.replace(/[\s  €$£]/g, '').replace(/(CHF|CAD)$/i, '');
  if (compact === '') return { cents: null };
  const match = compact.match(/^(\d+)(?:[.,](\d{1,2}))?$/);
  if (!match) return { error: 'invalid' };
  const cents = Number(match[1]) * 100 + Number((match[2] ?? '0').padEnd(2, '0'));
  return cents > maxCents ? { error: 'invalid' } : { cents };
}

/** "129 €", "12,50 €", "$129": round amounts drop their cents. */
export function formatPrice(cents: number, currency: string, language: string) {
  return new Intl.NumberFormat(language, {
    style: 'currency',
    currency,
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

/** The value to put back in the price field when editing: "129" or "12,50" in French. */
export function priceInput(cents: number | null, language: string) {
  if (cents === null) return '';
  return new Intl.NumberFormat(language, {
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    useGrouping: false,
  }).format(cents / 100);
}
