import { SxProps, Theme } from '@mui/material';
import { signatureBlue } from '../../../../styles/theme.ts';

export const headerStyles: Record<string, SxProps<Theme>> = {
  appBar: {
    position: 'sticky',
    color: signatureBlue,
    boxShadow: 1,
  },
  toolbar: {
    justifyContent: 'space-between',
  },
  logo: {
    textDecoration: 'none',
    color: 'inherit',
    fontWeight: 'bold',
  },
  navContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    color: '#0A0B0D',
  },
  navButton: {
    textTransform: 'none',
    color: 'inherit',
    '&:hover': {
      backgroundColor: 'action.hover',
    },
  },
  activeNavButton: {
    backgroundColor: 'action.hover',
  },
};
