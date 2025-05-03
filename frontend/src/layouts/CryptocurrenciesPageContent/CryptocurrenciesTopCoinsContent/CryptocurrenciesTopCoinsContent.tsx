import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { cryptocurrenciesTopCoinsContentStyles } from './styles';
import { useCoinsDataContext } from '../../../contexts/CoinsDataContext.tsx';
import { useGeneralContext } from '../../../contexts/GeneralContext.tsx';
import { Languages } from '../../../constants/customConstants.ts';
import {
  getNewCoins,
  getTopGainers,
  updateCoinsPrices,
} from '../../../services/utils/coinsUtils.ts';
import CoinCard from '../../../components/common/CoinCard';
import Grid from '@mui/material/Grid';
import {
  DEFAUL_NO_OF_TOP_COINS_TO_BE_DISPLAYED,
  DEFAUL_REFRESH_TIME_OF_TOP_COINS_TO_BE_DISPLAYED,
} from '../../../constants/configVariables.ts';
import { FetchCoinStatsError } from '../../../services/dataServices/errors.ts';
import { ErrorPopup } from '../../../components/common/ErrorPopup/ErrorPopup.tsx';

const CryptocurrenciesTopCoinsContent: React.FC = () => {
  const { t } = useTranslation(['cryptocurrenciesPage', 'errors']);
  const { coinsData } = useCoinsDataContext();
  const { language } = useGeneralContext();

  //currency is derived from selected language (English = USD, Czech = EUR)
  const selectedCurrency = Languages[language].currency;

  // Error states + error handling functions
  const [displayError, setDisplayError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDisplayError = (message: string) => {
    setErrorMessage(message);
    setDisplayError(true);
  };

  const handleCloseError = () => {
    setDisplayError(false);
  };

  //initial generation of topGainerCoins and newCoins from coinsData (note: these constants will be updated whenever coinsData are refreshed and changed)
  const topGainerCoins = useMemo(
    () => getTopGainers(coinsData, selectedCurrency),
    [coinsData, selectedCurrency],
  ).slice(0, DEFAUL_NO_OF_TOP_COINS_TO_BE_DISPLAYED);

  const newCoins = useMemo(
    () => getNewCoins(coinsData, selectedCurrency),
    [coinsData, selectedCurrency],
  ).slice(0, DEFAUL_NO_OF_TOP_COINS_TO_BE_DISPLAYED);

  //using useState to re-render component each time the new price of topGainer or newCoin is fetched.
  const [displayedTopGainers, setDisplayedTopGainers] = useState(topGainerCoins);
  const [displayedNewCoins, setDisplayedNewCoins] = useState(newCoins);

  // using useEffect to monitor changes in coinsData or language (changes coming from initial fetching or refreshing of coinsData)
  useEffect(() => {
    if (coinsData.size > 0) {
      setDisplayedTopGainers(topGainerCoins);
      setDisplayedNewCoins(newCoins);
    }
  }, [coinsData, selectedCurrency]);

  // displayedTopGainers: using useEffect to fetch and assign most recent price for each coin every x seconds
  useEffect(() => {
    const fetchAndUpdate = async () => {
      try {
        if (displayedTopGainers.length === 0) return;
        const updatedCoinPrices = await updateCoinsPrices(displayedTopGainers);
        setDisplayedTopGainers(updatedCoinPrices);
      } catch (error) {
        console.error('Error updating prices:', error);

        if (error instanceof FetchCoinStatsError) {
          handleDisplayError(t('errors:message.fetchCoinStatsError'));
        }
      }
    };

    const interval = setInterval(fetchAndUpdate, DEFAUL_REFRESH_TIME_OF_TOP_COINS_TO_BE_DISPLAYED);

    return () => {
      clearInterval(interval);
    };
  }, [displayedTopGainers]);

  // displayedNewCoins: using useEffect to fetch and assign most recent price for each coin every x seconds
  useEffect(() => {
    const fetchAndUpdate = async () => {
      try {
        if (displayedNewCoins.length === 0) return;
        const updatedCoinPrices = await updateCoinsPrices(displayedNewCoins);
        setDisplayedNewCoins(updatedCoinPrices);
      } catch (error) {
        console.error('Error updating prices:', error);
        if (error instanceof FetchCoinStatsError) {
          handleDisplayError(t('errors:message.fetchCoinStatsError'));
        }
      }
    };

    const interval = setInterval(fetchAndUpdate, DEFAUL_REFRESH_TIME_OF_TOP_COINS_TO_BE_DISPLAYED);

    return () => {
      clearInterval(interval);
    };
  }, [displayedNewCoins]);

  return (
    <Box sx={cryptocurrenciesTopCoinsContentStyles.container}>
      {/* Top Movers */}
      <Box sx={cryptocurrenciesTopCoinsContentStyles.sectionContainer}>
        <Typography variant="h6" sx={cryptocurrenciesTopCoinsContentStyles.sectionTitle}>
          {t('topCoins.topGainers')}
        </Typography>

        <Grid container spacing={1} sx={cryptocurrenciesTopCoinsContentStyles.coinsGridContainer}>
          {displayedTopGainers.map((coin) => (
            <CoinCard
              key={coin.base_currency_id}
              coinSymbol={coin.base_display_symbol}
              coinName={coin.base_name}
              coinPrice={coin.price}
              coinPriceChange={coin.price_percentage_change_24h}
              currency={selectedCurrency}
              size={'small'}
            />
          ))}
        </Grid>
      </Box>

      {/* New on CoinChange */}
      <Box sx={cryptocurrenciesTopCoinsContentStyles.sectionContainer}>
        <Typography variant="h6" sx={cryptocurrenciesTopCoinsContentStyles.sectionTitle}>
          {t('topCoins.newOnCoinChange')}
        </Typography>

        <Grid container spacing={2} sx={cryptocurrenciesTopCoinsContentStyles.coinsGridContainer}>
          {displayedNewCoins.map((coin) => (
            <CoinCard
              key={coin.base_currency_id}
              coinSymbol={coin.base_display_symbol}
              coinName={coin.base_name}
              coinPrice={coin.price}
              coinPriceChange={coin.price_percentage_change_24h}
              currency={selectedCurrency}
              size={'small'}
            />
          ))}
        </Grid>
      </Box>

      {/* Error popup */}
      <ErrorPopup open={displayError} onClose={handleCloseError} errorMessage={errorMessage} />
    </Box>
  );
};

export default CryptocurrenciesTopCoinsContent;
