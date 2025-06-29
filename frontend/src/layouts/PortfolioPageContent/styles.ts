import { SxProps } from '@mui/material/styles';
import { Theme } from '@mui/system';

export const portfolioPageContentStyles: Record<string, SxProps<Theme>> = {
  container: {
    maxWidth: 700,
    mx: 'auto',
    mt: 4,
    px: 2,
  },
  summaryContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    flexWrap: 'wrap',
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
  totalBalanceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    mb: 2,
    mt: 1,
  },
  totalBalanceValue: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#27ae60',
    letterSpacing: 1,
    ml: 0, // mezera od popisku
  },

  totalFeesRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5, // rozumná mezera mezi popiskem a hodnotou
    mt: 1,
    mb: 1,
    fontSize: '1.2rem',
    fontWeight: 750,
  },
  totalFeesLabel: {
    fontSize: '1.2rem',
    color: 'text.secondary',
    mr: 0.5,
  },
  totalFeesValue: {
    color: 'text.secondary',
    ml: 0.5,
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  },
  totalFeesTooltipIcon: {
    fontSize: 18,
    color: 'text.disabled',
    ml: 1,
    cursor: 'pointer',
  },
};
