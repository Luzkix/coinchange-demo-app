import { FC } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Route, Routes } from 'react-router-dom';
import theme from './styles/theme';
import ROUTES from './constants/routes';

// Výchozí 'skeleton' layout je použit na všech stránkách dané sekce (typicky obsahuje hlavičku a patičku případně cookies banner)
import PublicLayout from './layouts/skeleton/publicLayout/PublicLayout.tsx';

// Pages (obsahují pouze specifický obsah dané stránky)
import HomePage from './pages/HomePage';
import { GeneralContextProvider } from './contexts/GeneralContext.tsx';
import CryptocurrenciesPage from './pages/CryptocurrenciesPage.tsx';

const App: FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GeneralContextProvider>
        <Routes>
          {/* Veřejné stránky (== ty bez přihlášení uživatele) - používají publicLayout */}
          <Route element={<PublicLayout />}>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.CRYPTOCURRENCIES} element={<CryptocurrenciesPage />} />
            {/* <Route path={ROUTES.SIGNIN} element={<SignInPage />} /> */}
            {/* <Route path={ROUTES.SIGNUP} element={<SignUpPage />} /> */}
          </Route>

          {/* Zde by v budoucnu byly další routy, např. pro přihlášené uživatele s jiným layoutem */}

          {/* Fallback route */}
          <Route path="*" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
          </Route>
        </Routes>
      </GeneralContextProvider>
    </ThemeProvider>
  );
};

export default App;
