import { SxProps, Theme } from '@mui/material';

export const acknowledgmentStyles: Record<string, SxProps<Theme>> = {
  container: {
    py: 4,
    px: 4,
    textAlign: 'center',
  },
  title: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'text.secondary',
    mb: 2,
  },
  linksContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: 3,
    flexWrap: 'wrap',
  },
  link: {
    color: 'primary.main',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: 500,
    '&:hover': {
      textDecoration: 'underline',
    },
  },
};
