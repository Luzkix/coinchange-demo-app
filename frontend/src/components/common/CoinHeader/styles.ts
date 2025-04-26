import { SxProps, Theme } from '@mui/material';

export const coinHeaderStyles: Record<string, SxProps<Theme>> = {
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    minWidth: 46,
    height: 46,
    fontSize: '1.6rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    mr: 2,
    color: 'white',
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  name: {
    fontWeight: 600,
    lineHeight: 1.2,
    overflow: 'hidden',
  },
  symbol: {
    color: 'text.secondary',
    fontSize: '0.875rem',
  },

  // individual styles for each predefined size
  smallIcon: {
    minWidth: 36,
    height: 36,
    fontSize: '1.3rem',
    mr: 1,
  },
  smallName: {
    fontSize: '0.9rem',
  },
  smallSymbol: {
    fontSize: '0.75rem',
  },

  largeIcon: {
    minWidth: 56,
    height: 56,
    fontSize: '2rem',
  },
  largeName: {
    fontSize: '1.3rem',
  },
  largeSymbol: {
    fontSize: '1rem',
  },
};
