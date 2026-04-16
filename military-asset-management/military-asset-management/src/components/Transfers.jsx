import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Transfers = ({ role }) => {
  const [assets, setAssets] = useState([]);
  const [assetId, setAssetId] = useState('');
  const [toBase, setToBase] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (['Admin', 'Base Commander'].includes(role)) {
      fetchAssets();
    }
  }, [role]);

  const fetchAssets = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/assets', { headers });
      setAssets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    // Find selected asset to get its current base
    const selectedAsset = assets.find(a => a.id.toString() === assetId);
    if (!selectedAsset) {
      setError('Please select a valid asset.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/transfers', { 
        assetId, 
        fromBase: selectedAsset.base, 
        toBase, 
        date 
      }, { headers });
      
      setMessage('Transfer recorded successfully!');
      setAssetId('');
      setToBase('');
      fetchAssets(); // Refresh assets to update base locations
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  if (!['Admin', 'Base Commander'].includes(role)) {
    return (
      <div className="card">
        <h2 style={{ color: 'var(--danger)' }}>Access Denied</h2>
        <p>You do not have permission to view this page. Requires Admin or Base Commander role.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Asset Transfers</h1>
      
      <div className="card" style={{ maxWidth: '600px' }}>
        {message && <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--success)' }}>
          {message}
        </div>}
        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--danger)' }}>
          {error}
        </div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Asset</label>
            <select 
              className="form-control"
              value={assetId}
              onChange={e => setAssetId(e.target.value)}
              required
              style={{ background: '#1e293b' }}
            >
              <option value="">Select Asset to Transfer...</option>
              {assets.map(asset => (
                <option key={asset.id} value={asset.id}>
                  ID: {asset.id} - {asset.assetName} (Current Base: {asset.base})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Destination Base (To)</label>
            <input 
              type="text" 
              className="form-control" 
              value={toBase} 
              onChange={e => setToBase(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Transfer Date</label>
            <input 
              type="date" 
              className="form-control" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn">Record Transfer</button>
        </form>
      </div>
    </div>
  );
};

export default Transfers;
