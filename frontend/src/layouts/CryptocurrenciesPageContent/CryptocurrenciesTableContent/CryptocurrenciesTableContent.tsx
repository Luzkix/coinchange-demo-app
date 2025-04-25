import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { cryptocurrenciesTableContentStyles } from './styles';

const CryptocurrenciesTableContent: React.FC = () => {
  const { t } = useTranslation('cryptocurrenciesPage');

  return (
    <Box sx={cryptocurrenciesTableContentStyles.container}>
      <Box sx={cryptocurrenciesTableContentStyles.titleContainer}>
        <Typography variant="h5" sx={cryptocurrenciesTableContentStyles.title}>
          {t('tableTitle', 'Crypto prices')}
        </Typography>
      </Box>

      {/* Tabulka bude zde */}
      <Box sx={cryptocurrenciesTableContentStyles.tableContainer}>
        {/* Table component will be added later */}
      </Box>

      {/* Paginace */}
      <Box sx={cryptocurrenciesTableContentStyles.pagination}>
        {/* Pagination component will be added later */}
      </Box>
    </Box>
  );
};

export default CryptocurrenciesTableContent;
