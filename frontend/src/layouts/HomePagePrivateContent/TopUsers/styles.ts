import { SxProps, Theme } from '@mui/material';

export const hotCoinsStyles: Record<string, SxProps<Theme>> = {
  container: {
    py: 8,
    px: 4,
    backgroundColor: '#F7F8FA',
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    gap: 6,
  },
};
