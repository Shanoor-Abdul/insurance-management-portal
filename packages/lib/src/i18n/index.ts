import { en } from "./messages/en";
import { ar } from "./messages/ar";
import type { Lang } from "../types";

export const resources = { en: { translation: en }, ar: { translation: ar } };

export const supportedLngs: Lang[] = ["en", "ar"];

export const defaultLang: Lang = "en";

export const isRtl = (lang: Lang) => lang === "ar";
