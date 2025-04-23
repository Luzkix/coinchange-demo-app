// src/contexts/GeneralContext.tsx
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Interface pro data kontextu
export interface GeneralContextType {
  language: string;
  setLanguage: (lang: string) => void;
  cookiesAccepted: boolean;
  setCookiesAccepted: (accepted: boolean) => void;
  isAuthenticated: boolean;
}

// Vytvoření kontextu s výchozími hodnotami
const GeneralContext = createContext<GeneralContextType | undefined>(undefined);

// Hook pro použití kontextu
export const useGeneralContext = (): GeneralContextType => {
  const context = useContext(GeneralContext);

  if (context === undefined) {
    throw new Error('useGeneralContext must be used within a GeneralContextProvider');
  }

  return context;
};

interface GeneralContextProviderProps {
  children: ReactNode;
}

// Provider komponenta, která poskytuje kontext
export const GeneralContextProvider: React.FC<GeneralContextProviderProps> = ({ children }) => {
  // Globální stavy sdílené přes kontext
  const [language, setLanguage] = useState<string>(localStorage.getItem('language') || 'en');
  const [cookiesAccepted, setCookiesAccepted] = useState<boolean>(
    localStorage.getItem('cookiesAccepted') === 'true',
  );
  const [isAuthenticated] = useState<boolean>(false);

  // Uložení jazykové preference do localStorage
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Uložení preference cookies do localStorage
  useEffect(() => {
    localStorage.setItem('cookiesAccepted', cookiesAccepted.toString());
  }, [cookiesAccepted]);

  // Hodnota kontextu poskytovaná všem potomkům
  const value: GeneralContextType = {
    language,
    setLanguage,
    cookiesAccepted,
    setCookiesAccepted,
    isAuthenticated,
  };

  return <GeneralContext.Provider value={value}>{children}</GeneralContext.Provider>;
};
