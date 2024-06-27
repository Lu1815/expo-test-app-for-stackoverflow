// i18nContext.tsx
import * as Localization from "expo-localization";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { i18n } from "../languages/i18n.config";

type I18nContextType = {
  i18n: typeof i18n;
  locale: string;
  changeLanguage: (newLocale: string) => void;
};
const I18nContext = createContext<I18nContextType | null>(null);

type I18nProviderProps = {
  children: ReactNode;
};

export const I18nProvider = ({ children }: I18nProviderProps) => {
  const [locale, setLocale] = useState(Localization.getLocales()[0].languageCode);
  // For some reason, when changing the locale, the component does not re-render, so in order to force the re-render, we use a key
  const [key, setKey] = useState(0); // Key to force re-render

  useEffect(() => {
    i18n.locale = locale;
    setKey(prevKey => prevKey + 1);
  }, [locale]);

  const changeLanguage = (newLocale: string) => {
    setLocale(previousLocale => previousLocale = newLocale);
  };

  return (
    <I18nContext.Provider value={{ i18n, locale, changeLanguage }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within a I18nProvider");
  }
  return context;
};
