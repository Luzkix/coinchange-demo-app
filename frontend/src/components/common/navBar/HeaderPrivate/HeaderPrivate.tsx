import React from 'react';
import { AppBar, Box, Drawer, IconButton, Toolbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import ROUTES from '../../../../constants/routes.ts';
import { changeAndSaveLanguage } from '../../../../locales/i18nConfig.ts';
import NavTab from '../NavTab/NavTab.tsx';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher.tsx';
import LogoLink from '../LogoLink/LogoLink.tsx';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { headerStyles } from '../HeaderPublic/styles.ts';
import { useAuth } from '../../../../contexts/AuthContext.tsx';

const HeaderPublic: React.FC = () => {
  const { t, i18n } = useTranslation(['common']);
  const location = useLocation();
  const { logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLanguageChange = (lng: string) => {
    changeAndSaveLanguage(lng);
  };

  return (
    <AppBar sx={headerStyles.appBar}>
      <Toolbar sx={headerStyles.toolbar}>
        <LogoLink to={ROUTES.PORTFOLIO} />

        {/* Desktop navigace */}
        {!isMobile && (
          <Box sx={headerStyles.navContainer}>
            <NavTab
              label={t('header.portfolio')}
              to={ROUTES.PORTFOLIO}
              active={isActive(ROUTES.PORTFOLIO)}
            />
            <NavTab
              label={t('header.cryptocurrencies')}
              to={ROUTES.CRYPTOCURRENCIES_PRIVATE}
              active={isActive(ROUTES.CRYPTOCURRENCIES_PRIVATE)}
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
        )}

        {/* Mobilní menu */}
        {isMobile && (
          <>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={() => setDrawerOpen(!drawerOpen)}
              sx={headerStyles.menuIconButton}
            >
              <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
              <Box sx={headerStyles.drawerContent} role="presentation">
                <Box sx={theme.mixins.toolbar} />
                <NavTab
                  label={t('header.portfolio')}
                  to={ROUTES.PORTFOLIO}
                  active={isActive(ROUTES.PORTFOLIO)}
                />
                <NavTab
                  label={t('header.cryptocurrencies')}
                  to={ROUTES.CRYPTOCURRENCIES_PRIVATE}
                  active={isActive(ROUTES.CRYPTOCURRENCIES_PRIVATE)}
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
            </Drawer>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default HeaderPublic;
