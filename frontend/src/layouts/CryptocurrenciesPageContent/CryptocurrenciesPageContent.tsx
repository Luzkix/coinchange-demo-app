import React, { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { cryptocurrenciesPageContentStyles } from './styles';
import CryptocurrenciesTableContent from './CryptocurrenciesTableContent/CryptocurrenciesTableContent.tsx';
import CryptocurrenciesTopCoinsContent from './CryptocurrenciesTopCoinsContent/CryptocurrenciesTopCoinsContent.tsx';
import ContentBoxLarge from '../../components/ui/ContentBoxLarge/ContentBoxLarge.tsx';

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
