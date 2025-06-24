import { SxProps, Theme } from '@mui/material/styles';

export const tradePageContentStyles: Record<string, SxProps<Theme>> = {
  container: {
    display: 'flex',
    gap: 2,
    p: 0,
    mt: 2,
    alignItems: 'center', // vertikální zarovnání na střed
    justifyContent: 'center', // vodorovné zarovnání na střed
    '@media (max-width: 1000px)': {
      flexDirection: 'column',
      alignItems: 'center', // volitelné: aby se v mobilním zobrazení roztáhly na šířku
    },
  },

  pendingTransactionsContainer: {
    display: 'block',
    gap: 2,
    p: 3,
    mt: 2,
    alignItems: 'center', // vertikální zarovnání na střed
    justifyContent: 'center', // vodorovné zarovnání na střed
    borderRadius: 2,
    boxShadow: 1,
  },

  mainColumn: {
    flex: '0 1 65%',
    maxWidth: '65%',
    '@media (max-width: 1000px)': {
      flex: '1 1 100%',
      maxWidth: '100%',
    },
  },
  sideColumn: {
    flex: '0 1 35%',
    maxWidth: '35%',
    '@media (max-width: 1000px)': {
      flex: '1 1 100%',
      maxWidth: '100%',
    },
  },

  form: {
    maxWidth: 500,
    p: 3,
    bgcolor: 'white',
    borderRadius: 2,
    boxShadow: 1,
  },

  formTitle: {
    mb: 4,
    fontWeight: 700,
    color: 'primary.main',
    textAlign: 'center',
  },
  switchRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    mb: 3,
  },
};
