'use client'

import React, { useEffect, useState, useRef } from 'react';
import { Container, Grid, Box, TextField, Button, Typography, Card, CardContent, IconButton, CssBaseline } from '@mui/material';
import { Add, Edit, Delete, PhotoCamera } from '@mui/icons-material';
import Navbar from '../components/navbar/nav';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { firestore } from '../../firebase';
import { collection, getDocs, query, doc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { Camera } from "react-camera-pro";

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
  const [takePhoto ,setTakePhoto] = useState(false);
  const [captureImage, setCaptureImage] = useState(null);
  const camera = useRef(null);

  const updatePantry = async () => {
    const querySnapshot = query(collection(firestore, 'pantryItems'));
    const docs = await getDocs(querySnapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({
        name: doc.id,
        ...doc.data()
      });
    });
    setPantryItems(pantryList);
  };

  const addItem = async (item) => {
    if (!item) return;

    const docRef = doc(firestore, 'pantryItems', item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    setNewItem('');
    await updatePantry();
  };

  const removeItem = async (item) => {
    const docRef = doc(firestore, 'pantryItems', item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updatePantry();
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    addItem(newItem);
  };

  // Handling the camera toggle 
  // const handleCameraToggle = () => {
  //   setTakePhoto((prev) => !prev);
  // };

  // Handling the camera capture 
  // const handleCapture = () => {
  //   if (camera.current) {
  //     const photo = camera.current.takePhoto();
  //     setCaptureImage(photo);
  //     if (onCapture) {
  //       onCapture(photo);
  //     }
  //   }
  // };

  // Uploading our images to Firebase Storage
  //   const uploadImage = async (image) => {
  //   const storageRef = ref(storage, `images/${image.name}`);
  //   const download = await downloadURL(storageRef);

  //   return download;
  // };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Navbar />
        <Typography variant="h4" gutterBottom>
          My Pantry
        </Typography>
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
              <Button variant="contained" color="primary" fullWidth type="submit">
                <Add /> Add Item
              </Button>
            </Grid>
            {/* <Grid item xs={0.5}>
              <Button variant="contained" color="secondary" fullWidth onClick={handleCameraToggle}>
                <PhotoCamera /> 
              </Button>
            </Grid> */}
          </Grid>
        </Box>

        {/* {takePhoto && (
          <Box sx={{ mb: 4 }}>
            <Camera ref={camera} />
            <Button variant="contained" color="primary" onClick={handleCapture}>
              Capture Photo
            </Button>
            {captureImage && <img src={captureImage} alt="Captured" style={{ maxWidth: '100%', marginTop: '10px' }} />}
          </Box>
        )} */}


        <Typography variant="h6" gutterBottom>
          Your Pantry
        </Typography>
        <Grid container spacing={2}>
          {pantryItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1">{item.name}</Typography>
                    <Typography variant='body2'>{item.quantity}</Typography>
                    <Box>
                      <IconButton color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton color="secondary" onClick={() => removeItem(item.name)}>
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default MyPantry;