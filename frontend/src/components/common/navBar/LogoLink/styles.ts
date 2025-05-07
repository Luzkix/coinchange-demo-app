import { SxProps, Theme } from '@mui/material';

export const logoLinkStyles: Record<string, SxProps<Theme>> = {
  link: {
    textDecoration: 'none',
    color: 'inherit',
    fontWeight: 'bold',
  },
  typography: {
    fontWeight: 'bold',
    color: 'primary.main',
  },
};
