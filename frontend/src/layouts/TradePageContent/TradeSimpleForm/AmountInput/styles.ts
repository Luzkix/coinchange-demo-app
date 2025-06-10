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
  balanceInfo: {
    color: 'text.secondary',
    fontSize: '0.95rem',
    mb: 1,
    textAlign: 'right',
  },
  error: {
    color: 'error.main',
    fontSize: '0.95rem',
    mt: 0.5,
    mb: 1,
  },
};
