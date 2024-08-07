import React from 'react';
import { Box, Typography, TextField, Button, Link, Grid, IconButton } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import TwitterIcon from '@mui/icons-material/Twitter';

const SignIn = () => {
  return (
    <Box
      sx={{
        maxWidth: 350,
        background: 'linear-gradient(0deg, rgb(255, 255, 255) 0%, rgb(244, 247, 251) 100%)',
        borderRadius: '40px',
        padding: '25px 35px',
        border: '5px solid rgb(255, 255, 255)',
        boxShadow: '0px 30px 30px -20px rgba(133, 189, 215, 0.878)',
        margin: '20px auto',
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" fontWeight="bold" color="primary.main" sx={{ fontWeight: 900, fontSize: 30 }}>
        Sign In
      </Typography>
      <form style={{ marginTop: 20 }}>
        <TextField
          required
          fullWidth
          variant="outlined"
          label="E-mail"
          type="email"
          name="email"
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
          name="password"
          sx={{
            background: 'white',
            borderRadius: '20px',
            marginTop: '15px',
            boxShadow: '#cff0ff 0px 10px 10px -5px',
          }}
        />
        <Box textAlign="left" sx={{ marginTop: 1, marginLeft: 1 }}>
          <Link href="#" variant="body2" sx={{ fontSize: 11, color: '#0099ff', textDecoration: 'none' }}>
            Forgot Password ?
          </Link>
        </Box>
        <Button
          type="submit"
          fullWidth
          variant="contained"
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
          Sign In
        </Button>
      </form>
      <Typography variant="body2" color="textSecondary" sx={{ marginTop: 3, fontSize: 10 }}>
        Or Sign in with
      </Typography>
      <Grid container spacing={2} justifyContent="center" sx={{ marginTop: 1 }}>
        <Grid item>
          <IconButton
            sx={{
              background: 'linear-gradient(45deg, rgb(0, 0, 0) 0%, rgb(112, 112, 112) 100%)',
              border: '5px solid white',
              padding: '5px',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'rgba(133, 189, 215, 0.878) 0px 12px 10px -8px',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.2)',
              },
              '&:active': {
                transform: 'scale(0.9)',
              },
            }}
          >
            <GoogleIcon style={{ fill: 'white' }} />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton
            sx={{
              background: 'linear-gradient(45deg, rgb(0, 0, 0) 0%, rgb(112, 112, 112) 100%)',
              border: '5px solid white',
              padding: '5px',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'rgba(133, 189, 215, 0.878) 0px 12px 10px -8px',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.2)',
              },
              '&:active': {
                transform: 'scale(0.9)',
              },
            }}
          >
            <AppleIcon style={{ fill: 'white' }} />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton
            sx={{
              background: 'linear-gradient(45deg, rgb(0, 0, 0) 0%, rgb(112, 112, 112) 100%)',
              border: '5px solid white',
              padding: '5px',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'rgba(133, 189, 215, 0.878) 0px 12px 10px -8px',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.2)',
              },
              '&:active': {
                transform: 'scale(0.9)',
              },
            }}
          >
            <TwitterIcon style={{ fill: 'white' }} />
          </IconButton>
        </Grid>
      </Grid>
      <Typography variant="caption" display="block" sx={{ marginTop: 3 }}>
        <Link href="#" sx={{ textDecoration: 'none', color: '#0099ff', fontSize: 9 }}>
          Learn user licence agreement
        </Link>
      </Typography>
    </Box>
  );
};

export default SignIn;