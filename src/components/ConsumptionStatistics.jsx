import React, { useState, useEffect, useContext } from 'react';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip } from 'chart.js';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import ConsumptionChart from './ConsumptionChart';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip);

const ConsumptionStatistics = () => {
  const { user } = useContext(AuthContext);
  const [dailyData, setDailyData] = useState({ labels: [], values: [], total: 0 });
  const [weeklyData, setWeeklyData] = useState({ labels: [], values: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const estacionId = user?.estaciones?.[0]?.id;

  const calculatePercentageChange = (data) => {
    if (!data.values || data.values.length < 2) return 0;
    const firstValue = data.values[0];
    const lastValue = data.values[data.values.length - 1];
    return ((lastValue - firstValue) / firstValue * 100).toFixed(1);
  };

  useEffect(() => {
    const fetchConsumptionData = async () => {
      if (!estacionId) {
        setError("No se encontró una estación asociada.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching data for estacionId:', estacionId);

        const response = await axios.get(
          `http://localhost:8000/api/tanks/dashboard/consumption/?estacion_id=${estacionId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('API Response:', response.data);

        if (!response.data) {
          throw new Error('No se recibieron datos del servidor');
        }

        const { daily, weekly } = response.data;
        setDailyData(daily);
        setWeeklyData(weekly);
      } catch (err) {
        console.error("Error fetching consumption data:", err);
        setError(err.message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    if (estacionId) {
      fetchConsumptionData();
    }
  }, [estacionId]);

  if (loading) {
    return (
      <div className="bg-[#111517] p-6 rounded-lg">
        <h2 className="text-white text-lg font-bold mb-4">Estadísticas de consumo</h2>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#111517] p-6 rounded-lg">
        <h2 className="text-white text-lg font-bold mb-4">Estadísticas de consumo</h2>
        <div className="text-red-500 text-center">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-[#111517] p-6 rounded-lg">
      <h2 className="text-white text-lg font-bold mb-4">Estadísticas de consumo</h2>
      <div className="flex gap-4">
        <ConsumptionChart
          title="Diario"
          period="7 días"
          data={dailyData}
          total={dailyData.total}
          change={calculatePercentageChange(dailyData)}
        />
        <ConsumptionChart
          title="Semanalmente"
          period="4 meses"
          data={weeklyData}
          total={weeklyData.total}
          change={calculatePercentageChange(weeklyData)}
        />
      </div>
    </div>
  );
};

export default ConsumptionStatistics;