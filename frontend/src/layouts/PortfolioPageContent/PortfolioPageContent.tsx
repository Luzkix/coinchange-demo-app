import React, { useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSuspenseQuery } from '@tanstack/react-query';
import {
  createFetchBalancesOptions,
  creteFetchCoinsDataOptions,
} from '../../constants/customQueryOptions';
import CoinsTable, { CoinsTableRowData } from '../../components/common/CoinsTable/CoinsTable';
import { portfolioPageContentStyles } from './styles';
import { BalanceTypeEnum } from '../../constants/customEnums.ts';
import { useGeneralContext } from '../../contexts/GeneralContext.tsx';
import { Languages } from '../../constants/customConstants.ts';
import { convertCoinsDataAndUserBalanceDataIntoCoinsTableRowData } from '../../services/utils/coinsUtils.ts';
import PortfolioTableFilter from './PortfolioTableFilter/PortfolioTableFilter.tsx';

const PortfolioPageContent: React.FC = () => {
  const { t, i18n } = useTranslation(['portfolioPage', 'cryptocurrenciesPage']);
  const { supportedFiatCurrencies, supportedCryptoCurrencies } = useGeneralContext();

  const fetchedCoinsDataResult = useSuspenseQuery(
    creteFetchCoinsDataOptions(supportedFiatCurrencies, supportedCryptoCurrencies),
  );
  const fetchedUserBalancesResult = useSuspenseQuery(
    createFetchBalancesOptions(BalanceTypeEnum.AVAILABLE),
  );

  const coinsData = fetchedCoinsDataResult.data;
  const userBalancesData = fetchedUserBalancesResult.data.currenciesBalances;

  const [selectedCurrency, setSelectedCurrency] = useState(
    Languages[i18n.language]?.currency || supportedFiatCurrencies[0],
  );
  const [nonZeroBalances, setNonZeroBalances] = useState(true);

  // Conversion of coinsData and userBalancesData into format suitable for DataGrid -> array of directly usable data filtered for selectedCurrency
  const coinsTableRowData = useMemo(() => {
    if (!coinsData || !coinsData.get(selectedCurrency) || !userBalancesData)
      return [] as CoinsTableRowData[];

    let rows = convertCoinsDataAndUserBalanceDataIntoCoinsTableRowData(
      coinsData,
      userBalancesData,
      selectedCurrency,
    );

    // Filtration based on nonZeroBalances
    if (nonZeroBalances) {
      rows = rows.filter((row) => Number(row.userBalance) > 0);
    }
    return rows;
  }, [coinsData, userBalancesData, selectedCurrency, nonZeroBalances]);

  return (
    <Box sx={portfolioPageContentStyles.container}>
      <Typography variant="h4" sx={portfolioPageContentStyles.title}>
        {t('portfolioPage.title', 'Portfolio Overview')}
      </Typography>
      <Typography variant="h6" sx={portfolioPageContentStyles.sectionTitle}>
        {t('portfolioPage.availableBalances', 'Balances')}
      </Typography>
      <PortfolioTableFilter
        nonZeroBalances={nonZeroBalances}
        setNonZeroBalances={setNonZeroBalances}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
      />
      <CoinsTable data={coinsTableRowData} selectedCurrency={selectedCurrency} />
    </Box>
  );
};

export default PortfolioPageContent;
