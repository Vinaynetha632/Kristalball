import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Assignments = ({ role }) => {
  const [assets, setAssets] = useState([]);
  const [assetId, setAssetId] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/assets', { headers });
      // Only show assets that are currently available (not already assigned)
      setAssets(res.data.filter(a => a.status === 'Available'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await axios.post('http://localhost:5000/api/assignments', { 
        assetId, 
        assignedTo, 
        date 
      }, { headers });
      
      setMessage('Assignment & Expenditure recorded successfully!');
      setAssetId('');
      setAssignedTo('');
      fetchAssets(); // Refresh assets
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  if (!['Admin', 'Base Commander', 'Logistics Officer'].includes(role)) {
    return (
      <div className="card">
        <h2 style={{ color: 'var(--danger)' }}>Access Denied</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Assignments & Expenditures</h1>
      
      <div className="card" style={{ maxWidth: '600px' }}>
        {message && <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--success)' }}>
          {message}
        </div>}
        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--danger)' }}>
          {error}
        </div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Available Asset</label>
            <select 
              className="form-control"
              value={assetId}
              onChange={e => setAssetId(e.target.value)}
              required
              style={{ background: '#1e293b' }}
            >
              <option value="">Select Asset to Assign...</option>
              {assets.map(asset => (
                <option key={asset.id} value={asset.id}>
                  ID: {asset.id} - {asset.assetName} ({asset.category})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Assigned To (Personnel / Unit)</label>
            <input 
              type="text" 
              className="form-control" 
              value={assignedTo} 
              onChange={e => setAssignedTo(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Assignment Date</label>
            <input 
              type="date" 
              className="form-control" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn">Record Assignment</button>
        </form>
      </div>
    </div>
  );
};

export default Assignments;
