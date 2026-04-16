import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Purchases from './components/Purchases';
import Transfers from './components/Transfers';
import Assignments from './components/Assignments';
import Login from './components/Login';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  const handleLogin = (t, r) => {
    localStorage.setItem('token', t);
    localStorage.setItem('role', r);
    setToken(t);
    setRole(r);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="app-container">
        <aside className="sidebar">
          <h2>KristalBall</h2>
          <div style={{color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem', textAlign: 'center'}}>
            Role: {role}
          </div>
          <Link to="/" className="nav-link">Dashboard</Link>
          <Link to="/purchases" className="nav-link">Purchases</Link>
          <Link to="/transfers" className="nav-link">Transfers</Link>
          <Link to="/assignments" className="nav-link">Assignments</Link>
          <div style={{flex: 1}}></div>
          <button onClick={handleLogout} className="btn" style={{background: 'var(--danger)'}}>Logout</button>
        </aside>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/purchases" element={<Purchases role={role} />} />
            <Route path="/transfers" element={<Transfers role={role} />} />
            <Route path="/assignments" element={<Assignments role={role} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
