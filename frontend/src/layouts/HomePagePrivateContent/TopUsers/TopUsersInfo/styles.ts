import { SxProps, Theme } from '@mui/material';

export const hotCoinsInfoStyles: Record<string, SxProps<Theme>> = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 700,
    mb: 2,
  },
  subtitle: {
    color: 'text.secondary',
    mb: 4,
  },
  button: {
    alignSelf: { xs: 'center', md: 'flex-start' },
  },
};
