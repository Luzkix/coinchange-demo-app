import { SxProps, Theme } from '@mui/material';

export const cryptocurrenciesTableContentStyles: Record<string, SxProps<Theme>> = {
  container: {
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 1,
    p: 3,
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 3,
  },
  title: {
    fontWeight: 'bold',
    color: 'text.primary',
  },
  tableContainer: {
    '& .MuiTableCell-head': {
      fontWeight: 'bold',
      color: 'text.secondary',
    },
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    mt: 3,
  },
};
