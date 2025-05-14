import { i18n } from "astro:config/client";
import { normalizeLocale } from "./utils";

export const languages = {
  en: "English",
  fi: "Suomi",
};

export const normalizedLocales = i18n?.locales.map(normalizeLocale);
