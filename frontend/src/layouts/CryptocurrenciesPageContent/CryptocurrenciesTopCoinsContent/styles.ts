import { SxProps, Theme } from '@mui/material';

export const cryptocurrenciesTopCoinsContentStyles: Record<string, SxProps<Theme>> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  sectionContainer: {
    //bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 1,
    p: 3,
  },
  sectionTitle: {
    fontWeight: 'bold',
    mb: 2,
    color: 'text.primary',
  },
  coinsGridContainer: {
    mt: 2,
  },
};
