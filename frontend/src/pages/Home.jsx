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
              pt: '11.5vh',
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
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  fontSize: '4rem',
                  color: '#333333',
                }}
              >
                The platform built to power your work
              </Typography>
              <Typography
                variant='h5'
                align='center'
                color='text.secondary'
                paragraph
                sx={{ fontSize: '1rem' }}
              >
                Work efficiently at scale with monday.com Work OS products, powered by a diverse
                integration ecosystem, no-code automations, and the freedom to run any workflow.
              </Typography>
              <Stack sx={{ pt: 4 }} direction='row' spacing={2} justifyContent='center'>
                <Link to='/login' style={{ textDecoration: 'none' }}>
                  <RoundedButton variant='contained' color='primary'>
                    Get Started{' '}
                    <ArrowForwardIcon
                      color='#fff'
                      style={{ fontSize: '1rem', marginLeft: '4px' }}
                    />
                  </RoundedButton>
                </Link>
              </Stack>
            </Container>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 1440 320'
              style={{ height: '100%', width: '100%' }}
            >
              <path
                fill='#000b76'
                fill-opacity='1'
                d='M0,32L360,160L720,224L1080,32L1440,128L1440,320L1080,320L720,320L360,320L0,320Z'
              ></path>
            </svg>
          </Box>
        </main>
      </ThemeProvider>
    </>
  );
};

export default Home;
