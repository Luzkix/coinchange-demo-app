import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ErrorPopup } from '../components/common/ErrorPopup/ErrorPopup.tsx';
import { ErrorModal } from '../components/common/ErrorModal/ErrorModal.tsx';

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
  isAuthenticated: boolean;
  setIsAuthenticated: (authenticated: boolean) => void;
  addErrorPopup: (message: string) => void;
  addErrorModal: (message: string, title?: string) => void;
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  // Uložení preference cookies do localStorage
  useEffect(() => {
    localStorage.setItem('cookiesAccepted', cookiesAccepted.toString());
  }, [cookiesAccepted]);

  return (
    <GeneralContext.Provider
      value={{
        cookiesAccepted,
        setCookiesAccepted,
        isAuthenticated,
        setIsAuthenticated,
        addErrorPopup,
        addErrorModal,
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
