import React from 'react';
import { AppBar, Box, Toolbar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { headerStyles } from './styles.ts';
import ROUTES from '../../../../constants/routes.ts';
import { changeAndSaveLanguage } from '../../../../locales/i18nConfig.ts';
import NavTab from '../NavTab/NavTab.tsx';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher.tsx';
import LogoLink from '../LogoLink/LogoLink.tsx';
import ContentBox from '../../../ui/ContentBox/ContentBox.tsx';

const HeaderPublic: React.FC = () => {
  const { t, i18n } = useTranslation(['common']);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLanguageChange = (lng: string) => {
    changeAndSaveLanguage(lng);
  };

  return (
    <AppBar position="sticky" sx={headerStyles.appBar}>
      <ContentBox>
        <Toolbar sx={headerStyles.toolbar}>
          <LogoLink />

          <Box sx={headerStyles.navContainer}>
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
              label={t('header.signIn')}
              to={ROUTES.SIGNIN}
              active={isActive(ROUTES.SIGNIN)}
            />
            <NavTab
              label={t('header.signUp')}
              to={ROUTES.SIGNUP}
              active={isActive(ROUTES.SIGNUP)}
              variant="primary"
            />
          </Box>
        </Toolbar>
      </ContentBox>
    </AppBar>
  );
};

export default HeaderPublic;
