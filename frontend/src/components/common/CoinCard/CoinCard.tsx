import React from 'react';
import { Box } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { coinCardStyles } from './styles.ts';
import { Languages } from '../../../constants/customConstants.ts';
import { convertStringNumberToRoundedNumber } from '../../../services/utils/numbersUtils.ts';
import { useTranslation } from 'react-i18next';
import CoinHeader from '../CoinHeader/CoinHeader.tsx';

interface CoinCardProps {
  coinSymbol: string;
  coinName: string;
  coinPrice: string;
  coinPriceChange: string;
  currency: string;
  size?: 'small' | 'medium' | 'large';
}

export const CoinCard: React.FC<CoinCardProps> = ({
  coinSymbol,
  coinName,
  coinPrice,
  coinPriceChange,
  currency,
  size = 'medium',
}) => {
  const { i18n } = useTranslation();

  //conversion of string formats into number formats for select input variables
  const coinPriceNum = Number(coinPrice);
  const coinPriceChangeNum = convertStringNumberToRoundedNumber(coinPriceChange, 2);

  // Format price with local currency formatting
  const formattedPrice = new Intl.NumberFormat(Languages[i18n.language].languageCountryCode, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(coinPriceNum);

  // Determine price change color and icon
  const isPriceUp = coinPriceChangeNum > 0;
  const isPriceDown = coinPriceChangeNum < 0;
  const priceChangeColor = isPriceUp
    ? coinCardStyles.positive
    : isPriceDown
      ? coinCardStyles.negative
      : coinCardStyles.neutral;

  // Apply styles based on size
  const cardStyle = {
    ...coinCardStyles.card,
    ...(size === 'small' ? coinCardStyles.smallCard : {}),
    ...(size === 'medium' ? coinCardStyles.mediumCard : {}),
    ...(size === 'large' ? coinCardStyles.largeCard : {}),
  };

  const priceStyle = {
    ...coinCardStyles.price,
    ...(size === 'small' ? coinCardStyles.smallPrice : {}),
    ...(size === 'medium' ? coinCardStyles.mediumPrice : {}),
    ...(size === 'large' ? coinCardStyles.largePrice : {}),
  };

  const priceChangeStyle = {
    ...coinCardStyles.priceChange,
    ...priceChangeColor,
    ...(size === 'small' ? coinCardStyles.smallPriceChange : {}),
    ...(size === 'medium' ? coinCardStyles.mediumPriceChange : {}),
    ...(size === 'large' ? coinCardStyles.largePriceChange : {}),
  };

  return (
    <Box sx={cardStyle}>
      <CoinHeader coinSymbol={coinSymbol} coinName={coinName} size={size} />

      <Box sx={priceStyle}>{formattedPrice}</Box>

      <Box sx={priceChangeStyle}>
        {isPriceUp && <ArrowDropUpIcon />}
        {isPriceDown && <ArrowDropDownIcon />}
        {Math.abs(coinPriceChangeNum)}%
      </Box>
    </Box>
  );
};

export default CoinCard;
