import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import HeaderPublic from '../../../components/common/HeaderPublic';
import Footer from '../../../components/common/Footer';
import CookieBanner from '../../../components/common/CookieBanner';

// Interface for context data passed to children
export interface PublicAccessLayoutContextType {
  language: string;
  setLanguage: (lang: string) => void;
  cookiesAccepted: boolean;
  setCookiesAccepted: (accepted: boolean) => void;
  isAuthenticated: boolean;
}

// Create context to share data with all children
export const PublicAccessLayoutContext = React.createContext<
  PublicAccessLayoutContextType | undefined
>(undefined);

const PublicAccessLayout: React.FC = () => {
  // Global states that will be shared with children via context
  const [language, setLanguage] = useState<string>(localStorage.getItem('language') || 'en');
  const [cookiesAccepted, setCookiesAccepted] = useState<boolean>(
    localStorage.getItem('cookiesAccepted') === 'true',
  );
  // In a real app, you would check authentication status from JWT or session
  const [isAuthenticated] = useState<boolean>(false);

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Save cookies preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cookiesAccepted', cookiesAccepted.toString());
  }, [cookiesAccepted]);

  // Context value that will be provided to all children
  const contextValue: PublicAccessLayoutContextType = {
    language,
    setLanguage,
    cookiesAccepted,
    setCookiesAccepted,
    isAuthenticated,
  };

  return (
    <PublicAccessLayoutContext.Provider value={contextValue}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <HeaderPublic />
        <Box component="main" sx={{ flexGrow: 1 }}>
          {/* Outlet renders the child route's element */}
          <Outlet />
        </Box>
        <Footer />
        {!cookiesAccepted && (
          <CookieBanner onAccept={() => setCookiesAccepted(true)} onClose={() => {}} />
        )}
      </Box>
    </PublicAccessLayoutContext.Provider>
  );
};

export default PublicAccessLayout;
