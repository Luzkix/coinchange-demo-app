import React from 'react';
import { Box, Typography } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { coinCardStyles } from './styles.ts';
import { useGeneralContext } from '../../../contexts/GeneralContext.tsx';
import { createCoinColor } from '../../../services/utils/coinsUtils.ts';

interface CoinCardProps {
  coinSymbol: string;
  coinName: string;
  coinPrice: number;
  coinPriceChange: number;
  currency: string;
}

export const CoinCard: React.FC<CoinCardProps> = ({
  coinSymbol,
  coinName,
  coinPrice,
  coinPriceChange,
  currency,
}) => {
  const { language } = useGeneralContext();

  // Format price with local currency formatting
  const formattedPrice = new Intl.NumberFormat(language === 'cs' ? 'cs-CZ' : 'en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(coinPrice);

  // Determine price change color and icon
  const isPriceUp = coinPriceChange > 0;
  const isPriceDown = coinPriceChange < 0;
  const priceChangeColor = isPriceUp
    ? coinCardStyles.positive
    : isPriceDown
      ? coinCardStyles.negative
      : coinCardStyles.neutral;

  return (
    <Box sx={coinCardStyles.card}>
      <Box sx={coinCardStyles.header}>
        <Box sx={{ ...coinCardStyles.icon, bgcolor: createCoinColor(coinSymbol) }}>
          <Typography variant="h6" color="white">
            {coinSymbol.charAt(0)}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body1" sx={coinCardStyles.name}>
            {coinName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {coinSymbol}
          </Typography>
        </Box>
      </Box>
      <Typography variant="h6" sx={coinCardStyles.price}>
        {formattedPrice}
      </Typography>
      <Box sx={{ ...coinCardStyles.priceChange, ...priceChangeColor }}>
        {isPriceUp && <ArrowDropUpIcon />}
        {isPriceDown && <ArrowDropDownIcon />}
        <Typography variant="body2">{Math.abs(coinPriceChange)}%</Typography>
      </Box>
    </Box>
  );
};

export default CoinCard;
