import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { generateHMACSignature } from '../../utils/hmac';

const CheckoutPage = () => {
  // const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedApiKey = localStorage.getItem('merchant_api_key');
    const storedApiSecret = localStorage.getItem('merchant_api_secret');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
    if (storedApiSecret) {
      setApiSecret(storedApiSecret);
    }
  }, []);

  const clearStoredCredentials = () => {
    localStorage.removeItem('merchant_api_key');
    localStorage.removeItem('merchant_api_secret');
    setApiKey('');
    setApiSecret('');
  };

  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    setError('');
    setTransaction(null);
    setLoading(true);

    if (!apiKey || !apiSecret) {
      setError('Please enter your API Key and Secret');
      setLoading(false);
      return;
    }

    try {
      const trimmedApiKey = apiKey.trim();
      const trimmedApiSecret = apiSecret.trim();
      const body = {
        amount: parseFloat(amount),
        currency: currency || 'INR',
        customer_email: email.trim(),
      };
      const bodyString = JSON.stringify(body);
      const signature = generateHMACSignature(trimmedApiSecret, body);

      const { data } = await api.post(
        '/transaction/checkout-session',
        body,
        {
          headers: {
            'x-api-key': trimmedApiKey,
            'x-signature': signature,
          },
        }
      );

      setTransaction({
        id: data.transaction_id,
        status: data.status,
        signature: data.signature,
        message: data.message,
      });
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create checkout session';
      const errorDetails = err.response?.data?.details;
      
      if (errorDetails) {
        setError(`${errorMsg}\n\nCheck browser console (F12) and backend console for detailed comparison.\n\nCommon issues:\n- Wrong API Secret (use the plain text secret from merchant creation)\n- Secret has extra spaces (try clearing and re-entering)\n- API Key doesn't match your merchant account`);
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async () => {
    if (!transaction) return;

    setLoading(true);
    setError('');

    try {
      const trimmedApiSecret = apiSecret.trim();
      const body = {
        transaction_id: transaction.id,
      };

      const signature = generateHMACSignature(trimmedApiSecret, body);

      const { data } = await api.post(
        '/transaction/process',
        body,
        {
          headers: {
            'x-api-key': apiKey.trim(),
            'x-signature': signature,
          },
        }
      );

      setTransaction({
        ...transaction,
        status: data.status,
        message: data.message,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTransaction(null);
    setError('');
    setEmail('');
    setAmount('');
  };

  return (
    <div className="checkout-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Demo Checkout</h2>
        <Link to="/dashboard" style={{ color: '#667eea', textDecoration: 'none', fontSize: '14px' }}>
          ← Back to Dashboard
        </Link>
      </div>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px', fontSize: '14px' }}>
        Enter your merchant API credentials and customer details to create a transaction
      </p>
      <p style={{ textAlign: 'center', color: '#999', marginBottom: '20px', fontSize: '12px', fontStyle: 'italic' }}>
        Note: Use the plain text API Secret (not encrypted) that you received when creating your merchant account
      </p>

      {!transaction ? (
        <form onSubmit={handleCreateCheckout}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontWeight: '600', color: '#333' }}>
                Merchant API Key
              </label>
              {apiKey && (
                <span style={{ fontSize: '12px', color: '#28a745', fontStyle: 'italic' }}>
                  ✓ Pre-filled from dashboard
                </span>
              )}
            </div>
            <input
              type="text"
              placeholder="Enter your API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontWeight: '600', color: '#333' }}>
                Merchant API Secret
              </label>
              {apiSecret && (
                <span style={{ fontSize: '12px', color: '#28a745', fontStyle: 'italic' }}>
                  ✓ Pre-filled
                </span>
              )}
            </div>
            <input
              type="password"
              placeholder="Enter your API Secret"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              required
            />
            {apiSecret && (
              <div style={{ marginTop: '8px', fontSize: '11px', color: '#666' }}>
                Secret length: {apiSecret.trim().length} characters
                {apiSecret.trim().length !== 64 && (
                  <span style={{ color: '#dc3545', marginLeft: '10px' }}>
                    ⚠️ Should be 64 characters (32 bytes hex)
                  </span>
                )}
                {apiSecret.trim().length === 64 && (
                  <div style={{ marginTop: '4px', fontFamily: 'monospace', fontSize: '10px' }}>
                    First 8 chars: {apiSecret.trim().substring(0, 8)}... 
                    Last 8 chars: ...{apiSecret.trim().substring(56)}
                  </div>
                )}
              </div>
            )}
            {(apiKey || apiSecret) && (
              <button
                type="button"
                onClick={clearStoredCredentials}
                style={{
                  marginTop: '8px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  background: 'transparent',
                  color: '#666',
                  border: '1px solid #ddd',
                  cursor: 'pointer'
                }}
              >
                Clear stored credentials
              </button>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
              Customer Email
            </label>
            <input
              type="email"
              placeholder="customer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                Amount
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0.01"
                step="0.01"
              />
            </div>
            <div style={{ width: '120px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>

          {error && <div className="status-message status-error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Checkout Session'}
          </button>
        </form>
      ) : (
        <div>
          <div className="status-message" style={{ marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#155724' }}>Checkout Session Created!</h3>
            <div style={{ textAlign: 'left', fontSize: '14px' }}>
              <p><strong>Transaction ID:</strong> {transaction.id}</p>
              <p><strong>Status:</strong> <span className={`status-badge status-${transaction.status === 'success' ? 'success' : transaction.status === 'pending' ? 'pending' : 'failed'}`}>{transaction.status}</span></p>
              <p><strong>Amount:</strong> {currency} {amount}</p>
              <p><strong>Customer:</strong> {email}</p>
              {transaction.signature && (
                <p style={{ wordBreak: 'break-all', fontSize: '12px', marginTop: '10px' }}>
                  <strong>Signature:</strong> {transaction.signature}
                </p>
              )}
            </div>
          </div>

          {transaction.status === 'pending' && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleProcessPayment} disabled={loading} style={{ flex: 1 }}>
                {loading ? 'Processing...' : 'Process Payment'}
              </button>
              <button onClick={resetForm} className="btn-secondary" style={{ flex: 1 }}>
                New Transaction
              </button>
            </div>
          )}

          {transaction.status !== 'pending' && (
            <div>
              <div className={`status-message ${transaction.status === 'success' ? '' : 'status-error'}`} style={{ marginBottom: '20px' }}>
                <strong>Final Status:</strong> {transaction.status === 'success' ? '✅ Payment Successful!' : '❌ Payment Failed'}
              </div>
              <button onClick={resetForm} style={{ width: '100%' }}>
                Create New Transaction
              </button>
            </div>
          )}

          {error && <div className="status-message status-error" style={{ marginTop: '20px' }}>{error}</div>}
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
