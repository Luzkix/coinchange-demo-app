import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Box, CircularProgress, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  createFetchBalancesOptions,
  createFetchMarketConversionRateOptions,
  creteFetchCoinsDataOptions,
} from '../../constants/customQueryOptions';
import CoinsTable, { CoinsTableRowData } from '../../components/common/CoinsTable/CoinsTable';
import { portfolioPageContentStyles } from './styles';
import { useGeneralContext } from '../../contexts/GeneralContext.tsx';
import { Languages } from '../../constants/customConstants.ts';
import { convertCoinsDataAndUserBalanceDataIntoCoinsTableRowData } from '../../services/utils/coinsUtils.ts';
import PortfolioTableFilter from './PortfolioTableFilter/PortfolioTableFilter.tsx';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { CoinsMap } from '../../constants/customTypes.ts';
import {
  type CurrencyBalanceResponseDto,
  CurrencyConversionRateResponseDto,
} from '../../api-generated/backend';
import { BalanceTypeEnum } from '../../constants/customEnums.ts';
import { DEFAULT_ERROR_REFETCH_INTERVAL } from '../../constants/configVariables.ts';
import { useProcessApiError } from '../../hooks/useProcessApiError.ts';
import { isApiError } from '../../services/utils/errorUtils.ts';

const PortfolioPageContent: React.FC = () => {
  const { t, i18n } = useTranslation(['portfolioPage', 'cryptocurrenciesPage', 'errors']);
  const { supportedFiatCurrencies, supportedCryptoCurrencies, addErrorPopup } = useGeneralContext();
  const processApiError = useProcessApiError();
  const processName = PortfolioPageContent.name;

  const fetchedCoinsDataResult = useQuery({
    ...creteFetchCoinsDataOptions(supportedFiatCurrencies, supportedCryptoCurrencies),
    refetchInterval: (query) => {
      if (query.state.status === 'error') {
        return DEFAULT_ERROR_REFETCH_INTERVAL;
      }
      return false;
    },
  });
  const fetchedUserBalancesResult = useQuery({
    ...createFetchBalancesOptions(BalanceTypeEnum.AVAILABLE),
    refetchInterval: (query) =>
      query.state.status === 'error' ? DEFAULT_ERROR_REFETCH_INTERVAL : false,
  });
  const fetchedEurToUsdResult = useQuery({
    ...createFetchMarketConversionRateOptions('EUR', 'USD'),
    refetchInterval: (query) =>
      query.state.status === 'error' ? DEFAULT_ERROR_REFETCH_INTERVAL : false,
  });

  const [coinsData, setCoinsData] = useState<CoinsMap>();
  const [userBalancesData, setUserBalancesData] = useState<CurrencyBalanceResponseDto[]>([]);
  const [eurToUsdRate, setEurToUsdRate] = useState<CurrencyConversionRateResponseDto>();

  useEffect(() => {
    if (fetchedCoinsDataResult.data && fetchedCoinsDataResult.data.size > 0) {
      setCoinsData(fetchedCoinsDataResult.data);
    }
    if (
      fetchedUserBalancesResult.data &&
      fetchedUserBalancesResult.data.currenciesBalances.length > 0
    ) {
      setUserBalancesData(fetchedUserBalancesResult.data.currenciesBalances);
    }
    if (fetchedEurToUsdResult.data) {
      setEurToUsdRate(fetchedEurToUsdResult.data);
    }
  }, [fetchedCoinsDataResult.data, fetchedUserBalancesResult.data, fetchedEurToUsdResult.data]);

  const [selectedCurrency, setSelectedCurrency] = useState(
    Languages[i18n.language]?.currency || supportedFiatCurrencies[0].code,
  );
  const [nonZeroBalances, setNonZeroBalances] = useState(true);

  // Conversion of coinsData and userBalancesData into format suitable for DataGrid -> array of directly usable data filtered for selectedCurrency
  const coinsTableRowData = useMemo(() => {
    if (!coinsData || !coinsData.get(selectedCurrency) || !userBalancesData || !eurToUsdRate)
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

  // final filtered table data
  const filteredTableRowData = useMemo(
    () =>
      nonZeroBalances
        ? coinsTableRowData.filter((row) => Number(row.userBalance) > 0)
        : coinsTableRowData,
    [coinsTableRowData, nonZeroBalances],
  );

  //ERRORS HANDLING
  const [isCoinsDataError, setIsCoinsDataError] = useState(false);
  const [isUserBalancesDataError, setIsUserBalancesDataError] = useState(false);
  const [isEurToUsdRateError, setIsEurToUsdRateError] = useState(false);
  const [isAnyError, setIsAnyError] = useState(false);

  //setování error stavů pro všechny možné errory
  useEffect(() => {
    if (!fetchedCoinsDataResult.isLoading && fetchedCoinsDataResult.isError) {
      setIsCoinsDataError(!!fetchedCoinsDataResult.error);
    }
  }, [fetchedCoinsDataResult.isError]);

  useEffect(() => {
    if (!fetchedUserBalancesResult.isLoading && fetchedUserBalancesResult.isError) {
      setIsUserBalancesDataError(!!fetchedUserBalancesResult.error);
    }
  }, [fetchedUserBalancesResult.isError]);

  useEffect(() => {
    if (!fetchedEurToUsdResult.isLoading && fetchedEurToUsdResult.isError) {
      setIsEurToUsdRateError(!!fetchedEurToUsdResult.error);
    }
  }, [fetchedEurToUsdResult.isError]);

  useEffect(() => {
    const anyError =
      fetchedCoinsDataResult.isError ||
      fetchedUserBalancesResult.isError ||
      fetchedEurToUsdResult.isError;

    setIsAnyError(anyError);
  }, [
    fetchedCoinsDataResult.isError,
    fetchedUserBalancesResult.isError,
    fetchedEurToUsdResult.isError,
  ]);

  useEffect(() => {
    // Zobrazí chybovou hlášku jen napoprvé, když se detekuje error (tzn při změně stavu isAnyError z false na true)
    if (isCoinsDataError && fetchedCoinsDataResult.error) {
      setCoinsData(undefined);
      if (isApiError(fetchedCoinsDataResult.error)) {
        processApiError(fetchedCoinsDataResult.error, processName);
      } else {
        //not ApiError
        addErrorPopup('errors:message.fetchCoinsDataError');
      }
    } else if (isUserBalancesDataError && fetchedUserBalancesResult.error) {
      setUserBalancesData([]);
      if (isApiError(fetchedUserBalancesResult.error)) {
        processApiError(fetchedUserBalancesResult.error, processName);
      } else {
        //not ApiError
        addErrorPopup(t('errors:message.fetchBalancesError'));
      }
    } else if (isEurToUsdRateError && fetchedEurToUsdResult.error) {
      setEurToUsdRate(undefined);
      if (isApiError(fetchedEurToUsdResult.error)) {
        processApiError(fetchedEurToUsdResult.error, processName);
      } else {
        //not ApiError
        addErrorPopup(t('errors:message.fetchConversionRateError'));
      }
    }
  }, [isCoinsDataError, isUserBalancesDataError, isEurToUsdRateError]);

  return (
    <Box sx={portfolioPageContentStyles.container}>
      <Typography variant="h4" sx={portfolioPageContentStyles.title}>
        {t('portfolioPage.title', 'Portfolio Overview')}
      </Typography>

      <Box sx={portfolioPageContentStyles.totalBalanceRow}>
        {fetchedCoinsDataResult.isLoading ||
        fetchedUserBalancesResult.isLoading ||
        fetchedEurToUsdResult.isLoading ? (
          <CircularProgress />
        ) : isAnyError ? (
          <Alert severity="error" sx={{ fontWeight: 700 }}>
            {t('errors:common.genericErrorTitle')}
          </Alert>
        ) : (
          <>
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
          </>
        )}
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
