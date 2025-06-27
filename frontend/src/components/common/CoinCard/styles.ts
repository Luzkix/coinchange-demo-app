import { SystemStyleObject, Theme } from '@mui/system';

export const coinCardStyles: Record<string, SystemStyleObject<Theme>> = {
  // overall card styles
  card: {
    p: 3,
    borderRadius: 4,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
    backgroundColor: 'background.default',
    aspectRatio: '1 / 1',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    margin: 'auto',
    overflow: 'hidden', // Zabrání přetékání obsahu
  },

  // size variants of the card
  smallCard: {
    maxWidth: '140px',
    p: 2,
  },

  mediumCard: {
    maxWidth: '170px',
    p: 3,
  },

  largeCard: {
    maxWidth: '210px',
    p: 3,
  },

  // price styles
  price: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    mt: 1,
    mb: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  // size variants for price
  smallPrice: {
    fontSize: '1.15rem',
  },

  mediumPrice: {
    fontSize: '1.25rem',
    mt: 1,
  },

  largePrice: {
    fontSize: '1.75rem',
  },

  // priceChange styles
  priceChange: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // size variants for price change
  smallPriceChange: {
    fontSize: '1.05rem',
    '& .MuiSvgIcon-root': {
      fontSize: '1.5rem',
    },
  },

  mediumPriceChange: {
    fontSize: '1.2rem',
    '& .MuiSvgIcon-root': {
      fontSize: '2rem',
    },
  },

  largePriceChange: {
    fontSize: '1.5rem',
    '& .MuiSvgIcon-root': {
      fontSize: '3rem',
    },
  },

  // color variants
  positive: {
    color: '#00C087',
  },

  negative: {
    color: '#FF4D4F',
  },

  neutral: {
    color: '#71717A',
  },
};
