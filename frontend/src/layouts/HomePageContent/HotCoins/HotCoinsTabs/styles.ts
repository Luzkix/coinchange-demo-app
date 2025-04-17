import { SxProps, Theme } from '@mui/material';

export const hotCoinsTabsStyles: Record<string, SxProps<Theme>> = {
  container: {
    flex: 2,
  },
  toggleContainer: {
    display: 'flex',
    justifyContent: 'center',
    mb: 4,
  },
  toggleButton: {
    borderRadius: 100,
    px: 3,
  },
  coinsGrid: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr' },
    gap: 3,
  },
};
