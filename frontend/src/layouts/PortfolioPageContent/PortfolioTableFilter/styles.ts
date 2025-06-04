// src/layouts/PortfolioPageContent/PortfolioTableFilter/styles.ts
import { SxProps, Theme } from '@mui/material';

export const portfolioTableFilterStyles: Record<string, SxProps<Theme>> = {
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2,
    mt: 2,
    mb: 2,
    flexWrap: 'wrap',
  },
  tabsRow: {
    display: 'flex',
    gap: 1,
  },
  tabButton: {
    borderRadius: 1,
    minWidth: 70,
    px: 2,
    py: 1,
    fontWeight: 500,
    border: '1px solid',
    borderColor: 'divider',
    backgroundColor: 'background.paper',
    color: 'text.primary',
    boxShadow: 'none',
    textTransform: 'none',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: 'action.hover',
      boxShadow: 1,
    },
  },
  tabButtonActive: {
    backgroundColor: 'primary.main',
    color: 'primary.contrastText',
    borderColor: 'primary.main',
    boxShadow: 2,
    fontWeight: 700,
  },
  switchRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    ml: 2,
  },
  switchLabel: {
    ml: 0.5,
    userSelect: 'none',
  },
};
