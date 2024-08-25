'use client'; // Client side rendering 

import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ThemeProvider, createTheme } from '@mui/material';
import { Card, CardContent, Typography, CircularProgress, Alert, Container, CssBaseline, Box, Grid, Button, CardActions, CardMedia } from '@mui/material';
import { useAuth } from '../contexts/authContext';
import Navbar from '../components/navbar/nav';
import Link from 'next/link';
import axios from 'axios';
import { motion } from 'framer-motion';

const theme = createTheme({
  palette: {
    background: {
      default: '#ffffff',
    },
    primary: {
      main: '#0000ff',
    },
    secondary: {
      main: '#add8e6',
    },
    text: {
      primary: '#000000',
    },
  },
  typography: {
    fontFamily: 'Comic Sans MS',
  },
});

const Recipes = () => {
  // Accessing the token from the global AuthContext
  const { userLoggedIn, getToken, currentUser } = useAuth();
  // State management to manage the recipes
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 
  // useEffect() to fetch the token when the user logs in
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchPantry(); // Fetch the pantry items from the server when the user logs in
      }
    });
    return () => unsubscribe(); // When the component unmounts, unsubscribe from the onAuthStateChanged event
  }, [currentUser]); // This will only run when the currentUser state changes

  // Function to fetch the pantry items from the server 
  const fetchPantry = async () => {
    const token = await getToken();
    try {
      // Sending an HTTP get request to the server with the token
      // using axios to help get the data from the server
      // server is a get request to the /pantry endpoint
      const res = await axios.get('http://localhost:8000/pantry', {
        headers: {
          // Passing the token in the request headers
          Authorization: `Bearer ${token}`,
        },
      });
      // Generate recipes based on the fetched ingredients from the server
      // calling the generateRecipes function to pass the ingredients to the server
      generateRecipes(res.data.map(item => item.name)); 
    } catch (error) {
      console.error('Error fetching pantry items:', error);
    }
  };

  // Function to generate the recipes
  // the ingredients parameter is an array of ingredients that the server will accept as a query 
  const generateRecipes = async (ingredients) => {
    // Getting the authentication token
    const token = await getToken();
    setLoading(true);
    try {
        // Sending an HTTP get request to the server with the token to generate the recipes
        // server is a get request to the /generateRecipe endpoint
      const res = await axios.get('http://localhost:8000/generateRecipe', {
        headers: {
          // Passing the token in the request headers 
          Authorization: `Bearer ${token}`,
        },
        params: {
          ingredients: ingredients.join(','), // Passing the ingredients as query parameters
        },
      });
      console.log("Generated Recipes:", res.data);
      setRecipes(res.data); // Update the recipes state with the generated recipes
    } catch (error) {
      setError('Your pantry is empty!');
      console.error('Error generating recipes:', error);
    } finally {
      setLoading(false); // Setting the loading to false after the recipes are generated
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Navbar />
        {!userLoggedIn ? (
          <Box>
            <Link href="/login" passHref>
              <Typography variant="body1" component="span">
                Please sign up or log in to view your recipe suggestions!
              </Typography>
            </Link>
          </Box>
        ) : (
          <Box>
            <Typography variant="h4" gutterBottom>
              Recipe Suggestions
            </Typography>
            {loading && (
              <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 4 }}>
                <CircularProgress />
              </Box>
            )}
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                <Alert severity="error">{error}</Alert>
              </motion.div>
            )}
            <Grid container spacing={3}>
              {recipes.map((recipe, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      {recipe.imageUrl && (
                        <CardMedia
                          component="img"
                          height="200"
                          image={recipe.imageUrl}
                          alt={recipe.name}
                        />
                      )}
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h5" component="div">
                          {recipe.name}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                          {recipe.description}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Ingredients:</strong>
                          <ul>
                            {recipe.steps.map((step, stepIndex) => (
                              <li key={stepIndex}>{step}</li>
                            ))}
                          </ul>
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" variant="contained" color="primary" href={recipe.url} target="_blank">
                          Learn More
                        </Button>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default Recipes;