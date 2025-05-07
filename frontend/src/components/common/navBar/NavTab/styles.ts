import { SxProps, Theme } from '@mui/material';

export const navTabStyles = {
  button: (active: boolean, variant: 'default' | 'primary'): SxProps<Theme> => ({
    borderRadius: 999,
    fontWeight: 'bold',
    boxShadow: variant === 'primary' ? 2 : undefined,
    backgroundColor: active && variant !== 'primary' ? 'action.hover' : undefined,
    color: variant === 'primary' ? '#fff' : undefined,
    minWidth: 120,
    mx: 0.5,
    textTransform: 'none',
  }),
};
