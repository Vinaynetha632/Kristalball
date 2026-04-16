import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, MapPin, Search } from 'lucide-react';

const Dashboard = () => {
  const [assets, setAssets] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);
  
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assetsRes, transfersRes, assignmentsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/assets', { headers }),
        axios.get('http://localhost:5000/api/transfers', { headers }),
        axios.get('http://localhost:5000/api/assignments', { headers })
      ]);
      setAssets(assetsRes.data);
      setTransfers(transfersRes.data);
      setAssignments(assignmentsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredAssets = assets.filter(a => 
    a.assetName.toLowerCase().includes(filterQuery.toLowerCase()) || 
    a.base.toLowerCase().includes(filterQuery.toLowerCase()) ||
    a.category.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const getAssetDetails = (assetId) => {
    const assetTransfers = transfers.filter(t => t.assetId === assetId);
    const assetAssignments = assignments.filter(a => a.assetId === assetId);
    return { assetTransfers, assetAssignments };
  };

  return (
    <div>
      <h1>Command Dashboard</h1>
      
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <Search size={20} color="#94a3b8" />
          <input 
            type="text" 
            placeholder="Search by asset name, base, or category..." 
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-color)', width: '100%', outline: 'none' }}
          />
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '12px' }}>
              <Package color="#60a5fa" size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, color: '#94a3b8', fontSize: '0.875rem' }}>Total Assets</h3>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>{assets.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '12px' }}>
              <MapPin color="#34d399" size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, color: '#94a3b8', fontSize: '0.875rem' }}>Active Bases</h3>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
                {new Set(assets.map(a => a.base)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Asset Inventory</h2>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Current Base</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map(asset => (
                <tr key={asset.id}>
                  <td>#{asset.id}</td>
                  <td style={{ fontWeight: 500 }}>{asset.assetName}</td>
                  <td>{asset.category}</td>
                  <td>{asset.base}</td>
                  <td>
                    <span className={`badge ${asset.status === 'Available' ? 'available' : 'assigned'}`}>
                      {asset.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }} onClick={() => setSelectedAsset(asset)}>
                      View Movement
                    </button>
                  </td>
                </tr>
              ))}
              {filteredAssets.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>No assets found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Movement Pop-up */}
      {selectedAsset && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 }}>
          <div className="card" style={{ width: '90%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}>Movement History: {selectedAsset.assetName}</h2>
              <button 
                onClick={() => setSelectedAsset(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.5rem' }}
              >
                &times;
              </button>
            </div>
            
            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Transfers</h3>
            {getAssetDetails(selectedAsset.id).assetTransfers.length > 0 ? (
              <ul style={{ paddingLeft: '1.5rem' }}>
                {getAssetDetails(selectedAsset.id).assetTransfers.map(t => (
                  <li key={t.id} style={{ marginBottom: '0.5rem' }}>
                    Moved from <strong>{t.fromBase}</strong> to <strong>{t.toBase}</strong> on {t.date}
                  </li>
                ))}
              </ul>
            ) : <p style={{ color: '#94a3b8' }}>No transfer history.</p>}

            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginTop: '1.5rem' }}>Assignments</h3>
            {getAssetDetails(selectedAsset.id).assetAssignments.length > 0 ? (
              <ul style={{ paddingLeft: '1.5rem' }}>
                {getAssetDetails(selectedAsset.id).assetAssignments.map(a => (
                  <li key={a.id} style={{ marginBottom: '0.5rem' }}>
                    Assigned to <strong>{a.assignedTo}</strong> on {a.date}
                  </li>
                ))}
              </ul>
            ) : <p style={{ color: '#94a3b8' }}>No assignment history.</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
