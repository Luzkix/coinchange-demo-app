import React, { useMemo, useState } from 'react';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { hotCoinsTabsStyles } from './styles.ts';
import CoinCard from '../../../../components/common/CoinCard';
import { useCoinsDataContext } from '../../../../contexts/CoinsDataContext.tsx';
import { SUPPORTED_CURRENCIES } from '../../../../constants/configVariables.ts';
import { getTopGainers, getTradableCoins } from '../../../../services/utils/coinsUtils.ts';
import { convertStringNumberToRoundedNumber } from '../../../../services/utils/numbersUtils.ts';

export const HotCoinsTabs: React.FC = () => {
  const { t } = useTranslation('homepage');
  const [view, setView] = useState('tradable');
  const { coinsData } = useCoinsDataContext();
  const selectedCurrency = SUPPORTED_CURRENCIES[0]; //USD

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
      ? tradableCoins.slice(0, 6) //slice vrati z array pouze hodnoty v uvedenem rozsahu
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

      <Box sx={hotCoinsTabsStyles.coinsGrid}>
        {displayedCoins.map((coin) => (
          <CoinCard
            key={coin.base_currency_id}
            coinSymbol={coin.base_display_symbol}
            coinName={coin.base_name}
            coinPrice={Number(coin.price)}
            coinPriceChange={convertStringNumberToRoundedNumber(
              coin.price_percentage_change_24h,
              2,
            )}
            currency={selectedCurrency}
          />
        ))}
      </Box>
    </Box>
  );
};

export default HotCoinsTabs;
