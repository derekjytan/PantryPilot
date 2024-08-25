'use client'

import React, { useEffect, useState } from 'react';
import { Container, Grid, Box, TextField, Button, Typography, CssBaseline, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, InputAdornment, TableSortLabel, Snackbar, Alert, TablePagination } from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import Navbar from '../components/navbar/nav';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useAuth } from '../contexts/authContext';
import axios from 'axios';
import { motion } from 'framer-motion';

const theme = createTheme({
  palette: {
    background: {
      default: '#f4f6f8',
    },
    primary: {
      main: '#1a73e8',
    },
    secondary: {
      main: '#18b1d1',
    },
    text: {
      primary: '#333333',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          textTransform: 'none',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#1a73e8',
          color: '#ffffff',
          fontWeight: 700,
        },
      },
    },
  },
});

const MyPantry = () => {
  const [pantryItems, setPantryItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { getToken, currentUser } = useAuth();

  const fetchPantry = async () => {
    const token = await getToken();
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/pantry`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPantryItems(res.data);
    } catch (error) {
      console.error('Error fetching pantry items:', error);
    }
  };

  const addItem = async (item) => {
    const token = await getToken();
    if (!item || !currentUser) return;

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/addItem`,
        { item, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchPantry();
      setSnackbar({ open: true, message: 'Item added successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error adding item:', error);
      setSnackbar({ open: true, message: 'Failed to add item.', severity: 'error' });
    }

    setNewItem('');
  };

  const removeItem = async (item) => {
    const token = await getToken();
    if (!item || !currentUser) return;

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/removeItem`,
        { item },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchPantry();
      setSnackbar({ open: true, message: 'Item removed successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error removing item:', error);
      setSnackbar({ open: true, message: 'Failed to remove item.', severity: 'error' });
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

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredItems = pantryItems
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (orderBy === 'name') {
        return order === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        return order === 'asc' ? a.quantity - b.quantity : b.quantity - a.quantity;
      }
    });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Navbar />
          <Typography variant="h4" gutterBottom color="primary" component={motion.div} initial={{ x: -100 }} animate={{ x: 0 }} transition={{ duration: 1 }}>
            My Pantry
          </Typography>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}>
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
                <Grid item xs={4}>
                  <motion.div whileHover={{ scale: 1.1 }}>
                    <Button variant="contained" color="primary" fullWidth type="submit">
                      <Add /> Add Item
                    </Button>
                  </motion.div>
                </Grid>
              </Grid>
            </Box>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 1 }}>
            <Box sx={{ mb: 4 }}>
              <TextField
                label="Search Items"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </motion.div>

          <TableContainer component={Paper}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'name'}
                      direction={orderBy === 'name' ? order : 'asc'}
                      onClick={(event) => handleRequestSort(event, 'name')}
                    >
                      Item Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      active={orderBy === 'quantity'}
                      direction={orderBy === 'quantity' ? order : 'asc'}
                      onClick={(event) => handleRequestSort(event, 'quantity')}
                    >
                      Quantity
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredItems
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => (
                    <motion.tr key={index} whileHover={{ scale: 1.02 }}>
                      <TableCell component="th" scope="row">
                        {item.name}
                      </TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">
                        <IconButton color="primary" onClick={() => addItem(item.name)}>
                          <Edit />
                        </IconButton>
                        <IconButton color="secondary" onClick={() => removeItem(item.name)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </motion.tr>
                  ))}
                                    </TableBody>
                </Table>

                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredItems.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableContainer>

              <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                TransitionComponent={motion.div}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                  {snackbar.message}
                </Alert>
              </Snackbar>
            </Container>
          </motion.div>
        </ThemeProvider>
      );
    };

export default MyPantry;