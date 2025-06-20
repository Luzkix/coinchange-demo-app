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

/**
 * Own email regex to be used throughout application
 */
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

/**
 * Own password regex (which comply with backend validations) to be used throughout application. Conditions for psw:
 * - at least 4 characters length
 */
export const PASSWORD_REGEX = /^.{4,}$/;

/**
 * Own number > 0 regex to be used throughout application in text fields where we want to be sure, that set number is > 0.
 */
export const NUMBER_BIGGER_THEN_ZERO_REGEX = /^(?:0*\.[1-9]\d*|[1-9]\d*(?:\.\d+)?)$/;

/**
 * search params used in hyperlinks
 */
export const SEARCHPARAM_SOLD_CURRENCY = 'soldCurrencyCode';
export const SEARCHPARAM_BOUGHT_CURRENCY = 'boughtCurrencyCode';
