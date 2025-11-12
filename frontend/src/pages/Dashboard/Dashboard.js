import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import Transactions from './Transactions.js';
import Analytics from './Analytics';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [merchant, setMerchant] = useState(null);

  useEffect(() => {
    const fetchMerchant = async () => {
      try {
        const { data } = await api.get('/merchant/keys');
        setMerchant(data);
      } catch (err) {
        console.log('No merchant yet');
      }
    };
    fetchMerchant();
  }, []);

  const createMerchant = async () => {
    const name = prompt('Enter business name:');
    if (!name) return;
    try {
      const { data } = await api.post('/merchant/create', { business_name: name });
      localStorage.setItem('merchant_api_key', data.api_key);
      localStorage.setItem('merchant_api_secret', data.api_secret);
      alert(`Your API Key: ${data.api_key}\nYour API Secret: ${data.api_secret}\n\n⚠️ Save your API Secret - it won't be shown again!`);
      setMerchant(data);
      window.location.reload();
    } catch (err) {
      alert('Failed to create merchant account');
    }
  };

  const handleGoToCheckout = () => {
    if (merchant?.api_key) {
      localStorage.setItem('merchant_api_key', merchant.api_key);
    }
    navigate('/checkout');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Merchant Dashboard</h2>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ color: '#666', fontSize: '14px' }}>{user?.email}</span>
            <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }}>Logout</button>
          </div>
        </div>
        {!merchant ? (
          <button onClick={createMerchant}>Create Merchant Account</button>
        ) : (
          <div className="merchant-info">
            <p><strong>API Key:</strong> {merchant.api_key}</p>
            <p><strong>Status:</strong> <span className={`status-badge status-${merchant.status === 'active' ? 'success' : 'pending'}`}>{merchant.status}</span></p>
            {localStorage.getItem('merchant_api_secret') && (
              <p style={{ fontSize: '12px', color: '#28a745', marginTop: '10px' }}>
                API Secret is stored and will be pre-filled in checkout
              </p>
            )}
            {!localStorage.getItem('merchant_api_secret') && (
              <p style={{ fontSize: '12px', color: '#dc3545', marginTop: '10px' }}>
                API Secret not found in storage. You'll need to enter it manually in checkout.
                <br />
                If you've lost your secret, you'll need to create a new merchant account.
              </p>
            )}
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
              <button onClick={handleGoToCheckout} style={{ flex: 1 }}>
                🛒 Test Checkout
              </button>
            </div>
          </div>
        )}
      </div>
      {merchant && (
        <>
          <div className="dashboard-section">
            <Transactions />
          </div>
          <div className="dashboard-section">
            <Analytics />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
