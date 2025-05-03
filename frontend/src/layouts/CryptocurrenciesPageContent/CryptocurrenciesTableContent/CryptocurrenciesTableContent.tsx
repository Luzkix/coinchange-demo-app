import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { cryptocurrenciesTableContentStyles } from './styles';
import { useCoinsDataContext } from '../../../contexts/CoinsDataContext';
import { useGeneralContext } from '../../../contexts/GeneralContext';
import { Languages } from '../../../constants/customConstants';
import CoinsTable, { CoinsTableRowData } from '../../../components/common/CoinsTable';
import { SUPPORTED_CURRENCIES } from '../../../constants/configVariables.ts';
import CoinsTableFilter from '../../../components/common/CoinsTableFilter';
import { CoinsFilterType } from '../../../constants/customEnums.ts';
import { convertCoinsDataIntoCoinsTableRowData } from '../../../services/utils/coinsUtils.ts';

const CryptocurrenciesTableContent: React.FC = () => {
  const { t } = useTranslation(['cryptocurrenciesPage']);
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
  const coinsTableRowData = useMemo(() => {
    if (!coinsData || !coinsData.get(selectedCurrency)) return [] as CoinsTableRowData[];

    return convertCoinsDataIntoCoinsTableRowData(coinsData, selectedCurrency);
  }, [coinsData, selectedCurrency]);

  //setting selected coin filter from CoinsTableFilter, default is ALL
  const [coinsFilterType, setCoinsFilterType] = useState(CoinsFilterType.ALL);

  const filteredData = React.useMemo(() => {
    switch (coinsFilterType) {
      case CoinsFilterType.TRADEABLE:
        return coinsTableRowData.filter((coin) => coin.isTradeable);
      case CoinsFilterType.NEW:
        return coinsTableRowData.filter((coin) => coin.isNew);
      case CoinsFilterType.GAINERS:
        return [...coinsTableRowData].sort((a, b) => b.priceChange24 - a.priceChange24);
      case CoinsFilterType.LOSERS:
        return [...coinsTableRowData].sort((a, b) => a.priceChange24 - b.priceChange24);
      default:
        return coinsTableRowData;
    }
  }, [coinsTableRowData, coinsFilterType]);

  return (
    <Box sx={cryptocurrenciesTableContentStyles.container}>
      <Box sx={cryptocurrenciesTableContentStyles.titleContainer}>
        <Typography variant="h5" sx={cryptocurrenciesTableContentStyles.title}>
          {t('tableContent.cryptocurrenciesTableTitle')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('tableContent.total')} {coinsTableRowData.length}
        </Typography>
      </Box>

      <CoinsTableFilter
        coinsFilterType={coinsFilterType}
        setCoinsFilterType={setCoinsFilterType}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
      />

      <CoinsTable data={filteredData} isLoading={isLoading} selectedCurrency={selectedCurrency} />
    </Box>
  );
};

export default CryptocurrenciesTableContent;
