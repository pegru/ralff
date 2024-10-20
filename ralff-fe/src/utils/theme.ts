import {createTheme} from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light', // Change to 'dark' if you want a dark theme
    primary: {
      main: '#1976d2', // Blue
      light: '#63a4ff',
      dark: '#004ba0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#ff4081', // Pink
      light: '#ff79b0',
      dark: '#c60055',
      contrastText: '#fff',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
      contrastText: '#fff'
    },
    warning: {
      main: '#ffa726',
      light: '#ffb74d',
      dark: '#f57c00',
      contrastText: '#fff'
    },
    info: {
      main: '#29b6f6',
      light: '#4fc3f7',
      dark: '#0288d1',
      contrastText: '#fff'
    },
    success: {
      main: '#66bb6a',
      light: '#81c784',
      dark: '#388e3c',
      contrastText: '#fff'
    },
    background: {
      default: '#f5f5f5', // Light gray background
      paper: '#ffffff', // White background for cards, paper, etc.
    },
    text: {
      primary: '#333', // Dark gray for primary text
      secondary: '#555', // Lighter gray for secondary text
      disabled: '#9e9e9e',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
    },
    button: {
      textTransform: 'none', // Disables uppercase for buttons
      fontWeight: 600,
    },
  },
  spacing: 8, // Default spacing, adjust as needed
  shape: {
    borderRadius: 8, // Makes components have slightly rounded corners
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Rounded corners for buttons
          padding: '10px 20px',
        },
        contained: '#000000',
        colorPrimary: '#000000',
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: '16px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: '16px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow for cards
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#818181',
          color: '#fff',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        gutterBottom: {
          marginBottom: '1.5rem', // Adds spacing below headings
        },
      },
    },
  },
});