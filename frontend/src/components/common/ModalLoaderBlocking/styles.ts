import { SxProps, Theme } from '@mui/material/styles';

export const modalBoxStyle: SxProps<Theme> = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  bgcolor: 'transparent',
  boxShadow: 0,
  outline: 'none',
  p: 0,
};
