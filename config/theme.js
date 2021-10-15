import { createTheme } from '@mui/material';
import axios from 'axios';

export const theme = createTheme({
  // props: {
  //   // Name of the component ⚛️
  //   MuiButtonBase: {
  //     // The properties to apply
  //     disableRipple: true, // No more ripple, on the whole application 💣!
  //   },
  // },

  typography: {
    // Tell Material-UI what's the font-size on the html element is.
    htmlFontSize: 10,
    body1: {
      fontSize: '1.05rem',
    },
    h1: {
      fontSize: '1.25rem',
    },
    h2: {
      fontSize: '1.15rem',
    },
    h3: {
      fontSize: '1.05rem',
    },
  },
  listItemText: {
    fontSize: '0.7em', //Insert your required size
  },
  breakpoints: {
    values: {
      xs: 320,
      sm: 600,
      md: 960,
      lg: 1024,
      xl: 1920,
    },
  },
  palette: {
    common: {
      black: '#000',
      white: '#fff',
      accent: '#f1c40f',
      Fade: '#C7C7CC',
      Fade2: 'rgba(0.24, 0.24, 0.26, 0.6)',
      Fade3: 'rgba(0.24, 0.24, 0.26, 0.09)',
      Fade4: '#D1D1D6',
      Fade5: '#3C3C4399',
      Fade6: '#5F5F60',
      FadedBackground: '#F4F4F4',
      FadedBackgroundLight: '#ededed',
      disabled: '#D3D3D3',
      inActive: '#999999',
      white: '#FFFFFF',
      whiteText: '#FFFFFF',
      black: '#000',
      danger: '#F50202',
      greyText: '#5F5F60',
      greyText2: '#cccccc',
      modalBackGround: 'rgba(95, 95, 96, 0.65)',
    },
    background: {
      paper: '#fff',
      default: '#fafafa',
      black: '#000',
    },
    primary: {
      light: '#0EA44B',
      main: '#0EA44B',
      // main: "#0EA44B",
      dark: 'rgba(0, 113, 95, 1)',
      contrastText: '#fff',
    },
    root: {
      '&:hover': { backgroundColor: 'transparent' },
      '&:focus': { backgroundColor: 'transparent' },
      '&.Mui-selected': {
        outline: 'none',
      },
      '& label.Mui-focused': {
        color: '#0EA44B',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: '#0EA44B',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'red',
        },
        '&:hover fieldset': {
          borderColor: '#0EA44B',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#0EA44B',
        },
      },
    },
  },
});
export default theme;
