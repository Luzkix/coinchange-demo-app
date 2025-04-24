import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enCommon from './en/common.json';
import enHomepage from './en/homepage.json';
import enFooter from './en/footer.json';
import csCommon from './cs/common.json';
import csHomepage from './cs/homepage.json';
import csFooter from './cs/footer.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      EN: {
        common: enCommon,
        homepage: enHomepage,
        footer: enFooter,
      },
      CS: {
        common: csCommon,
        homepage: csHomepage,
        footer: csFooter,
      },
    },
    fallbackLng: 'EN',
    ns: ['common', 'homepage', 'footer'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
