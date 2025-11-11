import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import api from '../../api/axios';

const COLORS = ['#00C49F', '#FF8042', '#FFBB28'];

const Analytics = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/merchant/stats');
        setData(data.map((d) => ({ name: d._id || 'unknown', value: d.total })));
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h3>Transaction Statistics</h3>
      {data.length === 0 ? (
        <div className="empty-state">No transaction data available yet.</div>
      ) : (
        <div className="analytics-container">
          <PieChart width={400} height={400}>
            <Pie data={data} cx={200} cy={200} label outerRadius={120} fill="#8884d8" dataKey="value">
              {data.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      )}
    </div>
  );
};

export default Analytics;
