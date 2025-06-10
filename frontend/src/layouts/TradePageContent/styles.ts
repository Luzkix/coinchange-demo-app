// src/layouts/TradePageContent/styles.ts
import { SxProps, Theme } from '@mui/material/styles';

export const tradePageContentStyles: Record<string, SxProps<Theme>> = {
  container: {
    maxWidth: 500,
    mx: 'auto',
    mt: 4,
    px: 2,
    py: 4,
    bgcolor: 'white',
    borderRadius: 2,
    boxShadow: 22,
  },
  title: {
    mb: 4,
    fontWeight: 700,
    color: 'primary.main',
    textAlign: 'center',
  },
  switchRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    mb: 3,
  },
};
