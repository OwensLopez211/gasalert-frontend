import React, { useState, useEffect } from 'react';
import TankHistoricalChart from '../components/TanksChart';
import TankStatusIndicator from '../components/TankStatusIndicator';
import axios from 'axios';

function DashboardPage() {
  const [selectedTanks, setSelectedTanks] = useState([]);
  const [timeRange, setTimeRange] = useState('24h');
  const [tanks, setTanks] = useState([]);
  const [loading, setLoading] = useState(true);

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
        const response = await axios.get('http://localhost:8000/api/tanks/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
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

  // Clase común para el estilo neumórfico
  const neumorphicClass = `
    rounded-[39px] bg-[#1a1d21]
    shadow-[inset_-8px_8px_16px_#151719,inset_8px_-8px_16px_#1f2329]
    border border-[#232529]
  `;

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-7xl">
      <h1 className="text-2xl md:text-3xl font-bold text-white text-center mb-6">
        Dashboard de Monitoreo
      </h1>

      {/* Sección Principal - Grid Responsivo */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
  {/* Estado Actual */}
  <div className={`${neumorphicClass} p-6`}>
    <h2 className="text-base md:text-lg font-semibold text-white mb-6">
      Estado Actual de los Tanques
    </h2>
    <TankStatusIndicator
      tanks={tanks}
      onTankSelect={handleTankSelect}
      selectedTanks={selectedTanks}
    />
  </div>

  {/* Niveles Históricos */}
  <div className={`${neumorphicClass} flex flex-col`}>
    <div className="flex justify-between items-center p-6 pb-4">
      <h2 className="text-base md:text-lg font-semibold text-white">
        Niveles Históricos
      </h2>
      <select
        value={timeRange}
        onChange={(e) => setTimeRange(e.target.value)}
        className="px-4 py-2 rounded-xl text-sm text-white
                  bg-[#1f2227] border border-[#2d3137]/30
                  shadow-[inset_-2px_2px_4px_#151719,inset_2px_-2px_4px_#232529]
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {ranges.map((range) => (
          <option key={range.value} value={range.value}>
            {range.label}
          </option>
        ))}
      </select>
    </div>
    <div className="flex-1 p-4">
      {loading ? (
        <div className="h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <TankHistoricalChart selectedTanks={selectedTanks} range={timeRange} />
      )}
    </div>
  </div>
</div>

      {/* Cards Inferiores */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <div className={`${neumorphicClass} p-6`}>
          <h3 className="text-white text-base md:text-lg font-semibold mb-4">
            Alertas Recientes
          </h3>
          <ul className="text-gray-300 text-sm space-y-3">
            <li className="p-3 rounded-xl bg-[#1a1d21] shadow-[inset_-3px_3px_6px_#151719,inset_3px_-3px_6px_#1f2329]">
              ⚠️ Tanque 93 - Nivel Crítico
            </li>
            <li className="p-3 rounded-xl bg-[#1a1d21] shadow-[inset_-3px_3px_6px_#151719,inset_3px_-3px_6px_#1f2329]">
              ⚠️ Tanque Diesel - Bajo Nivel
            </li>
            <li className="p-3 rounded-xl bg-[#1a1d21] shadow-[inset_-3px_3px_6px_#151719,inset_3px_-3px_6px_#1f2329]">
              ✅ Tanque MVP - Operando Normalmente
            </li>
          </ul>
        </div>

        <div className={`${neumorphicClass} p-6`}>
          <h3 className="text-white text-base md:text-lg font-semibold mb-4">
            Órdenes Pendientes
          </h3>
          <ul className="text-gray-300 text-sm space-y-3">
            <li className="p-3 rounded-xl bg-[#1a1d21] shadow-[inset_-3px_3px_6px_#151719,inset_3px_-3px_6px_#1f2329]">
              🔄 Reabastecimiento Tanque 95
            </li>
            <li className="p-3 rounded-xl bg-[#1a1d21] shadow-[inset_-3px_3px_6px_#151719,inset_3px_-3px_6px_#1f2329]">
              🔄 Reabastecimiento Tanque Diesel
            </li>
          </ul>
        </div>

        <div className={`${neumorphicClass} p-6 md:col-span-2 xl:col-span-1`}>
          <h3 className="text-white text-base md:text-lg font-semibold mb-4">
            Resumen General
          </h3>
          <div className="text-gray-300 text-sm space-y-3">
            <p className="p-3 rounded-xl bg-[#1a1d21] shadow-[inset_-3px_3px_6px_#151719,inset_3px_-3px_6px_#1f2329]">
              {tanks.length} Tanques Monitorizados
            </p>
            <p className="p-3 rounded-xl bg-[#1a1d21] shadow-[inset_-3px_3px_6px_#151719,inset_3px_-3px_6px_#1f2329]">
              3 Alerta(s) Activa(s)
            </p>
            <p className="p-3 rounded-xl bg-[#1a1d21] shadow-[inset_-3px_3px_6px_#151719,inset_3px_-3px_6px_#1f2329]">
              Operación Normal en 2 Tanques
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;