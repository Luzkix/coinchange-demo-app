import { createTheme } from '@mui/material/styles';

export const signatureBlue: string = '#0052FF'; // CoinChange signature blue color

// Define colors, typography and other theme properties
const theme = createTheme({
  palette: {
    primary: {
      main: signatureBlue,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#0A0B0D',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F7F8FA',
    },
    text: {
      primary: '#0A0B0D',
      secondary: '#5B616E',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 100,
          padding: '10px 24px',
          fontSize: '1rem',
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: signatureBlue,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export default theme;
