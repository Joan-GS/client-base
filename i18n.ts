import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationCA from "./src/locales/ca/translation.json";
import translationES from "./src/locales/es/translation.json";
import translationEN from "./src/locales/en/translation.json";

const resources = {
  en: {
    translation: translationEN,
  },
  es: {
    translation: translationES,
  },
  ca: {
    translation: translationCA,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    returnEmptyString: false,
    appendNamespaceToMissingKey: false,
  });

export default i18n;
