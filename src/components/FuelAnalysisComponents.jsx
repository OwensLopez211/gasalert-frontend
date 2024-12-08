import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DropletIcon, TrendingUpIcon, AlertTriangle, Clock, Battery, DollarSign } from 'lucide-react';

// Componente para las métricas principales
const MainMetrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <MetricCard
        title="Consumo Promedio"
        value="8,459 L/día"
        trend="+5.2% vs periodo anterior"
        trendColor="text-green-500"
        Icon={DropletIcon}
        iconColor="text-blue-500"
      />
      <MetricCard
        title="Tasa de Reposición"
        value="1.8 veces/día"
        trend="Normal para el periodo"
        trendColor="text-blue-500"
        Icon={TrendingUpIcon}
        iconColor="text-green-500"
      />
      <MetricCard
        title="Tiempo sin Incidentes"
        value="72 días"
        trend="Record histórico"
        trendColor="text-green-500"
        Icon={Clock}
        iconColor="text-purple-500"
      />
      <MetricCard
        title="Eficiencia Operativa"
        value="97.5%"
        trend="+2.1% vs objetivo"
        trendColor="text-green-500"
        Icon={Battery}
        iconColor="text-green-500"
      />
    </div>
  );
};

// Componente para una tarjeta de métrica individual
const MetricCard = ({ title, value, trend, trendColor, Icon, iconColor }) => {
  return (
    <div className="rounded-[20px] bg-[#1a1d21] shadow-[inset_-8px_8px_16px_#151719,inset_8px_-8px_16px_#1f2329] border border-[#232529] p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-400">{title}</h3>
        <Icon className={iconColor} size={20} />
      </div>
      <div className="text-xl font-bold text-white">{value}</div>
      <div className={`text-sm ${trendColor}`}>{trend}</div>
    </div>
  );
};

// Componente para el gráfico de consumo
const ConsumptionTrend = () => {
  const data = [
    { time: '00:00', nivel: 85 },
    { time: '04:00', nivel: 82 },
    { time: '08:00', nivel: 75 },
    { time: '12:00', nivel: 60 },
    { time: '16:00', nivel: 45 },
    { time: '20:00', nivel: 30 },
    { time: '23:59', nivel: 25 }
  ];

  return (
    <div className="rounded-[20px] bg-[#1a1d21] shadow-[inset_-8px_8px_16px_#151719,inset_8px_-8px_16px_#1f2329] border border-[#232529] p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Tendencia de Consumo</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorNivel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3137" />
            <XAxis dataKey="time" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{
              backgroundColor: '#1a1d21',
              border: '1px solid #232529',
              borderRadius: '8px'
            }} />
            <Area type="monotone" dataKey="nivel" stroke="#3b82f6" fill="url(#colorNivel)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Componente para el patrón de reabastecimiento
const RefillPattern = () => {
  const data = [
    { day: 'Lun', reposiciones: 2 },
    { day: 'Mar', reposiciones: 3 },
    { day: 'Mié', reposiciones: 2 },
    { day: 'Jue', reposiciones: 4 },
    { day: 'Vie', reposiciones: 3 },
    { day: 'Sáb', reposiciones: 5 },
    { day: 'Dom', reposiciones: 2 }
  ];

  return (
    <div className="rounded-[20px] bg-[#1a1d21] shadow-[inset_-8px_8px_16px_#151719,inset_8px_-8px_16px_#1f2329] border border-[#232529] p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Patrones de Reabastecimiento</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3137" />
            <XAxis dataKey="day" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{
              backgroundColor: '#1a1d21',
              border: '1px solid #232529',
              borderRadius: '8px'
            }} />
            <Line type="monotone" dataKey="reposiciones" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Componente para las alertas de tendencia
const TrendAlerts = () => {
  const alerts = [
    { mensaje: 'Consumo inusual detectado en Tanque 93', tiempo: '2h atrás' },
    { mensaje: 'Patrón de reposición irregular en Diesel', tiempo: '5h atrás' },
    { mensaje: 'Nivel crítico alcanzado más frecuente', tiempo: '1d atrás' }
  ];

  return (
    <div className="rounded-[20px] bg-[#1a1d21] shadow-[inset_-8px_8px_16px_#151719,inset_8px_-8px_16px_#1f2329] border border-[#232529] p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Alertas de Tendencia</h3>
        <AlertTriangle className="text-yellow-500" size={20} />
      </div>
      <ul className="space-y-3">
        {alerts.map((alerta, index) => (
          <li key={index} className="p-3 rounded-xl bg-[#1f2227] text-gray-300 text-sm">
            <div className="flex justify-between">
              <span>{alerta.mensaje}</span>
              <span className="text-gray-500">{alerta.tiempo}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Componente para las predicciones
const Predictions = () => {
  const predictions = [
    { prediccion: 'Próxima reposición estimada', tiempo: '8h', tanque: 'Tanque 95' },
    { prediccion: 'Pico de demanda esperado', tiempo: '2d', tanque: 'Tanque Diesel' },
    { prediccion: 'Mantenimiento sugerido', tiempo: '5d', tanque: 'Tanque 93' }
  ];

  return (
    <div className="rounded-[20px] bg-[#1a1d21] shadow-[inset_-8px_8px_16px_#151719,inset_8px_-8px_16px_#1f2329] border border-[#232529] p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Predicciones</h3>
        <TrendingUpIcon className="text-blue-500" size={20} />
      </div>
      <ul className="space-y-3">
        {predictions.map((pred, index) => (
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
  );
};

// Componente para la eficiencia por tanque
const TankEfficiency = () => {
  const tanks = [
    { tanque: 'Tanque 93', eficiencia: 94 },
    { tanque: 'Tanque 95', eficiencia: 88 },
    { tanque: 'Tanque Diesel', eficiencia: 92 },
    { tanque: 'Tanque MVP', eficiencia: 96 }
  ];

  return (
    <div className="rounded-[20px] bg-[#1a1d21] shadow-[inset_-8px_8px_16px_#151719,inset_8px_-8px_16px_#1f2329] border border-[#232529] p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Eficiencia por Tanque</h3>
        <DollarSign className="text-green-500" size={20} />
      </div>
      {tanks.map((tank, index) => (
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
  );
};

export {
  MainMetrics,
  ConsumptionTrend,
  RefillPattern,
  TrendAlerts,
  Predictions,
  TankEfficiency
};