import React, { useState } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DropletIcon, TrendingUpIcon, AlertTriangle, Clock, Battery, DollarSign } from 'lucide-react';
import AverageConsumption from '../components/AverageConsumption';
import ConsumptionTrendChart from '../components/ConsumptionTrendChart';
import TrendAlerts from '../components/TrendAlerts';
import useTrendAlerts from '../hooks/useTrendAlerts';

const FuelAnalysisPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('24h');
  const [selectedTank, setSelectedTank] = useState('all');
  const { alerts, loading, error } = useTrendAlerts(selectedTank, selectedPeriod);


  // Estilo neumórfico consistente con tu dashboard
  const neumorphicClass = `
    rounded-[20px] bg-[#1a1d21]
    shadow-[inset_-8px_8px_16px_#151719,inset_8px_-8px_16px_#1f2329]
    border border-[#232529]
  `;

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-7xl">
      {/* Header con filtros */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-white">Análisis de Tendencias</h1>
        <div className="flex gap-4">
          <select
            value={selectedTank}
            onChange={(e) => setSelectedTank(e.target.value)}
            className="px-4 py-2 rounded-xl text-sm text-white
                      bg-[#1f2227] border border-[#2d3137]/30
                      shadow-[inset_-2px_2px_4px_#151719,inset_2px_-2px_4px_#232529]
                      focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos los Tanques</option>
            <option value="93">Tanque 93</option>
            <option value="95">Tanque 95</option>
            <option value="diesel">Tanque Diesel</option>
            <option value="mvp">Tanque MVP</option>
          </select>
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
            <option value="90d">Últimos 90 días</option>
          </select>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <div className={`${neumorphicClass} p-4`}>
          <AverageConsumption
            tanqueId={selectedTank}
            dias={selectedPeriod === '24h' ? 1 : parseInt(selectedPeriod)}
          />
        </div>

        <div className={`${neumorphicClass} p-4`}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-gray-400">Tasa de Reposición</h3>
            <TrendingUpIcon className="text-green-500" size={20} />
          </div>
          <div className="text-xl font-bold text-white">1.8 veces/día</div>
          <div className="text-sm text-blue-500">Normal para el periodo</div>
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
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className={`${neumorphicClass} p-6`}>
          <h2 className="text-lg font-semibold text-white mb-4">Tendencia de Consumo</h2>
          <div className="h-[300px]">
            <ConsumptionTrendChart tanqueId={selectedTank} range={selectedPeriod} />
          </div>
        </div>



        <div className={`${neumorphicClass} p-6`}>
          <h2 className="text-lg font-semibold text-white mb-4">Patrones de Reabastecimiento</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { day: 'Lun', reposiciones: 2 },
                  { day: 'Mar', reposiciones: 3 },
                  { day: 'Mié', reposiciones: 2 },
                  { day: 'Jue', reposiciones: 4 },
                  { day: 'Vie', reposiciones: 3 },
                  { day: 'Sáb', reposiciones: 5 },
                  { day: 'Dom', reposiciones: 2 }
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3137" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1d21',
                    border: '1px solid #232529',
                    borderRadius: '8px'
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

      {/* Información Detallada */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className={`${neumorphicClass} p-4`}>
            <TrendAlerts 
              alerts={alerts}
              loading={loading}
              error={error}
              title="Alertas de Tendencia"
              iconColor="text-yellow-500"
            />          
        </div>

        <div className={`${neumorphicClass} p-6`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Predicciones</h3>
            <TrendingUpIcon className="text-blue-500" size={20} />
          </div>
          <ul className="space-y-3">
            {[
              { prediccion: 'Próxima reposición estimada', tiempo: '8h', tanque: 'Tanque 95' },
              { prediccion: 'Pico de demanda esperado', tiempo: '2d', tanque: 'Tanque Diesel' },
              { prediccion: 'Mantenimiento sugerido', tiempo: '5d', tanque: 'Tanque 93' }
            ].map((pred, index) => (
              <li key={index} className="p-3 rounded-xl bg-[#1f2227] text-gray-300 text-sm">
                <div className="flex justify-between">
                  <div>
                    <div>{pred.prediccion}</div>
                    <div className="text-gray-500">{pred.tanque}</div>
                  </div>
                  <span className="text-blue-500">{pred.tiempo}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className={`${neumorphicClass} p-6`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Eficiencia por Tanque</h3>
            <DollarSign className="text-green-500" size={20} />
          </div>
          {[
            { tanque: 'Tanque 93', eficiencia: 94 },
            { tanque: 'Tanque 95', eficiencia: 88 },
            { tanque: 'Tanque Diesel', eficiencia: 92 },
            { tanque: 'Tanque MVP', eficiencia: 96 }
          ].map((tank, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>{tank.tanque}</span>
                <span>{tank.eficiencia}%</span>
              </div>
              <div className="h-2 bg-[#1f2227] rounded-full">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${tank.eficiencia}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FuelAnalysisPage;