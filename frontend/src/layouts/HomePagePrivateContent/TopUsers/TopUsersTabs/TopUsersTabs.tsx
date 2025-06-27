import React, { useEffect, useMemo, useState } from 'react';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { hotCoinsTabsStyles } from './styles.ts';
import { convertCoinsDataAndUserBalanceDataIntoCoinsTableRowData } from '../../../../services/utils/coinsUtils.ts';
import { useGeneralContext } from '../../../../contexts/GeneralContext.tsx';
import { Languages } from '../../../../constants/customConstants.ts';
import Grid from '@mui/material/Grid';
import {
  DEFAUL_NO_OF_TOP_COINS_TO_BE_DISPLAYED,
  DEFAULT_ERROR_REFETCH_INTERVAL,
  INITIAL_BONUS_AMOUNT,
  INITIAL_BONUS_CURRENCY,
} from '../../../../constants/configVariables.ts';
import { useQuery } from '@tanstack/react-query';
import {
  createFetchBalancesOfAllUsersOptions,
  createFetchCoinsDataOptions,
  createFetchMarketConversionRateOptions,
} from '../../../../constants/customQueryOptions.ts';
import CoinCard from '../../../../components/common/CoinCard/CoinCard.tsx';
import { BalanceTypeEnum } from '../../../../constants/customEnums.ts';
import {
  BalancesResponseDto,
  CurrencyConversionRateResponseDto,
} from '../../../../api-generated/backend';
import { CoinsTableRowData } from '../../../../components/common/CoinsTable/CoinsTable.tsx';
import { CoinsMap } from '../../../../constants/customTypes.ts';

export const TopUsersTabs: React.FC = () => {
  const { t, i18n } = useTranslation(['homePagePrivate']);
  const { supportedFiatCurrencies, supportedCryptoCurrencies } = useGeneralContext();
  //currency is derived from selected language (English = USD, Czech = EUR)
  const selectedCurrency = Languages[i18n.language].currency;

  //CALCULATION OF TOTAL BALANCES AND PROFIT(%) FOR ALL USERS
  const [coinsData, setCoinsData] = useState<CoinsMap>();
  const [eurToUsdRate, setEurToUsdRate] = useState<CurrencyConversionRateResponseDto>();
  const [allUsersTotalBalancesData, setAllUsersTotalBalancesData] = useState<BalancesResponseDto[]>(
    [],
  );

  const fetchedCoinsDataResult = useQuery({
    ...createFetchCoinsDataOptions(supportedFiatCurrencies, supportedCryptoCurrencies),
    refetchInterval: (query) => {
      if (query.state.status === 'error') {
        return DEFAULT_ERROR_REFETCH_INTERVAL;
      }
      return false;
    },
  });
  const fetchedAllUsersBalancesResult = useQuery({
    ...createFetchBalancesOfAllUsersOptions(BalanceTypeEnum.TOTAL),
    refetchInterval: (query) =>
      query.state.status === 'error' ? DEFAULT_ERROR_REFETCH_INTERVAL : false,
  });
  const fetchedEurToUsdResult = useQuery({
    ...createFetchMarketConversionRateOptions('EUR', 'USD'),
    refetchInterval: (query) =>
      query.state.status === 'error' ? DEFAULT_ERROR_REFETCH_INTERVAL : false,
  });

  useEffect(() => {
    if (fetchedCoinsDataResult.data && fetchedCoinsDataResult.data.size > 0) {
      setCoinsData(fetchedCoinsDataResult.data);
    }
    if (fetchedAllUsersBalancesResult.data && fetchedAllUsersBalancesResult.data.length > 0) {
      setAllUsersTotalBalancesData(fetchedAllUsersBalancesResult.data);
    }
    if (fetchedEurToUsdResult.data) {
      setEurToUsdRate(fetchedEurToUsdResult.data);
    }
  }, [fetchedCoinsDataResult.data, fetchedAllUsersBalancesResult.data, fetchedEurToUsdResult.data]);

  // Conversion of coinsData and userTotalBalancesData into format suitable for DataGrid -> array of directly usable data filtered for selectedCurrency
  const coinsTableRowDataWithTotalBalances = useMemo(() => {
    if (
      !coinsData ||
      !coinsData.get(INITIAL_BONUS_CURRENCY) ||
      !allUsersTotalBalancesData ||
      !eurToUsdRate
    )
      return [];

    //creating own []type that contains data about each user and his currency portfolio (each currency balance is converted into INITIAL_BONUS_CURRENCY (e.g. into EUR))
    const usersWithCoinsTableRowData: {
      userName: string;
      coinsTableRowData: CoinsTableRowData[];
    }[] = [];

    allUsersTotalBalancesData.forEach((userBalances) => {
      usersWithCoinsTableRowData.push({
        userName: userBalances.userName,
        coinsTableRowData: convertCoinsDataAndUserBalanceDataIntoCoinsTableRowData(
          coinsData,
          userBalances.currenciesBalances,
          eurToUsdRate,
          INITIAL_BONUS_CURRENCY,
          supportedFiatCurrencies,
        ),
      });
    });

    return usersWithCoinsTableRowData;
  }, [coinsData, allUsersTotalBalancesData, eurToUsdRate]);

  // calculate total balance in selected currency and profit in % for each user
  const totalBalancesAndProfitsOfAllUsers = useMemo(() => {
    const balancesAndProfits: {
      userName: string;
      totalBalance: number;
      profit: number;
    }[] = [];

    coinsTableRowDataWithTotalBalances.forEach((item) => {
      const totalEurBalance = item.coinsTableRowData.reduce((sum, item) => sum + item.price, 0);

      balancesAndProfits.push({
        userName: item.userName,
        totalBalance:
          selectedCurrency == 'EUR'
            ? totalEurBalance
            : totalEurBalance * (!!eurToUsdRate ? eurToUsdRate.marketConversionRate : 0),
        profit: totalEurBalance == 0 ? 0 : (totalEurBalance / INITIAL_BONUS_AMOUNT - 1) * 100,
      });
    });

    // Seřadit podle profitu sestupně
    return balancesAndProfits.sort((a, b) => b.profit - a.profit);
  }, [coinsTableRowDataWithTotalBalances, selectedCurrency]);

  // DALSI
  //to store info about selected view (tradeable/topGainers)
  const [view, setView] = useState('topGainers');

  const handleViewChange = (_event: React.MouseEvent, newView: string | null) => {
    if (newView !== null) setView(newView);
  };

  const displayedUsers =
    view === 'topGainers'
      ? totalBalancesAndProfitsOfAllUsers.length <= DEFAUL_NO_OF_TOP_COINS_TO_BE_DISPLAYED
        ? totalBalancesAndProfitsOfAllUsers
        : totalBalancesAndProfitsOfAllUsers.slice(0, DEFAUL_NO_OF_TOP_COINS_TO_BE_DISPLAYED)
      : totalBalancesAndProfitsOfAllUsers.length <= DEFAUL_NO_OF_TOP_COINS_TO_BE_DISPLAYED
        ? //slice a reverse je potřeba dělat na kopii originálu
          [...totalBalancesAndProfitsOfAllUsers].reverse()
        : [...totalBalancesAndProfitsOfAllUsers]
            .slice(
              totalBalancesAndProfitsOfAllUsers.length - DEFAUL_NO_OF_TOP_COINS_TO_BE_DISPLAYED,
              totalBalancesAndProfitsOfAllUsers.length,
            )
            .reverse();

  return (
    <Box sx={hotCoinsTabsStyles.container}>
      <Box sx={hotCoinsTabsStyles.toggleContainer}>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleViewChange}
          //aria-label="coin view"
          color="primary"
        >
          <ToggleButton value="topGainers" sx={hotCoinsTabsStyles.toggleButton}>
            {t('hotUsers.topGainers')}
          </ToggleButton>
          <ToggleButton value="topLosers" sx={hotCoinsTabsStyles.toggleButton}>
            {t('hotUsers.topLosers')}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={2} sx={hotCoinsTabsStyles.coinsGridContainer}>
        {displayedUsers.map((userStats) => (
          <CoinCard
            key={userStats.userName}
            coinSymbol={userStats.userName.slice(0, 2)}
            coinName={userStats.userName}
            coinPrice={userStats.totalBalance.toString()}
            coinPriceChange={userStats.profit.toString()}
            currency={selectedCurrency}
            size={'large'}
          />
        ))}
      </Grid>
    </Box>
  );
};

export default TopUsersTabs;
