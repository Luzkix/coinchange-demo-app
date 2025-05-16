// src/layouts/SignUpForm/styles.ts
import { SxProps, Theme } from '@mui/material/styles';

export const signInFormStyles: Record<string, SxProps<Theme>> = {
  formBox: {
    maxWidth: 400,
    mx: 'auto',
    mt: 4,
    p: 3,
    boxShadow: 2,
    borderRadius: 2,
  },
  input: {
    mb: 2,
  },
  button: {
    mt: 2,
  },
};
