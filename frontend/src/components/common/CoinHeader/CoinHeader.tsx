import React, { useMemo } from 'react';
import { Box, SxProps, Theme, Typography } from '@mui/material';
import { coinHeaderStyles } from './styles';
import { createCoinColor } from '../../../services/utils/coinsUtils.ts';
import { useGeneralContext } from '../../../contexts/GeneralContext.tsx';

export interface CoinHeaderProps {
  coinSymbol: string;
  coinName: string;
  size?: 'small' | 'medium' | 'large';
  iconOnly?: boolean;
}

export const CoinHeader: React.FC<CoinHeaderProps> = ({
  coinSymbol,
  coinName,
  size = 'medium',
  iconOnly = false,
}) => {
  const { supportedFiatCurrencies, supportedCryptoCurrencies } = useGeneralContext();

  //defining iconBackgroundColor using 'useMemo' -> it allows to change icon color only when coinSymbol changes, not each time the component is refreshed
  const iconBackgroundColor: string = useMemo(
    () => createCoinColor(coinSymbol, supportedFiatCurrencies, supportedCryptoCurrencies),
    [coinSymbol],
  );

  // constants to define styles to be used based on size input
  const containerStyles = {
    ...coinHeaderStyles.container,
    ...(size === 'small' ? coinHeaderStyles.smallContainer : {}),
    ...(size === 'large' ? coinHeaderStyles.largeContainer : {}),
  };

  const iconStyles = {
    ...coinHeaderStyles.icon,
    ...(size === 'small' ? coinHeaderStyles.smallIcon : {}),
    ...(size === 'large' ? coinHeaderStyles.largeIcon : {}),
    ...{ bgcolor: iconBackgroundColor },
  } as Record<string, SxProps<Theme>>;

  const nameStyles = {
    ...coinHeaderStyles.name,
    ...(size === 'small' ? coinHeaderStyles.smallName : {}),
    ...(size === 'large' ? coinHeaderStyles.largeName : {}),
  };

  const symbolStyles = {
    ...coinHeaderStyles.symbol,
    ...(size === 'small' ? coinHeaderStyles.smallSymbol : {}),
    ...(size === 'large' ? coinHeaderStyles.largeSymbol : {}),
  };

  return (
    <Box sx={containerStyles}>
      <Box sx={iconStyles}>{coinSymbol.charAt(0).toUpperCase()}</Box>

      {!iconOnly && (
        <Box sx={coinHeaderStyles.infoContainer}>
          <Typography variant="body1" sx={nameStyles}>
            {coinName}
          </Typography>
          <Typography variant="body2" sx={symbolStyles}>
            {coinSymbol.toUpperCase()}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CoinHeader;
