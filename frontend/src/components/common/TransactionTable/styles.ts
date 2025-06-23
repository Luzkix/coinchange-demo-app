import { SxProps, Theme } from '@mui/material';

export const transactionTableStyles: Record<string, SxProps<Theme>> = {
  gridContainer: {
    width: '100%',
    height: 'auto',
    minHeight: 400,
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
    ml: 1,
    backgroundColor: 'primary.main',
    color: 'primary.contrastText',
    fontSize: '0.75rem',
    px: 2,
    py: 0.5,
    borderRadius: 1,
    '&:hover': {
      backgroundColor: 'primary.dark',
    },
  },
};
