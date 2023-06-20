import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardList from './pages/DashboardList';
import DashboardAdd from './pages/DashboardAdd';
import DashboardRole from './pages/DashboardRole';

const App = () => {
  const { user } = useAuthContext();
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={!user ? <Home /> : <Navigate to='/dashboard' />} />
          <Route path='/login' element={!user ? <Login /> : <Navigate to='/dashboard' />} />
          <Route path='/signup' element={!user ? <Signup /> : <Navigate to='/dashboard' />} />
          <Route path='/dashboard' element={user ? <DashboardList /> : <Navigate to='/login' />} />
          <Route
            path='/dashboard/add'
            element={user ? <DashboardAdd /> : <Navigate to='/login' />}
          />

          <Route
            path='/dashboard/role'
            element={user ? <DashboardRole /> : <Navigate to='/login' />}
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
