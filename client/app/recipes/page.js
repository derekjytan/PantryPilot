'use client'

import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ThemeProvider, createTheme } from '@mui/material';
import { List, ListItem, ListItemText, Typography, CircularProgress, Alert, Container, CssBaseline, Box } from '@mui/material';
import { useAuth } from '../contexts/authContext/page';
import Navbar from '../components/navbar/nav';
import Link from 'next/link';
import FetchPantryItems from '../components/recipe/FetchPantryItems';
import GenerateRecipe from '../components/recipe/GenerateRecipe';

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
  const { pantryItems, loading: pantryLoading, error: pantryError } = FetchPantryItems();
  const { recipes, loading: recipeLoading, error: recipeError, generateRecipes } = GenerateRecipe(pantryItems);
  const { userLoggedIn, setCurrentUser } = useAuth();
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserID(user.uid);
      } else {
        setUserID(null);
      }
    });
    return () => unsubscribe();
  }, []);

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
            {pantryLoading && <CircularProgress />}
            {pantryError && <Alert severity="error">{pantryError}</Alert>}
            <List>
              {pantryItems.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText primary={item.name} />
                </ListItem>
              ))}
            </List>
            <button onClick={generateRecipes}>Generate Recipes</button>
            {recipeLoading && <CircularProgress />}
            {recipeError && <Alert severity="error">{recipeError}</Alert>}
            <List>
              {recipes.map((recipe, index) => (
                <ListItem key={index}>
                  <ListItemText primary={recipe.recipe.label} /> {/* Adjust according to the actual data structure */}
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default Recipes;