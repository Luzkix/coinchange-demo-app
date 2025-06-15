// src/layouts/TradePageContent/TradeSimpleForm/AmountInput/styles.ts

import { SxProps, Theme } from '@mui/material/styles';

export const amountInputStyles: Record<string, SxProps<Theme>> = {
  container: {
    mb: 2,
  },
  label: {
    mb: 1,
    fontWeight: 600,
    color: 'text.secondary',
  },
  inputRow: {
    display: 'flex',
    gap: 1,
    alignItems: 'center',
  },
  input: {
    flex: 2,
  },
  currencySelect: {
    flex: 1,
  },
  currencySelectFirstRowMenuItem: {
    fontWeight: 600,
    opacity: 0.7,
    px: 2,
  },

  currencySelectRowMenuItemBox: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '300px',
    gap: 3,
  },

  balanceInfoWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    mt: 0.5,
  },
  balanceButton: {
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
  error: {
    color: 'error.main',
    fontSize: '0.95rem',
    mt: 0.5,
    mb: 1,
  },
};
