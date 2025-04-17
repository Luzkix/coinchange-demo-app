import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Route, Routes } from 'react-router-dom';
import theme from './styles/theme';
import ROUTES from './constants/routes';

// Layouts
import PublicAccessLayout from './layouts/skeleton/publicAccessLayout';

// Pages (obsahují pouze specifický obsah dané stránky)
import HomePage from './pages/HomePage';
// import CryptocurrenciesPage from './pages/CryptocurrenciesPage'; // budoucí stránky
// import SignInPage from './pages/SignInPage';
// import SignUpPage from './pages/SignUpPage';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Veřejné stránky - používají publicAccessLayout */}
        <Route element={<PublicAccessLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          {/* <Route path={ROUTES.CRYPTOCURRENCIES} element={<CryptocurrenciesPage />} /> */}
          {/* <Route path={ROUTES.SIGNIN} element={<SignInPage />} /> */}
          {/* <Route path={ROUTES.SIGNUP} element={<SignUpPage />} /> */}
        </Route>

        {/* Zde by v budoucnu byly další routy, např. pro přihlášené uživatele s jiným layoutem */}

        {/* Fallback route */}
        <Route path="*" element={<PublicAccessLayout />}>
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
};

export default App;
