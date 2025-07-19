// src/theme.js
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000', // update to your desired primary color
    },
    secondary: {
      main: '#dc004e', // update as needed
    },
    background: {
      default: '#000000',
      paper: '#ffffff',
    },
    text: {
      primary: '#ffffff',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
})

export default theme
