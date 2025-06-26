import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Box, CircularProgress, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  createFetchBalancesOptions,
  createFetchCoinsDataOptions,
  createFetchMarketConversionRateOptions,
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
import {
  DEFAULT_ERROR_REFETCH_INTERVAL,
  INITIAL_BONUS_AMOUNT,
  INITIAL_BONUS_CURRENCY,
} from '../../constants/configVariables.ts';
import { useProcessApiError } from '../../hooks/useProcessApiError.ts';
import { isApiError } from '../../services/utils/errorUtils.ts';

const PortfolioPageContent: React.FC = () => {
  const { t, i18n } = useTranslation(['portfolioPage', 'cryptocurrenciesPage', 'errors']);
  const { supportedFiatCurrencies, supportedCryptoCurrencies, addErrorPopup } = useGeneralContext();
  const processApiError = useProcessApiError();
  const processName = PortfolioPageContent.name;

  const fetchedCoinsDataResult = useQuery({
    ...createFetchCoinsDataOptions(supportedFiatCurrencies, supportedCryptoCurrencies),
    refetchInterval: (query) => {
      if (query.state.status === 'error') {
        return DEFAULT_ERROR_REFETCH_INTERVAL;
      }
      return false;
    },
  });
  const fetchedAvailableUserBalancesResult = useQuery({
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
  const [userAvailableBalancesData, setUserAvailableBalancesData] = useState<
    CurrencyBalanceResponseDto[]
  >([]);
  const [eurToUsdRate, setEurToUsdRate] = useState<CurrencyConversionRateResponseDto>();

  useEffect(() => {
    if (fetchedCoinsDataResult.data && fetchedCoinsDataResult.data.size > 0) {
      setCoinsData(fetchedCoinsDataResult.data);
    }
    if (
      fetchedAvailableUserBalancesResult.data &&
      fetchedAvailableUserBalancesResult.data.currenciesBalances.length > 0
    ) {
      setUserAvailableBalancesData(fetchedAvailableUserBalancesResult.data.currenciesBalances);
    }
    if (fetchedEurToUsdResult.data) {
      setEurToUsdRate(fetchedEurToUsdResult.data);
    }
  }, [
    fetchedCoinsDataResult.data,
    fetchedAvailableUserBalancesResult.data,
    fetchedEurToUsdResult.data,
  ]);

  const [selectedCurrency, setSelectedCurrency] = useState(
    Languages[i18n.language]?.currency || supportedFiatCurrencies[0].code,
  );
  const [nonZeroBalances, setNonZeroBalances] = useState(true);

  // Conversion of coinsData and userAvailableBalancesData into format suitable for DataGrid -> array of directly usable data filtered for selectedCurrency
  const coinsTableRowData = useMemo(() => {
    if (
      !coinsData ||
      !coinsData.get(selectedCurrency) ||
      !userAvailableBalancesData ||
      !eurToUsdRate
    )
      return [] as CoinsTableRowData[];

    return convertCoinsDataAndUserBalanceDataIntoCoinsTableRowData(
      coinsData,
      userAvailableBalancesData,
      eurToUsdRate,
      selectedCurrency,
      supportedFiatCurrencies,
    );
  }, [coinsData, userAvailableBalancesData, eurToUsdRate, selectedCurrency]);

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

  //CALCULATION OF PROFIT IN % BASED ON TOTAL BALANCE
  const fetchedTotalUserBalancesResult = useQuery({
    ...createFetchBalancesOptions(BalanceTypeEnum.TOTAL),
    refetchInterval: (query) =>
      query.state.status === 'error' ? DEFAULT_ERROR_REFETCH_INTERVAL : false,
  });
  const [userTotalBalancesData, setUserTotalBalancesData] = useState<CurrencyBalanceResponseDto[]>(
    [],
  );

  useEffect(() => {
    if (
      fetchedTotalUserBalancesResult.data &&
      fetchedTotalUserBalancesResult.data.currenciesBalances.length > 0
    ) {
      setUserTotalBalancesData(fetchedTotalUserBalancesResult.data.currenciesBalances);
    }
  }, [fetchedTotalUserBalancesResult.data]);

  // Conversion of coinsData and userTotalBalancesData into format suitable for DataGrid -> array of directly usable data filtered for selectedCurrency
  const coinsTableRowDataWithTotalBalances = useMemo(() => {
    if (
      !coinsData ||
      !coinsData.get(INITIAL_BONUS_CURRENCY) ||
      !userTotalBalancesData ||
      !eurToUsdRate
    )
      return [] as CoinsTableRowData[];

    return convertCoinsDataAndUserBalanceDataIntoCoinsTableRowData(
      coinsData,
      userTotalBalancesData,
      eurToUsdRate,
      INITIAL_BONUS_CURRENCY,
      supportedFiatCurrencies,
    );
  }, [coinsData, userTotalBalancesData, eurToUsdRate]);

  // calculate total available balance for particular currency before nonZeroBalances filtration
  const totalBalanceInEurCurrency = useMemo(
    () => coinsTableRowDataWithTotalBalances.reduce((sum, item) => sum + item.price, 0),
    [coinsTableRowDataWithTotalBalances],
  );
  // calculate profit in %
  const profitInPercent = (totalBalanceInEurCurrency / INITIAL_BONUS_AMOUNT - 1) * 100;

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
    if (
      !fetchedAvailableUserBalancesResult.isLoading &&
      fetchedAvailableUserBalancesResult.isError
    ) {
      setIsUserBalancesDataError(!!fetchedAvailableUserBalancesResult.error);
    }
  }, [fetchedAvailableUserBalancesResult.isError]);

  useEffect(() => {
    if (!fetchedEurToUsdResult.isLoading && fetchedEurToUsdResult.isError) {
      setIsEurToUsdRateError(!!fetchedEurToUsdResult.error);
    }
  }, [fetchedEurToUsdResult.isError]);

  useEffect(() => {
    const anyError =
      fetchedCoinsDataResult.isError ||
      fetchedAvailableUserBalancesResult.isError ||
      fetchedEurToUsdResult.isError;

    setIsAnyError(anyError);
  }, [
    fetchedCoinsDataResult.isError,
    fetchedAvailableUserBalancesResult.isError,
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
    } else if (isUserBalancesDataError && fetchedAvailableUserBalancesResult.error) {
      setUserAvailableBalancesData([]);
      if (isApiError(fetchedAvailableUserBalancesResult.error)) {
        processApiError(fetchedAvailableUserBalancesResult.error, processName);
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
        fetchedAvailableUserBalancesResult.isLoading ||
        fetchedEurToUsdResult.isLoading ? (
          <CircularProgress />
        ) : isAnyError ? (
          <Alert severity="error" sx={{ fontWeight: 700 }}>
            {t('errors:common.genericErrorTitle')}
          </Alert>
        ) : (
          <>
            <Box sx={portfolioPageContentStyles.summaryContainer}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography sx={portfolioPageContentStyles.totalBalanceValue}>
                  {new Intl.NumberFormat(
                    Languages[i18n.language]?.languageCountryCode ||
                      Languages.CS.languageCountryCode,
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

              {!!totalBalanceInEurCurrency && (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Typography
                    sx={{
                      ...portfolioPageContentStyles.totalBalanceValue,
                      color: profitInPercent < 0 ? 'red' : '#27ae60',
                    }}
                  >
                    {`${profitInPercent == 0 ? '' : profitInPercent > 0 ? '▲' : '▼'} ${profitInPercent.toFixed(2)}%`}
                  </Typography>
                  <Tooltip title={t('portfolioPage.profitInPercent')}>
                    <InfoOutlinedIcon
                      sx={{ ml: 0, fontSize: 20, color: 'text.secondary', cursor: 'pointer' }}
                    />
                  </Tooltip>
                </Box>
              )}
            </Box>
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
