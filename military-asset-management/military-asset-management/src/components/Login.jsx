import React, { useState } from 'react';
import axios from 'axios';
import { ShieldAlert } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Logistics Officer');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isRegistering) {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/register`, { username, password, role });
        setIsRegistering(false);
        setUsername('');
        setPassword('');
        setError('Registration successful. Please login.');
      } else {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/login`, { username, password });
        onLogin(response.data.token, response.data.role);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100%', padding: '20px' }}>
      <div className="glass-panel" style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <ShieldAlert size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h1>KristalBall</h1>
          <p style={{ color: '#94a3b8' }}>Military Asset Management System</p>
        </div>
        
        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--danger)' }}>
          {error}
        </div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              className="form-control" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="form-control" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          {isRegistering && (
            <div className="form-group">
              <label>Role</label>
              <select 
                className="form-control" 
                value={role} 
                onChange={e => setRole(e.target.value)}
                style={{ background: '#1e293b' }}
              >
                <option value="Admin">Admin</option>
                <option value="Base Commander">Base Commander</option>
                <option value="Logistics Officer">Logistics Officer</option>
              </select>
            </div>
          )}
          
          <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }}>
            {isRegistering ? 'Register' : 'Login'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button 
            type="button" 
            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
          >
            {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
