// src/layouts/TradePageContent/TradeSimpleForm/ConversionRateInfo/styles.ts
import { SxProps, Theme } from '@mui/material/styles';

export const conversionInfoStyles: Record<string, SxProps<Theme>> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: 2,
    mt: 2,
    mb: 2,
    color: 'text.secondary',
  },
  timer: {
    fontWeight: 700,
    color: 'primary.main',
    ml: 2,
  },
};
