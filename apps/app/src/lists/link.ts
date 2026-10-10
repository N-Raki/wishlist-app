/**
 * Turns what people paste or type into a link we can store: "boutique.fr/article" gains its
 * https://. Only web addresses are accepted, like in the database (no javascript:, data:…).
 */
export function normalizeLink(input: string): { url: string | null } | { error: 'invalid' } {
  const trimmed = input.trim();
  if (trimmed === '') return { url: null };
  const withScheme = /^[a-z][a-z\d+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withScheme);
    const valid =
      (url.protocol === 'https:' || url.protocol === 'http:') &&
      url.hostname.includes('.') &&
      !/\s/.test(withScheme) &&
      withScheme.length <= 2048;
    return valid ? { url: withScheme } : { error: 'invalid' };
  } catch {
    return { error: 'invalid' };
  }
}
