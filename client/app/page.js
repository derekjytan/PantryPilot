'use client'

import { Container, Typography, Button, Grid, Box, CssBaseline } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { firestore } from '../firebase'
import { collection, getDocs, query } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useAuth } from './contexts/authContext/page';
import Navbar from './components/navbar/nav'
import Image from 'next/image'

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
  },
  typography: {
    fontFamily: 'Comic Sans MS',
  },
})

const Home = () => {
  // Store all pantry items 
  const [pantryItems, setPantryItems] = useState([])
  const { userLoggedIn, setCurrentUser } = useAuth();

  useEffect(() => {
    const updatePantry = async () => {
      const querySnapshot = query(collection(firestore, 'pantryItems'))
      const docs = await getDocs(querySnapshot)
      const pantryList = []
      docs.forEach((doc) => {
        pantryList.push(doc.id)

      })
      console.log(pantryList)
      setPantryItems(pantryItems)
    }
    updatePantry()
}, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
      <header>
        <Navbar />
      </header>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h2" gutterBottom>
            Welcome to Pantry Pilot!
          </Typography>
          {!userLoggedIn ? (
               <Button variant="contained" color="secondary" href="/login" sx={{ mt: 4}}>
               Get Started
             </Button> 
          ) : null}
        </Box>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} sm={4}>
            <Box textAlign="center">
              <Typography variant="h6" gutterBottom>Track Pantry Items</Typography>
              <Typography>Keep track of what's in your pantry at all times.</Typography>
                <Image 
                  src="/checklist.svg"
                  alt="Checklist"
                  width={350}
                  height={400}
                />
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box textAlign="center">
              <Typography variant="h6" gutterBottom>Discover Recipes</Typography>
              <Typography>Find recipes based on your pantry items.</Typography>
              <Image
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box textAlign="center">
              <Typography variant="h6" gutterBottom>Plan Your Shopping</Typography>
              <Typography>Create shopping lists from your recipes.</Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default Home;