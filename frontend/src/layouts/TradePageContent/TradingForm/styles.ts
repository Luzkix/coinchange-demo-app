import { SxProps, Theme } from '@mui/material/styles';

export const tradingFormStyles: Record<string, SxProps<Theme>> = {
  form: {
    width: '100%',
  },
  swapButton: {
    mx: 'auto',
    display: 'block',
    my: 2,
  },
  submitButton: {
    mt: 3,
    fontWeight: 700,
    fontSize: '1.1rem',
  },
};

export const tradeSuccessMessageStyles: Record<string, SxProps<Theme>> = {
  root: {
    mt: 2,
    color: 'success.main',
    textAlign: 'center',
    fontWeight: 700,
  },
};
