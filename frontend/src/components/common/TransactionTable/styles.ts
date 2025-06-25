import { SxProps, Theme } from '@mui/material';

export const transactionTableStyles: Record<string, SxProps<Theme>> = {
  gridContainer: {
    width: '100%',
    height: 'auto',
    mt: 2,
  },
  dataGrid: {
    border: 'none',
    width: '100%',
    height: '100%',
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: 'background.default',
      borderRadius: 1,
    },
    '& .MuiDataGrid-cell': {
      borderBottom: '1px solid',
      borderColor: 'divider',
      display: 'flex',
      alignItems: 'center', // vertikální centrování obsahu buňky
      paddingTop: 0,
      paddingBottom: 0,
      fontFamily: 'monospace',
    },
    '& .MuiDataGrid-row': {
      verticalAlign: 'middle', // vertikální zarovnání řádku
    },
    '& .MuiDataGrid-cell--textLeft': {
      justifyContent: 'flex-start',
    },
    '& .MuiDataGrid-cell--textRight': {
      justifyContent: 'flex-end',
    },
    '& .MuiDataGrid-row:hover': {
      backgroundColor: 'action.hover',
    },
    '& .MuiDataGrid-columnHeader': {
      // zmenšení prostoru mezi nadpisem a řadící šipkou
      m: 0,
      pr: 0,
    },
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 'bold !important',
    },
    '& .MuiDataGrid-sortIcon': {
      fontSize: 16, // velikost šipky
    },
    '& .MuiDataGrid-toolbar': {
      my: -1,
      py: 0,
    },
    '& .transaction-row-pending': {
      color: 'lightcoral',
    },
    '& .transaction-row-cancelled': {
      color: 'lightgray',
      fontStyle: 'italic',
      textDecoration: 'line-through 0px',
    },
    '& .transaction-row-processed': {
      color: 'green',
    },
  },
  toggleGroup: {
    mb: 2,
  },
  toggleButton: {
    px: 2,
    py: 0.75,
    '&.Mui-selected': {
      backgroundColor: 'primary.main',
      color: 'primary.contrastText',
      '&:hover': {
        backgroundColor: 'primary.dark',
      },
    },
  },
  actionsCell: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  tradeButton: {
    ml: 0,
    backgroundColor: 'lightcoral',
    color: 'primary.contrastText',
    fontSize: '0.75rem',
    px: 2,
    py: 0,
    borderRadius: 1,
    '&:hover': {
      backgroundColor: 'primary.dark',
    },
  },
};
