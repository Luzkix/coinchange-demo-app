import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { cryptocurrenciesTableContentStyles } from './styles';
import { Languages } from '../../../constants/customConstants';
import { CoinsFilterTypeEnum } from '../../../constants/customEnums.ts';
import { convertCoinsDataIntoCoinsTableRowData } from '../../../services/utils/coinsUtils.ts';
import { useSuspenseQuery } from '@tanstack/react-query';
import { creteFetchCoinsDataOptions } from '../../../constants/customQueryOptions.ts';
import CoinsTable, {
  CoinsTableRowData,
} from '../../../components/common/CoinsTable/CoinsTable.tsx';
import CoinsTableFilter from '../../../components/common/CoinsTableFilter/CoinsTableFilter.tsx';
import { useGeneralContext } from '../../../contexts/GeneralContext.tsx';

const CryptocurrenciesTableContent: React.FC = () => {
  const { t, i18n } = useTranslation(['cryptocurrenciesPage']);
  const { supportedFiatCurrencies, supportedCryptoCurrencies } = useGeneralContext();

  const fetchedCoinsDataResult = useSuspenseQuery(
    creteFetchCoinsDataOptions(supportedFiatCurrencies, supportedCryptoCurrencies),
  );
  const coinsData = fetchedCoinsDataResult.data;

  const [selectedCurrency, setSelectedCurrency] = useState(
    Languages[i18n.language]?.currency || supportedFiatCurrencies[0]?.code,
  );

  useEffect(() => {
    if (i18n.language) {
      setSelectedCurrency(Languages[i18n.language].currency);
    }
  }, [i18n.language]);

  // Conversion of data from context into format suitable for DataGrid -> array of directly usable data filtered for selectedCurrency
  const coinsTableRowData = useMemo(() => {
    if (!coinsData || !coinsData.get(selectedCurrency)) return [] as CoinsTableRowData[];

    return convertCoinsDataIntoCoinsTableRowData(coinsData, selectedCurrency);
  }, [coinsData, selectedCurrency]);

  //setting selected coin filter from CoinsTableFilter, default is ALL
  const [coinsFilterType, setCoinsFilterType] = useState(CoinsFilterTypeEnum.ALL);

  const filteredData = React.useMemo(() => {
    switch (coinsFilterType) {
      case CoinsFilterTypeEnum.TRADEABLE:
        return coinsTableRowData.filter((coin) => coin.isTradeable);
      case CoinsFilterTypeEnum.NEW:
        return coinsTableRowData.filter((coin) => coin.isNew);
      case CoinsFilterTypeEnum.GAINERS:
        return [...coinsTableRowData].sort((a, b) => b.priceChange24 - a.priceChange24);
      case CoinsFilterTypeEnum.LOSERS:
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

      <CoinsTable data={filteredData} selectedCurrency={selectedCurrency} />
    </Box>
  );
};

export default CryptocurrenciesTableContent;
