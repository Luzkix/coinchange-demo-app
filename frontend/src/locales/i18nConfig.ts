import i18nConfig from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from './en/common.json';
import enCryptocurrenciesPage from './en/cryptocurrenciesPage.json';
import enHomePage from './en/homePage.json';
import enFooter from './en/footer.json';
import enErrors from './en/errors.json';
import enSignInSignUpPage from './en/signInSignUpPage.json';
import enProfilePage from './en/profilePage.json';
import enPortfolioPage from './en/portfolioPage.json';
import enTradePage from './en/tradePage.json';
import csCommon from './cs/common.json';
import csCryptocurrenciesPage from './cs/cryptocurrenciesPage.json';
import csHomePage from './cs/homePage.json';
import csFooter from './cs/footer.json';
import csErrors from './cs/errors.json';
import csSignInSignUpPage from './cs/signInSignUpPage.json';
import csProfilePage from './cs/profilePage.json';
import csPortfolioPage from './cs/portfolioPage.json';
import csTradePage from './cs/tradePage.json';

// Function to change language and its saving to localStorage so the users choice is remembered
export const changeAndSaveLanguage = (newLanguage: string) => {
  i18nConfig.changeLanguage(newLanguage);
  localStorage.setItem('coinChangeSelectedLanguage', newLanguage);
};

i18nConfig.use(initReactI18next).init({
  resources: {
    EN: {
      common: enCommon,
      footer: enFooter,
      errors: enErrors,
      homepage: enHomePage,
      cryptocurrenciesPage: enCryptocurrenciesPage,
      signInSignUpPage: enSignInSignUpPage,
      profilePage: enProfilePage,
      portfolioPage: enPortfolioPage,
      tradePage: enTradePage,
    },
    CS: {
      common: csCommon,
      footer: csFooter,
      errors: csErrors,
      homepage: csHomePage,
      cryptocurrenciesPage: csCryptocurrenciesPage,
      signInSignUpPage: csSignInSignUpPage,
      profilePage: csProfilePage,
      portfolioPage: csPortfolioPage,
      tradePage: csTradePage,
    },
  },
  lng: localStorage.getItem('coinChangeSelectedLanguage') || 'EN', // using of last saved language or 'EN'
  fallbackLng: 'EN', // backup
  ns: [
    'common',
    'footer',
    'errors',
    'homepage',
    'cryptocurrenciesPage',
    'signInSignUpPage',
    'profilePage',
    'portfolioPage',
    'tradePage',
  ],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
});

export default i18nConfig;
