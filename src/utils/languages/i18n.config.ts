// i18n.config.ts
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import { englishSources } from './en.config';
import { spanishSources } from './es.config';

// Set the key-value pairs for the different languages you want to support.
export const i18n = new I18n({
  en: { ...englishSources },
  es: { ...spanishSources },
});

i18n.locale = Localization.getLocales()[0].languageCode;

i18n.enableFallback = true;