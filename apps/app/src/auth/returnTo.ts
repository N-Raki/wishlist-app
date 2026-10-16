// On the web, signing in with a provider leaves the page. Where the user was, and the wish they
// were reserving, wait in the tab's session storage until /auth/callback reads them back.
export type ReturnTo = { list?: string; wish?: string };

const key = 'wishme.returnTo';

export const returnTo = {
  save(value: ReturnTo) {
    sessionStorage.setItem(key, JSON.stringify(value));
  },
  read(): ReturnTo {
    const value = typeof sessionStorage === 'undefined' ? null : sessionStorage.getItem(key);
    if (value === null) return {};
    try {
      return JSON.parse(value) as ReturnTo;
    } catch {
      return {};
    }
  },
  clear() {
    sessionStorage.removeItem(key);
  },
};
