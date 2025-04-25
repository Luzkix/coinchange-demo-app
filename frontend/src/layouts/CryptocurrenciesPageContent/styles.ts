import { SxProps, Theme } from '@mui/material';

export const cryptocurrenciesPageContentStyles: Record<string, SxProps<Theme>> = {
  container: {
    display: 'flex',
    gap: 1,
    p: 2,
    '@media (max-width: 900px)': {
      flexDirection: 'column',
    },
  },
  mainColumn: {
    flex: '0 1 70%',
    maxWidth: '70%',
    '@media (max-width: 900px)': {
      flex: '1 1 100%',
      maxWidth: '100%',
    },
  },
  sideColumn: {
    flex: '0 1 30%',
    maxWidth: '30%',
    '@media (max-width: 900px)': {
      flex: '1 1 100%',
      maxWidth: '100%',
    },
  },
};
