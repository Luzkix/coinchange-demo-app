import { SxProps, Theme } from '@mui/material';

export const introductionStyles: Record<string, SxProps<Theme>> = {
  container: {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    alignItems: 'center',
    justifyContent: 'space-between',
    py: 8,
    px: 4,
    backgroundColor: 'background.default',
  },
  content: {
    maxWidth: { xs: '100%', md: '50%' },
    textAlign: { xs: 'center', md: 'left' },
    mb: { xs: 4, md: 0 },
  },
  title: {
    fontWeight: 700,
    mb: 2,
  },
  description: {
    color: 'text.secondary',
    mb: 4,
    fontSize: '1.25rem',
  },
  imageContainer: {
    maxWidth: { xs: '100%', md: '45%' },
    display: 'flex',
    justifyContent: 'center',
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
  },
  signupButton: {
    py: 1.5,
    px: 4,
    fontSize: '1.1rem',
  },
};
