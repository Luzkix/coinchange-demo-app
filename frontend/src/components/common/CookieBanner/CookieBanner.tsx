import { Box, Button, Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { cookieBannerStyles } from './styles';

interface CookieBannerProps {
  onAccept: () => void;
  onClose: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onAccept, onClose }) => {
  const { t } = useTranslation('common');

  const handleAccept = () => {
    onAccept();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Box sx={cookieBannerStyles.banner}>
      <Typography variant="body2" sx={cookieBannerStyles.text}>
        {t('cookieBanner.message')}{' '}
        <Link component="span" sx={cookieBannerStyles.link}>
          {t('cookieBanner.manageSettings')}
        </Link>{' '}
        {t('cookieBanner.additionalInfo')}{' '}
        <Link component="span" sx={cookieBannerStyles.link}>
          {t('cookieBanner.cookiePolicy')}
        </Link>
        .
      </Typography>

      <Box sx={cookieBannerStyles.buttons}>
        <Button variant="outlined" color="inherit" onClick={handleClose}>
          {t('cookieBanner.close')}
        </Button>
        <Button variant="contained" color="primary" onClick={handleAccept}>
          {t('cookieBanner.acceptAll')}
        </Button>
      </Box>
    </Box>
  );
};

export default CookieBanner;
