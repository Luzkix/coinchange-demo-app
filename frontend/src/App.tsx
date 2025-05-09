import { FC } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Navigate, Route, Routes } from 'react-router-dom';
import theme from './styles/theme';
import ROUTES from './constants/routes';

// Výchozí 'skeleton' layout je použit na všech stránkách dané sekce (typicky obsahuje hlavičku a patičku případně cookies banner)
import PublicLayout from './layouts/skeleton/publicLayout/PublicLayout.tsx';

import HomePage from './pages/HomePage';
import CryptocurrenciesPage from './pages/CryptocurrenciesPage.tsx';
import PortfolioPage from './pages/PortfolioPage.tsx';
import PrivateLayout from './layouts/skeleton/privateLayout/PrivateLayout.tsx';
import { useAuth } from './contexts/AuthContext.tsx';
import LoginPage from './pages/LoginPage.tsx';
import SignUpPage from './pages/SignUpPage.tsx';

// Komponenta pro kontrolu přihlášení
const ProtectedRoute: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to={ROUTES.HOME} />;
};

const App: FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Veřejné routy */}
        <Route element={<PublicLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.CRYPTOCURRENCIES} element={<CryptocurrenciesPage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />
        </Route>

        {/* Privátní routy */}
        <Route
          element={
            <ProtectedRoute>
              <PrivateLayout />
            </ProtectedRoute>
          }
        >
          <Route path={ROUTES.PORTFOLIO} element={<PortfolioPage />} />
          <Route path={ROUTES.CRYPTOCURRENCIES_PRIVATE} element={<CryptocurrenciesPage />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
