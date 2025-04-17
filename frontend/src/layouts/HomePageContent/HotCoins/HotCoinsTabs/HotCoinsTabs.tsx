import React, { useState } from 'react';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { hotCoinsTabsStyles } from './styles.ts';
import CoinCard from '../../../../components/common/CoinCard';
import { CryptoAsset } from '../../../../constants/cryptoAssets.ts';

interface HotCoinsTabsProps {
  cryptoAssets: CryptoAsset[];
}

export const HotCoinsTabs: React.FC<HotCoinsTabsProps> = ({ cryptoAssets }) => {
  const { t } = useTranslation('homepage');
  const [view, setView] = useState<string>('tradable');

  const handleViewChange = (_event: React.MouseEvent<HTMLElement>, newView: string | null) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  // Filter coins based on selected view
  const displayedCoins =
    view === 'tradable' ? cryptoAssets : cryptoAssets.filter((coin) => coin.priceChange > 0);

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
          <CoinCard key={coin.id} coin={coin} />
        ))}
      </Box>
    </Box>
  );
};

export default HotCoinsTabs;
