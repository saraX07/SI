
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SupabaseProvider } from './context/SupabaseContext';
import Home from './pages/Home';
import Halls from './pages/Halls';
import Booking from './pages/Booking';
import Dashboard from './pages/Dashboard';
import Admin from './pages/admin';
import Auth from './pages/Auth';

function App() {
  return (
    <SupabaseProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/salles" element={<Halls />} />
          <Route path="/reservation" element={<Booking />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </Router>
    </SupabaseProvider>
  );
}

export default App;
