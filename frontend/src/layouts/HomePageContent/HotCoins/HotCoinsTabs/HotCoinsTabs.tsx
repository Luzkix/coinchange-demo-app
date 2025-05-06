import React, { useEffect, useMemo, useState } from 'react';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { hotCoinsTabsStyles } from './styles.ts';
import CoinCard from '../../../../components/common/CoinCard';
import {
  getTopGainers,
  getTradeableCoins,
  updateCoinsPrices,
} from '../../../../services/utils/coinsUtils.ts';
import { useGeneralContext } from '../../../../contexts/GeneralContext.tsx';
import { Languages } from '../../../../constants/customConstants.ts';
import Grid from '@mui/material/Grid';
import {
  DEFAUL_NO_OF_TOP_COINS_TO_BE_DISPLAYED,
  DEFAUL_REFRESH_TIME_OF_TOP_COINS_TO_BE_DISPLAYED,
} from '../../../../constants/configVariables.ts';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { creteFetchCoinsDataOptions } from '../../../../constants/customQueryOptions.ts';

export const HotCoinsTabs: React.FC = () => {
  const { t, i18n } = useTranslation(['homepage']);
  const { addErrorPopup } = useGeneralContext();

  const fetchedCoinsDataResult = useSuspenseQuery(creteFetchCoinsDataOptions());
  const coinsData = fetchedCoinsDataResult.data;

  const queryClient = useQueryClient(); //queryClient to be used for fetching stats for individual coins within .map function where useQuerry cant be used

  //currency is derived from selected language (English = USD, Czech = EUR)
  const selectedCurrency = Languages[i18n.language].currency; //currency is derived from selected language (English = USD, Czech = EUR)

  // useMemo slouzi pro memoizaci vysledku, tzn neprepocitavaji se znovu hodnoty pri prenacteni komponenty pokud se nezmenily zavislosti coinsData nebo selectedCurrency
  const topGainerCoins = useMemo(
    () => getTopGainers(coinsData, selectedCurrency),
    [coinsData, selectedCurrency],
  ).slice(0, DEFAUL_NO_OF_TOP_COINS_TO_BE_DISPLAYED); //slice vrati z array pouze hodnoty v uvedenem rozsahu

  const tradeableCoins = useMemo(
    () => getTradeableCoins(coinsData, selectedCurrency),
    [coinsData, selectedCurrency],
  ).slice(0, DEFAUL_NO_OF_TOP_COINS_TO_BE_DISPLAYED);

  //to store info about selected view (tradeable/topGainers)
  const [view, setView] = useState('tradeable');

  const handleViewChange = (_event: React.MouseEvent, newView: string | null) => {
    if (newView !== null) setView(newView);
  };

  //using useState to re-render component each time the new price of topGainer or tradeable coins is fetched.
  const [displayedTopGainers, setDisplayedTopGainers] = useState(topGainerCoins);
  const [displayedTradeableCoins, setDisplayedTradeableCoins] = useState(tradeableCoins);

  // using useEffect to monitor changes in coinsData or language (changes coming from initial fetching or refreshing of coinsData)
  useEffect(() => {
    if (coinsData.size > 0) {
      setDisplayedTopGainers(topGainerCoins);
      setDisplayedTradeableCoins(tradeableCoins);
    }
  }, [coinsData, selectedCurrency]);

  // displayedTopGainers: using useEffect to fetch and assign most recent price for each coin
  useEffect(() => {
    const fetchAndUpdate = async () => {
      if (displayedTopGainers.length === 0) return;
      const updatedCoinPrices = await updateCoinsPrices(
        displayedTopGainers,
        queryClient,
        addErrorPopup,
        t,
      );
      setDisplayedTopGainers(updatedCoinPrices);
    };

    const interval = setInterval(fetchAndUpdate, DEFAUL_REFRESH_TIME_OF_TOP_COINS_TO_BE_DISPLAYED);

    return () => clearInterval(interval);
  }, [displayedTopGainers]);

  // displayedTradeableCoins: using useEffect to fetch and assign most recent price for each coin
  useEffect(() => {
    const fetchAndUpdate = async () => {
      if (displayedTradeableCoins.length === 0) return;
      const updatedCoinPrices = await updateCoinsPrices(
        displayedTradeableCoins,
        queryClient,
        addErrorPopup,
        t,
      );
      setDisplayedTradeableCoins(updatedCoinPrices);
    };

    const interval = setInterval(fetchAndUpdate, DEFAUL_REFRESH_TIME_OF_TOP_COINS_TO_BE_DISPLAYED);

    return () => clearInterval(interval);
  }, [displayedTradeableCoins]);

  const displayedCoins = view === 'tradeable' ? displayedTradeableCoins : displayedTopGainers;

  return (
    <Box sx={hotCoinsTabsStyles.container}>
      <Box sx={hotCoinsTabsStyles.toggleContainer}>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleViewChange}
          aria-label="coin view"
          color="primary"
        >
          <ToggleButton value="tradeable" sx={hotCoinsTabsStyles.toggleButton}>
            {t('hotCoins.tradeable')}
          </ToggleButton>
          <ToggleButton value="topGainers" sx={hotCoinsTabsStyles.toggleButton}>
            {t('hotCoins.topGainers')}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={2} sx={hotCoinsTabsStyles.coinsGridContainer}>
        {displayedCoins.map((coin) => (
          <CoinCard
            key={coin.base_currency_id}
            coinSymbol={coin.base_display_symbol}
            coinName={coin.base_name}
            coinPrice={coin.price}
            coinPriceChange={coin.price_percentage_change_24h}
            currency={selectedCurrency}
            size={'large'}
          />
        ))}
      </Grid>
    </Box>
  );
};

export default HotCoinsTabs;
