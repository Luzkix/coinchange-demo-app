import React, { useMemo, useState } from 'react';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { hotCoinsTabsStyles } from './styles.ts';
import CoinCard from '../../../../components/common/CoinCard';
import { useCoinsDataContext } from '../../../../contexts/CoinsDataContext.tsx';
import { getTopGainers, getTradableCoins } from '../../../../services/utils/coinsUtils.ts';
import { useGeneralContext } from '../../../../contexts/GeneralContext.tsx';
import { Languages } from '../../../../constants/customConstants.ts';
import Grid from '@mui/material/Grid';

export const HotCoinsTabs: React.FC = () => {
  const { t } = useTranslation('homepage');
  const [view, setView] = useState('tradable');
  const { coinsData } = useCoinsDataContext();
  const { language } = useGeneralContext();
  const selectedCurrency = Languages[language].currency; //currency is derived from selected language (English = USD, Czech = EUR)

  // useMemo slouzi pro memoizaci vysledku, tzn neprepocitavaji se znovu hodnoty pri prenacteni komponenty pokud se nezmenily zavislosti coinsData nebo selectedCurrency
  const tradableCoins = useMemo(
    () => getTradableCoins(coinsData, selectedCurrency),
    [coinsData, selectedCurrency],
  );

  const topGainerCoins = useMemo(
    () => getTopGainers(coinsData, selectedCurrency),
    [coinsData, selectedCurrency],
  );

  const handleViewChange = (_event: React.MouseEvent, newView: string | null) => {
    if (newView !== null) setView(newView);
  };

  const displayedCoins =
    view === 'tradable'
      ? tradableCoins.slice(0, 6) //slice vrati z array pouze hodnoty v uvedenem rozsahu, tzn prvnich 6 coins
      : topGainerCoins.slice(0, 6);

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
          <ToggleButton value="tradable" sx={hotCoinsTabsStyles.toggleButton}>
            {t('hotCoins.tradable')}
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
