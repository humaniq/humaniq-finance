import i18next from "i18next";
import { initReactI18next } from "react-i18next";

export const translationKey = "i18nextLng";

export class TranslationService {
  translate(text: string, ...args: any[]) {
    return i18next.t(text, args);
  }

  async updateLang(lang: string) {
    return i18next.changeLanguage(lang);
  }

  async init() {
    return i18next.use(initReactI18next).init({
      lng: localStorage.getItem(translationKey) || "en",
      fallbackLng: "en",
      returnEmptyString: false,
      debug: false,
      ns: "default",
      keySeparator: " ",
      lowerCaseLng: true,
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
      fallbackNS: "default",
    });
  }
}
