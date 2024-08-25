'use client';

import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, Link, Container, CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import GoogleIcon from '@mui/icons-material/Google';
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "../../utils/auth";
import { useAuth } from "../contexts/authContext";
import Navbar from "../components/navbar/nav";
import { useRouter } from "next/navigation";
import { motion } from 'framer-motion';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1089d3', // Blue
    },
    secondary: {
      main: '#18b1d1', // Light blue
    },
  },
});

const Login = () => {
  // Accessing the token from the global AuthContext
  const { getToken, currentUser } = useAuth();
  // router hook to navigate the user to the home page after a successful login
  const router = useRouter(); 
  // State management to manage the email, password,, and login status
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // useEffect() to fetch the token when the user logs in
  // so when the state changes, the token will be fetched
  useEffect(() => {
    // Async function to fetch the token
    const fetchToken = async () => {
      if (currentUser) {
        // The get token is fetched from the global AuthContext provider
        const token = await getToken();
        console.log("Token:", token);
      }
    }
    fetchToken(); // Fetching the token when the user logs in
  }, [currentUser, getToken]); // This will only run when the currentUser or getToken state changes

  // Handle the email/password login submission
  const onSubmit = async (e) => {
    // Prevent the default form submission
    e.preventDefault();

    // Check if the sign in is not already in progress
    if (!isSigningIn) {
      // Set the login status to true if the user is signing in
      // This is to prevent multiple sign in attempts
      // So the button will show "Signing in..."
      setIsSigningIn(true);
      try {
        await doSignInWithEmailAndPassword(email, password);
        // Logging the token to see if the token is actually fetched from global context
        const token = await getToken();
        console.log("Token on Submit:", token);
        router.push('/');
      } catch (error) {
        setErrorMessage(error.message);
        // Resetting sign in status if the user fails to sign in
        setIsSigningIn(false);
      }
    }
  };

  // Handle the Google sign in
  const onGoogleSignIn = async (e) => {
    // Prevent the default form submission
    e.preventDefault();
    if (!isSigningIn) {
      // Set the login status to true if the user is signing in
      // This is to prevent multiple sign in attempts
      // So the button will show "Signing in..."
      setIsSigningIn(true);
      try {
        await doSignInWithGoogle();
        router.push('/');
      } catch (error) {
        setErrorMessage(error.message);
        // Resetting sign in status if the user fails to sign in
        setIsSigningIn(false);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Navbar />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              maxWidth: 400,
              background: 'linear-gradient(145deg, #ffffff, #f0f4f8)',
              borderRadius: '40px',
              padding: '35px 45px',
              border: '5px solid #ffffff',
              boxShadow: '0px 30px 30px -20px rgba(133, 189, 215, 0.878)',
              margin: '80px auto',
              textAlign: 'center',
            }}
          >
            <Typography variant="h5" fontWeight="bold" color="primary.main" sx={{ fontWeight: 900, fontSize: 30 }}>
              Welcome Back
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
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderRadius: '20px',
                    },
                  },
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
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderRadius: '20px',
                    },
                  },
                }}
              />
              {errorMessage && (
                <Typography variant="body2" color="error" sx={{ mt: 1, fontWeight: 'bold' }}>
                  {errorMessage}
                </Typography>
              )}
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isSigningIn}
                  sx={{
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #1089d3, #18b1d1)',
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
                  {isSigningIn ? "Signing In..." : "Sign In"}
                </Button>
              </motion.div>
            </form>
            <Box textAlign="left" sx={{ marginTop: 1, marginLeft: 1 }}>
              <Link href="#" variant="body2" sx={{ fontSize: 11, color: '#0099ff', textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </Box>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Don&apos;t have an account? <Link href="/register" sx={{ textDecoration: 'underline', fontWeight: 'bold' }}>Sign up</Link>
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Box sx={{ borderBottom: 2, borderColor: 'divider', flex: 1, mb: 2.5 }} />
              <Typography variant="body2" sx={{ mx: 2, fontWeight: 'bold' }}>OR</Typography>
              <Box sx={{ borderBottom: 2, borderColor: 'divider', flex: 1, mb: 2.5 }} />
            </Box>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                fullWidth
                variant="outlined"
                onClick={onGoogleSignIn}
                disabled={isSigningIn}
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
                {isSigningIn ? "Signing In..." : "Continue with Google"}
              </Button> 
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </ThemeProvider>
  );
};

export default Login;