import { Button } from '@mui/material';
import { styled } from '@mui/system';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: {
      default: '#ffffff', // White
    },
    primary: {
      main: '#0000ff', // Blue
    },
    secondary: {
      main: '#add8e6', // Light blue
    },
    text: {
      primary: '#000000', // Black text color
    },
    mode: 'dark',
  },
  typography: {
    fontFamily: 'Comic Sans MS',
  },
});

export const NavButton = styled(Button)(({ theme }) => ({
  margin: '0 15px',
  textTransform: 'none',
  color: '#000',
  fontWeight: 600,
  borderRadius: '15px',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '100%',
    transform: 'scaleX(0)',
    height: '2px',
    bottom: 0,
    left: 0,
    borderRadius: '15px',
    transformOrigin: 'bottom right',
    transition: 'transform 0.25s ease-out',
  },
  '&:hover::after': {
    transform: 'scaleX(1)',
    transformOrigin: 'bottom left',
  },
}));

export const AuthButton = styled(Button)(({ theme }) => ({
  margin: '0 15px',
  textTransform: 'none',
  color: '#000',
  fontWeight: 600,
  borderRadius: '15px',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '100%',
    transform: 'scaleX(0)',
    height: '2px',
    bottom: 0,
    left: 0,
    borderRadius: '15px',
    transformOrigin: 'bottom right',
    transition: 'transform 0.25s ease-out',
  },
  '&:hover::after': {
    transform: 'scaleX(1)',
    transformOrigin: 'bottom left',
  },
}));

export const Logo = styled('img')({
  height: '40px',
  cursor: 'pointer',
});