import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Platform } from 'react-native';
import { en } from './en';
import { fr } from './fr';

export type Language = 'fr' | 'en';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: { translation: typeof fr };
  }
}

/** French unless the device prefers English. */
export function preferredLanguage(): Language {
  return getLocales()[0]?.languageCode === 'en' ? 'en' : 'fr';
}

i18n.use(initReactI18next).init({
  resources: { fr: { translation: fr }, en: { translation: en } },
  // Web pages are pre-rendered in French; the root layout switches after hydration.
  lng: Platform.OS === 'web' ? 'fr' : preferredLanguage(),
  fallbackLng: 'fr',
  interpolation: { escapeValue: false },
});

export default i18n;
