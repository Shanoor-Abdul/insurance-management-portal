"use client";

import * as React from "react";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { resources, supportedLngs, defaultLang, isRtl } from "./index";
import type { Lang } from "../types";

if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    lng: defaultLang,
    fallbackLng: "en",
    supportedLngs,
    resources,
    interpolation: { escapeValue: false }
  });
}

export function I18nProvider({
  children,
  lang
}: {
  children: React.ReactNode;
  lang: Lang;
}) {
  React.useEffect(() => {
    i18next.changeLanguage(lang);
  }, [lang]);

  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
}

export { isRtl };
