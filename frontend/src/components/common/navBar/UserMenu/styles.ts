import { SxProps, Theme } from '@mui/material';

// Style for user icon in UserMenu, dark gray background, white text, rounded, centered
export const userMenuStyles: Record<string, SxProps<Theme>> = {
  iconButton: {
    mx: 1,
  },
  iconStyles: {
    minWidth: 28,
    height: 28,
    fontSize: '0.8rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    bgcolor: '#0A0B0D',
    fontWeight: 700,
    userSelect: 'none',
  },
};
