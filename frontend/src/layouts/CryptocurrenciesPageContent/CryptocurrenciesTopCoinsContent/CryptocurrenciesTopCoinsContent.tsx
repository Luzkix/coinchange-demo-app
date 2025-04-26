import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { cryptocurrenciesTopCoinsContentStyles } from './styles';
import { useCoinsDataContext } from '../../../contexts/CoinsDataContext.tsx';
import { useGeneralContext } from '../../../contexts/GeneralContext.tsx';
import { Languages } from '../../../constants/customConstants.ts';
import { getNewCoins, getTopGainers } from '../../../services/utils/coinsUtils.ts';
import CoinCard from '../../../components/common/CoinCard';
import Grid from '@mui/material/Grid';

const CryptocurrenciesTopCoinsContent: React.FC = () => {
  const { t } = useTranslation('cryptocurrenciesPage');
  const { coinsData } = useCoinsDataContext();
  const { language } = useGeneralContext();
  const selectedCurrency = Languages[language].currency; //currency is derived from selected language (English = USD, Czech = EUR)

  const topGainerCoins = useMemo(
    () => getTopGainers(coinsData, selectedCurrency),
    [coinsData, selectedCurrency],
  );

  const newCoins = useMemo(
    () => getNewCoins(coinsData, selectedCurrency),
    [coinsData, selectedCurrency],
  );

  const topGainersToBeDisplayed = topGainerCoins.slice(0, 6);
  const newCoinsToBeDisplayed = newCoins.slice(0, 6);

  return (
    <Box sx={cryptocurrenciesTopCoinsContentStyles.container}>
      {/* Top Movers sekce */}
      <Box sx={cryptocurrenciesTopCoinsContentStyles.sectionContainer}>
        <Typography variant="h6" sx={cryptocurrenciesTopCoinsContentStyles.sectionTitle}>
          {t('topCoins.topGainers')}
        </Typography>

        <Grid container spacing={1} sx={cryptocurrenciesTopCoinsContentStyles.coinsGridContainer}>
          {topGainersToBeDisplayed.map((coin) => (
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

      {/* New on CoinChange sekce */}
      <Box sx={cryptocurrenciesTopCoinsContentStyles.sectionContainer}>
        <Typography variant="h6" sx={cryptocurrenciesTopCoinsContentStyles.sectionTitle}>
          {t('topCoins.newOnCoinChange')}
        </Typography>

        <Grid container spacing={2} sx={cryptocurrenciesTopCoinsContentStyles.coinsGridContainer}>
          {newCoinsToBeDisplayed.map((coin) => (
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
    </Box>
  );
};

export default CryptocurrenciesTopCoinsContent;
