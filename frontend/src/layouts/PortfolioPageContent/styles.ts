// src/layouts/PortfolioPageContent/styles.ts
import { SxProps, Theme } from '@mui/material/styles';

export const portfolioPageContentStyles: Record<string, SxProps<Theme>> = {
  container: {
    maxWidth: 1000,
    mx: 'auto',
    mt: 4,
    px: 2,
  },
  title: {
    mb: 3,
    fontWeight: 700,
  },
  fiatSelectRow: {
    display: 'flex',
    alignItems: 'center',
    mb: 2,
  },
  sectionTitle: {
    mt: 4,
    mb: 2,
    fontWeight: 600,
  },
};
