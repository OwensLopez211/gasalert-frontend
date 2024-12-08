import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const ConsumptionTrendChart = ({ tanqueId, range }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTendenciaConsumo = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('access_token'); // Ajusta el nombre del token
        const api = axios.create({
          baseURL: 'http://localhost:8000/api',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const response = await api.get('/tanks/analytics/tendencia-consumo/', {
          params: { tanque_id: tanqueId, range: range },
        });

        setData(response.data);
      } catch (err) {
        console.error('Error fetching tendencia consumo:', err);
        setError('No se pudo cargar los datos del gráfico');
      } finally {
        setLoading(false);
      }
    };

    fetchTendenciaConsumo();
  }, [tanqueId, range]);

  if (loading) {
    return <div className="text-gray-400">Cargando datos del gráfico...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorNivel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#2d3137" />
        <XAxis dataKey="time" stroke="#9ca3af" />
        <YAxis stroke="#9ca3af" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1a1d21',
            border: '1px solid #232529',
            borderRadius: '8px',
          }}
        />
        <Area
          type="monotone"
          dataKey="nivel"
          stroke="#3b82f6"
          fill="url(#colorNivel)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default ConsumptionTrendChart;

