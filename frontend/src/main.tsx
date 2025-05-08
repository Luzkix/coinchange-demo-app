import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './locales/i18nConfig.ts'; // Initialize i18n
import App from './App';
import { CoinsDataService } from './services/dataServices/CoinsDataService.ts';
import { GeneralContextProvider } from './contexts/GeneralContext.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Initialization of alternative BASE urls at app startup using own proxy server to deal with CORS errors
CoinsDataService.initializeApi();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <GeneralContextProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </GeneralContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
