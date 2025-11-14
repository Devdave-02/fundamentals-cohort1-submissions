import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Users from './pages/Users';
import Activities from './pages/Activities';
import Appointments from './pages/Appointments';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/users">Users</Link>
          <Link to="/activities">Activities</Link>
          <Link to="/appointments">Appointments</Link>
        </nav>
        
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/appointments" element={<Appointments />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
