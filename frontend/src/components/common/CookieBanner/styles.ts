import { SxProps, Theme } from '@mui/material';

export const cookieBannerStyles: Record<string, SxProps<Theme>> = {
  banner: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    bgcolor: 'background.paper',
    boxShadow: '0px -2px 8px rgba(0, 0, 0, 0.1)',
    p: 3,
    zIndex: 1000,
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    alignItems: { xs: 'stretch', md: 'center' },
    justifyContent: 'space-between',
    gap: 2,
  },
  text: {
    flex: 1,
  },
  buttons: {
    display: 'flex',
    gap: 1,
    flexWrap: 'wrap',
    justifyContent: { xs: 'center', md: 'flex-end' },
  },
  link: {
    cursor: 'pointer',
    textDecoration: 'underline',
    mx: 0.5,
  },
};
