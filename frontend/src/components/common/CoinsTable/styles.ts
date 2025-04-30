import { SxProps, Theme } from '@mui/material';

export const coinsDataGridStyles: Record<string, SxProps<Theme>> = {
  gridContainer: {
    width: '100%',
    height: 'auto',
    minHeight: 400,
  },
  dataGrid: {
    border: 'none',
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: 'background.default',
      borderRadius: 1,
    },
    '& .MuiDataGrid-cell': {
      borderBottom: '1px solid',
      borderColor: 'divider',
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
