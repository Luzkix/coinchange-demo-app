import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { cryptocurrenciesTableContentStyles } from './styles';
import { useCoinsDataContext } from '../../../contexts/CoinsDataContext';
import { useGeneralContext } from '../../../contexts/GeneralContext';
import { Languages } from '../../../constants/customConstants';
import CoinsTable, { CoinRowData } from '../../../components/common/CoinsTable';
import { SUPPORTED_CURRENCIES } from '../../../constants/configVariables.ts';

const CryptocurrenciesTableContent: React.FC = () => {
  const { t } = useTranslation('cryptocurrenciesPage');
  const { coinsData, isLoading } = useCoinsDataContext();
  const { language } = useGeneralContext();

  const [selectedCurrency, setSelectedCurrency] = useState(
    Languages[language]?.currency || SUPPORTED_CURRENCIES[0],
  );

  useEffect(() => {
    if (language) {
      setSelectedCurrency(Languages[language].currency);
    }
  }, [language]);

  // Conversion of data from context into format suitable for DataGrid -> array of directly usable data filtered for selectedCurrency
  const gridData = useMemo(() => {
    if (!coinsData || !coinsData.get(selectedCurrency)) return [] as CoinRowData[];

    // @ts-ignore
    return Array.from(coinsData.get(selectedCurrency).values()).map(
      ({ coinPair, isTradeable }) => ({
        id: coinPair.product_id,
        symbol: coinPair.base_currency_id,
        name: coinPair.base_name,
        price: parseFloat(coinPair.price || '0'),
        priceChange: parseFloat(coinPair.price_percentage_change_24h || '0'),
        volume: parseFloat(coinPair.approximate_quote_24h_volume || '0'),
        isTradeable: isTradeable,
        isNew: Boolean(coinPair.new), // ensuring that the value will always be boolean
        fullData: coinPair,
        currency: selectedCurrency,
      }),
    ) as CoinRowData[];
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

      <CoinsTable
        data={gridData}
        isLoading={isLoading}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
      />
    </Box>
  );
};

export default CryptocurrenciesTableContent;
