'use client'

import { Container, Typography, Button, Grid, Box, CssBaseline } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { useAuth } from './contexts/authContext'
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

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.5 } },
}

const slideIn = {
  hidden: { x: -100, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 1 } },
}

const Home = () => {
  const { userLoggedIn } = useAuth()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <header>
            <Navbar />
          </header>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <motion.div initial="hidden" animate="visible" variants={slideIn}>
              <Typography variant="h2" gutterBottom>
                Welcome to Pantry Pilot!
              </Typography>
            </motion.div>
            {!userLoggedIn ? (
              <motion.div whileHover={{ scale: 1.1 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  href="/login"
                  sx={{ mt: 4 }}
                >
                  Get Started
                </Button>
              </motion.div>
            ) : null}
          </Box>

          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} sm={4}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Box textAlign="center">
                  <Typography variant="h6" gutterBottom>
                    Track Pantry Items
                  </Typography>
                  <Typography>
                    Keep track of what&apos;s in your pantry at all times.
                  </Typography>
                  <Image
                    src="/checklist.svg"
                    alt="Checklist"
                    width={350}
                    height={400}
                  />
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={4}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Box textAlign="center">
                  <Typography variant="h6" gutterBottom>
                    Discover Recipes
                  </Typography>
                  <Typography>
                    Find recipes based on your pantry items.
                  </Typography>
                  <Image
                    src="/recipe.svg"
                    alt="Recipes"
                    width={220}
                    height={420}
                  />
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={4}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Box textAlign="center">
                  <Typography variant="h6" gutterBottom>
                    Plan Your Shopping
                  </Typography>
                  <Typography>
                    Create shopping lists from your recipes.
                  </Typography>
                  <Image
                    src="/shopping.svg"
                    alt="Shopping"
                    width={240}
                    height={420}
                  />
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </motion.div>
    </ThemeProvider>
  )
}

export default Home