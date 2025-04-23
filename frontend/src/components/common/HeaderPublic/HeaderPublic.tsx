import React from 'react';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { headerStyles } from './styles';
import ROUTES from '../../../constants/routes';
import ContentBox from '../../ui/ContentBox';
import { useGeneralContext } from '../../../contexts/GeneralContext.tsx';

export const HeaderPublic: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const { language, setLanguage } = useGeneralContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const changeLanguage = (lng: string) => {
    setLanguage(lng);
    i18n.changeLanguage(lng);
    handleClose();
  };

  return (
    <AppBar sx={headerStyles.appBar}>
      <ContentBox>
        <Toolbar sx={headerStyles.toolbar}>
          <Typography variant="h6" component={Link} to={ROUTES.HOME} sx={headerStyles.logo}>
            CoinChange
          </Typography>

          <Box sx={headerStyles.navContainer}>
            <Button component={Link} to={ROUTES.CRYPTOCURRENCIES} color="inherit">
              {t('header.cryptocurrencies')}
            </Button>

            <IconButton
              onClick={handleClick}
              color="inherit"
              size="large"
              aria-label={t('header.language')}
            >
              <LanguageIcon />
            </IconButton>

            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem selected={language === 'en'} onClick={() => changeLanguage('en')}>
                English
              </MenuItem>
              <MenuItem selected={language === 'cs'} onClick={() => changeLanguage('cs')}>
                Čeština
              </MenuItem>
            </Menu>

            <Button component={Link} to={ROUTES.SIGNIN} color="inherit">
              {t('header.signIn')}
            </Button>
            <Button component={Link} to={ROUTES.SIGNUP} variant="contained" color="primary">
              {t('header.signUp')}
            </Button>
          </Box>
        </Toolbar>
      </ContentBox>
    </AppBar>
  );
};

export default HeaderPublic;
