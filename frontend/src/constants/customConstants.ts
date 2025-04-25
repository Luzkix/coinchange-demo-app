import { Language } from './customTypes.ts';

/**
 * Definitions of languages and their properties to be used throughout application
 */
export const Languages: Record<string, Language> = {
  EN: {
    id: 'EN',
    engName: 'English',
    localizedName: 'English',
    languageCountryCode: 'en-US',
    currency: 'USD',
  },
  CS: {
    id: 'CS',
    engName: 'Czech',
    localizedName: 'Čeština',
    languageCountryCode: 'cs-CZ',
    currency: 'EUR',
  },
};