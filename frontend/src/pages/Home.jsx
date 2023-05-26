import * as React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Navbar from '../components/Navbar';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

const RoundedButton = styled(Button)({
  borderRadius: '40px',
  fontWeight: '600',
  padding: '10px 20px',
});

const Home = () => {
  return (
    <>
      <Navbar />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <main>
          {/* Hero unit */}
          <Box
            sx={{
              bgcolor: 'background.paper',
              pt: 8,
              pb: 6,
            }}
          >
            <Container
              sx={{
                width: 700,
              }}
            >
              <Typography
                component='h1'
                variant='h2'
                align='center'
                color='text.primary'
                gutterBottom
              >
                The platform for smarter work management
              </Typography>
              <Typography variant='h5' align='center' color='text.secondary' paragraph>
                Make data-driven decisions, collaborate efficiently, and track progress with
                software that adapts to your way of working.
              </Typography>
              <Stack sx={{ pt: 4 }} direction='row' spacing={2} justifyContent='center'>
                <Link to='/login' style={{ textDecoration: 'none' }}>
                  <RoundedButton variant='contained' color='primary'>
                    Get Started <ArrowForwardIcon color='#fff' />
                  </RoundedButton>
                </Link>
              </Stack>
            </Container>
          </Box>
        </main>
      </ThemeProvider>
    </>
  );
};

export default Home;
