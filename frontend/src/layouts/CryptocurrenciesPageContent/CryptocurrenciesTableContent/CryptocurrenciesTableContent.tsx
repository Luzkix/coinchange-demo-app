import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { cryptocurrenciesTableContentStyles } from './styles';
import { useCoinsDataContext } from '../../../contexts/CoinsDataContext';
import { useGeneralContext } from '../../../contexts/GeneralContext';
import { Languages } from '../../../constants/customConstants';
import CoinsDataGrid, { CoinRowData } from '../../../components/common/CoinsDataGrid';

const CryptocurrenciesTableContent: React.FC = () => {
  const { t } = useTranslation('cryptocurrenciesPage');
  const { coinsData, isLoading } = useCoinsDataContext();
  const { language } = useGeneralContext();
  const selectedCurrency = Languages[language]?.currency || 'USD';

  // Převedení dat z kontextu do formátu vhodného pro DataGrid
  const gridData = useMemo(() => {
    if (!coinsData || !coinsData.get(selectedCurrency)) return [] as CoinRowData[];

    // @ts-ignore
    return Array.from(coinsData.get(selectedCurrency).values()).map(({ coinPair, isTradable }) => ({
      id: coinPair.product_id,
      symbol: coinPair.base_currency_id,
      name: coinPair.base_name,
      price: parseFloat(coinPair.price || '0'),
      priceChange: parseFloat(coinPair.price_percentage_change_24h || '0'),
      volume: parseFloat(coinPair.approximate_quote_24h_volume || '0'),
      isTradable,
      isNew: Boolean(coinPair.new), // Zajištění, že hodnota je vždy boolean
      fullData: coinPair,
    })) as CoinRowData[];
  }, [coinsData, selectedCurrency]);

  return (
    <Box sx={cryptocurrenciesTableContentStyles.container}>
      <Box sx={cryptocurrenciesTableContentStyles.titleContainer}>
        <Typography variant="h5" sx={cryptocurrenciesTableContentStyles.title}>
          {t('tableTitle', 'Crypto prices')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {gridData.length} {t('assets', 'assets')}
        </Typography>
      </Box>

      <CoinsDataGrid data={gridData} isLoading={isLoading} currency={selectedCurrency} />
    </Box>
  );
};

export default CryptocurrenciesTableContent;
