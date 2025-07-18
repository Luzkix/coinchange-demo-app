import { SxProps, Theme } from '@mui/material';

export const profilePageStyles: Record<string, SxProps<Theme>> = {
  root: {
    display: 'flex',
    minHeight: 500,
    flexDirection: { xs: 'column', sm: 'row' },
  },
  sidePanel: {
    minWidth: { xs: '100%', sm: '15%' },
    maxWidth: { xs: '100%', sm: '15%' },
    m: { xs: 0, sm: 2 },
    mt: { xs: 2, sm: 2 },
    alignItems: 'center',
    height: { xs: 'auto', sm: 'fit-content' },
  },
  menu: {
    backgroundColor: 'white',
    boxShadow: { xs: 1, sm: 1 },
    borderRadius: 2,
    zIndex: 1,
    overflowX: 'auto',
  },

  cancelAccountButton: {
    backgroundColor: 'lightcoral',
    color: 'white',
    mt: 2,
    width: '100%',

    boxShadow: { xs: 1, sm: 1 },
    borderRadius: 2,
    zIndex: 1,
    overflowX: 'auto',
  },

  navList: {
    p: 0,
  },
  navItem: {
    borderRadius: 0,
    '&.Mui-selected, &.Mui-selected:hover': {
      backgroundColor: 'primary',
      color: 'primary.main',
    },
    textAlign: 'center',
  },
  main: {
    width: '100%',
    maxWidth: { xs: '100%', sm: '85%' },
  },
};
