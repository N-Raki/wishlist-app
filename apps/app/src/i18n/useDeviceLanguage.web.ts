import { useEffect } from 'react';
import i18n, { preferredLanguage } from './index';

/** Switches pre-rendered French pages to the visitor's language once hydrated. */
export function useDeviceLanguage() {
  useEffect(() => {
    const language = preferredLanguage();
    document.documentElement.lang = language;
    i18n.changeLanguage(language);
  }, []);
}
