import React from 'react';
import { AppBar, Box, Drawer, IconButton, Toolbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { headerStyles } from './styles.ts';
import ROUTES from '../../../../constants/routes.ts';
import { changeAndSaveLanguage } from '../../../../locales/i18nConfig.ts';
import NavTab from '../NavTab/NavTab.tsx';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher.tsx';
import LogoLink from '../LogoLink/LogoLink.tsx';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const HeaderPublic: React.FC = () => {
  const { t, i18n } = useTranslation(['common']);
  const location = useLocation();
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
        <Box sx={{ mx: 1 }}>
          <LogoLink to={ROUTES.HOME} />
        </Box>

        {/* Desktop navigace */}
        {!isMobile && (
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
            <NavTab label={t('header.login')} to={ROUTES.LOGIN} active={isActive(ROUTES.LOGIN)} />
            <NavTab
              label={t('header.signUp')}
              to={ROUTES.SIGNUP}
              active={isActive(ROUTES.SIGNUP)}
              variant="primary"
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
              <MenuIcon fontSize="large" />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              slotProps={{ paper: { sx: headerStyles.drawerPaper } }}
            >
              <Box sx={headerStyles.drawerContent} role="presentation">
                <Box sx={theme.mixins.toolbar} />
                <NavTab
                  label={t('header.cryptocurrencies')}
                  to={ROUTES.CRYPTOCURRENCIES}
                  active={isActive(ROUTES.CRYPTOCURRENCIES)}
                  onClick={() => setDrawerOpen(false)}
                />
                <LanguageSwitcher
                  currentLanguage={i18n.language}
                  handleLanguageChange={handleLanguageChange}
                />
                <NavTab
                  label={t('header.login')}
                  to={ROUTES.LOGIN}
                  active={isActive(ROUTES.LOGIN)}
                  onClick={() => setDrawerOpen(false)}
                />
                <NavTab
                  label={t('header.signUp')}
                  to={ROUTES.SIGNUP}
                  active={isActive(ROUTES.SIGNUP)}
                  variant="primary"
                  onClick={() => setDrawerOpen(false)}
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
