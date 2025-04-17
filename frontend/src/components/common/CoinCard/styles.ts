import { SystemStyleObject, Theme } from '@mui/system';

export const coinCardStyles: Record<string, SystemStyleObject<Theme>> = {
  card: {
    p: 3,
    borderRadius: 4,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
    backgroundColor: 'background.default',
    //rectangular shape of CoinCard
    aspectRatio: '1 / 1',
    width: '55%',
    minWidth: '55%', // nebo konkrétní velikost,
    maxWidth: '55%',
    //maxHeight: '80%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: 'auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    mb: 2,
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    mr: 2,
  },
  name: {
    fontWeight: 600,
  },
  price: {
    fontWeight: 600,
    mb: 1,
  },
  priceChange: {
    display: 'flex',
    alignItems: 'center',
  },
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
