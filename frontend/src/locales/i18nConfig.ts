import i18nConfig from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from './en/common.json';
import enCryptocurrenciesPage from './en/cryptocurrenciesPage.json';
import enHomePage from './en/homePage.json';
import enFooter from './en/footer.json';
import csCommon from './cs/common.json';
import csCryptocurrenciesPage from './cs/cryptocurrenciesPage.json';
import csHomePage from './cs/homePage.json';
import csFooter from './cs/footer.json';

i18nConfig
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      EN: {
        common: enCommon,
        cryptocurrenciesPage: enCryptocurrenciesPage,
        homepage: enHomePage,
        footer: enFooter,
      },
      CS: {
        common: csCommon,
        cryptocurrenciesPage: csCryptocurrenciesPage,
        homepage: csHomePage,
        footer: csFooter,
      },
    },
    fallbackLng: 'EN',
    ns: ['common', 'homepage', 'footer', 'cryptocurrenciesPage'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18nConfig;
