import React, { useState } from 'react';
import axios from 'axios';

const Purchases = ({ role }) => {
  const [assetName, setAssetName] = useState('');
  const [category, setCategory] = useState('');
  const [base, setBase] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/purchases`, { assetName, category, base }, { headers });
      setMessage('Asset purchased and added successfully!');
      setAssetName('');
      setCategory('');
      setBase('');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  if (!['Admin', 'Logistics Officer'].includes(role)) {
    return (
      <div className="card">
        <h2 style={{ color: 'var(--danger)' }}>Access Denied</h2>
        <p>You do not have permission to view this page. Requires Admin or Logistics Officer role.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Purchase & Register Assets</h1>
      
      <div className="card" style={{ maxWidth: '600px' }}>
        {message && <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--success)' }}>
          {message}
        </div>}
        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--danger)' }}>
          {error}
        </div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Asset Name / Model</label>
            <input 
              type="text" 
              className="form-control" 
              value={assetName} 
              onChange={e => setAssetName(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select 
              className="form-control"
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
              style={{ background: '#1e293b' }}
            >
              <option value="">Select Category...</option>
              <option value="Vehicle">Vehicle</option>
              <option value="Weapon">Weapon</option>
              <option value="Ammunition">Ammunition</option>
              <option value="Communication">Communication</option>
              <option value="Medical">Medical Equipment</option>
            </select>
          </div>
          <div className="form-group">
            <label>Initial Base Location</label>
            <input 
              type="text" 
              className="form-control" 
              value={base} 
              onChange={e => setBase(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn">Register Asset</button>
        </form>
      </div>
    </div>
  );
};

export default Purchases;
