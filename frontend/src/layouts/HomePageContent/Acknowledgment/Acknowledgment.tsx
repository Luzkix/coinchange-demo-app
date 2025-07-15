import React from 'react';
import { Box, Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { acknowledgmentStyles } from './styles.ts';

export const Acknowledgment: React.FC = () => {
  const { t } = useTranslation(['homepage']);

  return (
    <Box sx={acknowledgmentStyles.container}>
      <Typography variant="body2" sx={acknowledgmentStyles.title}>
        {t('acknowledgment.title')}
      </Typography>

      <Box sx={acknowledgmentStyles.linksContainer}>
        <Link
          href="https://www.coinbase.com"
          target="_blank"
          rel="noopener noreferrer"
          sx={acknowledgmentStyles.link}
        >
          Coinbase.com
        </Link>
        <Link
          href="https://www.coinmate.io"
          target="_blank"
          rel="noopener noreferrer"
          sx={acknowledgmentStyles.link}
        >
          Coinmate.io
        </Link>
      </Box>
    </Box>
  );
};

export default Acknowledgment;
