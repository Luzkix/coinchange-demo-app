import { FC } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Navigate, Route, Routes } from 'react-router-dom';
import theme from './styles/theme';
import ROUTES from './constants/routes';
import PublicLayout from './layouts/skeleton/PublicLayout/PublicLayout.tsx';
import HomePage from './pages/HomePage';
import CryptocurrenciesPage from './pages/CryptocurrenciesPage.tsx';
import PortfolioPage from './pages/PortfolioPage.tsx';
import PrivateLayout from './layouts/skeleton/PrivateLayout/PrivateLayout.tsx';
import SignInPage from './pages/SignInPage.tsx';
import SignUpPage from './pages/SignUpPage.tsx';
import PublicRoute from './layouts/skeleton/PublicRoute/PublicRoute.tsx';
import PrivateRoute from './layouts/skeleton/PrivateRoute/PrivateRoute.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import TradePage from './pages/TradePage.tsx';

const App: FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Veřejné routy */}
        <Route
          element={
            <PublicRoute>
              <PublicLayout />
            </PublicRoute>
          }
        >
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.CRYPTOCURRENCIES} element={<CryptocurrenciesPage />} />
          <Route path={ROUTES.LOGIN} element={<SignInPage />} />
          <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />
        </Route>

        {/* Privátní routy */}
        <Route
          element={
            <PrivateRoute>
              <PrivateLayout />
            </PrivateRoute>
          }
        >
          <Route path={ROUTES.PORTFOLIO} element={<PortfolioPage />} />
          <Route path={ROUTES.TRADE} element={<TradePage />} />
          <Route path={ROUTES.CRYPTOCURRENCIES_PRIVATE} element={<CryptocurrenciesPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
