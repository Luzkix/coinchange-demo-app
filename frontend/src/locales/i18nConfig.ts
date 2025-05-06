import i18nConfig from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from './en/common.json';
import enCryptocurrenciesPage from './en/cryptocurrenciesPage.json';
import enHomePage from './en/homePage.json';
import enFooter from './en/footer.json';
import enErrors from './en/errors.json';
import csCommon from './cs/common.json';
import csCryptocurrenciesPage from './cs/cryptocurrenciesPage.json';
import csHomePage from './cs/homePage.json';
import csFooter from './cs/footer.json';
import csErrors from './cs/errors.json';

// Function to change language and its saving to localStorage so the users choice is remembered
export const changeAndSaveLanguage = (newLanguage: string) => {
  i18nConfig.changeLanguage(newLanguage);
  localStorage.setItem('selectedLanguage', newLanguage);
};

i18nConfig.use(initReactI18next).init({
  resources: {
    EN: {
      common: enCommon,
      cryptocurrenciesPage: enCryptocurrenciesPage,
      homepage: enHomePage,
      footer: enFooter,
      errors: enErrors,
    },
    CS: {
      common: csCommon,
      cryptocurrenciesPage: csCryptocurrenciesPage,
      homepage: csHomePage,
      footer: csFooter,
      errors: csErrors,
    },
  },
  lng: localStorage.getItem('selectedLanguage') || 'EN', // using of last saved language or 'EN'
  fallbackLng: 'EN', // backup
  ns: ['common', 'homepage', 'footer', 'cryptocurrenciesPage', 'errors'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
});

export default i18nConfig;
