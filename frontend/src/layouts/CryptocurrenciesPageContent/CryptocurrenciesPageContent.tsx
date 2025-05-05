import React, { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import CryptocurrenciesTableContent from './CryptocurrenciesTableContent';
import CryptocurrenciesTopCoinsContent from './CryptocurrenciesTopCoinsContent';
import { cryptocurrenciesPageContentStyles } from './styles';
import ContentBoxLarge from '../../components/ui/ContentBoxLarge';

const CryptocurrenciesPageContent: React.FC = () => {
  return (
    <ContentBoxLarge>
      <Box sx={cryptocurrenciesPageContentStyles.container}>
        <Box sx={cryptocurrenciesPageContentStyles.mainColumn}>
          <Suspense fallback={<CircularProgress />}>
            <CryptocurrenciesTableContent />
          </Suspense>
        </Box>
        <Box sx={cryptocurrenciesPageContentStyles.sideColumn}>
          <Suspense fallback={<CircularProgress />}>
            <CryptocurrenciesTopCoinsContent />
          </Suspense>
        </Box>
      </Box>
    </ContentBoxLarge>
  );
};

export default CryptocurrenciesPageContent;
