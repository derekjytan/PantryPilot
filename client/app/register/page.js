'use client';

import React, { useState } from "react";
import { Box, Typography, TextField, Button, Link, Container, CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import GoogleIcon from '@mui/icons-material/Google';
import { doCreateUserWithEmailAndPassword, doSignInWithGoogle } from "../../utils/auth";
import { useAuth } from "../contexts/authContext/page";
import Navbar from "../components/navbar/nav";
import { useRouter } from "next/navigation";

const theme = createTheme({
  palette: {
    primary: {
      main: '#1089d3',
    },
    secondary: {
      main: '#18b1d1',
    },
  },
});

const SignUp = () => {
  // const { user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningUp) {
      setIsSigningUp(true);
      try {
        await doCreateUserWithEmailAndPassword(email, password);
        router.push('/');
      } catch (error) {
        setErrorMessage(error.message);
        setIsSigningUp(false);
      }
    }
  };

  const onGoogleSignIn = async (e) => {
    e.preventDefault();
    if (!isSigningUp) {
      setIsSigningUp(true);
      try {
        await doSignInWithGoogle();
        router.push('/');
      } catch (error) {
        setErrorMessage(error.message);
        setIsSigningUp(false);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Navbar />
        <Box
          sx={{
            maxWidth: 350,
            background: 'linear-gradient(0deg, rgb(255, 255, 255) 0%, rgb(244, 247, 251) 100%)',
            borderRadius: '40px',
            padding: '25px 35px',
            border: '5px solid rgb(255, 255, 255)',
            boxShadow: '0px 30px 30px -20px rgba(133, 189, 215, 0.878)',
            margin: '80px auto',
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" fontWeight="bold" color="primary.main" sx={{ fontWeight: 900, fontSize: 30 }}>
            Sign Up
          </Typography>
          <form onSubmit={onSubmit} style={{ marginTop: 20 }}>
            <TextField
              required
              fullWidth
              variant="outlined"
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                background: 'white',
                borderRadius: '20px',
                marginTop: '15px',
                boxShadow: '#cff0ff 0px 10px 10px -5px',
              }}
            />
            <TextField
              required
              fullWidth
              variant="outlined"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                background: 'white',
                borderRadius: '20px',
                marginTop: '15px',
                boxShadow: '#cff0ff 0px 10px 10px -5px',
              }}
            />
            {errorMessage && (
              <Typography variant="body2" color="error" sx={{ mt: 1, fontWeight: 'bold' }}>
                {errorMessage}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSigningUp}
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%)',
                color: 'white',
                padding: '15px 0',
                margin: '20px auto',
                borderRadius: '20px',
                boxShadow: 'rgba(133, 189, 215, 0.878) 0px 20px 10px -15px',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: 'rgba(133, 189, 215, 0.878) 0px 23px 10px -20px',
                },
                '&:active': {
                  transform: 'scale(0.95)',
                  boxShadow: 'rgba(133, 189, 215, 0.878) 0px 15px 10px -10px',
                },
              }}
            >
              {isSigningUp ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Box sx={{ borderBottom: 2, borderColor: 'divider', flex: 1, mb: 2.5 }} />
            <Typography variant="body2" sx={{ mx: 2, fontWeight: 'bold' }}>OR</Typography>
            <Box sx={{ borderBottom: 2, borderColor: 'divider', flex: 1, mb: 2.5 }} />
          </Box>
          <Button
            fullWidth
            variant="outlined"
            onClick={onGoogleSignIn}
            disabled={isSigningUp}
            startIcon={<GoogleIcon />}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1,
              py: 2.5,
              borderRadius: '8px',
              textTransform: 'none',
              transition: 'background-color 0.2s',
              '&:hover': {
                backgroundColor: '#f0f0f0',
              },
              '&:active': {
                backgroundColor: '#e0e0e0',
              },
            }}
          >
            {isSigningUp ? "Signing Up..." : "Continue with Google"}
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SignUp;