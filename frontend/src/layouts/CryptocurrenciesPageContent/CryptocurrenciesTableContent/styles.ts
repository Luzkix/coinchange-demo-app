import { SxProps, Theme } from '@mui/material';

export const cryptocurrenciesTableContentStyles: Record<string, SxProps<Theme>> = {
  container: {
    borderRadius: 2,
    boxShadow: 1,
    p: 3,
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 3,
  },
  title: {
    fontWeight: 'bold',
    color: 'text.primary',
  },
};
