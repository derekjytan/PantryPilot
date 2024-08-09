'use client'

import React, { useEffect, useState } from 'react';
import { Container, Grid, Box, TextField, Button, Typography, Card, CardContent, IconButton, CssBaseline } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import Navbar from '../components/navbar/nav';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useAuth } from '../contexts/authContext/page';
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

const MyPantry = () => {
  const [pantryItems, setPantryItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const { getToken, currentUser } = useAuth();

  const fetchPantry = async () => {
    const token = await getToken(); // Get the token from the global context
    try {
      const res = await axios.get('http://localhost:8000/pantry', {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });
      setPantryItems(res.data); // Set the fetched pantry items in state
    } catch (error) {
      console.error('Error fetching pantry items:', error);
    }
  };

  const addItem = async (item) => {
    const token = await getToken(); // Get the token from the global context
    if (!item || !currentUser) return;

    try {
      await axios.post('http://localhost:8000/addItem',
        { item, quantity: 1 }, // Send item and quantity to the backend
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchPantry(); // Re-fetch the pantry items to update the changes
    } catch (error) {
      console.error('Error adding item:', error);
    }

    setNewItem('');
  };

  const removeItem = async (item) => {
    const token = await getToken(); // Get the token from the global context
    if (!item || !currentUser) return;

    try {
      await axios.post('http://localhost:8000/removeItem',
        { item }, // Send item to the backend
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchPantry(); // Re-fetch the pantry items to update the changes
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchPantry();
    } else {
      setPantryItems([]);
    }
  }, [currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    addItem(newItem);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 1.5 } } }}>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Navbar />
          <Typography variant="h4" gutterBottom>
            My Pantry
          </Typography>
          <motion.div initial="hidden" animate="visible" variants={{ hidden: { x: -100, opacity: 0 }, visible: { x: 0, opacity: 1, transition: { duration: 1 } } }}>
            <Box component="form" sx={{ mb: 4 }} onSubmit={handleSubmit}>
              <Typography variant="h6" gutterBottom>
                Add New Item
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={8}>
                  <TextField
                    label="Item Name"
                    variant="outlined"
                    fullWidth
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                  />
                </Grid>
                <Grid item xs={3}>
                  <motion.div whileHover={{ scale: 1.1 }}>
                    <Button variant="contained" color="primary" fullWidth type="submit">
                      <Add /> Add Item
                    </Button>
                  </motion.div>
                </Grid>
              </Grid>
            </Box>
          </motion.div>

          <Typography variant="h6" gutterBottom>
            Your Pantry
          </Typography>
          <Grid container spacing={2}>
            {pantryItems.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Card>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body1">{item.name}</Typography>
                        <Typography variant="body2">{item.quantity}</Typography>
                        <Box>
                          <IconButton color="primary" onClick={() => addItem(item.name)}>
                            <Edit />
                          </IconButton>
                          <IconButton color="secondary" onClick={() => removeItem(item.name)}>
                            <Delete />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </motion.div>
    </ThemeProvider>
  );
};

export default MyPantry;