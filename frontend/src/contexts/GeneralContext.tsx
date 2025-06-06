import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ErrorPopup } from '../components/common/ErrorPopup/ErrorPopup.tsx';
import { ErrorModal } from '../components/common/ErrorModal/ErrorModal.tsx';
import { getCryptoCurrencies, getFiatCurrencies } from '../services/utils/coinsUtils.ts';
import { useQuery } from '@tanstack/react-query';
import { createFetchSupportedCurrenciesOptions } from '../constants/customQueryOptions.ts';
import { CurrencyResponseDto } from '../api-generated/backend';

interface ErrorPopupMessage {
  id: number;
  text: string;
}

interface ErrorModalMessage {
  title?: string;
  message: string;
}

// Interface pro data kontextu
interface GeneralContextType {
  cookiesAccepted: boolean;
  setCookiesAccepted: (accepted: boolean) => void;
  addErrorPopup: (message: string) => void;
  addErrorModal: (message: string, title?: string) => void;
  supportedFiatCurrencies: CurrencyResponseDto[];
  supportedCryptoCurrencies: CurrencyResponseDto[];
}

// Vytvoření kontextu s výchozími hodnotami
const GeneralContext = createContext<GeneralContextType | undefined>(undefined);

export const useGeneralContext = (): GeneralContextType => {
  const context = useContext(GeneralContext);
  if (!context) throw new Error('useGeneralContext must be used within a GeneralContextProvider');
  return context;
};

// Provider komponenta, která poskytuje kontext
export const GeneralContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cookiesAccepted, setCookiesAccepted] = useState(
    localStorage.getItem('cookiesAccepted') === 'true',
  );

  // Správa 2 typů errorů (popup a modal)
  const [errorPopupMessages, setErrorPopupMessages] = useState<ErrorPopupMessage[]>([]);
  const [modalError, setModalError] = useState<ErrorModalMessage | null>(null);
  const [messageId, setMessageId] = useState(0);

  const addErrorPopup = (message: string) => {
    const id = messageId;
    setMessageId((prev) => prev + 1);
    setErrorPopupMessages((prev) => [...prev, { id, text: message }].slice(-10));
  };

  const addErrorModal = (message: string, title?: string) => {
    setModalError({ message, title });
  };

  const removePopupMessage = (id: number) => {
    setErrorPopupMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  const closeModal = () => {
    setModalError(null);
  };

  // Načtení a refresh povolených fiat/ktrypto měn
  const fetchedCurrenciesResult = useQuery(createFetchSupportedCurrenciesOptions());
  const [supportedFiatCurrencies, setSupportedFiatCurrencies] = useState<CurrencyResponseDto[]>([]);
  const [supportedCryptoCurrencies, setSupportedCryptoCurrencies] = useState<CurrencyResponseDto[]>(
    [],
  );

  // using useEffect to monitor changes in fetchedCurrenciesResult (changes coming from initial fetching or refreshing of coinsData)
  useEffect(() => {
    if (fetchedCurrenciesResult.data && fetchedCurrenciesResult.data.length > 0) {
      setSupportedFiatCurrencies(getFiatCurrencies(fetchedCurrenciesResult.data));
      setSupportedCryptoCurrencies(getCryptoCurrencies(fetchedCurrenciesResult.data));
    }
  }, [fetchedCurrenciesResult.data]);

  // Uložení preference cookies do localStorage
  useEffect(() => {
    localStorage.setItem('cookiesAccepted', cookiesAccepted.toString());
  }, [cookiesAccepted]);

  return (
    <GeneralContext.Provider
      value={{
        cookiesAccepted,
        setCookiesAccepted,
        addErrorPopup,
        addErrorModal,
        supportedFiatCurrencies: supportedFiatCurrencies,
        supportedCryptoCurrencies: supportedCryptoCurrencies,
      }}
    >
      {children}
      <ErrorPopup messages={errorPopupMessages} removeMessage={removePopupMessage} />
      <ErrorModal
        open={!!modalError}
        onClose={closeModal}
        errorMessage={modalError?.message || ''}
        title={modalError?.title}
      />
    </GeneralContext.Provider>
  );
};
