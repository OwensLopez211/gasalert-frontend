import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUpIcon, Clock, Battery } from 'lucide-react';
import AverageConsumption from '../components/AverageConsumption';
import ConsumptionAnalysis from '../components/ConsumptionAnalysis';
import useTrendAlerts from '../hooks/useTrendAlerts';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import PredictionReposition from '../components/PredictionReposition';

const API_URL = process.env.REACT_APP_API_URL;

const FuelAnalysisPage = () => {
  const location = useLocation();
  const { range = "7d" } = location.state || {};
  const { tankId: initialTankId = 'all', range: initialRange = '7d' } = location.state || {};

  const [selectedPeriod, setSelectedPeriod] = useState(initialRange);
  const [selectedTank, setSelectedTank] = useState(initialTankId);
  const [tanks, setTanks] = useState([]);
  const [loadingTanks, setLoadingTanks] = useState(true);
  const [errorTanks, setErrorTanks] = useState(null);

  const { alerts, loading, error } = useTrendAlerts(selectedTank, selectedPeriod);

  useEffect(() => {
    const fetchTanks = async () => {
      setLoadingTanks(true);
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/tanks/mis_tanques/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTanks(response.data);
      } catch (err) {
        console.error('Error fetching tanks:', err);
        setErrorTanks('No se pudieron cargar los tanques.');
      } finally {
        setLoadingTanks(false);
      }
    };

    fetchTanks();
  }, []);

  const neumorphicClass = `
    rounded-[20px] bg-[#1a1d21]
    shadow-[inset_-8px_8px_16px_#151719,inset_8px_-8px_16px_#1f2329]
    border border-[#232529]
  `;

  if (loadingTanks) {
    return <div className="text-gray-400">Cargando tanques...</div>;
  }

  if (errorTanks) {
    return <div className="text-red-500">{errorTanks}</div>;
  }

    return (
    <div className="container mx-auto p-4 space-y-6 max-w-7xl">
      {/* Header con filtros */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-white">Análisis de Tendencias</h1>
        <div className="flex gap-4">
          {/* Filtro de tanques */}
          <select
            value={selectedTank}
            onChange={(e) => setSelectedTank(e.target.value)}
            className="px-4 py-2 rounded-xl text-sm text-white
                      bg-[#1f2227] border border-[#2d3137]/30
                      shadow-[inset_-2px_2px_4px_#151719,inset_2px_-2px_4px_#232529]
                      focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {/* <option value="all">Todos los Tanques</option> */}
            {tanks.map((tanque) => (
              <option key={tanque.id} value={tanque.id}>
                {tanque.nombre}
              </option>
            ))}
          </select>

          {/* Filtro de periodos */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 rounded-xl text-sm text-white
                      bg-[#1f2227] border border-[#2d3137]/30
                      shadow-[inset_-2px_2px_4px_#151719,inset_2px_-2px_4px_#232529]
                      focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="24h">Últimas 24 horas</option>
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
          </select>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className={`${neumorphicClass} p-4`}>
          <AverageConsumption
            tanqueId={selectedTank} 
            dias={selectedPeriod === '24h' ? 1 : parseInt(selectedPeriod, 10)} // Convierte el rango en días
          />
        </div>

        <div className={`${neumorphicClass} p-4`}>
          <div className="flex justify-between items-center mb-2">
            <PredictionReposition tanqueId={selectedTank} />
          </div>
        </div>

        <div className={`${neumorphicClass} p-4`}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-gray-400">Tiempo sin Incidentes</h3>
            <Clock className="text-purple-500" size={20} />
          </div>
          <div className="text-xl font-bold text-white">72 días</div>
          <div className="text-sm text-green-500">Record histórico</div>
        </div>

        <div className={`${neumorphicClass} p-4`}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-gray-400">Eficiencia Operativa</h3>
            <Battery className="text-green-500" size={20} />
          </div>
          <div className="text-xl font-bold text-white">97.5%</div>
          <div className="text-sm text-green-500">+2.1% vs objetivo</div>
        </div>
      </div>

      {/* Gráficos Principales */}       
      <div className="grid grid-cols-1 gap-6">
        <div className={`${neumorphicClass} p-6`}>
          <h2 className="text-lg font-semibold text-white mb-4">Análisis de Tendencias</h2>
          <div className="min-h-[600px]"> {/* Aumentamos la altura mínima */}
            <ConsumptionAnalysis tanqueId={selectedTank} range={selectedPeriod} />
          </div>
        </div>
    
        <div className={`${neumorphicClass} p-6 relative`}>
          <h2 className="text-lg font-semibold text-white mb-4">Patrones de Reabastecimiento</h2>
          <div className="h-[300px]">
            {/* Fondo superpuesto con mensaje */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-10 rounded-2xl">
              <span className="text-white text-xl font-bold">En proceso, no es parte del MVP</span>
            </div>

            {/* Gráfico de reposiciones */}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { day: 'Lun', reposiciones: 2 },
                  { day: 'Mar', reposiciones: 3 },
                  { day: 'Mié', reposiciones: 2 },
                  { day: 'Jue', reposiciones: 4 },
                  { day: 'Vie', reposiciones: 3 },
                  { day: 'Sáb', reposiciones: 5 },
                  { day: 'Dom', reposiciones: 2 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3137" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1d21',
                    border: '1px solid #232529',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="reposiciones"
                  stroke="#10b981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FuelAnalysisPage;
