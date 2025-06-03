import { SxProps, Theme } from '@mui/material/styles';

export const profilePageStyles: Record<string, SxProps<Theme>> = {
  container: {
    maxWidth: 450,
    mx: 'auto',
    mt: 4,
    px: 2,
  },
  feeInfo: {
    mt: 2,
    mb: 1,
    '& > p': {
      mb: 0.5,
    },
  },
  buttonStyle: {
    mt: 2,
  },
  messageStyle: {
    mt: 2,
  },
};
