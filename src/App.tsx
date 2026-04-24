import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Halls from './pages/Halls';
import Booking from './pages/Booking';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Admin from './pages/admin';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/salles" element={<Halls />} />
            <Route path="/reservation" element={<Booking />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
