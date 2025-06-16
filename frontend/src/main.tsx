import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './locales/i18nConfig.ts'; // Initialize i18n
import App from './App';
import { GeneralContextProvider } from './contexts/GeneralContext.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { setApiBaseToProxyUrl } from '../proxy-server/setApiBase.ts';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // data jsou okamžitě po načtení označena jako stará a při dalším fetchi se načítají znovu. Než se načtou, zobrazují se data z cache (pokud neuplynula platnost cache)
      gcTime: 1 * 60 * 1000, // (1min) - garbage collection time - doba, po kterou budou data uložena v cache (tato data se zobrazí než se načtou nová data)
      refetchOnWindowFocus: true, // Při návratu uživatele do okna (focus) se dotazy automaticky refetchují, pokud jsou stale.
      refetchOnMount: true, // Při mountu komponenty se dotaz znovu fetchuje, pokud jsou data stale.
      retry: false, // Dotaz se při chybě neopakuje
    },
  },
});

// Initialization of alternative BASE urls at app startup using own proxy server to deal with CORS errors
setApiBaseToProxyUrl(true);

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
