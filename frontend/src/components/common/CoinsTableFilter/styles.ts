import { SxProps, Theme } from '@mui/material';

export const coinsTableFilterStyles: Record<string, SxProps<Theme>> = {
  filterContainer: {
    display: 'flex',
    gap: 2,
    alignItems: 'center',
  },
  filterButton: {
    textTransform: 'none',
    minWidth: 80,
  },
  menu: {},
};
