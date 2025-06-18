import { SxProps, Theme } from '@mui/material/styles';

export const conversionInfoStyles: Record<string, SxProps<Theme>> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    color: 'text.secondary',
  },
  timer: {
    fontWeight: 700,
    color: 'primary.main',
    ml: 1,
    textAlign: 'center',
  },
  iconSwitchRates: {
    color: 'primary.main',
  },
  marketRateButton: {
    background: 'none',
    border: 'none',
    padding: 0,
    margin: 0,
    px: 1,
    mx: -1,
    color: 'text.secondary',
    fontSize: '0.95rem',
    cursor: 'pointer',
    borderRadius: '12px',
    transition: 'background 0.2s, color 0.2s',
    minWidth: 'unset',
    boxShadow: 'none',
    '&:hover': {
      background: '#e3f2fd',
      color: '#1976d2',
      boxShadow: 'none',
    },
    '&:focus': {
      outline: '2px solid #1976d2',
    },
    userSelect: 'none',
    textTransform: 'none',
    fontWeight: 400,
    justifyContent: 'flex-end',
    display: 'flex',
  },
};
