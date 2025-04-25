import React from 'react';
import { Box, Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { cryptocurrenciesTopCoinsContentStyles } from './styles';

const CryptocurrenciesTopCoinsContent: React.FC = () => {
  const { t } = useTranslation('cryptocurrenciesPage');

  return (
    <Box sx={cryptocurrenciesTopCoinsContentStyles.container}>
      {/* Top Movers sekce */}
      <Box sx={cryptocurrenciesTopCoinsContentStyles.sectionContainer}>
        <Typography variant="h6" sx={cryptocurrenciesTopCoinsContentStyles.sectionTitle}>
          {t('topMovers', 'Top movers')}
        </Typography>

        <Box sx={cryptocurrenciesTopCoinsContentStyles.coinsGrid}>{/* CoinCardy budou zde */}</Box>

        <Link href="#" sx={cryptocurrenciesTopCoinsContentStyles.viewAllLink}>
          {t('viewAll', 'View all')}
        </Link>
      </Box>

      {/* New on CoinChange sekce */}
      <Box sx={cryptocurrenciesTopCoinsContentStyles.sectionContainer}>
        <Typography variant="h6" sx={cryptocurrenciesTopCoinsContentStyles.sectionTitle}>
          {t('newOnCoinChange', 'New on CoinChange')}
        </Typography>

        <Box sx={cryptocurrenciesTopCoinsContentStyles.coinsGrid}>{/* CoinCardy budou zde */}</Box>

        <Link href="#" sx={cryptocurrenciesTopCoinsContentStyles.viewAllLink}>
          {t('viewAll', 'View all')}
        </Link>
      </Box>
    </Box>
  );
};

export default CryptocurrenciesTopCoinsContent;
