import { SxProps, Theme } from '@mui/material';

export const footerStyles: Record<string, SxProps<Theme>> = {
  footer: {
    bgcolor: 'grey.900',
    color: 'grey.300',
    p: 4,
    mt: 8,
  },
  sectionTitle: {
    mb: 2,
  },
  linkItem: {
    color: 'inherit',
    display: 'block',
    underline: 'hover',
    mb: 0.5,
  },
  socialContainer: {
    display: 'flex',
    gap: 1,
    mb: 2,
  },
  newsletterForm: {
    display: 'flex',
    gap: 1,
  },
  newsletterInput: {
    bgcolor: 'grey.800',
    borderRadius: 1,
    input: { color: 'white' },
  },
};
