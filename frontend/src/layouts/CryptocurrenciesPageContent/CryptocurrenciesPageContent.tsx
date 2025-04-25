import React from 'react';
import { Box } from '@mui/material';
import CryptocurrenciesTableContent from './CryptocurrenciesTableContent';
import CryptocurrenciesTopCoinsContent from './CryptocurrenciesTopCoinsContent';
import { cryptocurrenciesPageContentStyles } from './styles';
import ContentBoxLarge from '../../components/ui/ContentBoxLarge';

const CryptocurrenciesPageContent: React.FC = () => {
  return (
    <ContentBoxLarge>
      <Box sx={cryptocurrenciesPageContentStyles.container}>
        <Box sx={cryptocurrenciesPageContentStyles.mainColumn}>
          <CryptocurrenciesTableContent />
        </Box>
        <Box sx={cryptocurrenciesPageContentStyles.sideColumn}>
          <CryptocurrenciesTopCoinsContent />
        </Box>
      </Box>
    </ContentBoxLarge>
  );
};

export default CryptocurrenciesPageContent;
