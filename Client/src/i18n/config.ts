import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

export const supportedLanguages = {
    en: "English",
    fr: "Français"
};

i18n.use(HttpApi)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        supportedLngs: Object.keys(supportedLanguages),
        debug: true,
        detection: {
            order: ['navigator']
        },
        // Normally, we want `escapeValue: true` as it ensures that i18next escapes any code in
        // translation messages, safeguarding against XSS (cross-site scripting) attacks.
        // However, React does this escaping itself, so we turn it off in i18next.
        interpolation: {
            escapeValue: false,
        }
    }
);

export default i18n;