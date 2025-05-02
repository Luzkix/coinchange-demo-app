import { SxProps, Theme } from '@mui/material';

export const cryptocurrenciesPageContentStyles: Record<string, SxProps<Theme>> = {
  container: {
    display: 'flex',
    gap: 2,
    p: 0,
    mt: 2,
    '@media (max-width: 900px)': {
      flexDirection: 'column',
    },
  },
  mainColumn: {
    flex: '0 1 75%',
    maxWidth: '75%',
    '@media (max-width: 900px)': {
      flex: '1 1 100%',
      maxWidth: '100%',
    },
  },
  sideColumn: {
    flex: '0 1 25%',
    maxWidth: '25%',
    '@media (max-width: 900px)': {
      flex: '1 1 100%',
      maxWidth: '100%',
    },
  },
};
