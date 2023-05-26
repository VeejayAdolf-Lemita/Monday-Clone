import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { styled } from '@mui/material/styles';
import Logo from '../assets/monday-logo.png';

const RoundedButton = styled(Button)({
  borderRadius: '40px',
  fontWeight: '600',
  padding: '10px 20px',
});

const Navbar = () => {
  return (
    <AppBar position='relative' style={{ backgroundColor: '#FFF', cursor: 'pointer' }}>
      <Toolbar>
        <Typography variant='h6' color='inherit' noWrap style={{ flexGrow: 1 }}>
          <img src={Logo} alt='monday.com' width='180px' />
        </Typography>
        <Link to='/login'>
          <RoundedButton
            variant='contained'
            color='primary'
            style={{ marginLeft: 'auto', cursor: 'pointer' }}
          >
            Get Started <ArrowForwardIcon color='#fff' />
          </RoundedButton>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
