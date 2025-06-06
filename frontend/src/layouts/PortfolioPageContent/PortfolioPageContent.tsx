import React, { useMemo, useState } from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSuspenseQuery } from '@tanstack/react-query';
import {
  createFetchBalancesOptions,
  createFetchMarketConversionRateOptions,
  creteFetchCoinsDataOptions,
} from '../../constants/customQueryOptions';
import CoinsTable, { CoinsTableRowData } from '../../components/common/CoinsTable/CoinsTable';
import { portfolioPageContentStyles } from './styles';
import { BalanceTypeEnum } from '../../constants/customEnums.ts';
import { useGeneralContext } from '../../contexts/GeneralContext.tsx';
import { Languages } from '../../constants/customConstants.ts';
import {
  convertCoinsDataAndUserBalanceDataIntoCoinsTableRowData,
  convertCurrenciesToStringArrayOfCodes,
} from '../../services/utils/coinsUtils.ts';
import PortfolioTableFilter from './PortfolioTableFilter/PortfolioTableFilter.tsx';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const PortfolioPageContent: React.FC = () => {
  const { t, i18n } = useTranslation(['portfolioPage', 'cryptocurrenciesPage']);
  const { supportedFiatCurrencies, supportedCryptoCurrencies } = useGeneralContext();

  const fetchedCoinsDataResult = useSuspenseQuery(
    creteFetchCoinsDataOptions(
      convertCurrenciesToStringArrayOfCodes(supportedFiatCurrencies),
      convertCurrenciesToStringArrayOfCodes(supportedCryptoCurrencies),
    ),
  );
  const fetchedUserBalancesResult = useSuspenseQuery(
    createFetchBalancesOptions(BalanceTypeEnum.AVAILABLE),
  );
  const fetchedEurToUsdRate = useSuspenseQuery(
    createFetchMarketConversionRateOptions('EUR', 'USD'),
  );

  const coinsData = fetchedCoinsDataResult.data;
  const userBalancesData = fetchedUserBalancesResult.data.currenciesBalances;
  const eurToUsdRate = fetchedEurToUsdRate.data;

  const [selectedCurrency, setSelectedCurrency] = useState(
    Languages[i18n.language]?.currency || supportedFiatCurrencies[0].code,
  );
  const [nonZeroBalances, setNonZeroBalances] = useState(true);

  // Conversion of coinsData and userBalancesData into format suitable for DataGrid -> array of directly usable data filtered for selectedCurrency
  const coinsTableRowData = useMemo(() => {
    if (!coinsData || !coinsData.get(selectedCurrency) || !userBalancesData)
      return [] as CoinsTableRowData[];

    return convertCoinsDataAndUserBalanceDataIntoCoinsTableRowData(
      coinsData,
      userBalancesData,
      eurToUsdRate,
      selectedCurrency,
      supportedFiatCurrencies,
    );
  }, [coinsData, userBalancesData, eurToUsdRate, selectedCurrency]);

  // calculate total available balance for particular currency before nonZeroBalances filtration
  const totalAvailableBalanceInSelectedCurrency = useMemo(
    () => coinsTableRowData.reduce((sum, item) => sum + item.price, 0),
    [coinsTableRowData],
  );

  // nonZeroBalances filtration
  const filteredTableRowData = useMemo(
    () =>
      nonZeroBalances
        ? coinsTableRowData.filter((row) => Number(row.userBalance) > 0)
        : coinsTableRowData,
    [coinsTableRowData, nonZeroBalances],
  );

  return (
    <Box sx={portfolioPageContentStyles.container}>
      <Typography variant="h4" sx={portfolioPageContentStyles.title}>
        {t('portfolioPage.title', 'Portfolio Overview')}
      </Typography>

      <Box sx={portfolioPageContentStyles.totalBalanceRow}>
        <Typography sx={portfolioPageContentStyles.totalBalanceValue}>
          {new Intl.NumberFormat(
            Languages[i18n.language]?.languageCountryCode || Languages.EN.languageCountryCode,
            {
              style: 'currency',
              currency: selectedCurrency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            },
          ).format(totalAvailableBalanceInSelectedCurrency)}
        </Typography>
        <Tooltip title={t('portfolioPage.totalAvailableBalance')}>
          <InfoOutlinedIcon
            sx={{ ml: 0, fontSize: 20, color: 'text.secondary', cursor: 'pointer' }}
          />
        </Tooltip>
      </Box>

      <PortfolioTableFilter
        nonZeroBalances={nonZeroBalances}
        setNonZeroBalances={setNonZeroBalances}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
      />

      <CoinsTable data={filteredTableRowData} selectedCurrency={selectedCurrency} />
    </Box>
  );
};

export default PortfolioPageContent;
