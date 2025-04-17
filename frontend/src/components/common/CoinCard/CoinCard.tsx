import React from 'react';
import { Box, Typography } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { coinCardStyles } from './styles.ts';
import { CryptoAsset } from '../../../constants/cryptoAssets.ts';
import { usePublicLayout } from '../../../hooks/usePublicLayout.ts';

interface CoinCardProps {
  coin: CryptoAsset;
}

export const CoinCard: React.FC<CoinCardProps> = ({ coin }) => {
  const { name, symbol, price, priceChange, iconColor } = coin;
  const { language } = usePublicLayout();

  // Format price with local currency formatting
  const formattedPrice = new Intl.NumberFormat(language === 'cs' ? 'cs-CZ' : 'en-US', {
    style: 'currency',
    currency: 'CZK',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

  // Determine price change color and icon
  const isPriceUp = priceChange > 0;
  const isPriceDown = priceChange < 0;
  const priceChangeColor = isPriceUp
    ? coinCardStyles.positive
    : isPriceDown
      ? coinCardStyles.negative
      : coinCardStyles.neutral;

  return (
    <Box sx={coinCardStyles.card}>
      <Box sx={coinCardStyles.header}>
        <Box sx={{ ...coinCardStyles.icon, bgcolor: iconColor }}>
          <Typography variant="h6" color="white">
            {symbol.charAt(0)}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body1" sx={coinCardStyles.name}>
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {symbol}
          </Typography>
        </Box>
      </Box>
      <Typography variant="h6" sx={coinCardStyles.price}>
        {formattedPrice}
      </Typography>
      <Box sx={{ ...coinCardStyles.priceChange, ...priceChangeColor }}>
        {isPriceUp && <ArrowDropUpIcon />}
        {isPriceDown && <ArrowDropDownIcon />}
        <Typography variant="body2">{Math.abs(priceChange)}%</Typography>
      </Box>
    </Box>
  );
};

export default CoinCard;
