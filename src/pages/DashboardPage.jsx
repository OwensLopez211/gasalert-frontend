import React, { useState, useEffect } from 'react';
import TankHistoricalChart from '../components/TanksChart';
import TankStatusIndicator from '../components/TankStatusIndicator';
import RecentAlerts from '../components/RecentAlerts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Clock } from 'lucide-react';
import { Droplet, } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL;

function DashboardPage() {
  const [selectedTanks, setSelectedTanks] = useState([]);
  const [timeRange, setTimeRange] = useState('24h');
  const [tanks, setTanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const ranges = [
    { value: '6h', label: 'Últimas 6 horas' },
    { value: '12h', label: 'Últimas 12 horas' },
    { value: '24h', label: 'Últimas 24 horas' },
    { value: '7d', label: 'Últimos 7 días' },
    { value: '30d', label: 'Últimos 30 días' },
  ];

  useEffect(() => {
    const fetchTanks = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/tanks/`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setTanks(response.data);
      } catch (error) {
        console.error('Error fetching tanks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTanks();
  }, []);

  const handleTankSelect = (tankId) => {
    setSelectedTanks((prev) => {
      if (prev.includes(tankId)) {
        return prev.filter((id) => id !== tankId);
      } else {
        return [...prev, tankId].sort();
      }
    });
  };

  const handleViewAnalysis = (tankId) => {
    navigate(`/fuel-analysis`, {
      state: { tankId, range: timeRange },
    });
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1800px] mx-auto space-y-8">
        {/* Header Section */}
        <div className="relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent inline-flex items-center gap-2">
                Dashboard de Monitoreo
                <ArrowUpRight className="w-6 h-6 text-blue-500" />
              </h1>
              <p className="mt-2 text-gray-400 text-sm sm:text-base">
                Monitorea en tiempo real el estado de tus tanques y alertas del sistema
              </p>
            </div>
            <div className="flex items-center gap-3 bg-[#1a1d21]/50 rounded-2xl p-1.5 border border-white/[0.05]">
              <Clock className="w-5 h-5 text-gray-400 ml-2" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 rounded-xl text-sm text-white bg-[#1f2227]/50 
                          border border-white/[0.05] focus:border-blue-500/50
                          focus:outline-none focus:ring-1 focus:ring-blue-500/50
                          transition-all duration-200"
              >
                {ranges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Contenedor Principal */}
        <div className="grid grid-cols-1 gap-6">
          {/* Estado Actual de Tanques */}
          <div className="bg-[#1a1d21]/90 backdrop-blur-xl rounded-3xl border border-[#2d3137]/30 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <Droplet className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-white">Estado Actual de los Tanques</h2>
                  <span className="px-2.5 py-1 text-xs font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    Tiempo Real
                  </span>
                </div>
              </div>
            </div>

            {/* TankStatusIndicator Component */}
            <TankStatusIndicator
              tanks={tanks}
              onTankSelect={handleTankSelect}
              selectedTanks={selectedTanks}
              onViewAnalysis={handleViewAnalysis}
            />
          </div>

          {/* Niveles Históricos */}
          <div className="bg-[#1a1d21]/70 backdrop-blur-xl rounded-3xl border border-white/[0.05] flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/[0.03] to-transparent"></div>
            <div className="relative p-6">
              <h2 className="text-lg font-semibold text-white mb-6">
                Niveles Históricos
              </h2>
              <div className="flex-1">
                {loading ? (
                  <div className="h-[400px] flex items-center justify-center">
                    <div className="relative flex items-center justify-center">
                      <div className="absolute animate-ping inline-flex h-12 w-12 rounded-full bg-blue-500 opacity-20"></div>
                      <div className="relative inline-flex rounded-full h-6 w-6 bg-blue-500"></div>
                    </div>
                  </div>
                ) : (
                  <TankHistoricalChart selectedTanks={selectedTanks} range={timeRange} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Recent Alerts */}
          <div className="bg-[#1a1d21]/70 backdrop-blur-xl rounded-3xl border border-white/[0.05] overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-b from-orange-500/[0.03] to-transparent"></div>
            <div className="relative">
              <RecentAlerts limit={3} className="h-full" />
            </div>
          </div>

          {/* Órdenes Pendientes */}
          <div className="bg-[#1a1d21]/70 backdrop-blur-xl rounded-3xl border border-white/[0.05] p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-10">
              <span className="text-white text-lg font-semibold px-6 py-3 rounded-2xl bg-white/[0.05] border border-white/[0.1]">
                En desarrollo
              </span>
            </div>
            <div className="relative">
              <h3 className="text-lg font-semibold text-white mb-4">
                Órdenes Pendientes
              </h3>
              <ul className="space-y-3">
                <li className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-gray-300 text-sm">
                  🔄 Reabastecimiento Tanque 95
                </li>
                <li className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-gray-300 text-sm">
                  🔄 Reabastecimiento Tanque Diesel
                </li>
              </ul>
            </div>
          </div>

          {/* Resumen General */}
          <div className="bg-[#1a1d21]/70 backdrop-blur-xl rounded-3xl border border-white/[0.05] p-6 md:col-span-2 xl:col-span-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-10">
              <span className="text-white text-lg font-semibold px-6 py-3 rounded-2xl bg-white/[0.05] border border-white/[0.1]">
                En desarrollo
              </span>
            </div>
            <div className="relative">
              <h3 className="text-lg font-semibold text-white mb-4">
                Resumen General
              </h3>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-gray-300 text-sm">
                  {tanks.length} Tanques Monitorizados
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-gray-300 text-sm">
                  3 Alerta(s) Activa(s)
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-gray-300 text-sm">
                  Operación Normal en 2 Tanques
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;