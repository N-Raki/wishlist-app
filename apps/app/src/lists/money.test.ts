import { formatPrice, parsePrice, priceInput } from './money';

describe('parsePrice', () => {
  it.each([
    ['129', 12900],
    ['12,5', 1250],
    ['12.50', 1250],
    ['1 299,99', 129999],
    ['1 299', 129900],
    ['35 €', 3500],
    ['20 CHF', 2000],
    ['0', 0],
  ])('reads %s', (input, cents) => {
    expect(parsePrice(input)).toEqual({ cents });
  });

  it('treats an empty field as no price', () => {
    expect(parsePrice('  ')).toEqual({ cents: null });
  });

  it.each(['abc', '12,345', '-5', '1.000,00', '1000000'])('refuses %s', (input) => {
    expect(parsePrice(input)).toEqual({ error: 'invalid' });
  });
});

describe('formatPrice', () => {
  it('drops the cents of round amounts', () => {
    expect(formatPrice(12900, 'EUR', 'fr')).toBe('129 €');
  });

  it('keeps the cents otherwise', () => {
    expect(formatPrice(1250, 'USD', 'en')).toBe('$12.50');
  });
});

describe('priceInput', () => {
  it('gives back what the user would have typed', () => {
    expect(priceInput(129999, 'fr')).toBe('1299,99');
    expect(priceInput(3500, 'en')).toBe('35');
    expect(priceInput(null, 'fr')).toBe('');
  });
});
