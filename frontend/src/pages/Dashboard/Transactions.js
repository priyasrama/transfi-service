import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTxns = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/merchant/transactions');
        setTransactions(data.transactions || []);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError(err.response?.data?.message || 'Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };
    fetchTxns();
  }, []);

  if (loading) return <div className="loading">Loading transactions...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div>
      <h3>Transactions ({transactions.length})</h3>
      {transactions.length === 0 ? (
        <div className="empty-state">No transactions yet.</div>
      ) : (
        <table>
          <thead>
            <tr><th>Amount</th><th>Currency</th><th>Status</th><th>Customer</th><th>Date</th></tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t._id}>
                <td>₹{t.amount}</td>
                <td>{t.currency || 'INR'}</td>
                <td><span className={`status-badge status-${t.status === 'success' ? 'success' : t.status === 'pending' ? 'pending' : 'failed'}`}>{t.status}</span></td>
                <td>{t.customer_email}</td>
                <td>{new Date(t.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Transactions;
