import { SxProps, Theme } from '@mui/material';
import { signatureBlue } from '../../../../styles/theme.ts';

export const headerStyles: Record<string, SxProps<Theme>> = {
  appBar: {
    position: 'sticky',
    color: signatureBlue,
    boxShadow: 1,
    zIndex: (theme) => theme.zIndex.drawer + 1,
    backgroundColor: '#fff',
  },
  toolbar: {
    justifyContent: 'space-between',
    minHeight: { xs: 56, sm: 64 },
    px: { xs: 1, sm: 3 },
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
    fontWeight: 500,
    fontSize: 16,
    borderRadius: 2,
    px: 2,
    py: 1,
    '&:hover': {
      backgroundColor: 'action.hover',
    },
    transition: 'background 0.2s',
  },
  activeNavButton: {
    backgroundColor: 'action.hover',
    fontWeight: 700,
  },
  menuIconButton: {
    display: { xs: 'flex', md: 'none' },
    ml: 1,
    color: '#0A0B0D',
  },
  drawerPaper: {
    width: 240,
    backgroundColor: '#fff',
    boxShadow: 3,
  },
  drawerContent: {
    width: 240,
    p: 2,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  drawerLangSwitcher: {
    mt: 2,
    display: 'flex',
    justifyContent: 'center',
  },
};
