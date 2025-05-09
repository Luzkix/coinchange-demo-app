import React from 'react';
import { AppBar, Box, Toolbar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import ROUTES from '../../../../constants/routes.ts';
import { changeAndSaveLanguage } from '../../../../locales/i18nConfig.ts';
import NavTab from '../NavTab/NavTab.tsx';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher.tsx';
import LogoLink from '../LogoLink/LogoLink.tsx';
import ContentBox from '../../../ui/ContentBox/ContentBox.tsx';
import { headerStyles } from '../HeaderPublic/styles.ts';
import { useAuth } from '../../../../contexts/AuthContext.tsx';

const HeaderPrivate: React.FC = () => {
  const { t, i18n } = useTranslation(['common']);
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLanguageChange = (lng: string) => {
    changeAndSaveLanguage(lng);
  };

  return (
    <AppBar position="sticky" sx={headerStyles.appBar}>
      <ContentBox>
        <Toolbar sx={headerStyles.toolbar} disableGutters>
          <LogoLink to={ROUTES.PORTFOLIO} />

          <Box sx={headerStyles.navContainer}>
            <NavTab
              label={t('header.dashboard')}
              to={ROUTES.PORTFOLIO}
              active={isActive(ROUTES.PORTFOLIO)}
            />
            <NavTab
              label={t('header.cryptocurrencies')}
              to={ROUTES.CRYPTOCURRENCIES}
              active={isActive(ROUTES.CRYPTOCURRENCIES)}
            />
            <LanguageSwitcher
              currentLanguage={i18n.language}
              handleLanguageChange={handleLanguageChange}
            />
            <NavTab
              label={t('header.logout')}
              to={ROUTES.HOME}
              active={false}
              variant="primary"
              onClick={logout}
            />
          </Box>
        </Toolbar>
      </ContentBox>
    </AppBar>
  );
};

export default HeaderPrivate;
